import React, { useState, useRef } from 'react';
import useOutsideAlerter from '../../../hooks/useOutsideAlerter';
import FilterButton from './FilterButton';
import ApplyButton from '../buttons/ApplyButton';
import ClearButton from '../buttons/ClearButton';
import '../styles/numberRangeFilter.css';

type NumberRangeFilterProps = {
  label: string;
  iconSrc: string;
  selectedIconSrc: string;
  iconAlt: string;
  onChange: (range: { min: number; max: number }) => void;
  initialMin?: number;
  initialMax?: number;
};

const NumberRangeFilter: React.FC<NumberRangeFilterProps> = ({
  label,
  iconSrc,
  selectedIconSrc,
  iconAlt,
  onChange,
  initialMin = 0.0,
  initialMax = 0.0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [minValue, setMinValue] = useState<string>(initialMin.toFixed(2));
  const [maxValue, setMaxValue] = useState<string>(initialMax.toFixed(2));
  const [appliedRange, setAppliedRange] = useState<{
    min: number;
    max: number;
  }>({ min: initialMin, max: initialMax });
  const [error, setError] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  const handleApply = () => {
    const minNum = parseFloat(minValue);
    const maxNum = parseFloat(maxValue);
    if (isNaN(minNum) || isNaN(maxNum)) {
      setError('Both values must be valid numbers.');
      return;
    }
    if (maxNum < minNum) {
      setError('Max value cannot be smaller than Min value.');
      return;
    }
    setError('');
    setAppliedRange({ min: minNum, max: maxNum });
    onChange({ min: minNum, max: maxNum });
    setIsOpen(false);
  };

  const handleClear = () => {
    setMinValue('0.00');
    setMaxValue('0.00');
    setAppliedRange({ min: 0.0, max: 0.0 });
    setError('');
    onChange({ min: 0.0, max: 0.0 });
    setIsOpen(false);
  };

  const isActive = appliedRange.min !== 0.0 || appliedRange.max !== 0.0;

  return (
    <div className="filter number-range-filter" ref={wrapperRef}>
      <FilterButton
        onClick={() => setIsOpen((prev) => !prev)}
        variant={isActive ? 'selected' : 'primary'}
        iconSrc={isActive ? selectedIconSrc : iconSrc}
        iconAlt={iconAlt}
        label={label}
      />
      {isOpen && (
        <div className="number-range-popup">
          <p className="title">{label}</p>
          <div className="inputs">
            <input
              type="number"
              step="0.01"
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
              placeholder="Min"
            />
            <span className="separator">-</span>
            <input
              type="number"
              step="0.01"
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
              placeholder="Max"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="buttons">
            <ApplyButton onClick={handleApply} />
            <ClearButton onClick={handleClear} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberRangeFilter;
