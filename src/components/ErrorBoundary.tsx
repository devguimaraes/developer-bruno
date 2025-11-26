import React, { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { AlertTriangle, RefreshCw, WifiOff, Home } from 'lucide-react';
import type { ErrorBoundaryState } from '@/types';
import { siteConfig } from '@/config/site';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

/**
 * Brazilian market error boundary with UX amigável
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId?: NodeJS.Timeout;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error sem exporar informações sensíveis
    this.setState({ error, errorInfo });

    // Log para console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Erro capturado pelo ErrorBoundary:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }

    // Enviar para serviço de analytics (será implementado com Plausible)
    if (window.gtag) {
      window.gtag('event', 'error_boundary_catch', {
        event_category: 'Error',
        error_message: error.message,
        non_interaction: true
      });
    }

    // Chamar callback de erro personalizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = setTimeout(() => {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-brutal-yellow border-y-4 border-black flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border-4 border-black shadow-brutal-lg p-8">
            {/* Header */}
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle size={48} className="text-brutal-orange mr-4" />
              <h1 className="text-2xl md:text-3xl font-black uppercase text-black">
                Oops! Algo deu errado
              </h1>
            </div>

            {/* Error Message */}
            <div className="text-center mb-8">
              <p className="text-lg font-bold text-gray-800 mb-2">
                Ocorreu um erro inesperado
              </p>
              <p className="text-gray-600 font-mono text-sm">
                {this.state.error?.message || 'Erro desconhecido'}
              </p>
            </div>

            {/* Error Actions */}
            <div className="space-y-4">
              <button
                onClick={this.resetErrorBoundary}
                className="w-full bg-black text-white border-4 border-black px-6 py-4 font-black uppercase hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                Tentar Novamente
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-white text-black border-4 border-black px-6 py-4 font-black uppercase hover:bg-brutal-yellow transition-colors flex items-center justify-center gap-2"
              >
                <WifiOff size={20} />
                Recarregar Página
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-brutal-orange text-black border-4 border-black px-6 py-4 font-black uppercase hover:bg-orange-400 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={20} />
                Voltar ao Início
              </button>
            </div>

            {/* Brazilian Support Info */}
            <div className="mt-8 p-4 bg-gray-100 border-2 border-black">
              <p className="text-center text-sm font-mono text-gray-700 mb-2">
                Se o problema persistir, entre em contato:
              </p>
              <div className="text-center">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-black font-black hover:text-brutal-orange transition-colors underline"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-red-50 border-2 border-red-300">
                <summary className="font-mono text-sm text-red-800 cursor-pointer">
                  Detalhes do Erro (Desenvolvimento)
                </summary>
                <div className="mt-2 text-xs text-red-600 font-mono whitespace-pre-wrap">
                  {this.state.error.stack}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Fallback component para erros específicos
 */
export const ErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({ error, resetError }) => {
  return (
    <div className="min-h-[400px] bg-brutal-yellow border-y-4 border-black flex items-center justify-center p-8">
      <div className="bg-white border-4 border-black shadow-brutal-lg p-6 text-center max-w-md">
        <AlertTriangle size={48} className="text-brutal-orange mx-auto mb-4" />
        <h2 className="text-xl font-black uppercase text-black mb-2">
          Falha de Componente
        </h2>
        <p className="text-gray-600 mb-4">
          {error?.message || 'O componente encontrou um erro'}
        </p>
        <button
          onClick={resetError}
          className="bg-black text-white border-4 border-black px-4 py-2 font-black uppercase hover:bg-gray-900 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};

/**
 * Loading fallback component
 */
export const LoadingFallback: React.FC = () => (
  <div className="min-h-[400px] bg-brutal-yellow border-y-4 border-black flex items-center justify-center p-8">
    <div className="bg-white border-4 border-black shadow-brutal-lg p-8 text-center">
      <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-lg font-black text-black mb-2">
        CARREGANDO
      </p>
      <p className="text-sm font-mono text-gray-600">
        Por favor, aguarde...
      </p>
    </div>
  </div>
);

/**
 * Wrapped component with error boundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

/**
 * Suspense with error boundary
 */
export const SafeSuspense: React.FC<{
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  children: ReactNode;
}> = ({ fallback, errorFallback, children }) => (
  <ErrorBoundary fallback={errorFallback}>
    <Suspense fallback={fallback || <LoadingFallback />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export default ErrorBoundary;