# Developer Bruno - Portfólio Profissional

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](#licença)

Um portfólio digital profissional construído com tecnologias modernas, featuring design brutalist e interatividade aprimorada. Exibe projetos, experiência profissional, blog integrado e permite contato direto.

✅ **PHASE1 IMPLEMENTATION COMPLETA** - Arquitetura de dados 100% externalizada com TypeScript strict
✅ **PHASE2 IMPLEMENTATION COMPLETA** - SEO & Monitoring otimizados para mercado brasileiro

[Visualizar Live](#deploy) • [Documentação](#documentação) • [Status da Implementação](docs/PHASE1_IMPLEMENTATION.md) • [Contribuindo](#contribuindo)

</div>

---

## 📋 Índice

- [Status Atual](#status-atual)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [Build & Deploy](#build--deploy)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Melhores Práticas](#melhores-práticas)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎯 Status Atual

### ✅ **PHASE1: Content Management - 100% COMPLETA**

- **Arquitetura de Dados**: 100% externalizada com TypeScript strict
- **Validação Runtime**: Schemas Zod para todas as estruturas de dados
- **Type Safety**: Interfaces completas para Projects, Experience, Skills
- **Utilitários**: Funções de busca, filtragem e estatísticas implementadas
- **Component Integration**: Hero, Projects, Experience usando dados externos

### ✅ **PHASE2: SEO & Monitoring - 100% COMPLETA**

- **SEO Otimizado**: Meta tags dinâmicas para mercado brasileiro (pt-BR)
- **Structured Data**: Schema.org markup em português para buscadores brasileiros
- **Performance Monitoring**: Core Web Vitals com thresholds para redes 3G/4G brasileiras
- **Error Boundaries**: Fallback UX em português com opções de recovery
- **Analytics Privacy-Focused**: Plausible integration LGPD compliant
- **Sitemap Generation**: XML sitemap otimizado para buscadores nacionais

### 🚧 **Em Progresso**

- **Skills Component**: Migração para dados externos em andamento
- **Performance**: Otimização de imagens e bundle size
- **Testing**: Infraestrutura de testes planejada

### 📋 **Próximos Fases**

1. **Fase 3**: Testing Infrastructure (Vitest + React Testing Library)
2. **Fase 4**: Performance Optimization Avançada
3. **Fase 5**: PWA Features & Offline Support

---

## ✨ Características

### 🎨 **Design & UX**

- **Design Brutalist Moderno**: Estética minimalista e contraste elevado para máxima legibilidade
- **Totalmente Responsivo**: Otimizado para desktop, tablet e mobile
- **Dark Mode Nativo**: Suporte integrado a temas escuro/claro com transições suaves
- **Animações Customizadas**: Keyframes brutais com efeitos glitch, float e typing

### ⚡ **Performance & Tecnologia**

- **Performance Otimizada**: Build rápido com Vite + SWC, lazy loading de componentes
- **TypeScript Strict**: Tipagem estática completa para maior segurança
- **Componentes Acessíveis**: Integração com Radix UI para acessibilidade WCAG 2.1

### 📝 **Content Management**

- **Dados Externalizados**: 100% do conteúdo em arquivos dedicados com validação
- **Blog Integrado**: Sistema de blog com suporte a markdown e navegação
- **Services Section**: Seção de serviços organizada por categoria
- **Experience Timeline**: Timeline interativa com achievements e skills

### 🚀 **SEO & Monitoring**

- **SEO Brasileiro**: Meta tags dinâmicas otimizadas para mercado brasileiro (pt-BR)
- **Structured Data**: Schema.org markup em português para buscadores nacionais
- **Performance Monitoring**: Core Web Vitals com thresholds para redes 3G/4G brasileiras
- **Error Boundaries**: Fallback UX amigável em português com opções de recovery
- **Analytics Privacy-Focused**: Plausible integration 100% LGPD compliant
- **Sitemap XML**: Geração automática otimizada para Google Brasil e buscadores

### 🔧 **Desenvolvimento**

- **SEO-Friendly**: Estrutura semântica HTML e meta tags otimizadas
- **Component Architecture**: Separação clara entre UI primitives e feature components
- **State Management**: React Query para server state, useState para UI state
- **Form Validation**: React Hook Form + Zod para validação robusta

---

## 🛠️ Stack Tecnológico

### Frontend

- **Framework**: React 18.3 com TypeScript
- **Build Tool**: Vite 7.2 com SWC
- **Styling**: Tailwind CSS 3.4 + animations
- **UI Components**: shadcn/ui + Radix UI primitives
- **Routing**: React Router DOM 6.30
- **State Management**: React Query 5.83
- **Forms**: React Hook Form 7.61 + Zod 3.25

### SEO & Analytics

- **SEO Meta Tags**: React Helmet Async 2.0
- **Structured Data**: Schema.org JSON-LD markup
- **Performance Monitoring**: Web Vitals 5.1
- **Privacy Analytics**: Plausible Tracker (LGPD compliant)
- **Error Tracking**: Custom Error Boundaries
- **Sitemap Generation**: Automated XML sitemap

### DevTools

- **Linting**: ESLint 9.32
- **Type Checking**: TypeScript 5.8
- **Code Formatting**: (via ESLint)
- **Preview**: Vite Preview

### Design System

- **Icons**: Lucide React
- **Notifications**: Sonner Toast
- **Date Picker**: React Day Picker
- **Charts**: Recharts

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js**: v18+ (recomendado: v20 LTS)
- **npm**: v9+ ou **bun** (gerenciador alternativo)
- **Git**: v2.30+

Verificar versões instaladas:

```bash
node --version
npm --version
git --version
```

Para instalar Node.js, utilize [nvm](https://github.com/nvm-sh/nvm) (recomendado):

```bash
# Instalar nvm (Linux/macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Usar Node 20 LTS
nvm install 20
nvm use 20
```

---

## 🚀 Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/devguimaraes/developer-bruno.git
cd developer-bruno
```

### 2. Instalar Dependências

```bash
# Com npm
npm install

# Ou com bun
bun install
```

### 3. Configurar Variáveis de Ambiente (se necessário)

Criar arquivo `.env.local` na raiz do projeto:

```bash
VITE_API_URL=http://localhost:3000
```

---

## 💻 Desenvolvimento

### Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173` com:

- **Hot Module Replacement (HMR)**: Recarregamento instantâneo ao salvar
- **Source Maps**: Debug facilitado em DevTools
- **TypeScript Checking**: Validação em tempo real

### Outros Comandos

```bash
# Linting - Verificar problemas de código
npm run lint

# Build - Gerar bundle de produção
npm run build

# Build Dev - Gerar bundle em modo desenvolvimento
npm run build:dev

# Preview - Visualizar build localmente
npm run preview
```

---

## 🏗️ Build & Deploy

### Build de Produção

```bash
npm run build
```

Gera otimizado em `dist/`:

- Minificação de código
- Code splitting automático
- Tree-shaking de dependências não utilizadas
- Compressão de assets

### Verificar Build Localmente

```bash
npm run preview
```

### Deploy

O projeto está pronto para deploy em:

- **Vercel**: [Guia de deploy](https://vercel.com/docs/frameworks/react)
- **Netlify**: [Guia de deploy](https://docs.netlify.com/integrations/frameworks/vite/)
- **GitHub Pages**: Configure `vite.config.ts` com `base: '/developer-bruno/'`

#### Deploy Automático (GitHub Pages)

Adicionar ao `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/developer-bruno/',
  // ... resto da config
})
```

---

## 📁 Estrutura do Projeto

```
developer-bruno/
├── public/                 # Assets estáticos
│   ├── robots.txt         # SEO - Configuração crawlers
│   └── assets/            # Imagens e mídias
├── src/
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── ui/           # Primitivos visuais (shadcn/ui)
│   │   ├── About.tsx     # Seção sobre com skills
│   │   ├── Contact.tsx   # Seção de contato e CTAs
│   │   ├── Experience.tsx # Timeline de experiência
│   │   ├── Footer.tsx    # Rodapé dinâmico
│   │   ├── Hero.tsx      # Seção principal com dados externos
│   │   ├── Navigation.tsx # Barra de navegação responsiva
│   │   ├── Projects.tsx  # Galeria de projetos filtrável
│   │   ├── Services.tsx  # Seção de serviços
│   │   ├── Skills.tsx    # Chips de tecnologias (em migração)
│   │   └── Blog/         # Sistema de blog
│   │       ├── Blog.tsx
│   │       ├── BlogPostPage.tsx
│   │       └── blog-components/
│   ├── hooks/            # Custom React hooks
│   │   ├── use-mobile.tsx     # Detectar viewport mobile
│   │   ├── use-toast.ts       # Sistema de notificações
│   │   └── useStackingSections.tsx # Scroll-based sections
│   ├── lib/              # Utilitários e helpers
│   │   ├── utils.ts      # Funções auxiliares gerais
│   │   ├── validation.ts # Schemas Zod e validação
│   │   └── typography.ts # Configurações de tipografia
│   ├── types/            # TypeScript definitions
│   │   └── index.ts      # Interfaces para todo o conteúdo
│   ├── config/           # Configuração do site
│   │   └── site.ts       # Metadados e dados do Hero
│   ├── data/             # Dados externalizados
│   │   ├── projects.ts   # Dados dos projetos com utilitários
│   │   ├── experience.ts # Experiência profissional
│   │   ├── skills.ts     # Tecnologias e competências
│   │   └── blog/         # Conteúdo do blog em markdown
│   ├── pages/            # Páginas/Layouts
│   │   ├── Index.tsx     # Página principal
│   │   ├── NotFound.tsx  # 404
│   │   └── Blog.tsx      # Página do blog
│   ├── assets/           # Assets estáticos do código
│   ├── App.tsx           # Componente raiz
│   ├── main.tsx          # Entry point
│   ├── App.css           # Estilos globais
│   ├── index.css         # Configurações Tailwind
│   └── vite-env.d.ts     # Tipos Vite
├── docs/                 # Documentação do projeto
│   ├── PHASE1_IMPLEMENTATION.md  # Status da implementação
│   └── PROJECT_ANALYSIS.md       # Análise técnica
├── eslint.config.js      # Configuração ESLint
├── tailwind.config.ts    # Temas e tokens Tailwind
├── tsconfig.json         # Configuração TypeScript
├── vite.config.ts        # Configuração build
├── package.json          # Dependências e scripts
└── README.md             # Este arquivo
```

### Principais Diretórios

| Diretório | Propósito |
|-----------|-----------|
| `src/components/ui/` | Componentes base sem lógica (buttons, inputs, etc) |
| `src/components/` | Componentes com lógica (seções da página) |
| `src/components/Blog/` | Sistema completo de blog com navegação |
| `src/types/` | Definições TypeScript para todo o conteúdo |
| `src/config/` | Configurações centralizadas do site e metadados |
| `src/data/` | Dados externalizados (projects, experience, skills) |
| `src/lib/` | Utilitários, validação e configurações |
| `src/pages/` | Componentes de página (layouts) |
| `src/hooks/` | Custom React hooks reutilizáveis |
| `docs/` | Documentação técnica e status da implementação |

### 🏗️ **Arquitetura de Dados (PHASE1)**

O projeto implementa uma arquitetura de dados completamente externalizada:

- **`src/types/index.ts`**: Interfaces TypeScript para todas as estruturas
- **`src/config/site.ts`**: Metadados e configurações globais do site
- **`src/data/projects.ts`**: Dados dos projetos com funções de busca e filtragem
- **`src/data/experience.ts`**: Timeline profissional com skills e achievements
- **`src/data/skills.ts`**: Competências técnicas organizadas por categoria
- **`src/lib/validation.ts`**: Schemas Zod para validação runtime

Esta arquitetura permite fácil manutenção, atualização de conteúdo sem modificar componentes e type safety completo.

---

## 🧪 Melhores Práticas

### 💻 **Código**

- **Component Design**: Manter componentes pequenos e focados em uma responsabilidade
- **TypeScript**: Usar TypeScript strict com tipos explícitos e interfaces claras
- **Composition**: Preferir composition sobre herança
- **Custom Hooks**: Extrair lógica complexa em hooks reutilizáveis
- **Data Architecture**: Externalizar dados em arquivos dedicados com validação

### 📝 **Commits**

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adicionar novo componente X
fix: corrigir bug em Y
docs: atualizar README
style: reformatação de código
refactor: reorganizar estrutura X
test: adicionar testes para X
```

### ⚡ **Performance**

- **Lazy Loading**: Componentes pesados com `React.lazy()`
- **Memoização**: Usar `React.memo()` para renderização otimizada
- **Code Splitting**: Aproveitar splitting automático do Vite
- **Images**: Otimizar imagens e usar formatos modernos (WebP)
- **Bundle Analysis**: Monitorar tamanho do bundle com build analysis

### 🎨 **Design System**

- **Consistência**: Seguir design tokens do Tailwind (cores, sombras, bordas)
- **Brutalist Aesthetic**: Manter consistência com `border-4`, `--radius: 0rem`
- **Dark Mode**: Usar CSS variables para temas claro/escuro
- **Responsive**: Mobile-first design com breakpoints adequados
- **Accessibility**: Componentes com ARIA labels e navegação por teclado

### 🔧 **Desenvolvimento**

- **Environment**: Variáveis de ambiente em `.env.local`
- **Linting**: Executar `npm run lint` antes de commits
- **Type Checking**: Aproveitar validação TypeScript em tempo real
- **Testing**: Testar componentes em múltiplos viewports
- **Build Verification**: Executar `npm run build` antes de deploy

### 📊 **Monitoramento**

- **Error Boundaries**: Implementar fallbacks para erros de runtime
- **Performance**: Monitorar Core Web Vitals
- **Bundle Size**: Analisar tamanho dos chunks periodicamente
- **Dependencies**: Revisar e atualizar dependências regularmente

---

## 🔄 Workflow de Contribuição

Este projeto segue **Gitflow Workflow**:

1. **Branches principais**:
   - `main` - produção (versões estáveis)
   - `develop` - staging (desenvolvimento)

2. **Branches de feature**:

   ```bash
   git checkout -b feature/nova-seção
   ```

3. **Processo**:
   - Criar feature branch de `develop`
   - Fazer commits com mensagens claras
   - Abrir Pull Request para `develop`
   - Code review antes de merge
   - Merge para `main` apenas em releases

Leia [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes completos.

---

## 📝 Licença

Este projeto está licenciado sob a [MIT License](LICENSE) - você é livre para usar, modificar e distribuir este código.

---

## 📧 Contato & Suporte

- **Email**: <bruno@example.com>
- **LinkedIn**: [Seu LinkedIn]
- **GitHub**: [devguimaraes](https://github.com/devguimaraes)
- **Issues**: [Abrir issue](https://github.com/devguimaraes/developer-bruno/issues)

---

## 🙏 Agradecimentos

- [shadcn/ui](https://ui.shadcn.com/) - Componentes React acessíveis
- [Radix UI](https://www.radix-ui.com/) - Primitivos headless
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Vite](https://vitejs.dev/) - Build tool ultra-rápido

---

<div align="center">

Feito com ❤️ por [Bruno Guimarães](https://github.com/devguimaraes)

</div>
