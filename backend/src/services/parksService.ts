// backend/src/services/parksService.ts
import { Coordinates, geocodeAddress } from './geocodingService';
import { ParksFilterParams } from '../types/parkFilters';

/**
 * Build SQL + values for filtering parks.
 * Removed date & weather filters. Removed petPolicy.
 * Includes many-to-many fields as arrays.
 */
export function buildParksFilterQuery(params: ParksFilterParams): {
  text: string;
  values: any[];
} {
  const conditions: string[] = [];
  const values: any[] = [];
  let idx = 1;

  // STATES
  if (params.states.length) {
    conditions.push(`p.park_state = ANY($${idx}::text[])`);
    values.push(params.states);
    idx++;
  }

  // REGIONS
  if (params.regions.length) {
    conditions.push(`p.park_region = ANY($${idx}::text[])`);
    values.push(params.regions);
    idx++;
  }

  // TRAILS filter via EXISTS
  if (params.trails.length) {
    conditions.push(
      `EXISTS (
         SELECT 1
         FROM park_trail_types ptt
         JOIN trail_types tt ON ptt.trail_type_id = tt.trail_type_id
         WHERE ptt.park_id = p.park_id
           AND tt.trail_type_name = ANY($${idx}::text[])
       )`
    );
    values.push(params.trails);
    idx++;
  }

  // CAMPS filter via EXISTS
  if (params.camps.length) {
    conditions.push(
      `EXISTS (
         SELECT 1
         FROM park_camp_types ptt
         JOIN camp_types tt ON ptt.camp_type_id = tt.camp_type_id
         WHERE ptt.park_id = p.park_id
           AND tt.camp_type_name = ANY($${idx}::text[])
       )`
    );
    values.push(params.camps);
    idx++;
  }

  // ACTIVITIES
  if (params.activities.length) {
    conditions.push(
      `EXISTS (
         SELECT 1
         FROM park_activities pa
         JOIN activities a ON pa.activity_id = a.activity_id
         WHERE pa.park_id = p.park_id
           AND a.activity_name = ANY($${idx}::text[])
       )`
    );
    values.push(params.activities);
    idx++;
  }

  // FACILITIES
  if (params.facilities.length) {
    conditions.push(
      `EXISTS (
         SELECT 1
         FROM park_facilities pf
         JOIN facilities f ON pf.facility_id = f.facility_id
         WHERE pf.park_id = p.park_id
           AND f.facility_name = ANY($${idx}::text[])
       )`
    );
    values.push(params.facilities);
    idx++;
  }

  // FEATURES
  if (params.features.length) {
    conditions.push(
      `EXISTS (
         SELECT 1
         FROM park_features pfeat
         JOIN features feat ON pfeat.feature_id = feat.feature_id
         WHERE pfeat.park_id = p.park_id
           AND feat.feature_name = ANY($${idx}::text[])
       )`
    );
    values.push(params.features);
    idx++;
  }

  // RATING
  if (params.ratingMin !== null) {
    conditions.push(`p.park_average_rating >= $${idx}`);
    values.push(params.ratingMin);
    idx++;
  }

  // ENTRY FEE
  if (
    params.entryFeeMin != null &&
    params.entryFeeMax != null &&
    params.groupSize != null &&
    params.numCars != null &&
    params.numMotorcycles != null &&
    params.includeShuttle != null
  ) {
    // compute total_cost = groupSize * park_entry_fee
    //                    + (numCars + numMotorcycles) * park_parking_fee
    //                    + (includeShuttle ? park_other_fee : 0)
    conditions.push(`
      (
        ($${idx}::int     * p.park_entry_fee)
        + (($${idx + 1}::int + $${idx + 2}::int) * p.park_parking_fee)
        + (CASE WHEN $${idx + 3}::boolean THEN p.park_other_fee ELSE 0 END)
      ) BETWEEN $${idx + 4}::numeric AND $${idx + 5}::numeric
    `);
    values.push(
      params.groupSize,
      params.numCars,
      params.numMotorcycles,
      params.includeShuttle,
      params.entryFeeMin,
      params.entryFeeMax
    );
    idx += 6;
  }

  // ACCESSIBILITY
  if (params.accessibility.length) {
    conditions.push(
      `EXISTS (
         SELECT 1
         FROM park_accessibility pac
         JOIN accessibility ac ON pac.accessibility_id = ac.accessibility_id
         WHERE pac.park_id = p.park_id
           AND ac.accessibility_name = ANY($${idx}::text[])
       )`
    );
    values.push(params.accessibility);
    idx++;
  }

  // PERMITS: drone, fishing, hunting, backcountry
  if (params.permits) {
    const permitConds: string[] = [];

    if (params.permits.drone) {
      permitConds.push(`p.park_drone_permit = $${idx}`);
      values.push(params.permits.drone);
      idx++;
    }
    if (params.permits.fishing) {
      permitConds.push(`p.park_fishing_permit = $${idx}`);
      values.push(params.permits.fishing);
      idx++;
    }
    if (params.permits.hunting) {
      permitConds.push(`p.park_hunting_permit = $${idx}`);
      values.push(params.permits.hunting);
      idx++;
    }
    if (params.permits.backcountry) {
      permitConds.push(`p.park_backcountry_permit = $${idx}`);
      values.push(params.permits.backcountry);
      idx++;
    }

    if (permitConds.length) {
      conditions.push(`(${permitConds.join(' AND ')})`);
    }
  }

  // DISTANCE
  if (params.distanceAddress && params.distanceMiles !== null) {
    const coords: Coordinates = geocodeAddress(params.distanceAddress);
    const radius = params.distanceMiles * 1609.34;
    conditions.push(
      `ST_DWithin(
         p.park_location,
         ST_SetSRID(ST_Point($${idx + 1}, $${idx}), 4326)::geography,
         $${idx + 2}
       )`
    );
    values.push(coords.latitude, coords.longitude, radius);
    idx += 3;
  }

  // FINAL SQL with array_agg sub-selects
  const text = `
    SELECT
      p.*,
      COALESCE((SELECT array_agg(tt.trail_type_name)
        FROM park_trail_types ptt
        JOIN trail_types tt ON ptt.trail_type_id = tt.trail_type_id
        WHERE ptt.park_id = p.park_id), '{}') AS trail_types,
      COALESCE((SELECT array_agg(ct.camp_type_name)
        FROM park_camp_types pct
        JOIN camp_types ct ON pct.camp_type_id = ct.camp_type_id
        WHERE pct.park_id = p.park_id), '{}') AS camp_types,
      COALESCE((SELECT array_agg(a.activity_name)
        FROM park_activities pa
        JOIN activities a ON pa.activity_id = a.activity_id
        WHERE pa.park_id = p.park_id), '{}') AS activities,
      COALESCE((SELECT array_agg(f.facility_name)
        FROM park_facilities pf
        JOIN facilities f ON pf.facility_id = f.facility_id
        WHERE pf.park_id = p.park_id), '{}') AS facilities,
      COALESCE((SELECT array_agg(fe.feature_name)
        FROM park_features pf2
        JOIN features fe ON pf2.feature_id = fe.feature_id
        WHERE pf2.park_id = p.park_id), '{}') AS features,
      COALESCE((SELECT array_agg(ac.accessibility_name)
        FROM park_accessibility pac
        JOIN accessibility ac ON pac.accessibility_id = ac.accessibility_id
        WHERE pac.park_id = p.park_id), '{}') AS accessibility
    FROM parks p
    ${conditions.length ? 'WHERE ' + conditions.join('\n  AND ') : ''}
  `;

  return { text, values };
}
