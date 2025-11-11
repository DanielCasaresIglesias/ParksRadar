// frontend/src/components/filters/StateRegionFilter.tsx
import React from 'react';
import ChecklistExpandedListFilter, {
  type GroupOptions,
} from './base-filters/ChecklistExpandedListFilter';
import { stateTourismRegions } from '../../data/stateTourismRegions';

type StateRegionFilterProps = {
  /**
   * Called with two arrays: [selectedStates, selectedRegions]
   */
  onChange: (states: string[], regions: string[]) => void;
  initialStates: string[];
  initialRegions: string[];
};

const StateRegionFilter: React.FC<StateRegionFilterProps> = ({
  onChange,
  initialStates,
  initialRegions,
}) => {
  // Build groups: one per state/territory, children = that region list
  const groups: GroupOptions[] = stateTourismRegions.map(
    ({ state, regions }) => ({
      label: state,
      options: regions,
    })
  );

  // initialSelected for the expanded checklist = states + regions
  const initialSelected = [...initialStates, ...initialRegions];

  // Extract list of all state labels to distinguish parents vs. children
  const allStates = stateTourismRegions.map((s) => s.state);

  return (
    <ChecklistExpandedListFilter
      label="State & Region"
      iconSrc="images/filter-icons/base-icons/state-icon.png"
      selectedIconSrc="images/filter-icons/selected-icons/state-icon.png"
      iconAlt="State & Region Icon"
      groups={groups}
      initialSelected={initialSelected}
      onChange={(selected) => {
        // split flat selection into states vs. regions
        const states = selected.filter((s) => allStates.includes(s));
        const regions = selected.filter((r) => !allStates.includes(r));
        onChange(states, regions);
      }}
    />
  );
};

export default StateRegionFilter;
