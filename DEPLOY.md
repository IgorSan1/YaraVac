# 🚀 Guia de Deploy - YaraVac (Opção A)

## 📋 Pré-requisitos

- ✅ Conta no [GitHub](https://github.com)
- ✅ Conta no [Render.com](https://render.com) (gratuita)
- ✅ Git instalado
- ✅ Java 21 instalado (para testar localmente)

---

## 🎯 Visão Geral

**Backend:** Render.com (Spring Boot + PostgreSQL)  
**Frontend:** GitHub Pages (HTML/CSS/JS)  
**Custo:** 100% GRATUITO

---

## 📦 Passo 1: Preparar o Projeto

### 1.1 Criar os Arquivos Necessários

Execute os comandos abaixo na RAIZ do projeto:

```bash
# Tornar scripts executáveis
chmod +x deploy.sh
chmod +x update-api-urls.sh

# Atualizar arquivos JS (se necessário)
./update-api-urls.sh
```

### 1.2 Estrutura Final

```
seu-projeto/
├── render.yaml                    # ✅ Configuração do Render
├── deploy.sh                      # ✅ Script de deploy
├── DEPLOY.md                      # ✅ Este arquivo
├── saude-indigena/
│   ├── src/main/resources/
│   │   ├── application.yaml       # ✅ Atualizado
│   │   └── application-prod.yaml  # ✅ Novo
│   └── ...
└── Front_End/
    ├── js/
    │   ├── config.js              # ✅ Novo
    │   ├── login.js               # ✅ Atualizado
    │   ├── home.js                # ✅ Atualizado
    │   └── ...
    └── ...
```

---

## 🚀 Passo 2: Deploy do Backend (Render.com)

### 2.1 Preparar Repositório GitHub

```bash
# Inicializar Git (se ainda não fez)
git init

# Adicionar remote (SUBSTITUA pelos seus dados)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git

# Fazer commit inicial
git add .
git commit -m "Initial commit - Preparar para deploy"
git push -u origin main
```

### 2.2 Configurar Render.com

1. **Acessar:** https://dashboard.render.com

2. **Criar conta:**
   - Clique em "Get Started"
   - Conecte com GitHub

3. **Novo Blueprint:**
   - Clique em "New +" → "Blueprint"
   - Conecte seu repositório
   - Render detectará `render.yaml` automaticamente
   - Clique em "Apply"

4. **Aguardar Deploy:**
   - ⏱️ Tempo: ~10-15 minutos
   - Status: Acompanhe em Dashboard

5. **Copiar URL do Backend:**
   - Após deploy, clique no serviço "yaravac-backend"
   - Copie a URL (ex: `https://yaravac-backend.onrender.com`)

---

## 🌐 Passo 3: Deploy do Frontend (GitHub Pages)

### 3.1 Atualizar Config do Frontend

Edite `Front_End/js/config.js`:

```javascript
const API_CONFIG = {
    // COLE AQUI a URL do Render (sem /api/v1)
    PRODUCTION_URL: 'https://yaravac-backend.onrender.com/api/v1',
    
    DEVELOPMENT_URL: 'http://localhost:8080/api/v1',
    
    get BASE_URL() {
        if (window.location.hostname !== 'localhost' && 
            window.location.hostname !== '127.0.0.1') {
            return this.PRODUCTION_URL;
        }
        return this.DEVELOPMENT_URL;
    }
};
```

### 3.2 Executar Script de Deploy

```bash
# Execute o script de deploy
./deploy.sh
```

O script irá:
- ✅ Testar build do backend
- ✅ Verificar arquivos necessários
- ✅ Fazer commit das mudanças
- ✅ Push para GitHub (main)
- ✅ Criar/atualizar branch gh-pages
- ✅ Deploy do frontend

### 3.3 Ativar GitHub Pages

1. **Acessar:** https://github.com/SEU_USUARIO/SEU_REPO/settings/pages

2. **Configurar:**
   - **Source:** Deploy from a branch
   - **Branch:** gh-pages
   - **Folder:** / (root)
   - Clique em "Save"

3. **Aguardar:**
   - ⏱️ Tempo: ~2-5 minutos
   - GitHub mostrará a URL quando estiver pronto

4. **Seu site estará em:**
   ```
   https://SEU_USUARIO.github.io/SEU_REPO
   ```

---

## ✅ Passo 4: Verificar Deploy

### 4.1 Testar Backend

```bash
# Testar health check
curl https://yaravac-backend.onrender.com/api/v1/actuator/health

# Resposta esperada:
# {"status":"UP"}
```

### 4.2 Testar Frontend

1. Acesse: `https://SEU_USUARIO.github.io/SEU_REPO`
2. Tente fazer login
3. Verifique se consegue acessar as páginas

### 4.3 Criar Primeiro Usuário Admin

**IMPORTANTE:** Como o sistema usa JWT, você precisa criar um admin primeiro.

**Opção 1: Via API diretamente**

```bash
curl -X POST https://yaravac-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

**Opção 2: Adicionar migration no Flyway**

Criar arquivo: `saude-indigena/src/main/resources/db/migration/V007__insert-admin.sql`

```sql
-- Senha criptografada para "admin123"
-- Gerada com BCrypt
INSERT INTO saude.admin (id, uuid, usuario, password, role, created_at)
VALUES (
    nextval('saude.admin_seq'),
    saude.uuid_generate_v4(),
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    CURRENT_TIMESTAMP
);
```

Depois fazer redeploy:
```bash
git add .
git commit -m "Adicionar admin inicial"
git push origin main
```

---

## 🔧 Passo 5: Configurações Adicionais (Opcional)

### 5.1 Domínio Customizado (GitHub Pages)

1. Compre um domínio (ex: Namecheap, GoDaddy)
2. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: SEU_USUARIO.github.io
   ```
3. No GitHub:
   - Settings > Pages
   - Custom domain: www.seu-dominio.com
   - Save

### 5.2 Melhorar Performance do Render

No `render.yaml`, ajuste:

```yaml
envVars:
  - key: JAVA_TOOL_OPTIONS
    value: -Xmx384m -Xms192m  # Aumentar memória
```

### 5.3 Monitoramento

**Backend (Render):**
- Dashboard: https://dashboard.render.com
- Logs em tempo real
- Métricas de uso

**Frontend (GitHub):**
- Actions: Ver deploys
- Pages: Status

---

## 🐛 Troubleshooting

### Problema 1: Backend não sobe no Render

**Erro:** `Port already in use`

**Solução:** Certifique-se que `application.yaml` tem:
```yaml
server:
  port: ${PORT:8080}
```

---

### Problema 2: Frontend não conecta ao Backend

**Sintomas:** Erro de CORS ou 404

**Solução 1:** Verificar URL em `config.js`
```javascript
// Deve ter /api/v1 no final
PRODUCTION_URL: 'https://seu-backend.onrender.com/api/v1'
```

**Solução 2:** Verificar WebConfig.java está correto:
```java
.allowedOrigins(
    "https://seu-usuario.github.io",
    "http://localhost:8080"
)
```

---

### Problema 3: Database não migra

**Erro:** `Flyway migration failed`

**Solução:** Verificar logs no Render e adicionar:
```yaml
spring:
  flyway:
    baseline-on-migrate: true
```

---

### Problema 4: Render "dorme" após inatividade

**Sintoma:** Primeira requisição após inatividade demora muito

**Solução (Gratuita):** Use UptimeRobot para fazer ping a cada 5 min
1. Acesse: https://uptimerobot.com
2. Add Monitor
3. URL: `https://seu-backend.onrender.com/api/v1/actuator/health`
4. Interval: 5 minutes

---

### Problema 5: GitHub Pages retorna 404

**Solução:**
1. Verificar se branch gh-pages existe
2. Verificar se arquivos estão na raiz (não em subpasta)
3. Adicionar arquivo `.nojekyll` na raiz do gh-pages

---

## 🔄 Como Fazer Updates

### Update do Backend

```bash
# Fazer mudanças no código
cd saude-indigena
# ... suas mudanças ...

# Commit e push
git add .
git commit -m "feat: sua mudança"
git push origin main

# Render fará redeploy automático
```

### Update do Frontend

```bash
# Fazer mudanças no código
cd Front_End
# ... suas mudanças ...

# Executar deploy
cd ..
./deploy.sh

# GitHub Pages atualizará automaticamente
```

---

## 📊 Limites do Plano Gratuito

### Render.com
- ✅ 750 horas/mês (suficiente para 1 app 24/7)
- ✅ PostgreSQL 1GB (renova a cada 90 dias)
- ✅ 100GB bandwidth
- ⚠️ App "dorme" após 15 min de inatividade
- ⚠️ Build time: 15 min máximo

### GitHub Pages
- ✅ 1GB de storage
- ✅ 100GB bandwidth/mês
- ✅ 10 builds/hora
- ✅ Sem limite de visitantes

---

## 🎉 Conclusão

Pronto! Seu sistema está no ar **100% gratuitamente**!

**URLs Importantes:**
- 🖥️ Frontend: `https://SEU_USUARIO.github.io/SEU_REPO`
- 🔧 Backend: `https://yaravac-backend.onrender.com`
- 📊 Dashboard Render: `https://dashboard.render.com`
- 📦 GitHub Repo: `https://github.com/SEU_USUARIO/SEU_REPO`

---

## 📞 Suporte

Encontrou algum problema? 
- Verifique os logs no Render Dashboard
- Inspecione o Console do navegador (F12)
- Revise este guia passo a passo

**Bom deploy! 🚀**