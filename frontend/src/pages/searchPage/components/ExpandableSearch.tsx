// ExpandableSearch.tsx
import React, { useState, useRef } from "react";
import "../styles/expandableSearch.css";

const ExpandableSearch: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="expandable-search-container">
      <div className="expandable-search expanded">
        <div className="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path d="M10,18 C14.418278,18 18,14.418278 18,10 C18,5.581722 14.418278,2 10,2 C5.581722,2 2,5.581722 2,10 C2,14.418278 5.581722,18 10,18 Z M10,20 C4.4771525,20 0,15.5228475 0,10 C0,4.4771525 4.4771525,0 10,0 C15.5228475,0 20,4.4771525 20,10 C20,15.5228475 15.5228475,20 10,20 Z" fill="currentColor"/>
            <path d="M22.707,21.293 L17.314,15.9 C17.106,15.693 16.789,15.585 16.471,15.585 C16.153,15.585 15.836,15.693 15.628,15.9 L14.214,17.314 C13.902,17.628 13.902,18.118 14.214,18.432 C14.526,18.744 15.016,18.744 15.33,18.432 L16.743,17.018 L22.707,21.293 Z" fill="currentColor"/>
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter park name"
        />
        {query && (
          <button className="clear-button" onClick={handleClear}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path d="M18.3,5.71a1,1,0,0,0-1.41,0L12,10.59,7.11,5.7A1,1,0,0,0,5.7,7.11L10.59,12l-4.89,4.89a1,1,0,1,0,1.41,1.41L12,13.41l4.89,4.89a1,1,0,0,0,1.41-1.41L13.41,12l4.89-4.89A1,1,0,0,0,18.3,5.71Z" fill="currentColor"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpandableSearch;