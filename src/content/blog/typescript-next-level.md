---
title: "TypeScript: Nível Avançado"
date: "15 NOV 2023"
readTime: "10 min"
tags: ["TypeScript", "Advanced", "Tips"]
excerpt: "Vá além dos tipos básicos. Domine generics, utility types e padrões avançados para código Type-Safe."
---

# TypeScript que Impressiona

Todo mundo sabe fazer `interface User { name: string }`. Mas você está usando TypeScript no máximo?

## Generics que Fazem Sentido

### 1. Tipos Retornáveis
```typescript
function apiCall<T>(endpoint: string): Promise<T> {
  return fetch(endpoint).then(res => res.json())
}

type User = ReturnType<typeof apiCall<'/api/user'>>
```

### 2. Utility Types Criativos
```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>
```

### 3. Type Guards Avançados
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
```

## Padrões de Empresa

### 1. Branded Types
```typescript
type UserId = string & { readonly brand: unique symbol }
function createUserId(id: string): UserId {
  return id as UserId
}
```

### 2. Mapped Types com Template Literals
```typescript
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (event: T[K]) => void
}
```

TypeScript não é sobre restrição. É sobre **clareza** e **confiança** no seu código.