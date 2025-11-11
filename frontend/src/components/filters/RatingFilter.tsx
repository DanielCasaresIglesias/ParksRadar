// frontend/src/components/filters/RatingFilter.tsx
import React, { useState, useRef } from 'react';
import useOutsideAlerter from '../../hooks/useOutsideAlerter';
import FilterButton from './base-filters/FilterButton';
import ApplyButton from './buttons/ApplyButton';
import ClearButton from './buttons/ClearButton';
import StarIcon from '../StarIcon';
import './styles/ratingFilter.css';

type RatingFilterProps = {
  onChange: (selected: number | null) => void;
  initialSelected?: number | null;
};

const RatingFilter: React.FC<RatingFilterProps> = ({
  onChange,
  initialSelected,
}) => {
  const [appliedRating, setAppliedRating] = useState<number>(
    initialSelected || 0
  );
  const [tempRating, setTempRating] = useState<number>(initialSelected || 0);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  const togglePopup = () => {
    if (!isOpen) {
      setTempRating(appliedRating);
    }
    setIsOpen(!isOpen);
  };

  const handleStarClick = (rate: number) => {
    setTempRating(rate);
  };

  const applySelection = () => {
    setAppliedRating(tempRating);
    onChange(tempRating);
    setIsOpen(false);
  };

  const clearSelection = () => {
    setTempRating(0);
    setAppliedRating(0);
    onChange(null);
    setIsOpen(false);
  };

  const isActive = appliedRating > 0;

  return (
    <div className="filter rating-filter" ref={wrapperRef}>
      <FilterButton
        onClick={togglePopup}
        variant={isActive ? 'selected' : 'primary'}
        iconSrc={
          isActive
            ? 'images/filter-icons/selected-icons/rating-icon.png'
            : 'images/filter-icons/base-icons/rating-icon.png'
        }
        iconAlt="Rating Icon"
        label="Rating"
      />
      {isOpen && (
        <div className="rating-filter-popup">
          <p className="title">Rating</p>
          <div className="star-container">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = tempRating === 0 ? star === 0 : star <= tempRating;
              return (
                <StarIcon
                  key={star}
                  label={star.toString()}
                  filled={filled}
                  onClick={() => handleStarClick(star)}
                />
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

export default RatingFilter;
