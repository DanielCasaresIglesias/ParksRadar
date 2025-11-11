// frontend/src/components/SearchButton.tsx
import React from 'react';
import './styles/searchButton.css';

type SearchButtonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'selected';
};

const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  type = 'button',
  variant = 'primary',
}) => {
  return (
    <button
      type={type}
      className={`search-button ${variant}`}
      onClick={onClick}
    >
      Search
    </button>
  );
};

export default SearchButton;
