// frontend/src/components/SortDropdown.tsx
import React, { useEffect, useRef, useState } from 'react';
import { type Park } from '../../../types/park';
import '../styles/sortDropdown.css';

export type SortField = 'name' | 'rating' | 'distance' | 'random';
export type SortDirection = 'asc' | 'desc';

type Props = {
  // used for tie-breakers
  results: Park[];
  // if present, show distance option
  userLocation?: { lat: number; lon: number } | null;
  active?: { field: SortField | null; dir: SortDirection | null };
  onApplySort: (
    field: SortField,
    dir: SortDirection | null,
    sorted: Park[]
  ) => void;
};

const initialDirectionFor = (field: SortField): SortDirection | null => {
  switch (field) {
    case 'name':
      return 'asc';
    case 'rating':
      return 'desc';
    case 'distance':
      return 'asc';
    case 'random':
      return null;
  }
};

const haversineDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const buildComparator = (
  field: SortField,
  dir: SortDirection,
  distances?: Map<number, number>
) => {
  const multiplier = dir === 'asc' ? 1 : -1;

  const cmpString = (a?: string, b?: string) =>
    (a ?? '').localeCompare(b ?? '');
  const cmpNumber = (a?: number, b?: number) => (a ?? 0) - (b ?? 0);

  return (pA: any, pB: any) => {
    let primary = 0;
    if (field === 'name') {
      primary = cmpString(pA.park_name, pB.park_name);
    } else if (field === 'rating') {
      primary = cmpNumber(pA.park_average_rating, pB.park_average_rating);
    } else if (field === 'distance') {
      const dA = distances?.get(pA.park_id) ?? Infinity;
      const dB = distances?.get(pB.park_id) ?? Infinity;
      primary = cmpNumber(dA, dB);
    }

    if (primary !== 0) return primary * multiplier;

    // tie-breakers: name alphabetically, park_level, park_type
    const t1 = cmpString(pA.park_name, pB.park_name);
    if (t1 !== 0) return t1;

    const t2 = cmpString(pA.park_level, pB.park_level);
    if (t2 !== 0) return t2;

    const t3 = cmpString(pA.park_type, pB.park_type);
    return t3;
  };
};

const labelFor = (active?: {
  field: SortField | null;
  dir: SortDirection | null;
}) => {
  if (!active || !active.field) return 'Default';
  const f = active.field;
  const d = active.dir;
  const arrow = d === 'asc' ? ' ▲' : d === 'desc' ? ' ▼' : '';
  switch (f) {
    case 'name':
      return `Name${arrow}`;
    case 'rating':
      return `Rating${arrow}`;
    case 'distance':
      return `Distance${arrow}`;
    case 'random':
      return 'Random';
    default:
      return 'Default';
  }
};

const SortDropdown: React.FC<Props> = ({
  results,
  userLocation,
  active,
  onApplySort,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // compute distances map only if userLocation provided
  const distances = React.useMemo(() => {
    if (!userLocation) return undefined;
    const map = new Map<number, number>();
    for (const p of results) {
      const d = haversineDistanceKm(
        userLocation.lat,
        userLocation.lon,
        p.park_latitude,
        p.park_longitude
      );
      map.set(p.park_id, d);
    }
    return map;
  }, [results, userLocation]);

  useEffect(() => {
    const onBodyClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onBodyClick);
    return () => document.removeEventListener('click', onBodyClick);
  }, []);

  const applySort = (field: SortField) => {
    // random is special
    if (field === 'random') {
      const shuffled = [...results];
      // Fisher-Yates
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      onApplySort('random', null, shuffled);
      setOpen(false);
      return;
    }

    // compute next direction:
    const currentField = active?.field;
    const currentDir = active?.dir ?? null;
    let nextDir: SortDirection;
    if (currentField !== field || currentDir === null) {
      // set to initial direction for this field
      nextDir = initialDirectionFor(field) as SortDirection;
    } else {
      // toggle
      nextDir = currentDir === 'asc' ? 'desc' : 'asc';
    }

    const comparator = buildComparator(field, nextDir, distances);
    const sorted = [...results].sort(comparator);
    onApplySort(field, nextDir, sorted);
    setOpen(false);
  };

  const arrowFor = (field: SortField) => {
    if (active?.field !== field || !active?.dir) return null;
    return active.dir === 'asc' ? '▲' : '▼';
  };

  const displayLabel = labelFor(active);

  return (
    <div className="sort-dropdown" ref={ref}>
      {/* Button now displays current selection (or Default) */}
      <button
        className="sort-toggle"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Sort options — current: ${displayLabel}`}
        title={`Sort: ${displayLabel}`}
      >
        Sort: {displayLabel}
      </button>

      {open && (
        <ul className="sort-options" role="menu">
          <li
            role="menuitem"
            className={`sort-option ${active?.field === 'name' ? 'active' : ''}`}
            onClick={() => applySort('name')}
          >
            <span>Name</span>
            <span className="sort-arrow">{arrowFor('name')}</span>
          </li>

          <li
            role="menuitem"
            className={`sort-option ${active?.field === 'rating' ? 'active' : ''}`}
            onClick={() => applySort('rating')}
          >
            <span>Rating</span>
            <span className="sort-arrow">{arrowFor('rating')}</span>
          </li>

          {userLocation && (
            <li
              role="menuitem"
              className={`sort-option ${active?.field === 'distance' ? 'active' : ''}`}
              onClick={() => applySort('distance')}
            >
              <span>Distance</span>
              <span className="sort-arrow">{arrowFor('distance')}</span>
            </li>
          )}

          <li
            role="menuitem"
            className={`sort-option ${active?.field === 'random' ? 'active' : ''}`}
            onClick={() => applySort('random')}
          >
            <span>Random</span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;
