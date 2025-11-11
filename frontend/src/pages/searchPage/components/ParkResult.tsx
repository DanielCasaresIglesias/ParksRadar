// frontend/src/components/ResultsColumn/ParkResult.tsx
import React, { useRef, useEffect, useState } from 'react';
import useFitText from '../../../hooks/useFitText';
import type { Park } from '../../../types/park';
import type { ViewMode } from './ViewDropdown';

type ParkResultProps = {
  park: Park;
  onSelect: (park: Park) => void;
  view?: ViewMode;
};

const levelMap: Record<Park['park_level'], string> = {
  Federal: 'National',
  State: 'State',
  Regional: 'Regional',
  County: 'County',
  'City/Municipal': 'City',
  Tribal: 'Tribal',
  'Private with Public Access': 'Private',
  'Uknown/Other': 'Other',
};

const ParkResult: React.FC<ParkResultProps> = ({
  park,
  onSelect,
  view = 'detailed',
}) => {
  // ref for measuring container width
  const topRowRef = useRef<HTMLDivElement>(null);
  const [maxWidthPx, setMaxWidthPx] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!topRowRef.current) return;
      const total = topRowRef.current.clientWidth;
      const starArea = topRowRef.current.querySelector('.result-rating');
      const starW = starArea?.clientWidth ?? 0.2;
      setMaxWidthPx(total - starW - 8 /* gap */);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [view]);

  // fit-text parameters vary by view to make minimal more compact
  const fitOpts =
    view === 'minimal'
      ? { maxFontSizeRem: 1.0, minFontSizeRem: 0.6, maxWidthPx }
      : { maxFontSizeRem: 1.2, minFontSizeRem: 0.8, maxWidthPx };

  const { ref: titleRef, fontSizeRem } = useFitText(fitOpts);

  const levelLabel = levelMap[park.park_level] || park.park_level;
  const displayType = `${levelLabel} ${park.park_type}`;

  const isMinimal = view === 'minimal';

  return (
    <div
      className={`park-result ${isMinimal ? 'minimal' : 'detailed'}`}
      onClick={() => onSelect(park)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(park);
      }}
    >
      {!isMinimal && (
        <div className="result-image">
          <img src={park.park_photo_link} alt={park.park_name} />
        </div>
      )}

      <div className="result-content">
        <div className="top-row" ref={topRowRef}>
          <h2
            className="park-name"
            ref={titleRef}
            style={{
              fontSize: `${fontSizeRem}rem`,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: 0,
            }}
            title={park.park_name}
          >
            {park.park_name}
          </h2>

          <div className="result-rating" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="star">
                {i < Math.round(park.park_average_rating) ? '★' : '☆'}
              </span>
            ))}
          </div>
        </div>

        <div className="bottom-row">
          {/* Minimal view: only show type under name */}
          <p className="park-type">{displayType}</p>

          {!isMinimal && (
            <>
              <p className="park-state">{park.park_state}</p>
              <p className="park-region">{park.park_region}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkResult;
