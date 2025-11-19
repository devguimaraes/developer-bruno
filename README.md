# Developer Bruno - Portfólio Profissional

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](#licença)

Um portfólio digital profissional construído com tecnologias modernas, featuring design brutalist e interatividade aprimorada. Exibe projetos, experiência profissional e permite contato direto.

[Visualizar Live](#deploy) • [Documentação](#documentação) • [Contribuindo](#contribuindo)

</div>

---

## 📋 Índice

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [Build & Deploy](#build--deploy)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## ✨ Características

- **Design Brutalist Moderno**: Estética minimalista e contraste elevado para máxima legibilidade
- **Totalmente Responsivo**: Otimizado para desktop, tablet e mobile
- **Performance Otimizada**: Build rápido com Vite + SWC, lazy loading de componentes
- **TypeScript Strict**: Tipagem estática completa para maior segurança
- **Componentes Acessíveis**: Integração com Radix UI para acessibilidade WCAG 2.1
- **Dark Mode Nativo**: Suporte integrado a temas escuro/claro com Next Themes
- **SEO-Friendly**: Estrutura semântica HTML e meta tags otimizadas
- **Formulário de Contato**: Validação robusta com React Hook Form e Zod

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: React 18.3 com TypeScript
- **Build Tool**: Vite 5.4 com SWC
- **Styling**: Tailwind CSS 3.4 + animations
- **UI Components**: shadcn/ui + Radix UI primitives
- **Routing**: React Router DOM 6.30
- **State Management**: React Query 5.83
- **Forms**: React Hook Form 7.61 + Zod 3.25

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
│   └── robots.txt         # SEO - Configuração crawlers
├── src/
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── ui/           # Primitivos visuais (shadcn/ui)
│   │   ├── About.tsx     # Seção sobre
│   │   ├── Contact.tsx   # Formulário de contato
│   │   ├── Experience.tsx # Timeline de experiência
│   │   ├── Footer.tsx    # Rodapé
│   │   ├── Hero.tsx      # Seção principal
│   │   ├── Navigation.tsx # Barra de navegação
│   │   ├── Projects.tsx  # Galeria de projetos
│   │   └── NavLink.tsx   # Link customizado
│   ├── hooks/            # Custom React hooks
│   │   ├── use-mobile.tsx     # Detectar viewport mobile
│   │   └── use-toast.ts       # Sistema de notificações
│   ├── lib/              # Utilitários e helpers
│   │   └── utils.ts      # Funções auxiliares
│   ├── pages/            # Páginas/Layouts
│   │   ├── Index.tsx     # Página principal
│   │   └── NotFound.tsx  # 404
│   ├── assets/           # Imagens, vídeos, etc
│   ├── App.tsx           # Componente raiz
│   ├── main.tsx          # Entry point
│   ├── App.css           # Estilos globais
│   ├── index.css         # Configurações Tailwind
│   └── vite-env.d.ts     # Tipos Vite
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
| `src/pages/` | Componentes de página (layouts) |
| `src/hooks/` | Custom React hooks reutilizáveis |
| `src/lib/` | Funções utilitárias puras |

---

## 🧪 Boas Práticas

### Código

- Manter componentes pequenos e focados em uma responsabilidade
- Usar TypeScript stricto - sempre adicionar tipos explícitos
- Preferir composition sobre herança
- Extrair lógica complexa em custom hooks

### Commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: adicionar novo componente X
fix: corrigir bug em Y
docs: atualizar README
style: reformatação de código
refactor: reorganizar estrutura X
```

### Performance

- Lazy load de componentes pesados
- Memoização de componentes com `React.memo()` quando necessário
- Code splitting automático via Vite
- Otimizar imagens e usar formatos modernos (WebP)

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

- **Email**: bruno@example.com
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
