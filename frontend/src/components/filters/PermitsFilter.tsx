// frontend/src/components/filters/PermitsFilter.tsx
import React from 'react';
import MultiSectionRadioFilter from './base-filters/MultiSectionRadioFilter';

type PermitsFilterProps = {
  onChange: (selected: Record<string, string | null>) => void;
  initialSelected: Record<string, string | null>;
};

const PERMIT_SECTIONS: [string, string[]][] = [
  [
    'Drone',
    ['Permit Required', 'Not Allowed', 'Seasonal', 'No Permit Required'],
  ],
  [
    'Fishing',
    ['Permit Required', 'Not Allowed', 'Seasonal', 'No Permit Required'],
  ],
  [
    'Hunting',
    ['Permit Required', 'Not Allowed', 'Seasonal', 'No Permit Required'],
  ],
  [
    'Backcountry',
    ['Permit Required', 'Not Allowed', 'Seasonal', 'No Permit Required'],
  ],
];

const PermitsFilter: React.FC<PermitsFilterProps> = ({
  onChange,
  initialSelected,
}) => {
  return (
    <MultiSectionRadioFilter
      label="Permits"
      iconSrc="images/filter-icons/base-icons/permit-icon.png"
      selectedIconSrc="images/filter-icons/selected-icons/permit-icon.png"
      iconAlt="Permit Icon"
      options={PERMIT_SECTIONS}
      initialSelected={initialSelected}
      onChange={onChange}
    />
  );
};

export default PermitsFilter;
