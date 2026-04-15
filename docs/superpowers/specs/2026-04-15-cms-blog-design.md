# Design: CMS para Blog e Projetos (Decap CMS)

**Issue:** DEV-63
**Data:** 2026-04-15
**Status:** Aprovado

## Objetivo

Adicionar um CMS Git-based ao portfólio developer-bruno para gerenciar posts do blog e projetos, sem custo de infraestrutura e sem alterar a arquitetura SSG existente.

## Decisões

- **CMS:** Decap CMS (antigo Netlify CMS) — 100% client-side, zero custo, GitHub como backend
- **Acesso:** Painel integrado em `/admin` no site
- **Publicação:** Direta na branch main (sem PR/draft)
- **Imagens:** Upload via CMS para `public/uploads/` no repositório
- **Dependências:** Zero npm packages — Decap carrega via CDN

## Arquitetura

```
Autor → /admin (Decap CMS) → GitHub API (commit) → Vercel (build) → Site atualizado
```

### Fluxo

1. Autor acessa `devguimaraes.com.br/admin`
2. Autentica via GitHub OAuth
3. Cria/edita posts ou projetos no editor visual
4. Salva → Decap faz commit direto na branch `main`
5. Vercel detecta o push e faz build automático
6. Site atualizado em ~1-2 minutos

## Arquivos Novos

### `public/admin/index.html`

Ponto de entrada do CMS. HTML mínimo que carrega Decap CMS via CDN. Inclui:
- Script do Decap CMS (`decap-cms@^3.0.0`)
- Meta tag para `proxy` se necessário (para bypass de CORS em desenvolvimento)

### `public/admin/config.yml`

Configuração do Decap CMS. Define:

**Backend:**
```yaml
backend:
  name: github
  repo: devguimaraes/developer-bruno
  branch: main
  auth_type: pkce
```

**Media:**
```yaml
media_folder: public/uploads
public_folder: /uploads
```

## Collections

### 1. Blog (`src/content/blog/`)

| Campo | Widget | Configuração |
|-------|--------|-------------|
| title | string | Obrigatório |
| date | datetime | Format: `YYYY-MM-DD` |
| tags | list (select) | Opções: React, TypeScript, Next.js, Astro, CSS, JavaScript, Node.js, IA, Engenharia, Performance, UI/UX, Front-end |
| excerpt | text | Obrigatório |
| featured | boolean | Default: `false` |
| image | image | Opcional, upload para `public/uploads/blog/` |
| author | hidden | Default: `"Bruno Guimarães"` |
| body | markdown | Conteúdo do post |

**Arquivo gerado:** `src/content/blog/{slug}.md`

**Slug:** Gerado automaticamente a partir do título (lowercase, sem acentos, hífens no lugar de espaços).

**Preview:** Usa o próprio site como preview template (`/blog/{slug}`).

### 2. Projetos (`src/data/projects.ts`)

| Campo | Widget | Configuração |
|-------|--------|-------------|
| title | string | Obrigatório |
| description | text | Obrigatório |
| tags | list (select) | Mesmas opções do blog |
| image | image | Opcional, upload para `public/uploads/projects/` |
| url | string | URL do projeto (opcional) |
| github | string | URL do repositório (opcional) |
| featured | boolean | Default: `false` |
| order | number | Default: `0` (ordem de exibição) |

**Arquivo gerado:** `src/data/projects/{slug}.md` (markdown com frontmatter)

**Nota sobre projetos:** Atualmente os projetos ficam em `src/data/projects.ts` como array TypeScript. Com o CMS, migramos para arquivos markdown individuais em `src/data/projects/`. A função de leitura precisará ser adaptada para usar `getCollection` do Astro, similar ao blog.

## Mudanças Necessárias no Código Existente

### `src/data/projects.ts`
- Migrar de array TypeScript para collection Astro
- Criar `src/data/projects/` com os projetos atuais como `.md`
- Adaptar a função de leitura para usar `getCollection`

### `src/content.config.ts`
- Adicionar schema Zod para a collection `projects`

### `src/components/pages/Index.tsx`
- Adaptar importação de projetos para usar a nova collection

### `public/admin/config.yml`
- Definir as collections de blog e projetos
- Configurar preview templates

## Fora de Escopo

- Draft/PR workflow (publicação direta apenas)
- Gerenciamento de experiência/skills
- Gerenciamento de dados do site (site.ts)
- Busca no site
- Comentários nos posts
- Autores múltiplos

## Riscos

| Risco | Mitigação |
|-------|-----------|
| GitHub OAuth pode exigir configuração extra no Vercel | Usar `auth_type: pkce` (sem backend necessário) |
| Preview pode não funcionar perfeitamente com React islands | Preview é "best effort" — o build real valida |
| Migração de projetos para markdown pode quebrar imports | Adaptar a camada de dados antes de habilitar o CMS |

## Validação

- [ ] CMS carrega em `/admin` sem erros
- [ ] Autenticação GitHub funciona
- [ ] Criar post novo via CMS gera `.md` correto
- [ ] Upload de imagem funciona
- [ ] Preview mostra o post corretamente
- [ ] Build passa após edição via CMS
- [ ] Projetos migram para markdown sem quebrar o site
