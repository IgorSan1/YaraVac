#!/bin/bash

# Script para atualizar URLs da API em todos os arquivos JavaScript
# Uso: ./update-api-urls.sh

echo "🔄 Atualizando URLs da API nos arquivos JavaScript..."

# Diretório dos arquivos JS
JS_DIR="Front_End/js"

# Lista de arquivos para atualizar
FILES=(
    "cadastrar-usuario.js"
    "cadastrar-vacina.js"
    "perfil.js"
    "registrar-vacinacao.js"
)

# Backup dos arquivos originais
echo "📦 Criando backup dos arquivos..."
mkdir -p "${JS_DIR}/backup_$(date +%Y%m%d_%H%M%S)"

for file in "${FILES[@]}"; do
    filepath="${JS_DIR}/${file}"
    if [ -f "$filepath" ]; then
        cp "$filepath" "${JS_DIR}/backup_$(date +%Y%m%d_%H%M%S)/"
        
        # Substituir a linha do API_BASE
        sed -i.tmp 's|const API_BASE = "http://localhost:8080/api/v1";|const API_BASE = window.API_CONFIG?.BASE_URL \|\| "/api/v1";|g' "$filepath"
        
        # Remover arquivo temporário
        rm -f "${filepath}.tmp"
        
        echo "✅ Atualizado: $file"
    else
        echo "⚠️  Arquivo não encontrado: $file"
    fi
done

echo ""
echo "✨ Atualização concluída!"
echo "📝 Arquivos atualizados: ${#FILES[@]}"
echo "💾 Backup salvo em: ${JS_DIR}/backup_$(date +%Y%m%d_%H%M%S)/"
