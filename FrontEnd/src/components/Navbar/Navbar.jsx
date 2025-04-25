import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Navbar = ({ setShowLogin }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Search
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [showSearchResults, setShowSearchResults] = useState(false); // Whether to show results
  const [debounceTimeout, setDebounceTimeout] = useState(null); // Search timeout
  const navigate = useNavigate();

  // UseEffect to implement debounce and send request to server
  useEffect(() => {
    if (searchTerm.length > 1) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout); // Clear previous timeout
      }
      const timeout = setTimeout(() => {
        fetchSuggestions();
      }, 500); // After 500ms from last keystroke send request
      setDebounceTimeout(timeout);
    } else {
      setShowSearchResults(false); // If search term is empty, hide suggestions
    }
  }, [searchTerm]);

  // Function that makes request to backend for suggestions
  const fetchSuggestions = async () => {
    try {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      console.log("Searching suggestions for:", searchTerm);
      const response = await axios.get(`http://localhost:4000/api/food/autocomplete?q=${searchTerm}`);
      console.log("Suggestions received:", response.data);
  
      if (response.data?.success) {
        setSearchResults(response.data.data || []);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle search and redirect to results page
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/search-results', {
        state: { searchTerm }
      });
      setSearchTerm(""); // Reset search
      setShowSearchResults(false); // Hide results
    }
  };

  // Handle click on suggestion and redirect to product page
  const handleSuggestionClick = async (e) => {
    if (searchTerm.trim()) {
      navigate('/search-results', {
        state: { searchTerm }
      });
      setSearchTerm(""); // Reset search
      setShowSearchResults(false); // Hide results
    }
  };

  // Hide dropdown after user stops interacting
  const handleBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200); // Hide dropdown after user stops interacting
  };

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="logo" className="logo" /></Link>
      <div className="navbar-search-container">
        <form onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              onBlur={handleBlur}
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
                onClick={() => {
                  navigate(`/food/${food._id}`);
                  setSearchTerm("");
                  setShowSearchResults(false);
                }}
              >
                <img 
                  src={food.image.startsWith('http') ? food.image : `http://localhost:4000/uploads/${food.image}`} 
                  alt={food.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                  }}
                />
                <div className="search-result-info">
                  <h4>{food.name}</h4>
                  <p>{food.price} lei</p>
                </div>
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
        <Link to="/food-search" className="navbar-item">
          <img src={assets.selector_icon} alt="filter" />
          <span>Advanced Search</span>
        </Link>
        <div className="navbar-item" onClick={() => setShowLogin(true)}>
          <img src={assets.profile_icon} alt="profile" />
          <span>Profile</span>
        </div>
        <Link to="/cart" className="navbar-item">
          <img src={assets.basket_icon} alt="basket" />
          <span>Cart</span>
        </Link>
      </div>
    </div>
  );
};
