// frontend/src/pages/aboutPage/AboutPage.tsx
import React from 'react';
import FindAPark from './components/FindAPark';
import ParksNearYou from './components/ParksNearYou';
import './styles/homePage.css';

export type Park = {
  park_id: number;
  park_photo_link: string;
  park_name: string;
  park_type: string;
  park_average_rating: number;
};

const Home: React.FC = () => {
  const parks: Park[] = [
    {
      park_id: 1,
      park_photo_link: '../../images/park-example-photos/yosemite-example.png',
      park_name: 'Yosemite',
      park_type: 'National Park',
      park_average_rating: 4.8,
    },
    {
      park_id: 2,
      park_photo_link: '../../images/park-example-photos/yosemite-example.png',
      park_name: 'Yellowstone',
      park_type: 'National Park',
      park_average_rating: 4.7,
    },
    {
      park_id: 3,
      park_photo_link: '../../images/park-example-photos/yosemite-example.png',
      park_name: 'Grand Canyon',
      park_type: 'National Park',
      park_average_rating: 4.9,
    },
    {
      park_id: 4,
      park_photo_link: '../../images/park-example-photos/yosemite-example.png',
      park_name: 'Zion',
      park_type: 'National Park',
      park_average_rating: 4.6,
    },
    {
      park_id: 5,
      park_photo_link: '../../images/park-example-photos/yosemite-example.png',
      park_name: 'Great Smoky Mountains',
      park_type: 'National Park',
      park_average_rating: 4.5,
    },
    {
      park_id: 6,
      park_photo_link: '../../images/park-example-photos/yosemite-example.png',
      park_name: 'Rocky Mountain',
      park_type: 'National Park',
      park_average_rating: 4.7,
    },
    {
      park_id: 7,
      park_photo_link: '../../images/park-example-photos/yosemite-example.png',
      park_name: 'Everglades',
      park_type: 'National Park',
      park_average_rating: 4.4,
    },
  ];

  return (
    <div>
      <img
        src="/images/Homepage-Image.jpg"
        alt="Yosemite valley"
        className="image"
      />
      <div className="park-search">
        <FindAPark />
      </div>
      <ParksNearYou location="San Luis Obispo" parks={parks} />
      <p>{/* Placeholder text block was removed for clarity */}</p>
    </div>
  );
};

export default Home;
