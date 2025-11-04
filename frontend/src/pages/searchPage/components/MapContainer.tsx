// MapContainer.tsx
import { useEffect, useRef, forwardRef, type RefObject } from 'react';
import '../styles/mapContainer.css';
import L, { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapContainer = forwardRef<LeafletMap | null, {}>((props, ref) => {
  console.log(props);
  const mapInstance = useRef<LeafletMap | null>(null);

  useEffect(() => {
    mapInstance.current = L.map('map', {
      zoomControl: false
    }).setView([37.7749, -122.4194], 8); // San Francisco

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // L.marker([37.7749, -122.4194])
    //   .addTo(mapInstance.current)
    //   .bindPopup("San Francisco, CA")
    //   .openPopup();

    L.control.zoom({
      position: 'topright'
    }).addTo(mapInstance.current);

    // Forward the map instance via ref
    if (ref) {
      if (typeof ref === 'function') {
        ref(mapInstance.current);
      } else {
        (ref as RefObject<LeafletMap | null>).current = mapInstance.current;
      }
    }

    return () => {
      mapInstance.current?.remove();
    };
  }, [ref]);

  return (
    <div className="map-container">
      <div id="map"></div>
    </div>
  );
});

export default MapContainer;
