import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useToast } from "./use-toast";

describe("useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Como o estado é global no módulo, precisamos garantir que ele 
    // não polua outros testes se possível. 
    // O ideal seria que o use-toast não usasse estado global, 
    // mas vamos testar o comportamento atual.
  });

  it("deve adicionar um toast e retornar o ID", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: "Teste",
        description: "Mensagem de teste",
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      title: "Teste",
      description: "Mensagem de teste",
      open: true,
    });
    expect(typeof result.current.toasts[0].id).toBe("string");
  });

  it("deve respeitar o TOAST_LIMIT (1)", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "Toast 1" });
    });

    act(() => {
      result.current.toast({ title: "Toast 2" });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe("Toast 2");
  });

  it("deve fechar um toast com dismiss", () => {
    const { result } = renderHook(() => useToast());
    let toastId = "";

    act(() => {
      const { id } = result.current.toast({ title: "Fechar" });
      toastId = id;
    });

    expect(result.current.toasts[0].open).toBe(true);

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it("deve atualizar um toast existente", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      const { id, update } = result.current.toast({ title: "Original" });
      update({ id, title: "Atualizado" });
    });

    expect(result.current.toasts[0].title).toBe("Atualizado");
  });
});
