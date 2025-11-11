// frontend/src/components/filters/RegionFilter.tsx
import React from 'react';
import SearchableChecklistFilter from './base-filters/SearchableChecklistFilter';

type RegionFilterProps = {
  onChange: (selected: string[]) => void;
  stateSelected: string | string[];
  initialSelected: string[];
};

const RegionFilter: React.FC<RegionFilterProps> = ({
  onChange,
  stateSelected,
  initialSelected,
}) => {
  // Master list of regions
  // (for demonstration, includes California and a few New York regions)
  const allRegions = [
    { region: 'Central Coast', state: 'California' },
    { region: 'Central Valley', state: 'California' },
    { region: 'Deserts', state: 'California' },
    { region: 'Gold Country', state: 'California' },
    { region: 'High Sierra', state: 'California' },
    { region: 'Inland Empire', state: 'California' },
    { region: 'Los Angeles County', state: 'California' },
    { region: 'North Coast', state: 'California' },
    { region: 'Orange County', state: 'California' },
    { region: 'San Diego County', state: 'California' },
    { region: 'San Francisco Bay Area', state: 'California' },
    { region: 'Shasta Cascade', state: 'California' },
    // Additional sample regions from another state:
    { region: 'Metropolitan', state: 'New York' },
    { region: 'Capital Region', state: 'New York' },
    { region: 'Long Island', state: 'New York' },
  ];

  // Normalize stateSelected to an array (if it's a string)
  const selectedStates = stateSelected
    ? Array.isArray(stateSelected)
      ? stateSelected
      : [stateSelected]
    : [];

  // Filter the regions if one or more states are selected;
  // otherwise, use the full list.
  const filteredRegions =
    selectedStates.length > 0
      ? allRegions.filter((item) =>
          selectedStates.some(
            (s) => s.toLowerCase() === item.state.toLowerCase()
          )
        )
      : allRegions;

  // Extract only the region names for the checklist options.
  const options = filteredRegions.map((item) => item.region);

  return (
    <SearchableChecklistFilter
      label="Region"
      iconSrc="images/filter-icons/base-icons/region-icon.png"
      selectedIconSrc="images/filter-icons/selected-icons/region-icon.png"
      iconAlt="Region Icon"
      options={options}
      onChange={onChange}
      initialSelected={initialSelected}
    />
  );
};

export default RegionFilter;
