// backend/src/types/parkFilters.ts

/**
 * Shared type for filter parameters in parksService and parksRoutes
 */
export interface ParksFilterParams {
  states: string[];
  regions: string[];
  trails: string[];
  camps: string[];
  activities: string[];
  facilities: string[];
  features: string[];
  ratingMin: number | null;

  entryFeeMin: number | null;
  entryFeeMax: number | null;

  accessibility: string[];

  permits: {
    drone: boolean | null;
    fishing: boolean | null;
    hunting: boolean | null;
    backcountry: boolean | null;
  };

  distanceAddress: string | null;
  distanceMiles: number | null;
}
