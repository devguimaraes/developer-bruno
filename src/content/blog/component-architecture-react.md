---
title: "Component Architecture React: Princípios Essenciais"
date: "22 NOV 2023"
readTime: "5 min"
tags: ["React", "Architecture", "Design Patterns", "Frontend"]
excerpt: "Como construir aplicações React escaláveis com component architecture moderna e princípios SOLID."
---

# Component Architecture React: Princípios Essenciais 🏗️

Construir aplicações React que escalam bem vai muito além de entender hooks e state. É sobre arquitetura inteligente que facilita manutenção, testes e evolução do código.

## 🎯 Princípios Fundamentais

### 1. **Single Responsibility Principle**
Cada componente deve ter uma única razão para existir:

```typescript
// ❌ Anti-pattern: Componente fazendo múltiplas coisas
function UserProfileAndPostsAndComments() {
  // lógica de perfil
  // lógica de posts
  // lógica de comentários
  // 500 linhas de código...
}

// ✅ Pattern: Componentes focados
function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>;
}

function UserPosts({ posts }: { posts: Post[] }) {
  return posts.map(post => <PostCard key={post.id} post={post} />);
}

function UserComments({ comments }: { comments: Comment[] }) {
  return comments.map(comment => <Comment key={comment.id} comment={comment} />);
}
```

### 2. **Composition over Inheritance**
React é sobre composição, não herança:

```typescript
// ✅ Component composition
interface CardProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

function Card({ children, variant = 'primary', size = 'md' }: CardProps) {
  const baseClasses = 'border-2 rounded-lg p-4';
  const variantClasses = {
    primary: 'bg-blue-500 text-white border-blue-600',
    secondary: 'bg-gray-100 text-gray-900 border-gray-300'
  };
  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </div>
  );
}

// Usage
<Card variant="primary" size="lg">
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
  </CardHeader>
  <CardContent>
    {/* conteúdo */}
  </CardContent>
</Card>
```

### 3. **Dependency Inversion**
Dependa de abstrações, não de implementações:

```typescript
// ❌ Acoplamento direto
function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(setUser);
  }, []);

  return <div>{user?.name}</div>;
}

// ✅ Inversão de dependência
interface UserService {
  getProfile(): Promise<User>;
}

interface UserProfileProps {
  userService: UserService;
}

function UserProfile({ userService }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userService.getProfile().then(setUser);
  }, [userService]);

  return <div>{user?.name}</div>;
}

// Mock para testes
const mockUserService: UserService = {
  getProfile: () => Promise.resolve({ name: 'Test User' })
};
```

## 🏗️ Architecture Patterns

### 1. **Container/Presentation Pattern**

Separar lógica de apresentação:

```typescript
// Container Component (lógica)
function PostListContainer() {
  const { posts, loading, error } = usePosts();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <PostList posts={posts} />;
}

// Presentation Component (visual)
interface PostListProps {
  posts: Post[];
}

function PostList({ posts }: PostListProps) {
  return (
    <div className="grid gap-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### 2. **Custom Hooks Pattern**
Extrair lógica reutilizável:

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// Usage
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Tema: {theme}
    </button>
  );
}
```

### 3. **Compound Components Pattern**
Componentes que trabalham juntos:

```typescript
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function Tabs({ children, defaultTab }: { children: React.ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)!;

  return (
    <button
      className={`tab ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeTab } = useContext(TabsContext)!;

  if (activeTab !== id) return null;

  return <div className="tab-panel">{children}</div>;
}

// Usage
<Tabs defaultTab="profile">
  <TabList>
    <Tab id="profile">Perfil</Tab>
    <Tab id="posts">Posts</Tab>
    <Tab id="settings">Configurações</Tab>
  </TabList>
  <TabPanel id="profile">
    <ProfileContent />
  </TabPanel>
  <TabPanel id="posts">
    <PostsContent />
  </TabPanel>
</Tabs>
```

## 📱 State Management Patterns

### 1. **Lifting State Up**
Estado compartilhado deve subir na árvore:

```typescript
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <div className={`app ${theme}`}>
      <Header theme={theme} setTheme={setTheme} />
      <Main theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}
```

### 2. **Context API para Estado Global**
Para estados compartilhados entre componentes distantes:

```typescript
interface AppState {
  user: User | null;
  theme: string;
  notifications: Notification[];
}

interface AppContextType {
  state: AppState;
  dispatch: (action: AppAction) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    default:
      return state;
  }
}

function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
```

## 🧪 Testability

### 1. **Componentes Testáveis**
Componentes com poucas dependências externas:

```typescript
// ✅ Fácil de testar
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}

// Test
test('Button calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByText('Click me'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 2. **Integration Tests**
Testar fluxos completos:

```typescript
test('User can view and like posts', async () => {
  const mockPosts = [
    { id: 1, title: 'Post 1', likes: 5 },
    { id: 2, title: 'Post 2', likes: 3 }
  ];

  render(<PostListContainer />, {
    wrapper: ({ children }) => (
      <PostProvider posts={mockPosts}>
        {children}
      </PostProvider>
    )
  });

  await waitFor(() => {
    expect(screen.getByText('Post 1')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('Like'));

  expect(screen.getByText('6')).toBeInTheDocument();
});
```

## 🎯 Key Takeaways

1. **Single Responsibility**: Cada componente faz uma coisa bem
2. **Composition**: Componha componentes em vez de herdar
3. **Abstraction**: Dependha de interfaces, não implementações
4. **Testability**: Componentes devem ser fáceis de testar isoladamente
5. **Consistency**: Use patterns consistentes em toda aplicação

## 🚀 Próximos Passos

- Implementar Design System baseado nestes princípios
- Adicionar Storybook para documentação de componentes
- Configurar testes automatizados no CI/CD
- Implementar lazy loading para performance

Component architecture não é sobre seguir regras cegamente, mas sobre criar código que outros desenvolvedores (e você mesmo no futuro) possam entender e modificar facilmente.