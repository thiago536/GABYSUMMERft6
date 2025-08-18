-- GABY SUMMER E-COMMERCE DATABASE SCHEMA
-- Esquema completo para sistema de e-commerce de moda praia e fitness

-- =====================================================
-- 1. TABELA DE CLIENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    whatsapp VARCHAR(20) UNIQUE NOT NULL,
    primeira_compra BOOLEAN DEFAULT true,
    total_pedidos INTEGER DEFAULT 0,
    valor_total_gasto DECIMAL(10,2) DEFAULT 0.00,
    data_nascimento DATE,
    genero VARCHAR(20),
    endereco_cep VARCHAR(10),
    endereco_rua VARCHAR(255),
    endereco_numero VARCHAR(20),
    endereco_complemento VARCHAR(100),
    endereco_bairro VARCHAR(100),
    endereco_cidade VARCHAR(100),
    endereco_estado VARCHAR(2),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TABELA DE PRODUTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    preco_promocional DECIMAL(10,2),
    cores TEXT[] DEFAULT '{}',
    tamanhos TEXT[] DEFAULT '{}',
    imagens TEXT[] DEFAULT '{}',
    imagem_url VARCHAR(500),
    estoque INTEGER DEFAULT 0,
    estoque_minimo INTEGER DEFAULT 5,
    peso DECIMAL(8,2),
    dimensoes VARCHAR(100),
    material VARCHAR(255),
    cuidados TEXT,
    sku VARCHAR(100) UNIQUE,
    codigo_barras VARCHAR(50),
    marca VARCHAR(100),
    colecao VARCHAR(100),
    temporada VARCHAR(50),
    ativo BOOLEAN DEFAULT true,
    destaque BOOLEAN DEFAULT false,
    novidade BOOLEAN DEFAULT false,
    promocao BOOLEAN DEFAULT false,
    data_lancamento DATE,
    tags TEXT[] DEFAULT '{}',
    seo_titulo VARCHAR(255),
    seo_descricao TEXT,
    seo_palavras_chave TEXT[],
    visualizacoes INTEGER DEFAULT 0,
    vendas_total INTEGER DEFAULT 0,
    nota_media DECIMAL(3,2) DEFAULT 0.00,
    total_avaliacoes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABELA DE CATEGORIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    imagem_url VARCHAR(500),
    categoria_pai_id INTEGER REFERENCES categorias(id),
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TABELA DE PEDIDOS
-- =====================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    numero_pedido VARCHAR(50) UNIQUE,
    status VARCHAR(50) DEFAULT 'pendente',
    subtotal DECIMAL(10,2) NOT NULL,
    desconto DECIMAL(10,2) DEFAULT 0.00,
    frete DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    cupom_codigo VARCHAR(50),
    cupom_desconto DECIMAL(10,2) DEFAULT 0.00,
    observacoes TEXT,
    forma_pagamento VARCHAR(100),
    status_pagamento VARCHAR(50) DEFAULT 'pendente',
    data_pagamento TIMESTAMP WITH TIME ZONE,
    endereco_entrega JSONB,
    prazo_entrega INTEGER,
    codigo_rastreamento VARCHAR(100),
    transportadora VARCHAR(100),
    data_envio TIMESTAMP WITH TIME ZONE,
    data_entrega TIMESTAMP WITH TIME ZONE,
    avaliacao_pedido INTEGER CHECK (avaliacao_pedido >= 1 AND avaliacao_pedido <= 5),
    comentario_avaliacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TABELA DE ITENS DO PEDIDO
-- =====================================================
CREATE TABLE IF NOT EXISTS itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10,2) NOT NULL,
    preco_total DECIMAL(10,2) NOT NULL,
    cor VARCHAR(100),
    tamanho VARCHAR(50),
    personalizacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. TABELA DE CUPONS
-- =====================================================
CREATE TABLE IF NOT EXISTS cupons (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(255),
    descricao TEXT,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('percentual', 'valor_fixo', 'frete_gratis')),
    valor DECIMAL(10,2) NOT NULL,
    valor_minimo_pedido DECIMAL(10,2) DEFAULT 0.00,
    valor_maximo_desconto DECIMAL(10,2),
    primeira_compra_apenas BOOLEAN DEFAULT false,
    categorias_validas TEXT[] DEFAULT '{}',
    produtos_validos INTEGER[] DEFAULT '{}',
    clientes_validos INTEGER[] DEFAULT '{}',
    usos_maximos INTEGER,
    usos_por_cliente INTEGER DEFAULT 1,
    usos_atuais INTEGER DEFAULT 0,
    data_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_expiracao TIMESTAMP WITH TIME ZONE,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. TABELA DE AVALIACOES
-- =====================================================
CREATE TABLE IF NOT EXISTS avaliacoes (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    pedido_id INTEGER REFERENCES pedidos(id),
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    titulo VARCHAR(255),
    comentario TEXT,
    fotos TEXT[] DEFAULT '{}',
    verificada BOOLEAN DEFAULT false,
    util_sim INTEGER DEFAULT 0,
    util_nao INTEGER DEFAULT 0,
    resposta_loja TEXT,
    data_resposta TIMESTAMP WITH TIME ZONE,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(produto_id, cliente_id, pedido_id)
);

-- =====================================================
-- 8. TABELA DE ESTOQUE
-- =====================================================
CREATE TABLE IF NOT EXISTS estoque_movimentacao (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida', 'ajuste', 'reserva', 'cancelamento')),
    quantidade INTEGER NOT NULL,
    quantidade_anterior INTEGER NOT NULL,
    quantidade_atual INTEGER NOT NULL,
    motivo VARCHAR(255),
    pedido_id INTEGER REFERENCES pedidos(id),
    usuario_id INTEGER,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. TABELA DE NEWSLETTER
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255),
    ativo BOOLEAN DEFAULT true,
    origem VARCHAR(100),
    interesses TEXT[] DEFAULT '{}',
    data_confirmacao TIMESTAMP WITH TIME ZONE,
    data_descadastro TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. TABELA DE FAVORITOS
-- =====================================================
CREATE TABLE IF NOT EXISTS favoritos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cliente_id, produto_id)
);

-- =====================================================
-- 11. TABELA DE CARRINHO ABANDONADO
-- =====================================================
CREATE TABLE IF NOT EXISTS carrinho_abandonado (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    email VARCHAR(255),
    whatsapp VARCHAR(20),
    itens JSONB NOT NULL,
    valor_total DECIMAL(10,2),
    recuperado BOOLEAN DEFAULT false,
    emails_enviados INTEGER DEFAULT 0,
    ultimo_email TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. TABELA DE CONFIGURAÇÕES
-- =====================================================
CREATE TABLE IF NOT EXISTS configuracoes (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    tipo VARCHAR(50) DEFAULT 'string',
    descricao TEXT,
    categoria VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_clientes_whatsapp ON clientes(whatsapp);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_ativo ON clientes(ativo);

-- Índices para produtos
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_preco ON produtos(preco);
CREATE INDEX IF NOT EXISTS idx_produtos_destaque ON produtos(destaque);
CREATE INDEX IF NOT EXISTS idx_produtos_promocao ON produtos(promocao);
CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos USING gin(to_tsvector('portuguese', nome));
CREATE INDEX IF NOT EXISTS idx_produtos_descricao ON produtos USING gin(to_tsvector('portuguese', descricao));

-- Índices para pedidos
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_data ON pedidos(created_at);
CREATE INDEX IF NOT EXISTS idx_pedidos_numero ON pedidos(numero_pedido);

-- Índices para itens do pedido
CREATE INDEX IF NOT EXISTS idx_itens_pedido_pedido_id ON itens_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_itens_pedido_produto_id ON itens_pedido(produto_id);

-- Índices para cupons
CREATE INDEX IF NOT EXISTS idx_cupons_codigo ON cupons(codigo);
CREATE INDEX IF NOT EXISTS idx_cupons_ativo ON cupons(ativo);
CREATE INDEX IF NOT EXISTS idx_cupons_data_expiracao ON cupons(data_expiracao);

-- Índices para avaliações
CREATE INDEX IF NOT EXISTS idx_avaliacoes_produto_id ON avaliacoes(produto_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_cliente_id ON avaliacoes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_ativo ON avaliacoes(ativo);

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON produtos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cupons_updated_at BEFORE UPDATE ON cupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_avaliacoes_updated_at BEFORE UPDATE ON avaliacoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular preço total do item
CREATE OR REPLACE FUNCTION calculate_item_total()
RETURNS TRIGGER AS $$
BEGIN
    NEW.preco_total = NEW.quantidade * NEW.preco_unitario;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para calcular preço total automaticamente
CREATE TRIGGER calculate_itens_pedido_total BEFORE INSERT OR UPDATE ON itens_pedido FOR EACH ROW EXECUTE FUNCTION calculate_item_total();

-- Função para gerar número do pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_pedido IS NULL THEN
        NEW.numero_pedido = 'GB' || LPAD(NEW.id::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para gerar número do pedido
CREATE TRIGGER generate_pedido_number BEFORE INSERT ON pedidos FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE clientes IS 'Tabela de clientes do e-commerce';
COMMENT ON TABLE produtos IS 'Tabela de produtos com informações completas';
COMMENT ON TABLE categorias IS 'Categorias hierárquicas de produtos';
COMMENT ON TABLE pedidos IS 'Pedidos realizados pelos clientes';
COMMENT ON TABLE itens_pedido IS 'Itens individuais de cada pedido';
COMMENT ON TABLE cupons IS 'Cupons de desconto e promoções';
COMMENT ON TABLE avaliacoes IS 'Avaliações e comentários dos produtos';
COMMENT ON TABLE estoque_movimentacao IS 'Histórico de movimentação de estoque';
COMMENT ON TABLE newsletter IS 'Cadastros para newsletter';
COMMENT ON TABLE favoritos IS 'Lista de produtos favoritos dos clientes';
COMMENT ON TABLE carrinho_abandonado IS 'Carrinhos abandonados para recuperação';
COMMENT ON TABLE configuracoes IS 'Configurações gerais do sistema';
