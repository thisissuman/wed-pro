"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type SectionId = "features" | "how-it-works" | "testimonials" | null;

interface ScrollTrackerContextValue {
  activeSection: SectionId;
}

const ScrollTrackerContext = createContext<ScrollTrackerContextValue>({
  activeSection: null,
});

export function useActiveSection() {
  return useContext(ScrollTrackerContext).activeSection;
}

interface ScrollTrackerProviderProps {
  children: ReactNode;
}

export function ScrollTrackerProvider({ children }: ScrollTrackerProviderProps) {
  const [activeSection, setActiveSection] = useState<SectionId>(null);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      // Find the most visible section
      let bestEntry: IntersectionObserverEntry | null = null;
      let bestRatio = 0;

      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
          bestRatio = entry.intersectionRatio;
          bestEntry = entry;
        }
      }

      if (bestEntry) {
        setActiveSection(bestEntry.target.id as SectionId);
      }
    },
    []
  );

  useEffect(() => {
    if (!isHomepage) {
      setActiveSection(null);
      return;
    }

    const sectionIds = ["features", "how-it-works", "testimonials"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.1, 0.25, 0.5],
    });

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [isHomepage, handleIntersection]);

  return (
    <ScrollTrackerContext.Provider value={{ activeSection }}>
      {children}
    </ScrollTrackerContext.Provider>
  );
}
