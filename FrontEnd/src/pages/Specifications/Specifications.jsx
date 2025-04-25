import React from 'react';
import SpecificationsSearch from '../../components/SpecificationsSearch';
import './Specifications.css';

const Specifications = () => {
  return (
    <div className="specifications-page">
      <h1>Specifications Search</h1>
      <p className="page-description">
        Search through product specifications and sort results by relevance.
      </p>
      <SpecificationsSearch />
    </div>
  );
};

export default Specifications; 