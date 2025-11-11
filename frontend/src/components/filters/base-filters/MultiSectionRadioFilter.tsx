// frontend/src/components/filters/base-filters/MultiSectionRadioFilter.tsx
import React, { useState, useRef } from 'react';
import useOutsideAlerter from '../../../hooks/useOutsideAlerter';
import FilterButton from './FilterButton';
import ApplyButton from '../buttons/ApplyButton';
import ClearButton from '../buttons/ClearButton';
import '../styles/multiSectionRadioButtonFilter.css';

type MultiSectionRadioButtonFilterProps = {
  label: string;
  iconSrc: string;
  selectedIconSrc: string;
  iconAlt: string;
  options: [string, string[]][]; // [sectionTitle, options[]]
  onChange: (selected: Record<string, string | null>) => void;
  initialSelected: Record<string, string | null>;
};

const sectionKey = (label: string) => label.toLowerCase().replace(/\s+/g, '_');

const MultiSectionRadioButtonFilter: React.FC<
  MultiSectionRadioButtonFilterProps
> = ({
  label,
  iconSrc,
  selectedIconSrc,
  iconAlt,
  options,
  onChange,
  initialSelected,
}) => {
  // One piece of state per section
  const [tempSelected, setTempSelected] = useState<
    Record<string, string | null>
  >(() => {
    // ensure every section has an entry
    const init: Record<string, string | null> = {};
    options.forEach(([sectionTitle]) => {
      const key = sectionKey(sectionTitle);
      init[key] = initialSelected[key] ?? null;
    });
    return init;
  });
  const [appliedSelected, setAppliedSelected] =
    useState<Record<string, string | null>>(tempSelected);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  const togglePopup = () => {
    if (!isOpen) {
      // reset temp to last applied
      setTempSelected(appliedSelected);
    }
    setIsOpen((open) => !open);
  };

  const handleSectionChange = (sectionKeyStr: string, option: string) => {
    setTempSelected((prev) => ({
      ...prev,
      [sectionKeyStr]: option,
    }));
  };

  const applySelection = () => {
    setAppliedSelected(tempSelected);
    onChange(tempSelected);
    setIsOpen(false);
  };

  const clearSelection = () => {
    const cleared: Record<string, string | null> = {};
    options.forEach(([sectionTitle]) => {
      cleared[sectionKey(sectionTitle)] = null;
    });
    setTempSelected(cleared);
    setAppliedSelected(cleared);
    onChange(cleared);
    setIsOpen(false);
  };

  // active if any section has a non-null selection
  const isActive = Object.values(appliedSelected).some((v) => v !== null);

  return (
    <div className="filter multi-section-radiolist-filter" ref={wrapperRef}>
      <FilterButton
        onClick={togglePopup}
        variant={isActive ? 'selected' : 'primary'}
        iconSrc={isActive ? selectedIconSrc : iconSrc}
        iconAlt={iconAlt}
        label={label}
      />
      {isOpen && (
        <div className="multi-section-radiolist-filter-popup">
          <p className="title">{label}</p>
          <div className="options">
            {options.map(([sectionTitle, sectionOptions]) => {
              const key = sectionKey(sectionTitle);
              return (
                <div className="section" key={key}>
                  <p className="section-title">{sectionTitle}</p>
                  {sectionOptions.map((opt) => (
                    <label key={opt} className="option">
                      <input
                        type="radio"
                        name={key} // group per section
                        checked={tempSelected[key] === opt}
                        onChange={() => handleSectionChange(key, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              );
            })}
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

export default MultiSectionRadioButtonFilter;
