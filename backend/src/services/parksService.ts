// backend/src/services/parksService.ts
import { ParksFilterParams } from '../types/parkFilters';

export function buildParksFilterQuery(filters: ParksFilterParams) {
  const conditions: string[] = [];
  const values: any[] = [];

  // Basic filters
  if (filters.states.length > 0) {
    conditions.push(`p.park_state = ANY($${values.length + 1})`);
    values.push(filters.states);
  }

  if (filters.regions.length > 0) {
    conditions.push(`p.park_region = ANY($${values.length + 1})`);
    values.push(filters.regions);
  }

  if (filters.ratingMin !== null) {
    conditions.push(`p.park_average_rating >= $${values.length + 1}`);
    values.push(filters.ratingMin);
  }

  if (filters.entryFeeMin !== null) {
    conditions.push(`p.park_entry_fee >= $${values.length + 1}`);
    values.push(filters.entryFeeMin);
  }

  if (filters.entryFeeMax !== null) {
    conditions.push(`p.park_entry_fee <= $${values.length + 1}`);
    values.push(filters.entryFeeMax);
  }

  // Activity filters
  if (filters.activities.length > 0) {
    conditions.push(`
      p.park_id IN (
        SELECT pa.park_id FROM park_activities pa
        JOIN activities a ON a.activity_id = pa.activity_id
        WHERE a.activity_name = ANY($${values.length + 1})
      )
    `);
    values.push(filters.activities);
  }

  // Facilities
  if (filters.facilities.length > 0) {
    conditions.push(`
      p.park_id IN (
        SELECT pf.park_id FROM park_facilities pf
        JOIN facilities f ON f.facility_id = pf.facility_id
        WHERE f.facility_name = ANY($${values.length + 1})
      )
    `);
    values.push(filters.facilities);
  }

  // Features
  if (filters.features.length > 0) {
    conditions.push(`
      p.park_id IN (
        SELECT pf.park_id FROM park_features pf
        JOIN features f ON f.feature_id = pf.feature_id
        WHERE f.feature_name = ANY($${values.length + 1})
      )
    `);
    values.push(filters.features);
  }

  // Trails
  if (filters.trails.length > 0) {
    conditions.push(`
      p.park_id IN (
        SELECT pt.park_id FROM park_trail_types pt
        JOIN trail_types t ON t.trail_type_id = pt.trail_type_id
        WHERE t.trail_type_name = ANY($${values.length + 1})
      )
    `);
    values.push(filters.trails);
  }

  // Camps
  if (filters.camps.length > 0) {
    conditions.push(`
      p.park_id IN (
        SELECT pc.park_id FROM park_camp_types pc
        JOIN camp_types c ON c.camp_type_id = pc.camp_type_id
        WHERE c.camp_type_name = ANY($${values.length + 1})
      )
    `);
    values.push(filters.camps);
  }

  // Accessibility
  if (filters.accessibility.length > 0) {
    conditions.push(`
      p.park_id IN (
        SELECT pa.park_id FROM park_accessibility pa
        JOIN accessibility a ON a.accessibility_id = pa.accessibility_id
        WHERE a.accessibility_name = ANY($${values.length + 1})
      )
    `);
    values.push(filters.accessibility);
  }

  // Permits (Yes/No)
  const permitMap = {
    drone: 'park_drone_permit',
    fishing: 'park_fishing_permit',
    hunting: 'park_hunting_permit',
    backcountry: 'park_backcountry_permit',
  } as const;

  for (const [key, column] of Object.entries(permitMap)) {
    const value = filters.permits[key as keyof typeof permitMap];
    if (value !== null) {
      conditions.push(`LOWER(p.${column}) = LOWER($${values.length + 1})`);
      values.push(value ? 'Yes' : 'No');
    }
  }

  // Distance filtering (PostGIS)
  if (filters.distanceAddress && filters.distanceMiles) {
    // distanceAddress will be a string like "lat,lon"
    const coords = filters.distanceAddress.split(',').map(Number);
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      const [latitude, longitude] = coords;
      const distanceMeters = filters.distanceMiles * 1609.34;

      // Add distance calculation to the SELECT
      conditions.push(
        `ST_DWithin(p.park_location, ST_SetSRID(ST_MakePoint($${
          values.length + 1
        }, $${values.length + 2}), 4326)::geography, $${values.length + 3})`
      );

      values.push(longitude, latitude, distanceMeters);
    }
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const text = `
    SELECT 
      p.*,
      ST_Y(p.park_location::geometry) AS latitude,
      ST_X(p.park_location::geometry) AS longitude
      ${
        filters.distanceAddress && filters.distanceMiles
          ? `,
        ST_Distance(
          p.park_location,
          ST_SetSRID(ST_MakePoint(${
            values.length - 2
          }, ${values.length - 1}), 4326)::geography
        ) AS distance_meters`
          : ''
      }
    FROM parks p
    ${whereClause}
    ${
      filters.distanceAddress && filters.distanceMiles
        ? 'ORDER BY distance_meters ASC'
        : 'ORDER BY p.park_name ASC'
    };
  `;

  return { text, values };
}
