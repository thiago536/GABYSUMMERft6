-- VIEWS E FUNÇÕES ÚTEIS PARA GABY SUMMER E-COMMERCE
-- Views para relatórios e funções auxiliares

-- =====================================================
-- 1. VIEW DE PRODUTOS COM ESTATÍSTICAS
-- =====================================================
CREATE OR REPLACE VIEW v_produtos_completos AS
SELECT 
    p.*,
    COALESCE(p.nota_media, 0) as nota_media_calc,
    COALESCE(p.total_avaliacoes, 0) as total_avaliacoes_calc,
    CASE 
        WHEN p.estoque <= p.estoque_minimo THEN 'BAIXO'
        WHEN p.estoque <= (p.estoque_minimo * 2) THEN 'MEDIO'
        ELSE 'ALTO'
    END as status_estoque,
    CASE 
        WHEN p.preco_promocional IS NOT NULL AND p.preco_promocional < p.preco 
        THEN ROUND(((p.preco - p.preco_promocional) / p.preco * 100), 2)
        ELSE 0
    END as percentual_desconto,
    COALESCE(p.preco_promocional, p.preco) as preco_final
FROM produtos p
WHERE p.ativo = true;

-- =====================================================
-- 2. VIEW DE PEDIDOS COM INFORMAÇÕES COMPLETAS
-- =====================================================
CREATE OR REPLACE VIEW v_pedidos_completos AS
SELECT 
    p.*,
    c.nome as cliente_nome,
    c.email as cliente_email,
    c.whatsapp as cliente_whatsapp,
    COUNT(ip.id) as total_itens,
    STRING_AGG(pr.nome, ', ') as produtos_nomes
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN itens_pedido ip ON p.id = ip.pedido_id
LEFT JOIN produtos pr ON ip.produto_id = pr.id
GROUP BY p.id, c.nome, c.email, c.whatsapp;

-- =====================================================
-- 3. VIEW DE RELATÓRIO DE VENDAS
-- =====================================================
CREATE OR REPLACE VIEW v_relatorio_vendas AS
SELECT 
    DATE(p.created_at) as data_venda,
    COUNT(p.id) as total_pedidos,
    SUM(p.total) as faturamento_dia,
    AVG(p.total) as ticket_medio,
    COUNT(DISTINCT p.cliente_id) as clientes_unicos
FROM pedidos p
WHERE p.status NOT IN ('cancelado', 'devolvido')
GROUP BY DATE(p.created_at)
ORDER BY data_venda DESC;

-- =====================================================
-- 4. VIEW DE PRODUTOS MAIS VENDIDOS
-- =====================================================
CREATE OR REPLACE VIEW v_produtos_mais_vendidos AS
SELECT 
    pr.id,
    pr.nome,
    pr.categoria,
    pr.preco,
    SUM(ip.quantidade) as total_vendido,
    SUM(ip.preco_total) as receita_total,
    COUNT(DISTINCT ip.pedido_id) as pedidos_count
FROM produtos pr
JOIN itens_pedido ip ON pr.id = ip.produto_id
JOIN pedidos p ON ip.pedido_id = p.id
WHERE p.status NOT IN ('cancelado', 'devolvido')
GROUP BY pr.id, pr.nome, pr.categoria, pr.preco
ORDER BY total_vendido DESC;

-- =====================================================
-- 5. VIEW DE CLIENTES VIP
-- =====================================================
CREATE OR REPLACE VIEW v_clientes_vip AS
SELECT 
    c.*,
    COUNT(p.id) as total_pedidos_real,
    SUM(p.total) as valor_total_real,
    AVG(p.total) as ticket_medio,
    MAX(p.created_at) as ultima_compra,
    CASE 
        WHEN SUM(p.total) >= 1000 THEN 'DIAMANTE'
        WHEN SUM(p.total) >= 500 THEN 'OURO'
        WHEN SUM(p.total) >= 200 THEN 'PRATA'
        ELSE 'BRONZE'
    END as categoria_cliente
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id AND p.status NOT IN ('cancelado', 'devolvido')
GROUP BY c.id
ORDER BY valor_total_real DESC NULLS LAST;

-- =====================================================
-- 6. FUNÇÃO PARA CALCULAR FRETE
-- =====================================================
CREATE OR REPLACE FUNCTION calcular_frete(
    valor_pedido DECIMAL,
    cep_destino VARCHAR DEFAULT NULL,
    tipo_frete VARCHAR DEFAULT 'padrao'
) RETURNS DECIMAL AS $$
DECLARE
    valor_frete DECIMAL := 0;
    frete_gratis_valor DECIMAL;
    frete_padrao DECIMAL;
    frete_expresso DECIMAL;
BEGIN
    -- Buscar configurações de frete
    SELECT valor::DECIMAL INTO frete_gratis_valor 
    FROM configuracoes WHERE chave = 'frete_gratis_valor';
    
    SELECT valor::DECIMAL INTO frete_padrao 
    FROM configuracoes WHERE chave = 'frete_padrao_valor';
    
    SELECT valor::DECIMAL INTO frete_expresso 
    FROM configuracoes WHERE chave = 'frete_expresso_valor';
    
    -- Verificar se tem direito a frete grátis
    IF valor_pedido >= COALESCE(frete_gratis_valor, 150.00) THEN
        RETURN 0.00;
    END IF;
    
    -- Calcular frete baseado no tipo
    IF tipo_frete = 'expresso' THEN
        valor_frete := COALESCE(frete_expresso, 25.00);
    ELSE
        valor_frete := COALESCE(frete_padrao, 15.00);
    END IF;
    
    RETURN valor_frete;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. FUNÇÃO PARA APLICAR CUPOM
-- =====================================================
CREATE OR REPLACE FUNCTION aplicar_cupom(
    codigo_cupom VARCHAR,
    valor_pedido DECIMAL,
    cliente_whatsapp VARCHAR DEFAULT NULL
) RETURNS TABLE(
    valido BOOLEAN,
    desconto DECIMAL,
    erro VARCHAR
) AS $$
DECLARE
    cupom_record RECORD;
    cliente_record RECORD;
    desconto_calculado DECIMAL := 0;
BEGIN
    -- Buscar cupom
    SELECT * INTO cupom_record 
    FROM cupons 
    WHERE codigo = UPPER(codigo_cupom) AND ativo = true;
    
    -- Verificar se cupom existe
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0.00::DECIMAL, 'Cupom não encontrado'::VARCHAR;
        RETURN;
    END IF;
    
    -- Verificar se cupom expirou
    IF cupom_record.data_expiracao IS NOT NULL AND cupom_record.data_expiracao < NOW() THEN
        RETURN QUERY SELECT false, 0.00::DECIMAL, 'Cupom expirado'::VARCHAR;
        RETURN;
    END IF;
    
    -- Verificar limite de usos
    IF cupom_record.usos_maximos IS NOT NULL AND cupom_record.usos_atuais >= cupom_record.usos_maximos THEN
        RETURN QUERY SELECT false, 0.00::DECIMAL, 'Cupom esgotado'::VARCHAR;
        RETURN;
    END IF;
    
    -- Verificar valor mínimo do pedido
    IF valor_pedido < cupom_record.valor_minimo_pedido THEN
        RETURN QUERY SELECT false, 0.00::DECIMAL, 
            ('Valor mínimo do pedido: R$ ' || cupom_record.valor_minimo_pedido::VARCHAR)::VARCHAR;
        RETURN;
    END IF;
    
    -- Verificar se é cupom de primeira compra
    IF cupom_record.primeira_compra_apenas AND cliente_whatsapp IS NOT NULL THEN
        SELECT * INTO cliente_record 
        FROM clientes 
        WHERE whatsapp = cliente_whatsapp;
        
        IF FOUND AND NOT cliente_record.primeira_compra THEN
            RETURN QUERY SELECT false, 0.00::DECIMAL, 'Cupom válido apenas para primeira compra'::VARCHAR;
            RETURN;
        END IF;
    END IF;
    
    -- Calcular desconto
    IF cupom_record.tipo = 'percentual' THEN
        desconto_calculado := valor_pedido * (cupom_record.valor / 100);
        -- Aplicar limite máximo se existir
        IF cupom_record.valor_maximo_desconto IS NOT NULL THEN
            desconto_calculado := LEAST(desconto_calculado, cupom_record.valor_maximo_desconto);
        END IF;
    ELSIF cupom_record.tipo = 'valor_fixo' THEN
        desconto_calculado := cupom_record.valor;
    ELSIF cupom_record.tipo = 'frete_gratis' THEN
        -- Para frete grátis, retornar valor simbólico
        desconto_calculado := 0.01;
    END IF;
    
    -- Garantir que desconto não seja maior que o valor do pedido
    desconto_calculado := LEAST(desconto_calculado, valor_pedido);
    
    RETURN QUERY SELECT true, desconto_calculado, ''::VARCHAR;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. FUNÇÃO PARA ATUALIZAR ESTATÍSTICAS DO PRODUTO
-- =====================================================
CREATE OR REPLACE FUNCTION atualizar_estatisticas_produto(produto_id_param INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE produtos SET
        nota_media = (
            SELECT COALESCE(AVG(nota), 0)
            FROM avaliacoes 
            WHERE produto_id = produto_id_param AND ativo = true
        ),
        total_avaliacoes = (
            SELECT COUNT(*)
            FROM avaliacoes 
            WHERE produto_id = produto_id_param AND ativo = true
        ),
        vendas_total = (
            SELECT COALESCE(SUM(ip.quantidade), 0)
            FROM itens_pedido ip
            JOIN pedidos p ON ip.pedido_id = p.id
            WHERE ip.produto_id = produto_id_param 
            AND p.status NOT IN ('cancelado', 'devolvido')
        )
    WHERE id = produto_id_param;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. TRIGGER PARA ATUALIZAR ESTATÍSTICAS AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION trigger_atualizar_estatisticas()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar estatísticas do produto quando avaliação é inserida/atualizada/deletada
    IF TG_TABLE_NAME = 'avaliacoes' THEN
        IF TG_OP = 'DELETE' THEN
            PERFORM atualizar_estatisticas_produto(OLD.produto_id);
            RETURN OLD;
        ELSE
            PERFORM atualizar_estatisticas_produto(NEW.produto_id);
            RETURN NEW;
        END IF;
    END IF;
    
    -- Atualizar estatísticas quando item de pedido é inserido
    IF TG_TABLE_NAME = 'itens_pedido' THEN
        IF TG_OP = 'DELETE' THEN
            PERFORM atualizar_estatisticas_produto(OLD.produto_id);
            RETURN OLD;
        ELSE
            PERFORM atualizar_estatisticas_produto(NEW.produto_id);
            RETURN NEW;
        END IF;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers
DROP TRIGGER IF EXISTS trigger_avaliacoes_stats ON avaliacoes;
CREATE TRIGGER trigger_avaliacoes_stats
    AFTER INSERT OR UPDATE OR DELETE ON avaliacoes
    FOR EACH ROW EXECUTE FUNCTION trigger_atualizar_estatisticas();

DROP TRIGGER IF EXISTS trigger_itens_pedido_stats ON itens_pedido;
CREATE TRIGGER trigger_itens_pedido_stats
    AFTER INSERT OR DELETE ON itens_pedido
    FOR EACH ROW EXECUTE FUNCTION trigger_atualizar_estatisticas();
