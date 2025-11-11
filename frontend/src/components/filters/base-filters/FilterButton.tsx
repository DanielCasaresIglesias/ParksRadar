// frontend/src/components/filters/base-filters/FilterButton.tsx
import React from 'react';
import '../styles/filterButton.css';

type FilterButtonProps = {
  iconSrc?: string;
  iconAlt?: string;
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'selected';
};

const FilterButton: React.FC<FilterButtonProps> = ({
  iconSrc,
  iconAlt = 'icon',
  label,
  onClick,
  variant = 'primary',
}) => {
  return (
    <button
      type="button"
      className={`filter-button ${variant}`}
      onClick={onClick}
    >
      {iconSrc && <img src={iconSrc} alt={iconAlt} className="button-icon" />}
      <span className="button-text">{label}</span>
    </button>
  );
};

export default FilterButton;
