import { useState } from 'react';

export const useToggleFilter = <T>(initialState: T[]) => {
  const [selectedFilters, setSelectedFilters] = useState<T[]>(initialState);

  const toggleFilter = (filterName: T) => {
    setSelectedFilters(prev =>
      prev.includes(filterName)
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  const resetFilters = () => setSelectedFilters([]);

  return { selectedFilters, toggleFilter, resetFilters };
};