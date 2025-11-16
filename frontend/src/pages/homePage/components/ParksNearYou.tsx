// ParksNearYou.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParkCard from './ParkCard';
import '../styles/parksNearYou.css';
import type { Park } from '../HomePage';

interface ParksNearYouProps {
  location: string | null;
  parks: Park[] | null;
}

const ParksNearYou: React.FC<ParksNearYouProps> = ({ location, parks }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1380);
  const [dots, setDots] = useState('.');

  const navigate = useNavigate();
  const parksPerPage = 4;

  // Dot animation: ".", "..", "..."
  useEffect(() => {
    const frames = ['.', '..', '...'];
    let i = 0;
    const interval = setInterval(() => {
      setDots(frames[i]);
      i = (i + 1) % frames.length;
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // Resize handling
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1380);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // -----------------------------
  // Determine loading conditions
  // -----------------------------
  // location unknown OR parks not fetched yet
  const stillLoading = !location || parks === null;

  if (stillLoading) {
    return (
      <div className="parks-near-you">
        <h2>Parks near {dots}</h2>
      </div>
    );
  }

  // -----------------------------
  // Normal carousel logic
  // -----------------------------
  const totalItems = parks.length + 1;
  const totalPages = Math.ceil(totalItems / parksPerPage);

  const handleNext = () =>
    currentPage < totalPages - 1 && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 0 && setCurrentPage(currentPage - 1);

  const startIndex = currentPage * parksPerPage;

  const isLastPage = currentPage === totalPages - 1;
  const currentParks = isLastPage
    ? parks.slice(startIndex)
    : parks.slice(startIndex, startIndex + parksPerPage);

  return (
    <div className="parks-near-you">
      <h2>
        Parks near <u>{location}</u>
      </h2>

      <div className="carousel-container">
        {!isMobile && currentPage > 0 && (
          <button className="nav-button left" onClick={handlePrev}>
            ◀
          </button>
        )}

        <div className="parks-row">
          {isMobile ? (
            <>
              {parks.map((park) => (
                <ParkCard
                  key={park.park_id}
                  imageSrc={park.park_photo_link ?? ''}
                  parkName={park.park_name}
                  parkType={park.park_type}
                  rating={park.park_average_rating}
                />
              ))}
              <div
                className="park-card show-more"
                onClick={() => navigate('/search')}
              >
                <span>Show more →</span>
              </div>
            </>
          ) : (
            <>
              {currentParks.map((park) => (
                <ParkCard
                  key={park.park_id}
                  imageSrc={park.park_photo_link ?? ''}
                  parkName={park.park_name}
                  parkType={park.park_type}
                  rating={park.park_average_rating}
                />
              ))}

              {isLastPage && (
                <div
                  className="park-card show-more"
                  onClick={() => navigate('/search')}
                >
                  <span>Show more →</span>
                </div>
              )}
            </>
          )}
        </div>

        {!isMobile && currentPage < totalPages - 1 && (
          <button className="nav-button right" onClick={handleNext}>
            ▶
          </button>
        )}
      </div>
    </div>
  );
};

export default ParksNearYou;
