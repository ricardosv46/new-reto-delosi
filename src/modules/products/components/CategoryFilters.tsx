'use client';

import React from 'react';

interface CategoryFiltersProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  activeCount?: number;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  activeCount,
}) => {
  const items = [
    { label: 'Todos', value: '' },
    ...categories.map((category) => ({
      label: category,
      value: category,
    })),
  ];

  return (
    <nav className="flex flex-col gap-1" aria-label="Categorías">
      {items.map((item) => {
        const isActive = activeCategory === item.value;

        return (
          <button
            key={item.value || 'all'}
            type="button"
            onClick={() => onSelectCategory(item.value)}
            className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium capitalize transition-colors ${
              isActive
                ? 'bg-canvas text-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <span className="truncate">{item.label}</span>
            {isActive && activeCount !== undefined && (
              <span className="rounded-full bg-badge px-1.5 py-0.5 text-[10px] font-medium text-white">
                {activeCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
