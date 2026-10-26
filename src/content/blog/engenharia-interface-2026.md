---
title: "Engenharia de interface: padrões de arquitetura para front-ends modernos em 2026"
date: "01 ABR 2026"
readTime: "9 min"
tags: ["Arquitetura", "Front-end", "Design System", "Testes", "Observabilidade"]
excerpt: "Front-end e engenharia de software. Conheça padrões de arquitetura, camadas, design systems e observabilidade que elevam a qualidade de projetos front-end."
---

# Engenharia de interface: padrões de arquitetura para front-ends modernos

Front-end deixou de ser "cutucar CSS e jQuery" há muitos anos. Em 2026, interfaces são sistemas distribuídos que rodam no navegador: com estado, concorrência, cache, roteamento, testes e monitoramento. Tratar front-end como engenharia de software não é pedantismo, é pragmatismo.

## Arquitetura em camadas

Uma aplicação front-end bem estruturada separa responsabilidades em camadas claras, assim como back-ends maduros fazem há décadas.

### Camada de apresentação (UI)

Componentes visuais puros, sem lógica de negócio. Recebem props, renderizam markup. Nada mais.

```tsx
// components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ variant, size, children, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

Esses componentes são testados com snapshot tests e storybooks. Não dependem de APIs, estado global ou side effects.

### Camada de estado

Gerencia o estado da aplicação com regras claras de propriedade e fluxo de dados.

```ts
// stores/cart-store.ts
import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.id === item.id);
    if (existing) {
      return {
        items: state.items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id),
  })),

  updateQuantity: (id, quantity) => set((state) => ({
    items: quantity <= 0
      ? state.items.filter(i => i.id !== id)
      : state.items.map(i => i.id === id ? { ...i, quantity } : i),
  })),

  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
```

A regra é: estado local (`useState`) para UI transitória (modais abertos, inputs focados). Estado global (store) para dados que atravessam múltiplos componentes.

### Camada de serviços

Encapsula comunicação com APIs, transformações de dados e cache. Componentes nunca chamam `fetch` diretamente.

```ts
// services/product-service.ts
import { queryOptions, useQuery } from '@tanstack/react-query';

export const productQueries = {
  list: () => queryOptions({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json() as Promise<Product[]>;
    },
    staleTime: 5 * 60 * 1000,
  }),

  byId: (id: string) => queryOptions({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json() as Promise<Product>;
    },
  }),
};

// Uso em componentes
export function useProducts() {
  return useQuery(productQueries.list());
}
```

Essa separação permite trocar a fonte de dados (REST para GraphQL, adicionar cache local, mockar em testes) sem alterar um único componente.

## Design system como contrato

Um design system não é uma biblioteca de componentes. É um contrato entre design e engenharia que garante consistência visual e funcional.

### Tokens como base

```ts
// design-tokens/index.ts
export const tokens = {
  colors: {
    primary: {
      50: '#f0fdf4',
      500: '#22c55e',
      900: '#14532d',
    },
    neutral: {
      0: '#ffffff',
      50: '#fafafa',
      900: '#171717',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radii: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  },
} as const;
```

### Componentes compostos

```tsx
// components/ui/Card/index.tsx
import { forwardRef } from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`rounded-md border shadow-sm ${className}`} {...props} />
  )
);

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-lg border-b ${className}`} {...props} />
  )
);

export const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-lg ${className}`} {...props} />
  )
);

// Uso
<Card>
  <CardHeader>
    <h3>Titulo</h3>
  </CardHeader>
  <CardContent>
    <p>Conteudo</p>
  </CardContent>
</Card>
```

## Acessibilidade como requisito, não como feature

Acessibilidade não é um ticket no backlog. É um requisito não funcional, como performance ou segurança. Deve ser validada continuamente, não adicionada depois.

### Checklist prático

- Todo elemento interativo é acessível via teclado (tab, enter, escape)
- Todo texto alternativo em imagens é descritivo e útil
- Contraste mínimo de 4.5:1 para texto normal, 3:1 para texto grande
- Formulários possuem labels associados e mensagens de erro acessíveis
- ARIA labels em elementos interativos customizados
- Focus visível em todos os elementos focáveis

### Testes automatizados de acessibilidade

```ts
// __tests__/a11y/button.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from '../components/ui/Button';

describe('Button a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Button variant="primary" size="md">
        Clique aqui
      </Button>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Testes automatizados: estratégia em camadas

### Testes unitários (componentes)

Testam componentes isolados com entradas e saídas definidas.

```ts
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button variant="primary" size="md" onClick={onClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button variant="primary" size="md" disabled>Click</Button>);

    expect(screen.getByText('Click')).toBeDisabled();
  });
});
```

### Testes de integração (fluxos)

Testam fluxos completos que envolvem múltiplos componentes e estado.

```ts
// __tests__/flows/cart.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '@/providers/CartProvider';
import { ProductCard } from '@/components/ProductCard';
import { CartSummary } from '@/components/CartSummary';

describe('Cart flow', () => {
  it('adds product and updates cart total', async () => {
    render(
      <CartProvider>
        <ProductCard product={{ id: '1', name: 'Produto A', price: 50 }} />
        <CartSummary />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Adicionar'));
    expect(screen.getByText('R$ 50,00')).toBeInTheDocument();
  });
});
```

### Testes E2E (caminhos críticos)

Testam os caminhos que geram valor de negócio, como checkout e autenticação.

## Observabilidade no front-end

Saber que algo quebrou em produção é tão importante quanto escrever o código. Observabilidade no front-end tem três pilares:

### 1. Performance metrics

```ts
// lib/monitoring/web-vitals.ts
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: { name: string; value: number }) {
  const body = JSON.stringify({
    name: metric.name,
    value: Math.round(metric.value),
    page: window.location.pathname,
    timestamp: Date.now(),
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body);
  } else {
    fetch('/api/vitals', { body, method: 'POST', keepalive: true });
  }
}

export function initWebVitals() {
  onLCP(metric => sendToAnalytics(metric));
  onINP(metric => sendToAnalytics(metric));
  onCLS(metric => sendToAnalytics(metric));
  onFCP(metric => sendToAnalytics(metric));
  onTTFB(metric => sendToAnalytics(metric));
}
```

### 2. Error tracking

```ts
// lib/monitoring/errors.ts
export function initErrorTracking() {
  window.addEventListener('error', (event) => {
    logError({
      type: 'runtime',
      message: event.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError({
      type: 'promise',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
    });
  });
}
```

### 3. User behavior analytics

Rastreamento de eventos de interação para entender onde os usuários encontram atrito. Diferente de métricas de marketing, o foco é identificar pontos de confusão ou fricção na interface.

## Conclusão

Front-end moderno exige disciplina de engenharia: camadas separadas, contratos claros, testes automatizados e observabilidade em produção. Não se trata de over-engineering, mas de aplicar práticas que o back-end já consolidou há anos.

O investimentos em arquitetura se paga rapidamente: bugs são detectados antes de chegar ao usuário, refatorações são seguras, e a velocidade de entrega aumenta porque cada mudança é isolada em sua camada. Em 2026, front-end sem arquitetura é dívida técnica desde o primeiro deploy.
