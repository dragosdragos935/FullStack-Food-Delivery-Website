import React, { useState, useEffect } from 'react';
import './SearchResults.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import FoodItem from '../../components/FoodItem/FoodItem';

const SearchResults = () => {
  const location = useLocation();
  const { searchTerm } = location.state || { searchTerm: '' };  // Extragem searchTerm din URL
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  // Folosim useEffect pentru a apela API-ul de fiecare dată când se schimbă searchTerm
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setMessage('Nu există termen de căutare.');
        return;
      }

      try {
        console.log("Căutăm pentru:", searchTerm); // Verifică termenul de căutare
        const response = await axios.get(`http://localhost:4000/api/food/search?q=${searchTerm}`);

        console.log("Răspunsul de la API:", response.data); // Afișăm răspunsul în consolă
       

        if (response.data.success) {
          setResults(response.data.data); // Setăm rezultatele primite
          setMessage('');  // Resetăm mesajul
        } else {
          setMessage(response.data.message || 'Nu au fost găsite produse.');
          setResults([]); // Nu au fost găsite produse
        }
      } catch (error) {
        console.error("Eroare la căutare:", error);
        setMessage("Eroare nu exista produse.");
        setResults([]); // În caz de eroare
      }
    };

    fetchSearchResults();  // Apelăm funcția când componenta se montează sau searchTerm se schimbă
  }, [searchTerm]); // Trigger la schimbarea searchTerm

  return (
    <div className="food-display" id="search-results">
      <h2>Rezultate pentru: "{searchTerm}"</h2>
      {message && <p className="message">{message}</p>}  {/* Dacă există mesaj, îl afișăm */}
      <div className="food-display-list">
        {results.length > 0 ? (
          results.map(item => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p className="no-results">{message || "Nu au fost găsite produse."}</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
