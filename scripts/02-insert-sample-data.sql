-- DADOS DE EXEMPLO PARA GABY SUMMER E-COMMERCE
-- Inserção de dados iniciais para teste e desenvolvimento

-- =====================================================
-- 1. CATEGORIAS
-- =====================================================
INSERT INTO categorias (nome, descricao, slug, ordem, ativo) VALUES
('Moda Praia', 'Biquínis, maiôs e saídas de praia', 'moda-praia', 1, true),
('Fitness', 'Roupas esportivas e de academia', 'fitness', 2, true),
('Acessórios', 'Bolsas, chapéus e acessórios de praia', 'acessorios', 3, true),
('Saídas de Praia', 'Kimonos, vestidos e saídas', 'saidas-praia', 4, true),
('Lingerie', 'Lingerie confortável e elegante', 'lingerie', 5, true);

-- =====================================================
-- 2. PRODUTOS
-- =====================================================
INSERT INTO produtos (
    nome, descricao, categoria, preco, preco_promocional, 
    cores, tamanhos, estoque, sku, ativo, destaque, novidade
) VALUES
-- Moda Praia
(
    'Biquíni Sunset Paradise',
    'Biquíni exclusivo com estampa tropical em tons de laranja e amarelo. Tecido com proteção UV50+ e secagem rápida. Top com bojo removível e calcinha com amarração lateral ajustável.',
    'Moda Praia',
    89.90,
    79.90,
    ARRAY['Laranja Sunset', 'Amarelo Solar', 'Rosa Coral'],
    ARRAY['PP', 'P', 'M', 'G', 'GG'],
    25,
    'BIK-SUN-001',
    true,
    true,
    true
),
(
    'Maiô Oceano Elegante',
    'Maiô sofisticado em azul oceano com detalhes em dourado. Modelagem que valoriza as curvas com recortes estratégicos. Tecido premium com elastano.',
    'Moda Praia',
    129.90,
    NULL,
    ARRAY['Azul Oceano', 'Preto Elegante', 'Verde Esmeralda'],
    ARRAY['PP', 'P', 'M', 'G', 'GG'],
    18,
    'MAI-OCE-001',
    true,
    true,
    false
),
(
    'Biquíni Tropical Vibes',
    'Biquíni com estampa de folhas tropicais, perfeito para quem ama a natureza. Top cortininha e calcinha cavada.',
    'Moda Praia',
    79.90,
    69.90,
    ARRAY['Verde Tropical', 'Rosa Flamingo', 'Azul Paraíso'],
    ARRAY['P', 'M', 'G', 'GG'],
    30,
    'BIK-TRO-001',
    true,
    false,
    true
),

-- Fitness
(
    'Top Fitness Power',
    'Top esportivo de alta performance com suporte médio. Ideal para treinos intensos, yoga e pilates. Tecido que absorve o suor e seca rapidamente.',
    'Fitness',
    59.90,
    49.90,
    ARRAY['Rosa Coral', 'Preto', 'Azul Marinho', 'Verde Militar'],
    ARRAY['PP', 'P', 'M', 'G', 'GG'],
    40,
    'TOP-FIT-001',
    true,
    true,
    false
),
(
    'Legging High Waist',
    'Legging cintura alta modeladora com tecnologia anti-celulite. Compressão graduada e costura flat para máximo conforto.',
    'Fitness',
    89.90,
    NULL,
    ARRAY['Preto', 'Cinza Mescla', 'Azul Marinho', 'Vinho'],
    ARRAY['PP', 'P', 'M', 'G', 'GG'],
    35,
    'LEG-HIG-001',
    true,
    true,
    true
),
(
    'Conjunto Fitness Completo',
    'Conjunto completo com top e legging coordenados. Perfeito para quem busca estilo e funcionalidade nos treinos.',
    'Fitness',
    149.90,
    129.90,
    ARRAY['Rosa e Preto', 'Azul e Branco', 'Verde e Cinza'],
    ARRAY['P', 'M', 'G', 'GG'],
    20,
    'CON-FIT-001',
    true,
    true,
    true
),

-- Acessórios
(
    'Bolsa de Praia Tropical',
    'Bolsa espaçosa em palha natural com detalhes coloridos. Perfeita para levar tudo que você precisa para a praia.',
    'Acessórios',
    45.90,
    NULL,
    ARRAY['Natural', 'Natural com Rosa', 'Natural com Azul'],
    ARRAY['Único'],
    15,
    'BOL-TRO-001',
    true,
    false,
    false
),
(
    'Chapéu Verão Chic',
    'Chapéu de palha com aba larga e fita colorida. Proteção solar com muito estilo.',
    'Acessórios',
    39.90,
    34.90,
    ARRAY['Natural', 'Bege', 'Branco'],
    ARRAY['P', 'M', 'G'],
    25,
    'CHA-VER-001',
    true,
    false,
    false
),

-- Saídas de Praia
(
    'Kimono Sunset',
    'Kimono leve e fluido com estampa exclusiva. Perfeito para usar sobre o biquíni ou como vestido casual.',
    'Saídas de Praia',
    69.90,
    59.90,
    ARRAY['Laranja Sunset', 'Rosa Coral', 'Azul Céu'],
    ARRAY['Único'],
    22,
    'KIM-SUN-001',
    true,
    true,
    false
),
(
    'Vestido Praia Boho',
    'Vestido longo estilo boho com bordados delicados. Pode ser usado na praia ou em ocasiões casuais.',
    'Saídas de Praia',
    99.90,
    NULL,
    ARRAY['Branco', 'Off White', 'Bege'],
    ARRAY['PP', 'P', 'M', 'G'],
    18,
    'VES-BOH-001',
    true,
    false,
    true
);

-- =====================================================
-- 3. CLIENTES DE EXEMPLO
-- =====================================================
INSERT INTO clientes (
    nome, email, whatsapp, primeira_compra, total_pedidos, valor_total_gasto,
    endereco_cidade, endereco_estado
) VALUES
('Maria Silva Santos', 'maria.silva@email.com', '83999887766', false, 3, 289.70, 'João Pessoa', 'PB'),
('Ana Carolina Lima', 'ana.lima@email.com', '83988776655', true, 0, 0.00, 'Campina Grande', 'PB'),
('Juliana Costa', 'ju.costa@email.com', '83977665544', false, 1, 129.90, 'João Pessoa', 'PB'),
('Beatriz Oliveira', 'bia.oliveira@email.com', '83966554433', false, 2, 199.80, 'Recife', 'PE'),
('Carla Mendes', 'carla.mendes@email.com', '83955443322', true, 0, 0.00, 'Natal', 'RN');

-- =====================================================
-- 4. CUPONS DE DESCONTO
-- =====================================================
INSERT INTO cupons (
    codigo, nome, descricao, tipo, valor, valor_minimo_pedido,
    primeira_compra_apenas, usos_maximos, data_expiracao, ativo
) VALUES
('BEMVINDA10', 'Desconto Primeira Compra', 'Desconto de 10% para primeira compra', 'percentual', 10.00, 50.00, true, 1000, '2024-12-31 23:59:59', true),
('VERAO2024', 'Promoção Verão', 'Desconto de R$ 20 em compras acima de R$ 100', 'valor_fixo', 20.00, 100.00, false, 500, '2024-03-31 23:59:59', true),
('FRETEGRATIS', 'Frete Grátis', 'Frete grátis em compras acima de R$ 150', 'frete_gratis', 0.00, 150.00, false, NULL, '2024-06-30 23:59:59', true),
('GABY15', 'Desconto Especial', 'Desconto de 15% para clientes especiais', 'percentual', 15.00, 80.00, false, 200, '2024-05-31 23:59:59', true);

-- =====================================================
-- 5. CONFIGURAÇÕES DO SISTEMA
-- =====================================================
INSERT INTO configuracoes (chave, valor, tipo, descricao, categoria) VALUES
('loja_nome', 'GABY SUMMER', 'string', 'Nome da loja', 'geral'),
('loja_email', 'contato@gabysummer.com.br', 'string', 'Email de contato', 'geral'),
('loja_whatsapp', '5583886357773', 'string', 'WhatsApp da loja', 'geral'),
('loja_instagram', '@gab.ysummer', 'string', 'Instagram da loja', 'geral'),
('loja_endereco', 'João Pessoa - Paraíba', 'string', 'Endereço da loja', 'geral'),
('frete_gratis_valor', '150.00', 'decimal', 'Valor mínimo para frete grátis', 'frete'),
('frete_padrao_valor', '15.00', 'decimal', 'Valor do frete padrão', 'frete'),
('frete_expresso_valor', '25.00', 'decimal', 'Valor do frete expresso', 'frete'),
('estoque_minimo_alerta', '5', 'integer', 'Quantidade mínima para alerta de estoque', 'estoque'),
('moeda_simbolo', 'R$', 'string', 'Símbolo da moeda', 'financeiro'),
('taxa_cartao', '3.5', 'decimal', 'Taxa do cartão de crédito (%)', 'financeiro'),
('prazo_entrega_padrao', '7', 'integer', 'Prazo de entrega padrão (dias)', 'entrega'),
('prazo_entrega_expresso', '3', 'integer', 'Prazo de entrega expressa (dias)', 'entrega');

-- =====================================================
-- 6. AVALIAÇÕES DE EXEMPLO
-- =====================================================
INSERT INTO avaliacoes (produto_id, cliente_id, nota, titulo, comentario, verificada) VALUES
(1, 1, 5, 'Produto incrível!', 'Amei o biquíni! A qualidade é excelente e o caimento perfeito. Super recomendo!', true),
(1, 3, 4, 'Muito bom', 'Produto de boa qualidade, chegou rápido. Só achei que poderia ter mais opções de cor.', true),
(2, 4, 5, 'Perfeito!', 'O maiô é lindo demais! Me senti uma sereia usando. Qualidade top!', true),
(4, 1, 5, 'Top fitness perfeito', 'Uso para treinar e é muito confortável. Não marca suor e tem ótimo suporte.', true),
(5, 4, 4, 'Legging boa', 'Gostei da legging, é bem confortável. Só achei que poderia ser um pouco mais comprida.', true);

-- Atualizar estatísticas dos produtos baseado nas avaliações
UPDATE produtos SET 
    nota_media = (SELECT AVG(nota) FROM avaliacoes WHERE produto_id = produtos.id AND ativo = true),
    total_avaliacoes = (SELECT COUNT(*) FROM avaliacoes WHERE produto_id = produtos.id AND ativo = true)
WHERE id IN (SELECT DISTINCT produto_id FROM avaliacoes);
