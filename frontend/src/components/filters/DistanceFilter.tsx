import React, { useState, useRef } from 'react';
import FilterButton from './base-filters/FilterButton';
import useOutsideAlerter from '../../hooks/useOutsideAlerter';
import ApplyButton from './buttons/ApplyButton';
import ClearButton from './buttons/ClearButton';
import './styles/distanceFilter.css';

type DistanceFilterProps = {
  label: string;
  iconSrc: string;
  selectedIconSrc: string;
  iconAlt: string;
  initialAddress?: string;
  initialMiles?: string;
  onChange: (values: { address: string; miles: string }) => void;
};

const DistanceFilter: React.FC<DistanceFilterProps> = ({
  label,
  iconSrc,
  selectedIconSrc,
  iconAlt,
  initialAddress = '',
  initialMiles = '',
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Applied state: the values that are in effect
  const [appliedAddress, setAppliedAddress] = useState<string>(initialAddress);
  const [appliedMiles, setAppliedMiles] = useState<string>(initialMiles);

  // Temporary state: changes are stored here until Apply is clicked
  const [tempAddress, setTempAddress] = useState<string>(initialAddress);
  const [tempMiles, setTempMiles] = useState<string>(initialMiles);

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  // When opening the popup, initialize temporary state from applied values.
  const togglePopup = () => {
    if (!isOpen) {
      setTempAddress(appliedAddress);
      setTempMiles(appliedMiles);
    }
    setIsOpen(!isOpen);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempAddress(e.target.value);
  };

  const handleMilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMiles = e.target.value;
    // Accept empty value or a positive number only.
    if (newMiles === '' || Number(newMiles) > 0) {
      setTempMiles(newMiles);
    }
  };

  const applySelection = () => {
    // Commit the temporary values to the applied state.
    setAppliedAddress(tempAddress);
    setAppliedMiles(tempMiles);
    // Notify parent with the new values.
    onChange({ address: tempAddress, miles: tempMiles });
    setIsOpen(false);
  };

  const clearSelection = () => {
    // Reset temporary and applied values.
    setTempAddress('');
    setTempMiles('');
    setAppliedAddress('');
    setAppliedMiles('');
    onChange({ address: '', miles: '' });
    setIsOpen(false);
  };

  // The filter is considered active if either address or miles have been
  // applied.
  const isFilterActive = appliedAddress !== '' || appliedMiles !== '';

  return (
    <div className="filter distance-filter" ref={wrapperRef}>
      <FilterButton
        onClick={togglePopup}
        variant={isFilterActive ? 'selected' : 'primary'}
        iconSrc={isFilterActive ? selectedIconSrc : iconSrc}
        iconAlt={iconAlt}
        label={label}
      />
      {isOpen && (
        <div className="distance-filter-popup">
          <p className="title">{label}</p>
          <input
            type="text"
            placeholder="Enter address"
            value={tempAddress}
            onChange={handleAddressChange}
            className="address-input"
          />
          <input
            type="number"
            placeholder="Miles"
            value={tempMiles}
            onChange={handleMilesChange}
            className="miles-input"
          />
          <div className="buttons">
            <ApplyButton onClick={applySelection} />
            <ClearButton onClick={clearSelection} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DistanceFilter;
