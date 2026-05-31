import { useState, useEffect } from "react";

/**
 * Hook to track which section is currently active in the viewport.
 * Useful for Table of Contents / Scroll Spy functionality.
 */
export const useScrollSpy = (ids: string[]) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        // Find the first entry that is intersecting
        const visibleEntry = entries.find(entry => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        // Adjust rootMargin to trigger when section is roughly in the top part of the screen
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    ids.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [ids]);

  return activeId;
};
