// frontend/src/components/filters/WeatherFilter.tsx
import React from 'react';
import ChecklistFilter from './base-filters/ChecklistFilter';

type WeatherFilterProps = {
  onChange: (selected: string[]) => void;
  initialSelected: string[];
};

const WeatherFilter: React.FC<WeatherFilterProps> = ({
  onChange,
  initialSelected,
}) => {
  return (
    <ChecklistFilter
      label="Weather"
      iconSrc="images/filter-icons/base-icons/weather-icon.png"
      selectedIconSrc="images/filter-icons/selected-icons/weather-icon.png"
      iconAlt="Weather Icon"
      options={[
        'Sunny',
        'Rain',
        'Snow',
        'Storm',
        'Cloudy',
        'Fog',
        'Windy',
        'Other',
      ]}
      onChange={onChange}
      initialSelected={initialSelected}
    />
  );
};

export default WeatherFilter;
