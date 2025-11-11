// frontend/src/components/filters/ParkingFilter.tsx
import React, { useState, useRef } from 'react';
import useOutsideAlerter from '../../hooks/useOutsideAlerter';
import FilterButton from './base-filters/FilterButton';
import ApplyButton from './buttons/ApplyButton';
import ClearButton from './buttons/ClearButton';
// import '../styles/parkingFilter.css';

type ParkingFilterProps = {
  onChange: (range: { min: number; max: number }) => void;
  initialMin: number;
  initialMax: number;
};

/**
 * Renders a single “Parking” button, whose popup has:
 *  - A range slider (min…max)
 *  - Two numeric inputs (low/end) that stay in sync with the slider
 *  - “Apply” and “Clear”
 */
const ParkingFilter: React.FC<ParkingFilterProps> = ({
  onChange,
  initialMin,
  initialMax,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  const [isOpen, setIsOpen] = useState(false);
  const [tempMin, setTempMin] = useState(initialMin);
  const [tempMax, setTempMax] = useState(initialMax);
  const [appliedMin, setAppliedMin] = useState(initialMin);
  const [appliedMax, setAppliedMax] = useState(initialMax);

  // For demonstration, assume our parking fee ranges from $0 to $50
  const ABSOLUTE_MIN = 0;
  const ABSOLUTE_MAX = 50;

  const togglePopup = () => {
    if (!isOpen) {
      setTempMin(appliedMin);
      setTempMax(appliedMax);
    }
    setIsOpen(!isOpen);
  };

  // Keep inputs and slider in sync:
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [low, high] = e.target.value.split(',').map(Number);
    if (!isNaN(low) && !isNaN(high)) {
      setTempMin(low);
      setTempMax(high);
    }
  };

  const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val >= ABSOLUTE_MIN && val <= tempMax) {
      setTempMin(val);
    }
  };
  const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val <= ABSOLUTE_MAX && val >= tempMin) {
      setTempMax(val);
    }
  };

  const applySelection = () => {
    setAppliedMin(tempMin);
    setAppliedMax(tempMax);
    onChange({ min: tempMin, max: tempMax });
    setIsOpen(false);
  };

  const clearSelection = () => {
    setTempMin(ABSOLUTE_MIN);
    setTempMax(ABSOLUTE_MAX);
    setAppliedMin(ABSOLUTE_MIN);
    setAppliedMax(ABSOLUTE_MAX);
    onChange({ min: ABSOLUTE_MIN, max: ABSOLUTE_MAX });
    setIsOpen(false);
  };

  const isActive = appliedMin !== ABSOLUTE_MIN || appliedMax !== ABSOLUTE_MAX;

  return (
    <div className="filter parking-filter" ref={wrapperRef}>
      <FilterButton
        onClick={togglePopup}
        variant={isActive ? 'selected' : 'primary'}
        iconSrc={
          isActive
            ? 'images/filter-icons/selected-icons/parking-icon.png'
            : 'images/filter-icons/base-icons/parking-icon.png'
        }
        iconAlt="Parking Icon"
        label="Parking"
      />
      {isOpen && (
        <div className="parking-filter-popup">
          <p className="title">Parking Fee Range ($)</p>
          <div className="slider-row">
            <input
              type="range"
              min={ABSOLUTE_MIN}
              max={ABSOLUTE_MAX}
              value={`${tempMin},${tempMax}`}
              onChange={handleSliderChange}
              className="dual-slider"
              step={1}
            />
          </div>
          <div className="inputs-row">
            <input
              type="number"
              value={tempMin}
              onChange={handleMinInput}
              min={ABSOLUTE_MIN}
              max={tempMax}
            />
            <span>to</span>
            <input
              type="number"
              value={tempMax}
              onChange={handleMaxInput}
              min={tempMin}
              max={ABSOLUTE_MAX}
            />
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

export default ParkingFilter;
