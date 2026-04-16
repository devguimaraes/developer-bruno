# Design: OAuth via Vercel Serverless para Decap CMS

**Data:** 2026-04-15
**Status:** Aprovado
**Branch:** feature/seo-audit

## Problema

O Decap CMS está configurado com `auth_endpoint: https://api.netlify.com/auth/github`, que exige um site deployado na Netlify. O projeto está hospedado na Vercel (`devguimaraes.com.br`), portanto o proxy da Netlify sempre retorna erro. O `site_id=127.0.0.1` no erro confirma que não há integração válida com a Netlify.

## Solução

Criar uma API route serverless na Vercel que lida com GitHub OAuth diretamente, removendo a dependência da Netlify para autenticação. O acesso é restrito ao username GitHub `devguimaraes`.

## Arquitetura

```
Decap CMS (/admin)
    ↓ redirect
/api/auth?provider=github
    ↓ redirect
GitHub OAuth authorize
    ↓ callback
/api/auth/callback?code=...&state=...
    ↓ verify username → token
Decap CMS (autenticado)
```

## Componentes

### 1. `api/auth.ts` — Serverless Function

**Rota 1: `GET /api/auth?provider=github`**
- Gera `state` (UUID v4) para proteção CSRF
- Redireciona para `https://github.com/login/oauth/authorize` com:
  - `client_id` = `GITHUB_CLIENT_ID` (env var)
  - `redirect_uri` = `https://devguimaraes.com.br/api/auth/callback`
  - `scope` = `repo,user:email`
  - `state` = UUID gerado

**Rota 2: `GET /api/auth/callback?code=...&state=...`**
- Troca o `code` por token via `POST https://github.com/login/oauth/access_token`
- Usa o token para consultar `GET https://api.github.com/user`
- Verifica se `username === process.env.ALLOWED_GITHUB_USER` (`devguimaraes`)
- Se não for o usuário permitido, retorna 403
- Se for, retorna JSON: `{ access_token, token_type, scope }`

**Env vars necessárias:**
- `GITHUB_CLIENT_ID` — Client ID da OAuth App
- `GITHUB_CLIENT_SECRET` — Client Secret da OAuth App
- `ALLOWED_GITHUB_USER` — `devguimaraes`

### 2. `public/admin/config.yml` — Atualização

```yaml
backend:
  name: github
  repo: devguimaraes/developer-bruno
  branch: main
  auth_endpoint: /api/auth
```

- Remover `app_id` (não necessário com endpoint custom)
- Remover `auth_type` e `site_domain` (não usar PKCE)

### 3. `vercel.json` — Atualização CSP

Adicionar domínios necessários no `connect-src` da Content-Security-Policy:
- `https://github.com` (para redirect OAuth)

## Segurança

- **Restrição de acesso:** Verificação obrigatória do username GitHub no callback. Qualquer outro usuário recebe 403.
- **CSRF:** Parâmetro `state` com UUID gerado no servidor e validado no callback.
- **Secrets:** Todos os secrets ficam em env vars da Vercel, nunca expostos ao client.
- **CSP:** Headers atualizados para permitir apenas os domínios necessários.

## Passo a Passo de Configuração

### No GitHub (Settings > Developer settings > OAuth Apps)

1. Selecionar a OAuth App `Ov23li1qdPhwOLKOleXS`
2. Atualizar **Authorization callback URL** para: `https://devguimaraes.com.br/api/auth/callback`
3. Anotar o **Client ID**
4. Gerar um novo **Client Secret** e anotar

### Na Vercel (Project Settings > Environment Variables)

1. `GITHUB_CLIENT_ID` = Client ID da OAuth App
2. `GITHUB_CLIENT_SECRET` = Client Secret gerado
3. `ALLOWED_GITHUB_USER` = `devguimaraes`

Aplicar em Production, Preview e Development.

### Deploy

1. Fazer o deploy da branch com as mudanças
2. Acessar `https://devguimaraes.com.br/admin`
3. Clicar em "Login with GitHub"
4. Autorizar no GitHub
5. Verificar que o CMS carrega corretamente

## Arquivos Alterados

| Arquivo | Ação |
|---------|------|
| `api/auth.ts` | Criar (serverless function OAuth) |
| `public/admin/config.yml` | Editar (trocar auth_endpoint, remover app_id) |
| `vercel.json` | Editar (atualizar CSP) |

## Não-escopo

- Migração para outro CMS
- Deploy na Netlify
- Mudanças no frontend do site
- Alteração nas collections do CMS
