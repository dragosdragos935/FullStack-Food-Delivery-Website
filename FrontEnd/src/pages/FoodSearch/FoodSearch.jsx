import React from 'react';
import FoodSpecificationsSearch from '../../components/FoodSpecificationsSearch';
import './FoodSearch.css';

const FoodSearch = () => {
  return (
    <div className="food-search-page">
      <h1>Căutare Mâncăruri</h1>
      <p className="page-description">
        Caută mâncăruri după specificații și sortează rezultatele după relevanță.
      </p>
      <FoodSpecificationsSearch />
    </div>
  );
};

export default FoodSearch; 