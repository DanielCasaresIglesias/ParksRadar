// frontend/src/components/filters/StateFilter.tsx
import React from 'react';
import ChecklistFilter from './base-filters/ChecklistFilter';

type StateFilterProps = {
  onChange: (selected: string[]) => void;
  initialSelected: string[];
};

const StateFilter: React.FC<StateFilterProps> = ({
  onChange,
  initialSelected,
}) => {
  return (
    <ChecklistFilter
      label="State"
      iconSrc="images/filter-icons/base-icons/state-icon.png"
      selectedIconSrc="images/filter-icons/selected-icons/state-icon.png"
      iconAlt="State Icon"
      options={[
        'Alabama',
        'Alaska',
        'American Samoa',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'District of Columbia',
        'Florida',
        'Georgia',
        'Guam',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Minor Outlying Islands',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Northern Mariana Islands',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Puerto Rico',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'U.S. Virgin Islands',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
      ]}
      onChange={onChange}
      initialSelected={initialSelected}
    />
  );
};

export default StateFilter;
