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
  const [sortOrder, setSortOrder] = useState('desc'); // desc = descrescător (mai relevant mai întâi)

  // Calculează un scor de similitudine între un produs și termenul de căutare
  const calculateSimilarity = (food, query) => {
    const searchTerms = query.toLowerCase().split(' ');
    const foodText = `${food.name} ${food.description} ${food.category} ${food.price}`.toLowerCase();
    
    let score = 0;
    searchTerms.forEach(term => {
      if (foodText.includes(term)) {
        score += 1;
      }
    });
    
    return score / searchTerms.length;
  };

  // Folosim useEffect pentru a apela API-ul de fiecare dată când se schimbă searchTerm sau sortOrder
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setMessage('Nu există termen de căutare.');
        return;
      }

      try {
        console.log("Căutăm pentru:", searchTerm, "Ordonare:", sortOrder);
        const response = await axios.get(`http://localhost:4000/api/food/search?q=${searchTerm}&sortOrder=${sortOrder}`);

        console.log("Răspunsul de la API:", response.data);

        if (response.data.success) {
          // Adăugăm un scor de similitudine pentru sortare locală dacă este necesar
          const resultsWithSimilarity = response.data.data.map(food => ({
            ...food,
            similarity: calculateSimilarity(food, searchTerm)
          }));
          setResults(resultsWithSimilarity);
          setMessage('');
        } else {
          setMessage(response.data.message || 'Nu au fost găsite produse.');
          setResults([]);
        }
      } catch (error) {
        console.error("Eroare la căutare:", error);
        setMessage("Eroare nu exista produse.");
        setResults([]);
      }
    };

    fetchSearchResults();
  }, [searchTerm, sortOrder]);

  // Funcție pentru a schimba ordinea de sortare
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h2>Rezultate pentru: "{searchTerm}"</h2>
        
        {results.length > 0 && (
          <div className="sort-controls">
            <span>Sortare după relevanță:</span>
            <button onClick={toggleSortOrder} className="sort-order-button">
              {sortOrder === 'asc' ? 'Crescător ↑' : 'Descrescător ↓'}
            </button>
          </div>
        )}
      </div>

      {message && <p className="message">{message}</p>}

      <div className="search-results-grid">
        {results.map((food) => (
          <FoodItem
            key={food._id}
            id={food._id}
            name={food.name}
            description={food.description}
            price={food.price}
            image={food.image}
            isVegan={food.isVegan}
            isVegetarian={food.isVegetarian}
            isGlutenFree={food.isGlutenFree}
            preparationTime={food.preparationTime}
            calories={food.calories}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
