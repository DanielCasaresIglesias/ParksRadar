// frontend/src/components/ResultsColumn.tsx
import React, { useState } from 'react';
import ResultsSearch from './ResultsSearch';
import '../styles/resultsColumn.css';
import { type Park } from '../../../types/park';
import ParkResult from './ParkResult';
import SortDropdown, { type SortField, type SortDirection } from './SortDropdown';
import ViewDropdown, { type ViewMode } from './ViewDropdown';

type ResultsColumnProps = {
  results: Park[];
  onParkSelect: (park: Park) => void;
  minimized: boolean;
  // optional: include user's resolved coords when distance filter is active
  userLocation?: { lat: number; lon: number } | null;
  loading?: boolean;
};

const ResultsColumn: React.FC<ResultsColumnProps> = ({
  results,
  onParkSelect,
  minimized,
  userLocation = null,
  loading = false,
}) => {
  // local sort state
  const [activeSort, setActiveSort] = useState<{ field: SortField | null; dir: SortDirection | null }>({
    field: null,
    dir: null,
  });

  // maintain the sorted list; default is original order
  const [sortedResults, setSortedResults] = useState<Park[]>(results);
  // search query state
  const [searchQuery, setSearchQuery] = useState<string>("");
  // view mode state: detailed is default
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');

  // if results prop changes (new search), reset sortedResults to match incoming results
  React.useEffect(() => {
    setSortedResults(results);
    setActiveSort({ field: null, dir: null });
  }, [results]);

  const handleApplySort = (field: SortField, dir: SortDirection | null, sorted: Park[]) => {
    setActiveSort({ field, dir });
    setSortedResults(sorted);
  };

  // 🧠 Filter by search query (case-insensitive)
  const filteredResults = sortedResults.filter(park =>
    park.park_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`results-column ${minimized ? 'minimized' : ''}`}>
      <div className="results-header">
        <div className="results-header-left">
          <SortDropdown
            results={results}
            userLocation={userLocation}
            active={activeSort}
            onApplySort={handleApplySort}
          />
          <ViewDropdown active={viewMode} onChange={setViewMode} />
        </div>
        <div className="results-header-right">
          <ResultsSearch query={searchQuery} onSearchChange={setSearchQuery} />
        </div>
      </div>

      <div className="results-list">
        {loading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredResults.length > 0 ? (
          filteredResults.map((park) => (
            <ParkResult
              key={park.park_id}
              park={park}
              onSelect={onParkSelect}
              view={viewMode}
            />
          ))
        ) : (
          <div className="no-results">No results found.</div>
        )}
      </div>


    </div>
  );
};

export default ResultsColumn;
