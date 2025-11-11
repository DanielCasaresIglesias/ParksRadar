// frontend/src/components/FilterBar.tsx

import React, { useState, useEffect, useRef } from 'react';
import useOutsideAlerter from '../hooks/useOutsideAlerter';
import DistanceFilter from './filters/DistanceFilter';
import TrailsFilter from './filters/TrailsFilter';
import ActivitiesFilter from './filters/ActivitiesFilter';
import FacilitiesFilter from './filters/FacilitiesFilter';
import FeaturesFilter from './filters/FeaturesFilter';
import RatingFilter from './filters/RatingFilter';
import StateRegionFilter from './filters/StateRegionFilter';
import AccessibilityFilter from './filters/AccessibilityFilter';
import PermitsFilter from './filters/PermitsFilter';
import PetPolicyFilter from './filters/PetPolicyFilter';
import CampsFilter from './filters/CampsFilter';
import CostFilter from './filters/CostFilter';
import FilterButton from './filters/base-filters/FilterButton';
import type { Filters } from '../types/filters';
import './styles/filterBar.css';

interface FilterBarProps {
  onFiltersChange: (filters: Filters) => void;
  initialFilters: Filters;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onFiltersChange,
  initialFilters,
}) => {
  const [showMore, setShowMore] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close the expanded filters panel whenever you click outside of the bar
  useOutsideAlerter(wrapperRef, () => setShowMore(false));

  // Only initialize from initialFilters once
  const [filters, setFilters] = useState<Filters>(initialFilters);

  // Notify parent whenever filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters]);

  // Helper to update one field in our filters object
  const updateField = <K extends keyof Filters>(
    field: K,
    value: Filters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Define “base filters” (six of them), then we’ll slice them

  const distanceFilterNode = (
    <DistanceFilter
      key="distance"
      label="Distance"
      iconSrc="images/filter-icons/base-icons/distance-icon.png"
      selectedIconSrc="images/filter-icons/selected-icons/distance-icon.png"
      iconAlt="Distance Icon"
      onChange={(val) => {
        updateField('distanceAddress', val.address || '');
        const milesNum = val.miles ? parseFloat(val.miles) : null;
        updateField('distanceMiles', milesNum);
      }}
      initialAddress={filters.distanceAddress || ''}
      initialMiles={
        filters.distanceMiles != null ? filters.distanceMiles.toString() : ''
      }
    />
  );

  const trailsFilterNode = (
    <TrailsFilter
      key="trails"
      onChange={(val) => updateField('trails', val)}
      initialSelected={filters.trails || []}
    />
  );

  const campsFilterNode = (
    <CampsFilter
      key="camps"
      onChange={(val) => updateField('camps', val)}
      initialSelected={filters.camps || []}
    />
  );

  const activitiesFilterNode = (
    <ActivitiesFilter
      key="activities"
      onChange={(val) => updateField('activities', val)}
      initialSelected={filters.activities || []}
    />
  );

  const facilitiesFilterNode = (
    <FacilitiesFilter
      key="facilities"
      onChange={(val) => updateField('facilities', val)}
      initialSelected={filters.facilities || []}
    />
  );

  const featuresFilterNode = (
    <FeaturesFilter
      key="features"
      onChange={(val) => updateField('features', val)}
      initialSelected={filters.features || []}
    />
  );

  const ratingFilterNode = (
    <RatingFilter
      key="rating"
      onChange={(val) => updateField('ratingMin', val)}
      initialSelected={filters.ratingMin ?? null}
    />
  );

  // Put all seven “base” filters in an array, then we’ll splice it:
  const baseFilters = [
    distanceFilterNode,
    trailsFilterNode,
    campsFilterNode,
    activitiesFilterNode,
    facilitiesFilterNode,
    featuresFilterNode,
    ratingFilterNode,
  ];

  // Define “extra” filters (the ones under “More Filters”)

  const extraFilters = [
    <StateRegionFilter
      key="stateRegion"
      initialStates={filters.parkState || []}
      initialRegions={filters.region || []}
      onChange={(states, regions) => {
        updateField('region', regions);
        updateField('parkState', states);
      }}
    />,
    <AccessibilityFilter
      key="accessibility"
      onChange={(val) => updateField('accessibility', val)}
      initialSelected={filters.accessibility || []}
    />,
    <PermitsFilter
      key="permits"
      onChange={(val) => updateField('permits', val)}
      initialSelected={filters.permits || {}}
    />,
    <PetPolicyFilter
      key="petPolicy"
      onChange={(val) => updateField('petPolicy', val)}
      initialSelected={filters.petPolicy ?? null}
    />,
    <CostFilter
      key="cost"
      label="Cost & Parking"
      iconSrc="images/filter-icons/base-icons/cost-icon.png"
      selectedIconSrc="images/filter-icons/selected-icons/cost-icon.png"
      iconAlt="Cost & Parking"
      initial={{
        min: filters.entryFeeMin ?? 0,
        max: filters.entryFeeMax ?? 0,
        people: filters.groupSize ?? 1,
        cars: filters.numCars ?? 0,
        motorcycles: filters.numMotorcycles ?? 0,
        includeTransit: filters.includeShuttle ?? false,
      }}
      onChange={({ min, max, people, cars, motorcycles, includeTransit }) => {
        updateField('parkingFeeMin', min);
        updateField('entryFeeMax', max);
        updateField('groupSize', people);
        updateField('numCars', cars);
        updateField('numMotorcycles', motorcycles);
        updateField('includeShuttle', includeTransit);
      }}
    />,
  ];

  // Show the first 6 of baseFilters in row 1
  // (we reserve one slot for “More Filters” button).
  const visibleBaseFilters = baseFilters.slice(0, 6);

  // Anything in the 7th slot of baseFilters
  // (i.e. ratingFilterNode) should be pushed into “extra” when showMore = true.
  const additionalBaseFilters = baseFilters.slice(6);

  // Combine “overflow” (additionalBaseFilters) with the actual extraFilters
  const extraFilterCombined = [...additionalBaseFilters, ...extraFilters];

  // Helper to chunk an array into subarrays of length `size`
  const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const maxButtons = 7;

  const extraFilterRows = chunkArray(extraFilterCombined, maxButtons);

  return (
    <div className="filter-bar-container" ref={wrapperRef}>
      {/* ─────────── First Row ─────────── */}
      <div className="filter-row">
        {visibleBaseFilters.map((filterNode, idx) => (
          <React.Fragment key={`base-${idx}`}>{filterNode}</React.Fragment>
        ))}

        {/* “More Filters” button always lives in row 1 */}
        <FilterButton
          onClick={() => setShowMore((prev) => !prev)}
          label={showMore ? 'Show Less' : 'Show More'}
          variant="primary"
          iconSrc="images/filter-icons/base-icons/more-filters-icon.png"
          iconAlt="More Filters"
        />
      </div>

      {/* Expanded Filters Section (only if showMore=true) */}
      {showMore && (
        <div className="expanded-filters visible">
          {extraFilterRows.map((row, rowIndex) => (
            <div key={`extra-row-${rowIndex}`} className="filter-row">
              {row.map((filterNode, idx) => (
                <React.Fragment key={`extra-${rowIndex}-${idx}`}>
                  {filterNode}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
