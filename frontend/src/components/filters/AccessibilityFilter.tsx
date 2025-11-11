// frontend/src/components/filters/AccessibilityFilter.tsx
import React from 'react';
import ChecklistFilter from './base-filters/ChecklistFilter';

type AccessibilityFilterProps = {
  onChange: (selected: string[]) => void;
  initialSelected: string[];
};

const AccessibilityFilter: React.FC<AccessibilityFilterProps> = ({
  onChange,
  initialSelected,
}) => {
  return (
    <ChecklistFilter
      label="Accessibility"
      iconSrc="images/filter-icons/base-icons/accessibility-icon.png"
      selectedIconSrc="images/filter-icons/selected-icons/accessibility-icon.png"
      iconAlt="Accessibility Icon"
      options={[
        'Wheelchair Accessible',
        'ASL Audio Guide',
        'Interpretation Services',
        'Touch Models',
        'Audio Described Brochures',
        'Open-Captioned Videos',
        'Assistive Listening Devices',
        'One-Way Portable Microphones',
        'Soundscapes',
        'Braille',
        'Audio-Described Films',
        'Audio Wayside Signs',
        'Tactile Models',
        'Audio & Large Print Exibits',
        'Audio/Visual Tours',
        'Beach Wheelchairs',
      ]}
      onChange={onChange}
      initialSelected={initialSelected}
    />
  );
};

export default AccessibilityFilter;
