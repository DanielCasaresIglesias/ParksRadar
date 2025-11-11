// frontend/src/types/filters.ts

/**
 * Must match exactly the backend’s ParksFilterParams interface!
 */
export interface Filters {
  parkState?: string[];
  region?: string[];
  trails?: string[];
  camps?: string[];
  activities?: string[];
  facilities?: string[];
  features?: string[];
  ratingMin?: number | null;

  entryFeeMin?: number | null;
  entryFeeMax?: number | null;

  parkingFeeMin?: number | null;
  parkingFeeMax?: number | null;

  petPolicy?: string | null;
  accessibility?: string[]; // ["Wheelchair","Hearing"]
  permits?: {
    drone?: string | null;
    fishing?: string | null;
    hunting?: string | null;
    backcountry?: string | null;
  };

  distanceAddress?: string;
  distanceMiles?: number | null;

  openStartDate?: string;
  openEndDate?: string;

  weatherConditions?: string[];

  // Cost Filters
  groupSize?: number | null;
  numCars?: number | null;
  numMotorcycles?: number | null;
  includeShuttle?: boolean;
}
