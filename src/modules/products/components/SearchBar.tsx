'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  initialValue: string;
  onSearch: (val: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ initialValue, onSearch }) => {
  const [value, setValue] = useState(initialValue);
  const [trackedInitialValue, setTrackedInitialValue] = useState(initialValue);

  if (initialValue !== trackedInitialValue) {
    setTrackedInitialValue(initialValue);
    setValue(initialValue);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== initialValue) {
        onSearch(value);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [value, onSearch, initialValue]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="flex h-[46px] w-full items-center rounded-full border border-field bg-background py-1 pr-1.5 pl-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
      <Search className="h-4 w-4 shrink-0 text-tertiary" strokeWidth={1.5} />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar productos..."
        className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-tertiary"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="mr-1 flex h-8 w-8 items-center justify-center rounded-full text-tertiary transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      )}
      <button
        type="button"
        onClick={() => onSearch(value)}
        className="h-[34px] shrink-0 rounded-full bg-primary px-[18px] text-xs font-medium text-primary-foreground transition-colors hover:bg-[#2B2B30]"
      >
        Buscar
      </button>
    </div>
  );
};
