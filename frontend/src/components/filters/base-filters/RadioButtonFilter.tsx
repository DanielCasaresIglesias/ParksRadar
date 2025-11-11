// frontend/src/components/filters/base-filters/RadioButtonFilter.tsx
import React, { useState, useRef } from 'react';
import useOutsideAlerter from '../../../hooks/useOutsideAlerter';
import FilterButton from './FilterButton';
import ApplyButton from '../buttons/ApplyButton';
import ClearButton from '../buttons/ClearButton';
import '../styles/radioButtonFilter.css';

type RadioButtonFilterProps = {
  label: string;
  iconSrc: string;
  selectedIconSrc: string;
  iconAlt: string;
  options: string[];
  onChange: (selected: string | null) => void;
  initialSelected: string | null;
};

const RadioButtonFilter: React.FC<RadioButtonFilterProps> = ({
  label,
  iconSrc,
  selectedIconSrc,
  iconAlt,
  options,
  onChange,
  initialSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedSelectedOption, setAppliedSelectedOption] = useState<
    string | null
  >(initialSelected);
  const [tempSelectedOption, setTempSelectedOption] = useState<string | null>(
    initialSelected
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  const togglePopup = () => {
    if (!isOpen) {
      setTempSelectedOption(appliedSelectedOption);
    }
    setIsOpen(!isOpen);
  };

  const handleRadioChange = (opt: string) => {
    setTempSelectedOption(opt);
  };

  const applySelection = () => {
    setAppliedSelectedOption(tempSelectedOption);
    onChange(tempSelectedOption);
    setIsOpen(false);
  };

  const clearSelection = () => {
    setTempSelectedOption(null);
    setAppliedSelectedOption(null);
    onChange(null);
    setIsOpen(false);
  };

  const isActive = appliedSelectedOption !== null;

  return (
    <div className="filter radiolist-filter" ref={wrapperRef}>
      <FilterButton
        onClick={togglePopup}
        variant={isActive ? 'selected' : 'primary'}
        iconSrc={isActive ? selectedIconSrc : iconSrc}
        iconAlt={iconAlt}
        label={label}
      />
      {isOpen && (
        <div className="radiolist-filter-popup">
          <p className="title">{label}</p>
          <div className="options">
            {options.map((opt) => (
              <label key={opt} className="option">
                <input
                  type="radio"
                  name={label}
                  checked={tempSelectedOption === opt}
                  onChange={() => handleRadioChange(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
          <div className="buttons">
            <ApplyButton onClick={applySelection} />
            <ClearButton onClick={clearSelection} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RadioButtonFilter;
