import React, { useState, useEffect } from 'react';
import './SearchResults.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import FoodItem from '../../components/FoodItem/FoodItem';

const SearchResults = () => {
  const location = useLocation();
  const { searchTerm } = location.state || { searchTerm: '' };
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (searchTerm) {
      axios.get(`/api/food/search?q=${searchTerm}`)
        .then(response => {
          if (response.data.success) {
            setResults(response.data.data);
          } else {
            setMessage(response.data.message || 'Nu au fost găsite produse.');
            setResults([]);
          }
        })
        .catch(error => {
          console.error("Eroare la căutare:", error);
          setMessage("Eroare de conexiune.");
          setResults([]);
        });
    }
  }, [searchTerm]);

  return (
    <div className='food-display' id='search-results'>
        <h2>Rezultate pentru: "{searchTerm}"</h2>
        {message && <p className="message">{message}</p>}
        <div className="food-display-list">
            {results.length > 0 ? (
              results.map(item => (
                <FoodItem key={item._id} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
              ))
            ) : (
              <p className="no-results">{message || "Nu au fost găsite produse."}</p>
            )}
        </div>
    </div>
  );
};

export default SearchResults;