import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRouteSEO } from "./useRouteSEO";
import * as reactRouter from "react-router-dom";

// Mock do react-router-dom
vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(),
}));

const mockLocation = (pathname: string) => ({
  pathname,
  search: "",
  hash: "",
  state: null,
  key: "default",
});

describe("useRouteSEO", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar metadados da home para a rota '/'", () => {
    vi.mocked(reactRouter.useLocation).mockReturnValue(mockLocation("/"));
    
    const { result } = renderHook(() => useRouteSEO());
    
    expect(result.current.title).toContain("Bruno");
    expect(result.current.url).toBe("/");
  });

  it("deve retornar metadados do blog para a rota '/blog'", () => {
    vi.mocked(reactRouter.useLocation).mockReturnValue(mockLocation("/blog"));
    
    const { result } = renderHook(() => useRouteSEO());
    
    expect(result.current.title).toMatch(/Blog/i);
    expect(result.current.url).toBe("/blog");
  });

  it("deve lidar com rotas desconhecidas retornando metadados default", () => {
    vi.mocked(reactRouter.useLocation).mockReturnValue(mockLocation("/contato-inexistente"));
    
    const { result } = renderHook(() => useRouteSEO());
    
    // Deve retornar o default (geralmente metadados da home ou genéricos)
    expect(result.current).toBeDefined();
    expect(result.current.url).toBe("/contato-inexistente");
  });
});
