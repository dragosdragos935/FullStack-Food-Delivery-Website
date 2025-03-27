import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Navbar = ({ setShowLogin }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Căutare
  const [searchResults, setSearchResults] = useState([]); // Rezultatele căutării
  const [showSearchResults, setShowSearchResults] = useState(false); // Dacă se afișează rezultatele
  const [debounceTimeout, setDebounceTimeout] = useState(null); // Timeout pentru căutare
  const navigate = useNavigate();

  // UseEffect pentru a implementa debounce și a trimite cererea la server
  useEffect(() => {
    if (searchTerm.length > 1) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout); // Șterge timeout-ul anterior
      }
      const timeout = setTimeout(() => {
        fetchSuggestions();
      }, 500); // După 500ms de la ultima tastare trimite cererea
      setDebounceTimeout(timeout);
    } else {
      setShowSearchResults(false); // Dacă termenul de căutare e gol, ascunde sugestiile
    }
  }, [searchTerm]); // Se va reactiva la schimbarea searchTerm

  // Funcția care face cererea către backend pentru sugestii
  const fetchSuggestions = async () => {
    try {
      console.log("Căutăm sugestii pentru:", searchTerm);
      const response = await axios.get(`http://localhost:4000/api/food/autocomplete?q=${searchTerm}`);
      console.log("Sugestii primite:", response.data); // Vezi ce primești de la API
  
      if (response.data?.success) {
        setSearchResults(response.data.data || []);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error("Eroare la căutarea sugestiilor:", error);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };
  

  // Handle search și redirecționare către pagina de rezultate
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/search-results', {
        state: { searchTerm }
      });
      setSearchTerm(""); // Resetăm căutarea
      setShowSearchResults(false); // Ascundem rezultatele
    }
  };

  // Handle click pe sugestie și redirecționare către pagina produsului
  const handleSuggestionClick = async (e) => {
    if (searchTerm.trim()) {
      navigate('/search-results', {
        state: { searchTerm }
      });
      setSearchTerm(""); // Resetăm căutarea
      setShowSearchResults(false); // Ascundem rezultatele
    }
  };

  // Ascunderea dropdown-ului după ce utilizatorul nu mai interacționează
  const handleBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200); // Ascunde dropdown-ul după ce utilizatorul nu mai interacționează
  };

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="logo" className="logo" /></Link>
      <div className="navbar-search-container">
        <form onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Caută produse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Actualizare searchTerm
              onFocus={() => setShowSearchResults(true)} // Afișează sugestiile când câmpul este focusat
              onBlur={handleBlur} // Ascunde sugestiile când câmpul pierde focusul
            />
            <button type="submit">
              <img src={assets.search_icon} alt="search" />
            </button>
          </div>
        </form>
        {showSearchResults && searchResults.length > 0 && (
          <div className="search-results-dropdown">
            {searchResults.map((food) => (
              <div
                key={food._id}
                className="search-result-item"
                onClick={() => handleSuggestionClick(food)}
                onMouseDown={(e) => e.preventDefault()} // Previne schimbarea focus-ului pe click
              >
                {food.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <ul className="navbar-menu">
        <Link to='/' className="active">Home</Link>
        <a href='#explore-menu'>Menu</a>
        <a href='#app-download'>Mobile App</a>
        <a href='#footer'>Contact Us</a>
      </ul>
      <div className="navbar-right">
        <Link to='/cart'>
          <img src={assets.basket_icon} alt="cart" />
        </Link>
      </div>
    </div>
  );
};
