// backend/src/services/geocodingService.ts

/**
 * A dummy “geocodeAddress” that returns fixed coordinates for sake of example.
 * In a real app, you’d call a third‐party API (Mapbox, Google, OpenCage, etc.).
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function geocodeAddress(address: string): Coordinates {
  console.log(`Geocoding address: ${address}`);
  // TODO: Replace with real geocoding lookup.
  // For now, always return San Francisco’s coords:
  return { latitude: 37.7749, longitude: -122.4194 };
}
