-- Adicionando coluna estoque e modificando para suportar múltiplas imagens
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS estoque INTEGER DEFAULT 0;

-- Renomeando imagem_url para image_urls e mudando para array
ALTER TABLE produtos 
RENAME COLUMN imagem_url TO image_urls;

ALTER TABLE produtos 
ALTER COLUMN image_urls TYPE TEXT[] USING ARRAY[image_urls];

-- Atualizando produtos existentes para ter array vazio se necessário
UPDATE produtos 
SET image_urls = ARRAY[]::TEXT[] 
WHERE image_urls IS NULL;
