import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

export const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home")
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const navigate = useNavigate()
  const {food_list} =useContext(StoreContext)

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        console.log("Searching for:", searchTerm); // Debug log
        const response = await axios.get(`/api/food/search`, {
          params: { q: searchTerm }
        });
        
        
        
        if (response.data.success) {
          navigate('/search-results', { 
            state: { 
              results: response.data.data,
              searchTerm,
              count: response.data.count
            }
          });
        } else {
          console.warn("Search failed:", response.data.message);
          navigate('/search-results', { 
            state: { 
              results: [],
              searchTerm,
              message: response.data.message
            }
          });
        }
      } catch (error) {
        console.error("Search error:", error);
        navigate('/search-results', {
          state: {
            results: [],
            searchTerm,
            message: "Eroare de conexiune"
          }
        });
      } finally {
        setSearchTerm("");
        setShowSearchResults(false);
      }
    }
  };

  const fetchSuggestions = async () => {
    if (searchTerm.length > 1) {
      try {
        const response = await axios.get(`/api/food/autocomplete?q=${searchTerm}`)
        setSearchResults(response.data?.data || [])
        setShowSearchResults(true)
      } catch (error) {
        console.error("Autocomplete error:", error)
        setSearchResults([])
        setShowSearchResults(false)
      }
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) fetchSuggestions()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSuggestionClick = (food) => {
    navigate(`/food/${food._id}`)
    setSearchTerm("")
    setShowSearchResults(false)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate("/")
  }

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
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length > 1 && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />
            <button type="submit">
              <img src={assets.search_icon} alt="search" />
            </button>
          </div>
        </form>
        
        
        {showSearchResults && Array.isArray(searchResults) && searchResults.length > 0 && (
  <div className="search-results-dropdown">
    {searchResults.map((food_list) => (
      <div
        key={food_list._id}
        className="search-result-item"
        onClick={() => handleSuggestionClick(food_list)}
        onMouseDown={(e) => e.preventDefault()}
      >
        {food_list?.name || 'Unknown'}
      </div>
    ))}
  </div>
)}
      </div>

      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
      </ul>
      
      <div className="navbar-right">
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="cart" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="profile" />
            <ul className="nav-profile-dropdown">
              <li><img src={assets.bag_icon} alt="orders" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="logout" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}