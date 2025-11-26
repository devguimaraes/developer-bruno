import { useEffect, useRef, useState } from 'react';

interface Section {
  id: string;
  element: HTMLElement | null;
  progress: number;
  isVisible: boolean;
}

export const useStackingSections = (sectionIds: string[]) => {
  const [sections, setSections] = useState<Section[]>(
    sectionIds.map(id => ({ id, element: null, progress: 0, isVisible: false }))
  );
  const observersRef = useRef<IntersectionObserver[]>([]);

  useEffect(() => {
    // Clean up previous observers
    observersRef.current.forEach(observer => observer.disconnect());
    observersRef.current = [];

    // Update sections with actual DOM elements
    const updatedSections = sections.map(section => ({
      ...section,
      element: document.getElementById(section.id)
    }));

    // Create IntersectionObserver for visibility tracking
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          setSections(prev => prev.map(section =>
            section.id === sectionId
              ? { ...section, isVisible: entry.isIntersecting }
              : section
          ));
        });
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );

    // Create IntersectionObserver for progress tracking
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          const progress = entry.intersectionRatio;

          setSections(prev => prev.map(section =>
            section.id === sectionId
              ? { ...section, progress }
              : section
          ));
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    // Observe all sections
    updatedSections.forEach(section => {
      if (section.element) {
        visibilityObserver.observe(section.element);
        progressObserver.observe(section.element);
      }
    });

    observersRef.current = [visibilityObserver, progressObserver];
    setSections(updatedSections);

    return () => {
      observersRef.current.forEach(observer => observer.disconnect());
    };
  }, [sectionIds]);

  // Calculate transform for each section
  const getTransform = (sectionId: string) => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return 'translateY(0px)';

    const currentSection = sections[sectionIndex];
    const prevSection = sections[sectionIndex - 1];

    // If this is the first section (Hero), no transform
    if (sectionIndex === 0) return 'translateY(0px)';

    // Calculate transform based on previous section's progress
    if (prevSection && prevSection.progress > 0.7) {
      // When previous section is 70% scrolled, start sliding this section up
      const slideAmount = (prevSection.progress - 0.7) / 0.3; // Normalize to 0-1
      const translateY = slideAmount * -150; // Max 150px slide

      return `translateY(${translateY}px) scale(${1 + slideAmount * 0.02})`;
    }

    return 'translateY(0px) scale(1)';
  };

  // Get z-index for each section based on position and scroll
  const getZIndex = (sectionId: string) => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return 1;

    const baseZ = 10;
    const currentSection = sections[sectionIndex];

    // Increase z-index based on scroll progress for dynamic stacking
    const progressBonus = currentSection.progress * 5;

    return Math.floor(baseZ + sectionIndex + progressBonus);
  };

  return {
    sections,
    getTransform,
    getZIndex,
    progress: sections.map(s => s.progress)
  };
};