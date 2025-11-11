// frontend/src/pages/homePage/FindAPark.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../../../components/FilterBar';
import SearchButton from '../../../components/SearchButton';
import '../styles/findAPark.css';

// interface FindAParkProps {}

const FindAPark: React.FC = () => {
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    // The shape of `filters` matches FiltersType, so we can copy logic from
    // SearchPage:
    Object.entries(filters).forEach(([key, val]) => {
      if (val === null || val === undefined) return;
      if (Array.isArray(val) && val.length) {
        queryParams.append(key, (val as string[]).join(','));
      } else if (typeof val === 'object' && val !== null) {
        // date‐range or fee‐range
        if ('start' in (val as any) && 'end' in (val as any)) {
          // Date range
          queryParams.append('openStartDate', (val as any).start);
          queryParams.append('openEndDate', (val as any).end);
        } else if ('min' in (val as any) && 'max' in (val as any)) {
          // parkingFee or entryFee
          const prefix = key === 'parking' ? 'parkingFee' : 'entryFee';
          queryParams.append(prefix + 'Min', (val as any).min.toString());
          queryParams.append(prefix + 'Max', (val as any).max.toString());
        }
      } else {
        queryParams.append(key, val.toString());
      }
    });
    navigate(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="find-a-park">
      <h1>Find a Park</h1>
      <div className="filter-bar-wrapper">
        <FilterBar onFiltersChange={handleFiltersChange} initialFilters={{}} />
      </div>
      <SearchButton onClick={handleSearch} />
    </div>
  );
};

export default FindAPark;
