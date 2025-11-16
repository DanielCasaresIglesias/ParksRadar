// frontend/src/services/parksService.ts

import { API_URL } from './api';
import type { Filters } from '../src/types/filters';

/**
 * Build a ?-style query string from filters and fetch /api/parks
 */
export async function fetchParks(filters: Filters) {
  const qs = new URLSearchParams();

  if (filters.parkState && filters.parkState.length) {
    qs.append('parkState', filters.parkState.join(','));
  }
  if (filters.region && filters.region.length) {
    qs.append('region', filters.region.join(','));
  }
  if (filters.trails && filters.trails.length) {
    qs.append('trails', filters.trails.join(','));
  }
  if (filters.camps && filters.camps.length) {
    qs.append('camps', filters.camps.join(','));
  }
  if (filters.activities && filters.activities.length) {
    qs.append('activities', filters.activities.join(','));
  }
  if (filters.facilities && filters.facilities.length) {
    qs.append('facilities', filters.facilities.join(','));
  }
  if (filters.features && filters.features.length) {
    qs.append('features', filters.features.join(','));
  }

  if (filters.ratingMin !== undefined && filters.ratingMin !== null) {
    qs.append('ratingMin', filters.ratingMin.toString());
  }

  if (filters.entryFeeMin !== undefined && filters.entryFeeMin !== null) {
    qs.append('entryFeeMin', filters.entryFeeMin.toString());
  }
  if (filters.entryFeeMax !== undefined && filters.entryFeeMax !== null) {
    qs.append('entryFeeMax', filters.entryFeeMax.toString());
  }

  if (filters.parkingFeeMin !== undefined && filters.parkingFeeMin !== null) {
    qs.append('parkingFeeMin', filters.parkingFeeMin.toString());
  }
  if (filters.parkingFeeMax !== undefined && filters.parkingFeeMax !== null) {
    qs.append('parkingFeeMax', filters.parkingFeeMax.toString());
  }

  if (filters.groupSize !== undefined && filters.groupSize !== null) {
    qs.append('groupSize', filters.groupSize.toString());
  }
  if (filters.numCars !== undefined && filters.numCars !== null) {
    qs.append('numCars', filters.numCars.toString());
  }
  if (filters.numMotorcycles !== undefined && filters.numMotorcycles !== null) {
    qs.append('numMotorcycles', filters.numMotorcycles.toString());
  }
  if (filters.includeShuttle !== undefined) {
    qs.append('includeShuttle', filters.includeShuttle.toString());
  }

  if (filters.petPolicy) {
    qs.append('petPolicy', filters.petPolicy);
  }

  if (filters.accessibility && filters.accessibility.length) {
    qs.append('accessibility', filters.accessibility.join(','));
  }

  if (filters.permits) {
    Object.entries(filters.permits).forEach(([section, value]) => {
      if (value !== null && value !== '') {
        qs.append(`permits[${section}]`, value);
      }
    });
  }

  if (filters.distanceAddress) {
    qs.append('distanceAddress', filters.distanceAddress);
  }
  if (filters.distanceMiles) {
    qs.append('distanceMiles', filters.distanceMiles.toString());
  }

  if (filters.openStartDate) {
    qs.append('openStartDate', filters.openStartDate);
  }
  if (filters.openEndDate) {
    qs.append('openEndDate', filters.openEndDate);
  }

  if (filters.weatherConditions && filters.weatherConditions.length) {
    qs.append('weatherConditions', filters.weatherConditions.join(','));
  }

  const response = await fetch(`${API_URL}/parks?${qs.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch parks: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch parks near a given latitude/longitude within a given distance in miles.
 */
export async function fetchParksNearLocation(
  lat: number,
  lng: number,
  miles = 50
) {
  const qs = new URLSearchParams({
    distanceAddress: `${lat},${lng}`,
    distanceMiles: miles.toString(),
  });

  const response = await fetch(`${API_URL}/parks?${qs.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch nearby parks: ${response.status}`);
  }
  return response.json();
}
