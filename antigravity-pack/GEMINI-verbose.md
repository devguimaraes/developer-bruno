# GEMINI - Verbose Guidelines

This file contains strict definitions, code patterns, and standards.

## /typescript - Rigid TypeScript Guidelines

- Use `type` over `interface` for consistency and union capabilities.
- Enable `strict: true` in `tsconfig.json`.
- Avoid `any`; use `unknown` if necessary and narrow types.
- Use explicit return types for all functions.
- Prefer Zod for runtime validation of external data.

## /react - React & Component Best Practices

- **Structure**: One component per file. Name file matches component name.
- **Hooks**: Logic should be extracted into custom hooks (`useFeatureName`).
- **State**: Use `useQuery` for server state, `useState`/`useReducer` for local UI state. Avoid global state stores (Redux/Zustand) unless absolutely necessary.
- **Styling**: Tailwind CSS with utility classes. Use `clsx` or `tailwind-merge` for class manipulation.
- **Performance**: Use `React.memo`, `useMemo`, and `useCallback` judiciously but proactively for expensive operations.

## /reviewing-code - Code Review Checklist

- **Functionality**: Does the code do what it's supposed to do?
- **Complexity**: Is the code as simple as possible?
- **Tests**: Are there automated tests? Do they cover edge cases?
- **Naming**: Are variables/functions named clearly and descriptively?
- **Comments**: Do comments explain *why*, not *what*?
- **Security**: Are there any injection risks or exposed secrets?

## /writing - Documentation Style Guide

- **Clarity**: Be concise and direct.
- **Format**: Use Markdown. Headers for hierarchy.
- **Code**: Use fenced code blocks with language identifiers.
- **Tone**: Professional, helpful, and technical.
