-- Criar tabela de configurações
CREATE TABLE IF NOT EXISTS configuracoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numQuestoes INTEGER DEFAULT 20,
    tempoPorQuestao INTEGER DEFAULT 180,
    pontuacaoMaxima INTEGER DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configuração padrão se não existir
INSERT OR IGNORE INTO configuracoes (id, numQuestoes, tempoPorQuestao, pontuacaoMaxima)
VALUES (1, 20, 180, 20); 