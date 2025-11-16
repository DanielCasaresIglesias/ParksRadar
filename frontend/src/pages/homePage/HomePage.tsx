// HomePage.tsx
import React, { useEffect, useState } from 'react';
// import FindAPark from './components/FindAPark';
import ParksNearYou from './components/ParksNearYou';
import { fetchParksNearLocation } from '../../../services/parksService';
import './styles/homePage.css';

export type Park = {
  park_id: number;
  park_photo_link: string;
  park_name: string;
  park_type: string;
  park_average_rating: number;
};

const Home: React.FC = () => {
  const [parks, setParks] = useState<Park[] | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    const fetchParks = async (lat: number, lon: number, locName: string) => {
      try {
        setLocation(locName); // Update location first
        const nearbyParks = await fetchParksNearLocation(lat, lon);
        setParks(nearbyParks);
      } catch (err) {
        console.error('Failed to fetch nearby parks:', err);
        setLocation('San Francisco');
        setParks([]); // avoid null
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          await fetchParks(latitude, longitude, 'your area');
        },
        async () => {
          console.warn('Location denied. Using San Francisco fallback.');
          await fetchParks(37.7749, -122.4194, 'San Francisco');
        },
        { timeout: 8000 }
      );
    } else {
      fetchParks(37.7749, -122.4194, 'San Francisco');
    }
  }, []);

  return (
    <div className="home-container">
      <div className="hero">
        <img
          src="/images/Homepage-Image.jpg"
          alt="Yosemite valley"
          className="hero-image"
        />

        {/* Centered content */}
        <div className="hero-center">
          <h1 className="hero-title">Find a Park</h1>
        </div>

        {/* Bottom-aligned button */}
        <div className="hero-bottom">
          <button
            className="hero-button"
            onClick={() => window.location.assign('/search')}
          >
            Search
          </button>
        </div>
      </div>

      <div className="below-hero">
        <ParksNearYou location={location} parks={parks} />
      </div>
    </div>
  );
};

export default Home;
