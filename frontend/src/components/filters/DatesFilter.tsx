// frontend/src/components/filters/DatesFilter.tsx
import React, { useState, useRef } from 'react';
import useOutsideAlerter from '../../hooks/useOutsideAlerter';
import FilterButton from './base-filters/FilterButton';
import ApplyButton from './buttons/ApplyButton';
import ClearButton from './buttons/ClearButton';
import './styles/datesFilter.css';

type DatesFilterProps = {
  onChange: (range: { start: string; end: string }) => void;
  initialStartDate: string;
  initialEndDate: string;
};

const DatesFilter: React.FC<DatesFilterProps> = ({
  onChange,
  initialStartDate,
  initialEndDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(initialStartDate);
  const [tempEnd, setTempEnd] = useState(initialEndDate);
  const [appliedStart, setAppliedStart] = useState(initialStartDate);
  const [appliedEnd, setAppliedEnd] = useState(initialEndDate);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  const togglePopup = () => {
    if (!isOpen) {
      // initialize from applied
      setTempStart(appliedStart);
      setTempEnd(appliedEnd);
    }
    setIsOpen(!isOpen);
  };

  const handleDateChange = (type: 'start' | 'end', val: string) => {
    if (type === 'start') {
      setTempStart(val);
      if (tempEnd && val > tempEnd) {
        setTempEnd(val);
      }
    } else {
      if (tempStart && val < tempStart) {
        return; // disallow end < start
      }
      setTempEnd(val);
    }
  };

  const applySelection = () => {
    setAppliedStart(tempStart);
    setAppliedEnd(tempEnd);
    onChange({ start: tempStart, end: tempEnd });
    setIsOpen(false);
  };

  const clearSelection = () => {
    setTempStart('');
    setTempEnd('');
    setAppliedStart('');
    setAppliedEnd('');
    onChange({ start: '', end: '' });
    setIsOpen(false);
  };

  const isActive = appliedStart !== '' && appliedEnd !== '';

  return (
    <div className="filter dates-filter" ref={wrapperRef}>
      <FilterButton
        onClick={togglePopup}
        variant={isActive ? 'selected' : 'primary'}
        iconSrc={
          isActive
            ? 'images/filter-icons/selected-icons/date-icon.png'
            : 'images/filter-icons/base-icons/date-icon.png'
        }
        iconAlt="Date Icon"
        label="Dates"
      />
      {isOpen && (
        <div className="dates-filter-popup">
          <p className="title">Dates</p>
          <div className="start-date">
            <label>Start Date:</label>
            <input
              type="date"
              value={tempStart}
              onChange={(e) => handleDateChange('start', e.target.value)}
            />
          </div>
          <div className="end-date">
            <label>End Date:</label>
            <input
              type="date"
              value={tempEnd}
              onChange={(e) => handleDateChange('end', e.target.value)}
              min={tempStart || undefined}
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

export default DatesFilter;
