import React, { useState, useRef } from 'react';
import useOutsideAlerter from '../../hooks/useOutsideAlerter';
import FilterButton from './base-filters/FilterButton';
import ApplyButton from './buttons/ApplyButton';
import ClearButton from './buttons/ClearButton';
import './styles/costFilter.css';

// CostFilter.tsx

type CostFilterProps = {
  label: string;
  iconSrc: string;
  selectedIconSrc: string;
  iconAlt: string;
  onChange: (settings: {
    min: number;
    max: number;
    people: number;
    cars: number;
    motorcycles: number;
    includeTransit: boolean;
  }) => void;
  initial?: {
    min: number;
    max: number;
    people: number;
    cars: number;
    motorcycles: number;
    includeTransit: boolean;
  };
};

const CostFilter: React.FC<CostFilterProps> = ({
  label,
  iconSrc,
  selectedIconSrc,
  iconAlt,
  onChange,
  initial = {
    min: 0,
    max: 0,
    people: 1,
    cars: 0,
    motorcycles: 0,
    includeTransit: false,
  },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [minValue, setMinValue] = useState<string>(initial.min.toFixed(2));
  const [maxValue, setMaxValue] = useState<string>(initial.max.toFixed(2));
  const [people, setPeople] = useState<string>(initial.people.toString());
  const [cars, setCars] = useState<string>(initial.cars.toString());
  const [motorcycles, setMotorcycles] = useState<string>(
    initial.motorcycles.toString()
  );
  const [includeTransit, setIncludeTransit] = useState<boolean>(
    initial.includeTransit
  );
  const [applied, setApplied] = useState(initial);
  const [error, setError] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  const handleApply = () => {
    const minNum = parseFloat(minValue);
    const maxNum = parseFloat(maxValue);
    const ppl = parseInt(people, 10);
    const carCount = parseInt(cars, 10);
    const motoCount = parseInt(motorcycles, 10);

    // Validate number inputs
    if (
      [minNum, maxNum].some(isNaN) ||
      [ppl, carCount, motoCount].some(isNaN)
    ) {
      setError('All values must be valid numbers.');
      return;
    }
    // No negatives
    if (minNum < 0 || maxNum < 0) {
      setError('Cost values cannot be negative.');
      return;
    }
    if (carCount < 0) {
      setError('Car count cannot be negative.');
      return;
    }
    if (motoCount < 0) {
      setError('Motorcycle count cannot be negative.');
      return;
    }
    // Range consistency
    if (maxNum < minNum) {
      setError('Max cost cannot be smaller than Min cost.');
      return;
    }
    // People count
    if (ppl < 1) {
      setError('At least one person required.');
      return;
    }

    setError('');
    const newSettings = {
      min: minNum,
      max: maxNum,
      people: ppl,
      cars: carCount,
      motorcycles: motoCount,
      includeTransit,
    };
    setApplied(newSettings);
    onChange(newSettings);
    setIsOpen(false);
  };

  const handleClear = () => {
    setMinValue('0.00');
    setMaxValue('0.00');
    setPeople('1');
    setCars('0');
    setMotorcycles('0');
    setIncludeTransit(false);
    setError('');
    const cleared = {
      min: 0,
      max: 0,
      people: 1,
      cars: 0,
      motorcycles: 0,
      includeTransit: false,
    };
    setApplied(cleared);
    onChange(cleared);
    setIsOpen(false);
  };

  const isActive = !(
    applied.min === 0 &&
    applied.max === 0 &&
    applied.people === 1 &&
    applied.cars === 0 &&
    applied.motorcycles === 0 &&
    applied.includeTransit === false
  );

  return (
    <div className="filter cost-filter" ref={wrapperRef}>
      <FilterButton
        onClick={() => setIsOpen((prev) => !prev)}
        variant={isActive ? 'selected' : 'primary'}
        iconSrc={isActive ? selectedIconSrc : iconSrc}
        iconAlt={iconAlt}
        label={label}
      />
      {isOpen && (
        <div className="cost-filter-popup">
          <p className="title">{label}</p>
          <div className="row-inputs">
            <input
              type="number"
              step="0.01"
              min="0"
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
              placeholder="Min $"
            />
            <span className="separator">-</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
              placeholder="Max $"
            />
          </div>
          <input
            type="number"
            min="1"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            placeholder="People"
          />
          <input
            type="number"
            min="0"
            value={cars}
            onChange={(e) => setCars(e.target.value)}
            placeholder="Cars"
          />
          <input
            type="number"
            min="0"
            value={motorcycles}
            onChange={(e) => setMotorcycles(e.target.value)}
            placeholder="Motorcycles"
          />
          <label className="transit-option">
            <input
              type="checkbox"
              checked={includeTransit}
              onChange={(e) => setIncludeTransit(e.target.checked)}
            />{' '}
            Include Ferry/Shuttle
          </label>
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

export default CostFilter;
