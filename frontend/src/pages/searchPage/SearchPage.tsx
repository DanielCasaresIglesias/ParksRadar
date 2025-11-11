// frontend/src/pages/searchPage/SearchPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FilterBar from '../../components/FilterBar';
import ResultsColumn from './components/ResultsColumn';
import ParkPopup from './components/ParkPopup';
import MapContainer from './components/MapContainer';
import { fetchParks } from '../../../services/parksService';
import type { Filters } from '../../types/filters';
import './styles/searchPage.css';
import L from 'leaflet';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState<Filters>({});
  const [parks, setParks] = useState<any[]>([]);
  const [selectedPark, setSelectedPark] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [resultsMinimized, setResultsMinimized] = useState(false);
  const [loading, setLoading] = useState(false);

  // Map ref to store Leaflet instance
  const mapRef = useRef<any>(null);

  // When URL’s query params change, parse them into our Filters object
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters: Filters = {};

    if (params.has('parkState')) {
      newFilters.parkState = (params.get('parkState') as string).split(',');
    }
    if (params.has('region')) {
      newFilters.region = (params.get('region') as string).split(',');
    }
    if (params.has('trails')) {
      newFilters.trails = (params.get('trails') as string).split(',');
    }
    if (params.has('camps')) {
      newFilters.camps = (params.get('camps') as string).split(',');
    }
    if (params.has('activities')) {
      newFilters.activities = (params.get('activities') as string).split(',');
    }
    if (params.has('facilities')) {
      newFilters.facilities = (params.get('facilities') as string).split(',');
    }
    if (params.has('features')) {
      newFilters.features = (params.get('features') as string).split(',');
    }

    if (params.has('ratingMin')) {
      newFilters.ratingMin = parseFloat(params.get('ratingMin')!);
    }

    if (params.has('entryFeeMin')) {
      newFilters.entryFeeMin = parseFloat(params.get('entryFeeMin')!);
    }
    if (params.has('entryFeeMax')) {
      newFilters.entryFeeMax = parseFloat(params.get('entryFeeMax')!);
    }

    if (params.has('parkingFeeMin')) {
      newFilters.parkingFeeMin = parseFloat(params.get('parkingFeeMin')!);
    }
    if (params.has('parkingFeeMax')) {
      newFilters.parkingFeeMax = parseFloat(params.get('parkingFeeMax')!);
    }

    if (params.has('groupSize')) {
      // parseInt because it’s a whole number ≥1
      newFilters.groupSize = parseInt(params.get('groupSize')!, 10);
    }
    if (params.has('numCars')) {
      // parseInt because it’s a whole number ≥1
      newFilters.numCars = parseInt(params.get('numCars')!, 10);
    }
    if (params.has('numMotorcycles')) {
      // parseInt because it’s a whole number ≥1
      newFilters.numMotorcycles = parseInt(params.get('numMotorcycles')!, 10);
    }
    if (params.has('includeShuttle')) {
      // checkboxes come through as "true" or "false"
      newFilters.includeShuttle = params.get('includeShuttle') === 'true';
    }

    if (params.has('petPolicy')) {
      newFilters.petPolicy = params.get('petPolicy')!;
    }

    if (params.has('accessibility')) {
      newFilters.accessibility = (params.get('accessibility') as string).split(
        ','
      );
    }

    const permitsObj: Record<string, string | null> = {};
    params.forEach((value, key) => {
      const match = key.match(/^permits\[(.+)\]$/);
      if (match) {
        const section = match[1];
        permitsObj[section] = value;
      }
    });
    if (Object.keys(permitsObj).length > 0) {
      newFilters.permits = permitsObj;
    }

    if (params.has('distanceAddress')) {
      newFilters.distanceAddress = params.get('distanceAddress')!;
    }
    if (params.has('distanceMiles')) {
      newFilters.distanceMiles = parseFloat(params.get('distanceMiles')!);
    }

    if (params.has('openStartDate')) {
      newFilters.openStartDate = params.get('openStartDate')!;
    }
    if (params.has('openEndDate')) {
      newFilters.openEndDate = params.get('openEndDate')!;
    }

    if (params.has('weatherConditions')) {
      newFilters.weatherConditions = (
        params.get('weatherConditions') as string
      ).split(',');
    }

    setFilters(newFilters);
  }, [location.search]);

  // Whenever filters change, fetch new park list
  useEffect(() => {
    async function loadParks() {
      setLoading(true);
      try {
        const data = await fetchParks(filters);
        setParks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadParks();
  }, [filters]);

  // Called by FilterBar whenever user changes any filter
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);

    // Build new query-string → update URL
    const qs = new URLSearchParams();
    if (newFilters.parkState && newFilters.parkState.length) {
      qs.append('parkState', newFilters.parkState.join(','));
    }
    if (newFilters.region && newFilters.region.length) {
      qs.append('region', newFilters.region.join(','));
    }
    if (newFilters.trails && newFilters.trails.length) {
      qs.append('trails', newFilters.trails.join(','));
    }
    if (newFilters.camps && newFilters.camps.length) {
      qs.append('camps', newFilters.camps.join(','));
    }
    if (newFilters.activities && newFilters.activities.length) {
      qs.append('activities', newFilters.activities.join(','));
    }
    if (newFilters.facilities && newFilters.facilities.length) {
      qs.append('facilities', newFilters.facilities.join(','));
    }
    if (newFilters.features && newFilters.features.length) {
      qs.append('features', newFilters.features.join(','));
    }

    if (newFilters.ratingMin !== undefined && newFilters.ratingMin !== null) {
      qs.append('ratingMin', newFilters.ratingMin.toString());
    }

    if (
      newFilters.entryFeeMin !== undefined &&
      newFilters.entryFeeMin !== null
    ) {
      qs.append('entryFeeMin', newFilters.entryFeeMin.toString());
    }
    if (
      newFilters.entryFeeMax !== undefined &&
      newFilters.entryFeeMax !== null
    ) {
      qs.append('entryFeeMax', newFilters.entryFeeMax.toString());
    }

    if (
      newFilters.parkingFeeMin !== undefined &&
      newFilters.parkingFeeMin !== null
    ) {
      qs.append('parkingFeeMin', newFilters.parkingFeeMin.toString());
    }
    if (
      newFilters.parkingFeeMax !== undefined &&
      newFilters.parkingFeeMax !== null
    ) {
      qs.append('parkingFeeMax', newFilters.parkingFeeMax.toString());
    }

    if (newFilters.petPolicy) {
      qs.append('petPolicy', newFilters.petPolicy);
    }
    if (newFilters.accessibility && newFilters.accessibility.length) {
      qs.append('accessibility', newFilters.accessibility.join(','));
    }
    if (newFilters.permits) {
      Object.entries(newFilters.permits).forEach(([section, value]) => {
        if (value !== null && value !== '') {
          qs.append(`permits[${section}]`, value);
        }
      });
    }

    if (newFilters.distanceAddress) {
      qs.append('distanceAddress', newFilters.distanceAddress);
    }
    if (
      newFilters.distanceMiles !== undefined &&
      newFilters.distanceMiles !== null
    ) {
      qs.append('distanceMiles', newFilters.distanceMiles.toString());
    }

    if (newFilters.openStartDate) {
      qs.append('openStartDate', newFilters.openStartDate);
    }
    if (newFilters.openEndDate) {
      qs.append('openEndDate', newFilters.openEndDate);
    }

    if (newFilters.weatherConditions && newFilters.weatherConditions.length) {
      qs.append('weatherConditions', newFilters.weatherConditions.join(','));
    }

    navigate(`/search?${qs.toString()}`);
  };

  // Select a park: show popup and zoom map to park’s size
  const handleParkSelect = (park: any) => {
    setSelectedPark(park);
    setShowPopup(true);

    const map: L.Map = mapRef.current;
    if (!map) return;

    // 1) Build center & compute bounds from acreage
    const center = L.latLng(park.park_latitude, park.park_longitude);
    const sizeAcres = park.park_size ?? 0;
    const radiusM = Math.sqrt((sizeAcres * 4046.86) / Math.PI) * 2.5;
    const bounds = center.toBounds(radiusM);

    // 2) FitBounds → this sets both center & zoom optimally
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 16 });

    // 3) Grab the actual zoom after fitBounds
    const zoomLevel = map.getZoom();

    // 4) Compute pixel offset: half the 30rem sidebar
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    const overlayHalfPx = (rootFontSize * 60) / 2;

    // 5) Convert the *fitted* center lat/lng into a container point
    const centerPoint = map.latLngToContainerPoint(center);

    // 6) Shift that point left by half the overlay
    const shiftedPoint = L.point(centerPoint.x - overlayHalfPx, centerPoint.y);

    // 7) Convert back to a LatLng
    const shiftedLatLng = map.containerPointToLatLng(shiftedPoint);

    // 8) Finally setView to that shifted center & zoom
    map.setView(shiftedLatLng, zoomLevel, { animate: true });
  };

  const handleMinimize = () => {
    const nxt = !resultsMinimized;
    setResultsMinimized(nxt);
    if (nxt && showPopup) {
      setShowPopup(false);
    }
  };

  return (
    <div className="search-page">
      <div className="filter-bar-container">
        <FilterBar
          onFiltersChange={handleFiltersChange}
          initialFilters={filters}
        />
      </div>
      <div className="content">
        <div
          className={`search-results ${resultsMinimized ? 'minimized' : ''}`}
        >
          <div className="results-content">
            <ResultsColumn
              results={parks}
              onParkSelect={handleParkSelect}
              minimized={resultsMinimized}
              loading={loading}
            />
          </div>
          <div className="results-toggle" onClick={handleMinimize}>
            {resultsMinimized ? '>' : '<'}
          </div>
        </div>
        {showPopup && selectedPark && (
          <ParkPopup park={selectedPark} onClose={() => setShowPopup(false)} />
        )}
        <MapContainer ref={mapRef} />
      </div>
    </div>
  );
};

export default SearchPage;
