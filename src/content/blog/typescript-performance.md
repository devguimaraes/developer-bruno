---
title: "TypeScript Performance: Otimizações Avançadas"
date: "18 NOV 2025"
readTime: "6 min"
tags: ["TypeScript", "Performance", "Otimização", "Build"]
excerpt: "Técnicas avançadas para melhorar a performance de compilação e runtime em projetos TypeScript."
---

# TypeScript Performance: Otimizações Avançadas ⚡

TypeScript trouxe type-safety para o JavaScript, mas às vezes pode impactar a performance do build. Vamos explorar técnicas para otimizar projetos TypeScript sem sacrificar a segurança de tipos.

## 🎯 Por Que Performance Importa?

- **Builds mais rápidos**: Menos tempo esperando compilação
- **Melhor DX**: Hot reload instantâneo
- **CI/CD eficiente**: Pipelines mais rápidos
- **Escala**: Projetos grandes precisam de otimização

## 🔧 Configurações do tsconfig.json

### 1. **skipLibCheck**

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

Pula a verificação de tipos em arquivos `.d.ts`, economizando tempo significativo.

### 2. **incremental**

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo"
  }
}
```

Habilita compilação incremental, recompilando apenas arquivos modificados.

### 3. **Project References**

Para monorepos, use referências de projeto:

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true
  }
}

// packages/app/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "references": [
    { "path": "../shared" }
  ]
}
```

## 💡 Otimizações de Código

### 1. **Use Type Imports**

```typescript
// ❌ Ruim - Importa valor também
import { User } from './types';

// ✅ Bom - Apenas tipo
import type { User } from './types';
```

### 2. **Evite Tipos Complexos em Loops**

```typescript
// ❌ Ruim - Cálculo de tipo complexo
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ✅ Bom - Simplifique ou use bibliotecas testadas
import { PartialDeep } from 'type-fest';
```

### 3. **Prefira Interfaces sobre Types**

```typescript
// ✅ Melhor performance
interface User {
  id: string;
  name: string;
}

interface Admin extends User {
  role: string;
}

// ⚠️ Mais lento (em alguns casos)
type User = {
  id: string;
  name: string;
};

type Admin = User & {
  role: string;
};
```

## 🛠️ Ferramentas e Técnicas

### 1. **Analyze Type-Checking Time**

```bash
# Veja quanto tempo cada arquivo leva
tsc --extendedDiagnostics
```

### 2. **Use SWC ou esbuild**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // SWC em vez de Babel

export default defineConfig({
  plugins: [react()],
});
```

### 3. **Lazy Types**

```typescript
// ❌ Importa tudo imediatamente
import { HugeType } from './huge-file';

// ✅ Carrega sob demanda
type LazyType = typeof import('./huge-file').HugeType;
```

## 📊 Otimizações Específicas

### Para Projetos Next.js

```typescript
// next.config.js
module.exports = {
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    typedRoutes: true,
  },
};
```

### Para Vite

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-typescript', {
            isTSX: true,
            optimizeConstEnums: true,
          }],
        ],
      },
    }),
  ],
});
```

## ⚡ Checklist de Performance

- [ ] `skipLibCheck: true` habilitado
- [ ] `incremental: true` para builds iterativos
- [ ] Usar `type` imports quando possível
- [ ] Project references em monorepos
- [ ] SWC ou esbuild para transpilação
- [ ] Evitar tipos muito complexos
- [ ] Lazy loading de tipos pesados
- [ ] Cache adequado em CI/CD

## 🎓 Resultados Esperados

Com essas otimizações, você pode ver:

- **50-70%** de redução no tempo de build inicial
- **80-90%** mais rápido em builds incrementais
- **Melhor** experiência de desenvolvimento
- **Menor** consumo de memória

## 💻 Exemplo Completo

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    
    // Performance
    "skipLibCheck": true,
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo",
    
    // Type-checking
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    
    // Module resolution
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---
*Performance não precisa ser inimiga de type-safety. Com as configurações certas, você tem o melhor dos dois mundos!* 🚀
