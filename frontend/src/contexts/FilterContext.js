import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate,   setEndDate]   = useState('2022-12-31');

  return (
    <FilterContext.Provider value={{ startDate, setStartDate, endDate, setEndDate }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used inside FilterProvider');
  return ctx;
}