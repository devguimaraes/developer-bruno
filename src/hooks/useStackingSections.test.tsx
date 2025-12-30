import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useStackingSections } from './useStackingSections';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const observerInstances: MockIntersectionObserver[] = [];

class MockIntersectionObserver {
  callback: (entries: IntersectionObserverEntry[]) => void;

  constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
    this.callback = callback;
    observerInstances.push(this);
  }

  observe = mockObserve;
  disconnect = mockDisconnect;
  takeRecords = () => [];
  
  // Helper to trigger callback manually in tests
  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(entries as IntersectionObserverEntry[]);
  }
}

// @ts-ignore
window.IntersectionObserver = MockIntersectionObserver;

describe('useStackingSections', () => {
  const sectionIds = ['section-1', 'section-2', 'section-3'];

  beforeEach(() => {
    // Setup DOM elements
    document.body.innerHTML = `
      <div id="section-1"></div>
      <div id="section-2"></div>
      <div id="section-3"></div>
    `;
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    observerInstances.length = 0;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should initialize with provided section IDs', () => {
    const { result } = renderHook(() => useStackingSections(sectionIds));

    expect(result.current.sections).toHaveLength(3);
    expect(result.current.sections[0].id).toBe('section-1');
    expect(result.current.sections[1].id).toBe('section-2');
    expect(result.current.sections[2].id).toBe('section-3');
  });

  it('should observe DOM elements on mount', () => {
    renderHook(() => useStackingSections(sectionIds));

    // Should observe all 3 sections twice (visibility + progress)
    expect(mockObserve).toHaveBeenCalledTimes(6);
  });

  it('should disconnect observers on unmount', () => {
    const { unmount } = renderHook(() => useStackingSections(sectionIds));
    unmount();
    // 2 observers instances should call disconnect
    expect(mockDisconnect).toHaveBeenCalledTimes(2);
  });

  it('should update progress state when intersection changes', () => {
    const { result } = renderHook(() => useStackingSections(sectionIds));

    // Acessar a instância do observer de progresso (segundo observer criado)
    const progressObserverInstance = observerInstances[1];

    act(() => {
      progressObserverInstance.trigger([
        { target: { id: 'section-1' }, intersectionRatio: 0.5, isIntersecting: true }
      ]);
    });

    expect(result.current.sections[0].progress).toBe(0.5);
  });

  it('should calculate transforms correctly based on previous section progress', () => {
    const { result } = renderHook(() => useStackingSections(sectionIds));

    // Initial state: no transforms
    expect(result.current.getTransform('section-2')).toBe('translateY(0px) scale(1)');

    // Update section-1 progress to trigger section-2 transform
    const progressObserverInstance = observerInstances[1];

    act(() => {
      // Simulate section-1 being 85% scrolled (triggers > 0.7 logic)
      progressObserverInstance.trigger([
        { target: { id: 'section-1' }, intersectionRatio: 0.85, isIntersecting: true }
      ]);
    });

    // (0.85 - 0.7) / 0.3 = 0.5 (50% do efeito)
    // translateY = 0.5 * -150 = -75px
    // scale = 1 + 0.5 * 0.02 = 1.01
    const transform = result.current.getTransform('section-2');
    // Allow for float precision differences
    expect(transform).toMatch(/translateY\(-75(\.0+)?1?px\)/);
    expect(transform).toContain('scale(1.01)');
  });

  it('should calculate increasing z-index', () => {
    const { result } = renderHook(() => useStackingSections(sectionIds));

    const z1 = result.current.getZIndex('section-1');
    const z2 = result.current.getZIndex('section-2');
    const z3 = result.current.getZIndex('section-3');

    // Base Z (10) + index + progress * 5
    expect(z1).toBe(10); // 10 + 0 + 0
    expect(z2).toBe(11); // 10 + 1 + 0
    expect(z3).toBe(12); // 10 + 2 + 0
  });

  it('should handle missing DOM elements gracefully', () => {
    // Remove element 3
    const el3 = document.getElementById('section-3');
    el3?.remove();

    renderHook(() => useStackingSections(sectionIds));

    // Should observe existing elements only
    // 2 elements * 2 observers = 4 calls
    expect(mockObserve).toHaveBeenCalledTimes(4);
  });
});