#!/bin/bash

# Script de Deploy do YaraVac
# Opção A: Render.com (Backend) + GitHub Pages (Frontend)

set -e  # Sair em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Deploy YaraVac - Opção A         ║${NC}"
echo -e "${BLUE}║   Backend: Render.com                  ║${NC}"
echo -e "${BLUE}║   Frontend: GitHub Pages               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está na raiz do projeto
if [ ! -d "saude-indigena" ] || [ ! -d "Front_End" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto!${NC}"
    exit 1
fi

# Verificar se git está inicializado
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Repositório Git não encontrado. Inicializando...${NC}"
    git init
    echo -e "${GREEN}✅ Git inicializado${NC}"
fi

# Etapa 1: Testar build do backend
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📦 Etapa 1/5: Testando build do backend...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd saude-indigena
./mvnw clean package -DskipTests

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no build do backend!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build do backend OK!${NC}"
cd ..

# Etapa 2: Verificar arquivos necessários
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 Etapa 2/5: Verificando arquivos...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

REQUIRED_FILES=(
    "render.yaml"
    "Front_End/js/config.js"
    "saude-indigena/src/main/resources/application.yaml"
    "saude-indigena/src/main/resources/application-prod.yaml"
)

MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Arquivo não encontrado: $file${NC}"
        MISSING_FILES=$((MISSING_FILES + 1))
    else
        echo -e "${GREEN}✅ $file${NC}"
    fi
done

if [ $MISSING_FILES -gt 0 ]; then
    echo -e "${RED}❌ $MISSING_FILES arquivo(s) faltando!${NC}"
    echo -e "${YELLOW}Execute os comandos de criação dos arquivos primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Todos os arquivos necessários estão presentes!${NC}"

# Etapa 3: Commit local
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}💾 Etapa 3/5: Fazendo commit local...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo -e "${YELLOW}Nada para commitar${NC}"

# Etapa 4: Push para GitHub
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📤 Etapa 4/5: Enviando para GitHub...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Verificar se tem remote configurado
if ! git remote | grep -q "origin"; then
    echo -e "${YELLOW}⚠️  Remote 'origin' não configurado.${NC}"
    echo -e "${YELLOW}Configure com: git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git${NC}"
    exit 1
fi

git push origin main || {
    echo -e "${YELLOW}⚠️  Tentando push para master...${NC}"
    git push origin master
}

echo -e "${GREEN}✅ Push para GitHub concluído!${NC}"

# Etapa 5: Deploy do Frontend para GitHub Pages
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🌐 Etapa 5/5: Deploy do Frontend...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Criar branch gh-pages se não existir
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
    echo -e "${YELLOW}Criando branch gh-pages...${NC}"
    git checkout --orphan gh-pages
else
    git checkout gh-pages
fi

# Limpar branch gh-pages
git rm -rf . 2>/dev/null || true

# Copiar apenas arquivos do frontend
cp -r Front_End/* .

# Criar arquivo .nojekyll para GitHub Pages
touch .nojekyll

# Criar arquivo CNAME se tiver domínio customizado (opcional)
# echo "seu-dominio.com" > CNAME

# Commit e push
git add .
git commit -m "Deploy frontend: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin gh-pages --force

# Voltar para branch main
git checkout main

# Resumo final
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✨ Deploy Concluído com Sucesso!    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 Próximos Passos:${NC}"
echo ""
echo -e "${YELLOW}1. Backend (Render.com):${NC}"
echo "   • Acesse: https://dashboard.render.com"
echo "   • Conecte seu repositório GitHub"
echo "   • Render detectará render.yaml automaticamente"
echo "   • Aguarde ~10 minutos para o deploy"
echo "   • Copie a URL do backend (ex: https://yaravac-backend.onrender.com)"
echo ""
echo -e "${YELLOW}2. Frontend (GitHub Pages):${NC}"
echo "   • Acesse: https://github.com/SEU_USUARIO/SEU_REPO/settings/pages"
echo "   • Source: Deploy from branch"
echo "   • Branch: gh-pages / (root)"
echo "   • Save"
echo "   • Aguarde ~2 minutos"
echo "   • Seu site estará em: https://SEU_USUARIO.github.io/SEU_REPO"
echo ""
echo -e "${YELLOW}3. Configurar URL do Backend:${NC}"
echo "   • Edite Front_End/js/config.js"
echo "   • Substitua 'SEU_BACKEND_URL_AQUI' pela URL do Render"
echo "   • Execute: ./deploy.sh novamente"
echo ""
echo -e "${GREEN}✅ Tudo pronto!${NC}"
echo ""