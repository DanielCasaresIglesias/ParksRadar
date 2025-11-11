// frontend/src/components/filters/CampsFilter.tsx
import React from 'react';
import ChecklistFilter from './base-filters/ChecklistFilter';

type CampsFilterProps = {
  onChange: (selected: string[]) => void;
  initialSelected: string[];
};

const CampsFilter: React.FC<CampsFilterProps> = ({
  onChange,
  initialSelected,
}) => {
  return (
    <ChecklistFilter
      label="Campsites"
      iconSrc="images/filter-icons/base-icons/camps-icon.png"
      selectedIconSrc="images/filter-icons/selected-icons/camps-icon.png"
      iconAlt="Camps Icon"
      options={['Tent', 'Backcountry', 'RV', 'Cabin']}
      onChange={onChange}
      initialSelected={initialSelected}
    />
  );
};

export default CampsFilter;
