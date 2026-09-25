import React from 'react';
import { SortOption } from '../types';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: string) => void;
}

export const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => (
  <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
    <span className="sr-only">Ordenar</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Ordenar"
      className="h-9 rounded-full border border-border bg-background px-4 text-xs font-medium text-foreground outline-none transition-colors focus:border-foreground"
    >
      <option value="">Relevancia</option>
      <option value="price-asc">Precio: menor a mayor</option>
      <option value="price-desc">Precio: mayor a menor</option>
    </select>
  </label>
);
