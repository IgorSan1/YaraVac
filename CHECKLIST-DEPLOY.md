# ✅ Checklist de Deploy - YaraVac

Use este checklist para garantir que tudo está pronto para o deploy!

---

## 📦 Fase 1: Preparação dos Arquivos

### Backend

- [ ] `render.yaml` criado na raiz do projeto
- [ ] `saude-indigena/src/main/resources/application.yaml` atualizado
- [ ] `saude-indigena/src/main/resources/application-prod.yaml` criado
- [ ] Build local funciona: `cd saude-indigena && ./mvnw clean package -DskipTests`

### Frontend

- [ ] `Front_End/js/config.js` criado
- [ ] Todos os arquivos JS atualizados:
  - [ ] `login.js`
  - [ ] `home.js`
  - [ ] `cadastrar-paciente.js`
  - [ ] `cadastrar-usuario.js`
  - [ ] `cadastrar-vacina.js`
  - [ ] `registrar-vacinacao.js`
  - [ ] `perfil.js`

- [ ] Todos os HTMLs incluem `<script src="js/config.js"></script>`:
  - [ ] `login.html`
  - [ ] `home.html`
  - [ ] `cadastrar-paciente.html`
  - [ ] `cadastrar-usuario.html`
  - [ ] `cadastrar-vacina.html`
  - [ ] `registrar-vacinacao.html`
  - [ ] `perfil.html`
  - [ ] `notificacoes.html`

### Scripts

- [ ] `deploy.sh` criado e executável (`chmod +x deploy.sh`)
- [ ] `update-api-urls.sh` criado e executável (opcional)

---

## 🔧 Fase 2: Configuração do Git

- [ ] Git inicializado: `git init`
- [ ] Repositório GitHub criado
- [ ] Remote configurado: `git remote add origin https://github.com/...`
- [ ] Commit inicial feito:
  ```bash
  git add .
  git commit -m "Initial commit"
  git push -u origin main
  ```

---

## 🚀 Fase 3: Deploy do Backend (Render)

- [ ] Conta criada no [Render.com](https://render.com)
- [ ] Render conectado ao GitHub
- [ ] Blueprint criado (detectou `render.yaml` automaticamente)
- [ ] Deploy iniciado com sucesso
- [ ] Aguardar ~10 minutos
- [ ] Backend online e funcionando
- [ ] URL do backend copiada (ex: `https://yaravac-backend.onrender.com`)
- [ ] Health check funciona: `/api/v1/actuator/health` retorna `{"status":"UP"}`

---

## 🌐 Fase 4: Deploy do Frontend (GitHub Pages)

- [ ] `Front_End/js/config.js` atualizado com URL do backend
- [ ] Script de deploy executado: `./deploy.sh`
- [ ] Branch `gh-pages` criada/atualizada
- [ ] GitHub Pages ativado:
  - Settings > Pages
  - Source: Deploy from branch
  - Branch: gh-pages / (root)
- [ ] Aguardar ~2 minutos
- [ ] Frontend online
- [ ] URL anotada: `https://SEU_USUARIO.github.io/SEU_REPO`

---

## ✅ Fase 5: Testes

### Teste 1: Backend
- [ ] Acessar: `https://seu-backend.onrender.com/api/v1/actuator/health`
- [ ] Resposta: `{"status":"UP"}`

### Teste 2: Frontend
- [ ] Acessar: `https://seu-usuario.github.io/seu-repo`
- [ ] Página de login carrega
- [ ] Console do navegador (F12) sem erros críticos

### Teste 3: Criar Admin
- [ ] Admin criado via API ou migration
- [ ] Login funciona
- [ ] Token JWT gerado
- [ ] Redirecionamento para home funciona

### Teste 4: Funcionalidades
- [ ] Cadastrar paciente funciona
- [ ] Cadastrar vacina funciona
- [ ] Cadastrar usuário funciona (apenas ADMIN)
- [ ] Registrar vacinação funciona
- [ ] Buscar paciente por CPF funciona

---

## 🔒 Fase 6: Segurança

- [ ] JWT_SECRET gerado automaticamente pelo Render (não usar padrão)
- [ ] Senha do banco forte (Render gera automaticamente)
- [ ] HTTPS habilitado (automático no Render e GitHub Pages)
- [ ] Variáveis sensíveis não expostas no código
- [ ] CORS configurado corretamente

---

## 📊 Fase 7: Monitoramento (Opcional)

- [ ] UptimeRobot configurado para manter backend ativo
  - URL: `https://seu-backend.onrender.com/api/v1/actuator/health`
  - Interval: 5 minutes
- [ ] Logs do Render monitorados
- [ ] GitHub Actions verificadas

---

## 📝 Fase 8: Documentação

- [ ] README atualizado com URLs de produção
- [ ] Credenciais de admin documentadas (seguramente)
- [ ] Processo de deploy documentado para time

---

## 🎯 URLs Importantes (Preencher após deploy)

```
Frontend (Produção): https://_____________________.github.io/_____________________
Backend (Produção):  https://_____________________.onrender.com
Dashboard Render:    https://dashboard.render.com
Repositório GitHub:  https://github.com/_____________________/_____________________

Credenciais Admin:
Usuario: ___________________
Senha:   ___________________ (MANTER SEGURO!)
```

---

## 🐛 Em Caso de Problemas

### Backend não sobe
1. Verificar logs no Render Dashboard
2. Verificar build local funciona
3. Verificar variáveis de ambiente
4. Verificar `application.yaml` tem `port: ${PORT:8080}`

### Frontend não conecta
1. Verificar `config.js` tem URL correta
2. Verificar CORS no backend
3. Verificar console do navegador (F12)
4. Verificar GitHub Pages está ativo

### Database error
1. Verificar Flyway migrations
2. Verificar conexão no Render
3. Verificar schema `saude` existe

---

## ✨ Deploy Concluído!

Quando todos os itens estiverem marcados, seu sistema está no ar!

**Próximos passos:**
1. Teste todas as funcionalidades
2. Compartilhe URL com usuários
3. Configure domínio próprio (opcional)
4. Monitore uso e performance

**Boa sorte! 🚀**