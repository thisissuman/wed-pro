"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import type { TemplateCategory } from "@/types";

const categories: { label: string; value: TemplateCategory }[] = [
  { label: "All Stories", value: "all" },
  { label: "Royal", value: "royal" },
  { label: "Modern", value: "modern" },
  { label: "Floral", value: "floral" },
  { label: "Minimal", value: "minimal" },
];

interface CategoryFiltersProps {
  onCategoryChange?: (category: TemplateCategory) => void;
}

export function CategoryFilters({ onCategoryChange }: CategoryFiltersProps) {
  const [active, setActive] = useState<TemplateCategory>("all");

  const handleSelect = (category: TemplateCategory) => {
    setActive(category);
    onCategoryChange?.(category);
  };

  return (
    <section className="flex overflow-x-auto no-scrollbar gap-[var(--spacing-gutter)] pb-4 -mx-[var(--spacing-container-margin)] px-[var(--spacing-container-margin)] md:mx-0 md:px-0 md:flex-wrap md:justify-center">
      {categories.map((cat) => (
        <Chip
          key={cat.value}
          label={cat.label}
          isActive={active === cat.value}
          onClick={() => handleSelect(cat.value)}
        />
      ))}
    </section>
  );
}
