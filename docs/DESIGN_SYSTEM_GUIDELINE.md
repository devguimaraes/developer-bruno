# 📘 **Developer Bruno – Design System (Internal)**

> **Versão:** 1.0.0 (Neo-Brutalist Edition)
> **Stack:** React + TypeScript + Tailwind + shadcn/ui

## 🚀 **1. MANIFESTO & IDENTIDADE**

Nosso design system não é apenas "minimalista". Ele é **Neo-Brutalista**.
Ele é cru, assertivo, de alto contraste e focado em performance para o mercado brasileiro.

### **Os 3 Mandamentos Visuais**
1.  **Borders are King:** Tudo tem borda (`border-4 border-black`). Sem sutilezas.
2.  **Shadows are Hard:** Sombras sólidas, sem blur (`4px 4px 0px #000`).
3.  **Motion is Glitch:** As animações devem parecer digitais, "glitchy" ou mecânicas.

### **Identidade Visual: "Techno Brutalist Prism"**
Nossas cores são definidas em HSL para manipulação fácil de opacidade.

| Token | Nome | Valor (HSL) | Uso |
|-------|------|-------------|-----|
| `--primary` | **Parakeet** | `162 100% 27%` | Ações principais, destaques |
| `--secondary` | **Royal Lilac** | `282 32% 42%` | Elementos de apoio |
| `--accent` | **Freesia** | `45 87% 57%` | Atenção, notificações |
| `--background` | **Light/Dark** | `0 0% 98%` / `8%` | Fundo base |
| `--brutal-orange` | **Danger** | `#f97316` | Alertas, Glitch FX |

***

## 🏗️ **2. ARQUITETURA TÉCNICA**

### **Layer 1: Design Tokens (`src/index.css` + `tailwind.config.ts`)**
Nossa fonte da verdade é híbrida. Definimos variáveis CSS para temas e usamos o Tailwind para consumi-las.

**Não use cores hardcoded.** Use sempre as classes utilitárias ou variáveis.

```css
/* ✅ Bom: Usa o sistema */
.card {
  @apply bg-background border-4 border-black shadow-brutal;
}

/* ❌ Ruim: Foge do tema */
.card {
  background: #f0f0f0;
  box-shadow: 5px 5px 0px black;
}
```

### **Layer 2: Primitivos (`src/components/ui/*.tsx`)**
Baseados em **shadcn/ui** (Radix UI + Tailwind).
- **Localização:** `src/components/ui/`
- **Padrão:** `forwardRef` + `cva` (Class Variance Authority).
- **Exemplo (Button):**
  ```tsx
  // Suporta variantes: 'default', 'outline', 'ghost', 'brutal'
  <Button variant="brutal" size="lg">CLIQUE AQUI</Button>
  ```

### **Layer 3: Padrões & Neo-Classes**
Criamos abstrações CSS para padrões repetitivos do brutalismo (ver `src/index.css`).

| Classe Utilitária | Efeito |
|-------------------|--------|
| `.neo-card` | Borda preta grossa + Sombra dura |
| `.neo-hover` | Move 2px e ajusta sombra no hover |
| `.glitch` | Efeito de texto "tremendo" |
| `.text-stroke` | Texto com borda e preenchimento transparente |

***

## ⚡ **3. PERFORMANCE (Mercado Brasileiro)**

Nossa audiência inclui usuários em redes 3G/4G instáveis. A performance não é luxo, é requisito.

### **Budgets (Monitorados por `useWebVitals`)**
| Métrica | Threshold (BR) | Ação se falhar |
|---------|----------------|----------------|
| **LCP** | < 2.5s | Otimizar imagens (WebP), Lazy Load |
| **JS Bundle** | < 300KB | Code Splitting, Remover libs pesadas |
| **Images** | < 500KB | Compressão agressiva |

### **Regras de Otimização**
1.  **Code Splitting:** Use `React.lazy` para seções pesadas (`Services`, `Blog`).
2.  **Imagens:** Sempre use formato WebP e dimensões explícitas.
3.  **Fontes:** `Satoshi` e `JetBrains Mono` devem ser pré-carregadas apenas nos pesos essenciais.

***

## 🧩 **4. COMPONENTES & PADRÕES**

### **4.1 Tipografia**
- **Títulos:** `font-mono` (JetBrains Mono) - Maiúsculas, Tracking apertado.
- **Corpo:** `font-sans` (Satoshi) - Leitura limpa.

### **4.2 Formulários**
Use os primitivos de `src/components/ui/form.tsx` (React Hook Form + Zod).

```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="font-mono uppercase">Email</FormLabel>
      <FormControl>
        <Input 
          className="border-4 border-black rounded-none focus-visible:ring-0" 
          {...field} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### **4.3 Animações (Framer Motion + CSS)**
Prefira CSS puro para animações contínuas (`float`, `pulse`) para poupar a thread principal JS.
Use Framer Motion apenas para transições de entrada complexas (`Enter/Exit`).

***

## 📊 **5. OBSERVABILIDADE**

O hook `useWebVitals` já está configurado para monitorar a experiência real do usuário.
- **Dev:** Logs no console com prefixo `📊 Web Vitals`.
- **Prod:** Envia eventos para o `window.gtag` (Google Analytics).

**Checklist de Code Review:**
- [ ] O componente respeita o tema "Neo-Brutalist" (bordas, sombras)?
- [ ] As cores usam variáveis CSS/Tailwind?
- [ ] Imagens têm `alt` e estão otimizadas?
- [ ] Não há `console.log` esquecido (exceto os do sistema de vitals)?