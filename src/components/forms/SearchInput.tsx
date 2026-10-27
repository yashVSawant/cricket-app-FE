'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input, InputProps } from '@/components/ui/Input';

export interface SearchInputProps
  extends Omit<InputProps, 'onChange' | 'value'> {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  debounceMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value: externalValue,
  onChange,
  onSearch,
  debounceMs = 300,
  placeholder = 'Search...',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState(externalValue || '');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (externalValue !== undefined) {
      setSearchTerm(externalValue);
    }
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setSearchTerm(newVal);
    onChange?.(newVal);

    if (onSearch) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSearch(newVal);
      }, debounceMs);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onChange?.('');
    onSearch?.('');
  };

  return (
    <Input
      value={searchTerm}
      onChange={handleChange}
      placeholder={placeholder}
      leftIcon={<Search className="w-4 h-4 text-gray-400" />}
      rightIcon={
        searchTerm ? (
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : undefined
      }
      {...props}
    />
  );
};
