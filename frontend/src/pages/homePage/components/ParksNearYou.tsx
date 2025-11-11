// frontend/src/pages/homePage/ParksNearYou.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParkCard from './ParkCard';
import '../styles/parksNearYou.css';
import type { Park } from '../HomePage';

interface ParksNearYouProps {
  location: string;
  parks: Park[];
}

const ParksNearYou: React.FC<ParksNearYouProps> = ({ location, parks }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1380);
  const navigate = useNavigate();
  const parksPerPage = 4;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1380);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalItems = parks.length + 1;
  const totalPages = Math.ceil(totalItems / parksPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = currentPage * parksPerPage;
  let currentParks: Park[] = [];
  let showMore = false;

  if (currentPage === totalPages - 1) {
    currentParks = parks.slice(startIndex);
    showMore = true;
  } else {
    currentParks = parks.slice(startIndex, startIndex + parksPerPage);
  }

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
                  imageSrc={
                    park.park_photo_link != null ? park.park_photo_link : ''
                  }
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
                  imageSrc={
                    park.park_photo_link != null ? park.park_photo_link : ''
                  }
                  parkName={park.park_name}
                  parkType={park.park_type}
                  rating={park.park_average_rating}
                />
              ))}
              {showMore && (
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
