# 🗑️ Plano de Descontinuação do Antigravity

> **Status**: 📅 Planejamento  
> **Data**: 29 de Janeiro de 2026  
> **Objetivo**: Remover a seção comercial "Antigravity Config Store" e funcionalidades associadas.

Este documento detalha o plano para remover a venda do pack de configurações Antigravity, revertendo o site para um portfólio puro.

---

## 1. 🔍 Análise de Dependências

Antes da remoção, mapeamos todos os artefatos que compõem a feature:

### Frontend
- **Página**: `src/pages/AntigravityPage.tsx`
- **Componentes**: `src/components/antigravity/` (toda a pasta)
  - `HeroSection.tsx`
  - `ComparisonSection.tsx`
  - `FeaturesSection.tsx`
  - `PricingSection.tsx`
  - `FAQSection.tsx`
  - `CheckoutModal.tsx`
- **Rotas**: Entrada em `src/App.tsx` (`/antigravity`)
- **Navegação**: Links em `src/config/site.ts` (ou `Navigation.tsx`)
- **Assets**: Imagens ou arquivos específicos em `public/` ou `src/assets/` usados apenas nesta página.

### Backend (Supabase)
- **Edge Functions**:
  - `supabase/functions/create-pix-payment`
  - `supabase/functions/mercadopago-webhook`
  - `supabase/functions/payment-status`
  - `supabase/functions/download`
- **Database**: Tabela `payments`
- **Storage**: Bucket `antigravity-files` (arquivo `antigravity-pack.zip`)
- **Policies**: RLS policies associadas à tabela `payments`.

### Conteúdo
- **Pasta do Produto**: `antigravity-pack/` (arquivos fonte do produto vendido)

---

## 2. ✂️ Plano de Remoção (Frontend & Backend)

### Passo 2.1: Limpeza do Frontend
1. **Remover Rota**: Excluir a definição da rota `/antigravity` em `src/App.tsx`.
2. **Remover Links**: Atualizar `src/config/site.ts` para remover o item "Antigravity" do menu de navegação e footer.
3. **Excluir Arquivos**:
   - Deletar `src/pages/AntigravityPage.tsx`
   - Deletar pasta `src/components/antigravity/`
4. **Limpeza de Imports**: Verificar e remover imports órfãos em `src/App.tsx` e outros arquivos consumidores.

### Passo 2.2: Desativação do Backend
1. **Remover Edge Functions**: Deletar as pastas das funções listadas acima em `supabase/functions/`.
2. **Atualizar Variáveis de Ambiente**: Remover chaves do Mercado Pago (`MERCADOPAGO_ACCESS_TOKEN`, `PRODUCT_PRICE`) do `.env` local e do painel do Supabase (opcional, por segurança).

---

## 3. 🔄 Atualização de SEO e Redirecionamentos

Para manter a integridade do domínio e não perder tráfego de links antigos:

1. **Configurar Redirect (Vercel)**:
   - Adicionar regra no `vercel.json` para redirecionar `/antigravity` para `/` (Home) com status **301 (Permanent)**.
   ```json
   {
     "redirects": [
       { "source": "/antigravity", "destination": "/", "permanent": true }
     ]
   }
   ```
2. **Sitemap**: O script de sitemap deve ser atualizado (se não for dinâmico) para parar de listar a URL antiga.
3. **Robots.txt**: Verificar se há regras específicas a remover.

---

## 4. 📦 Arquivamento de Dados

Preservação de histórico e dados de clientes (se houveram vendas):

1. **Backup do Banco de Dados**:
   - Exportar dados da tabela `payments` para CSV/SQL (`pg_dump` ou via Dashboard).
   - Salvar em local seguro (fora do repositório público) ou em pasta privada `archive/db_dumps/`.
2. **Backup do Produto**:
   - Mover a pasta `antigravity-pack/` para uma pasta de arquivo (`archive/products/antigravity/`) ou removê-la do repositório se for código proprietário que não deve ficar no histórico público (considerar limpar histórico git se for sensível).
   - **Decisão**: Mover para `archive/` localmente e adicionar ao `.gitignore` se quiser manter apenas localmente.
3. **Drop Table (Opcional)**: Após backup, remover a tabela `payments` para limpar o schema do banco.

---

## 5. 🧪 Testes de Regressão

Garantir que a remoção não quebrou o site principal:

1. **Build Test**: Executar `npm run build` para garantir que não restaram imports quebrados.
2. **Navigation Check**:
   - Verificar se o menu principal e footer não têm links quebrados.
   - Testar acesso direto a `/antigravity` para verificar o redirect.
3. **Smoke Test**: Navegar pelas páginas Home, Blog, Projects para garantir estabilidade.
4. **Console Check**: Verificar se há erros de "module not found" no console do navegador.

---

## 6. 📝 Checklist de Execução

- [ ] 1. Backup dos dados da tabela `payments` (Supabase).
- [ ] 2. Remover rota e links de navegação (`App.tsx`, `config/site.ts`).
- [ ] 3. Excluir componentes e páginas (`src/components/antigravity`, `src/pages/AntigravityPage.tsx`).
- [ ] 4. Remover Edge Functions (`supabase/functions/`).
- [ ] 5. Configurar redirect 301 em `vercel.json`.
- [ ] 6. Executar `npm run build` e corrigir erros.
- [ ] 7. Commit das alterações: `chore: sunset antigravity product`.
