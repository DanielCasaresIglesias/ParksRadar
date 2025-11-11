// frontend/src/types/park.tsx
export interface Park {
  park_id: number;
  park_name: string;
  park_photo_link?: string;
  park_address?: string;
  park_state?: string;
  park_region?: string;
  park_level:
    | 'Federal'
    | 'State'
    | 'Regional'
    | 'County'
    | 'City/Municipal'
    | 'Tribal'
    | 'Private with Public Access'
    | 'Uknown/Other';
  park_type:
    | 'Park'
    | 'Recreation Area'
    | 'Forest'
    | 'Wilderness Area'
    | 'Seashore'
    | 'Beach'
    | 'Historic Trail'
    | 'Monument'
    | 'Historical Park'
    | 'Historic Site'
    | 'Preserve'
    | 'Memorial'
    | 'Other Park Designation'
    | 'Grassland'
    | 'Management Unit'
    | 'Marine Sanctuary'
    | 'Wildlife Refuge'
    | 'Wildlife Management Area'
    | 'Fish Hatchery'
    | 'Affiliated Area';
  park_agency?: string;
  park_description?: string;
  park_phone_number?: string;
  park_size?: number;
  park_min_elevation?: number;
  park_max_elevation?: number;
  park_latitude: number;
  park_longitude: number;
  park_time_zone?: string;
  park_entry_fee?: number;
  park_parking_fee?: number;
  park_other_fee?: number;
  park_average_rating: number;
  park_number_of_reviews: number;
  park_drone_permit:
    | 'Permit Required'
    | 'Not Allowed'
    | 'No Permit Required'
    | 'Seasonal';
  park_fishing_permit:
    | 'Permit Required'
    | 'Not Allowed'
    | 'No Permit Required'
    | 'Seasonal';
  park_hunting_permit:
    | 'Permit Required'
    | 'Not Allowed'
    | 'No Permit Required'
    | 'Seasonal';
  park_backcountry_permit:
    | 'Permit Required'
    | 'Not Allowed'
    | 'No Permit Required'
    | 'Seasonal';
  activities?: string[];
  facilities?: string[];
  features?: string[];
  accessibility?: string[];
  trail_types?: string[];
  camp_types?: string[];
}
