// frontend/src/components/filters/TrailsFilter.tsx
import React from 'react';
import ChecklistFilter from './base-filters/ChecklistFilter';

type TrailsFilterProps = {
  onChange: (selected: string[]) => void;
  initialSelected: string[];
};

const TrailsFilter: React.FC<TrailsFilterProps> = ({
  onChange,
  initialSelected,
}) => {
  return (
    <ChecklistFilter
      label="Trails"
      iconSrc="images/filter-icons/base-icons/trails-icon.png"
      selectedIconSrc="images/filter-icons/selected-icons/trails-icon.png"
      iconAlt="Trails Icon"
      options={[
        'Hiking',
        'Mountain Biking',
        'Wheelchair Accessible',
        'Horseback Riding',
      ]}
      onChange={onChange}
      initialSelected={initialSelected}
    />
  );
};

export default TrailsFilter;
