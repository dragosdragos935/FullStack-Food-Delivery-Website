import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FoodSpecificationsSearch.css';
import { useNavigate } from 'react-router-dom';

const FoodSpecificationsSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'relevance',
    sortOrder: 'desc',
    category: 'all',
    priceRange: {
      min: 0,
      max: 1000
    },
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    caloriesRange: {
      min: 0,
      max: 2000
    },
    nutritionRange: {
      protein: { min: 0, max: 100 },
      carbs: { min: 0, max: 100 },
      fat: { min: 0, max: 100 },
      fiber: { min: 0, max: 50 }
    },
    maxSpicyLevel: 5,
    ingredients: '',
    allergens: '',
    prepTimeMax: 120, // în minute
    showAdvancedFilters: false
  });

  const navigate = useNavigate();

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

  const handleSearch = async () => {
    if (!searchQuery.trim() && !filters.ingredients.trim() && !filters.allergens.trim() &&
        !filters.isVegan && !filters.isVegetarian && !filters.isGlutenFree) {
      setSearchResults([]);
      setShowFilters(false);
      return;
    }

    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      
      if (searchQuery.trim()) {
        params.append('q', searchQuery);
      }
      
      params.append('sortOrder', filters.sortOrder);
      
      if (filters.isVegan) {
        params.append('isVegan', 'true');
      }
      
      if (filters.isVegetarian) {
        params.append('isVegetarian', 'true');
      }
      
      if (filters.isGlutenFree) {
        params.append('isGlutenFree', 'true');
      }
      
      if (filters.caloriesRange.min > 0) {
        params.append('minCalories', filters.caloriesRange.min);
      }
      
      if (filters.caloriesRange.max < 2000) {
        params.append('maxCalories', filters.caloriesRange.max);
      }
      
      if (filters.maxSpicyLevel < 5) {
        params.append('maxSpicyLevel', filters.maxSpicyLevel);
      }
      
      if (filters.ingredients.trim()) {
        params.append('q', filters.ingredients);
      }
      
      if (filters.allergens.trim()) {
        params.append('q', filters.allergens);
      }

      const response = await axios.get(`http://localhost:4000/api/food/search?${params.toString()}`);
      if (response.data.success) {
        let results = response.data.data.map(food => ({
          ...food,
          similarity: calculateSimilarity(food, searchQuery || filters.ingredients || filters.allergens || '')
        }));
        
        // Apply category filter on client side
        if (filters.category !== 'all') {
          results = results.filter(food => food.category === filters.category);
        }
        
        // Filter by price range
        results = results.filter(food => 
          food.price >= filters.priceRange.min && 
          food.price <= filters.priceRange.max
        );
        
        // Filter by preparation time
        if (filters.prepTimeMax < 120) {
          results = results.filter(food => {
            const prepTime = food.prepTime || food.preparationTime || 0;
            return prepTime <= filters.prepTimeMax;
          });
        }
        
        // Filter by nutrition ranges
        results = results.filter(food => {
          const nutritionFacts = food.nutritionFacts || {
            protein: food.protein || 0,
            carbs: food.carbs || 0,
            fat: food.fat || 0,
            fiber: food.fiber || 0
          };
          
          return (
            nutritionFacts.protein >= filters.nutritionRange.protein.min &&
            nutritionFacts.protein <= filters.nutritionRange.protein.max &&
            nutritionFacts.carbs >= filters.nutritionRange.carbs.min &&
            nutritionFacts.carbs <= filters.nutritionRange.carbs.max &&
            nutritionFacts.fat >= filters.nutritionRange.fat.min &&
            nutritionFacts.fat <= filters.nutritionRange.fat.max &&
            nutritionFacts.fiber >= filters.nutritionRange.fiber.min &&
            nutritionFacts.fiber <= filters.nutritionRange.fiber.max
          );
        });

        // Sort results
        results.sort((a, b) => {
          if (filters.sortBy === 'relevance') {
            return filters.sortOrder === 'asc'
              ? a.similarity - b.similarity
              : b.similarity - a.similarity;
          } else if (filters.sortBy === 'name') {
            return filters.sortOrder === 'asc' 
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          } else if (filters.sortBy === 'price') {
            return filters.sortOrder === 'asc'
              ? a.price - b.price
              : b.price - a.price;
          } else if (filters.sortBy === 'category') {
            return filters.sortOrder === 'asc'
              ? a.category.localeCompare(b.category)
              : b.category.localeCompare(a.category);
          } else if (filters.sortBy === 'calories') {
            const aCalories = a.calories || 0;
            const bCalories = b.calories || 0;
            return filters.sortOrder === 'asc'
              ? aCalories - bCalories
              : bCalories - aCalories;
          } else if (filters.sortBy === 'prepTime') {
            const aPrepTime = a.prepTime || a.preparationTime || 0;
            const bPrepTime = b.prepTime || b.preparationTime || 0;
            return filters.sortOrder === 'asc'
              ? aPrepTime - bPrepTime
              : bPrepTime - aPrepTime;
          }
          return 0;
        });

        setSearchResults(results);
        setShowFilters(true);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching foods:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: parseFloat(value) || 0
      }
    }));
  };

  const handleCaloriesRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      caloriesRange: {
        ...prev.caloriesRange,
        [type]: parseInt(value) || 0
      }
    }));
  };
  
  const handleNutritionRangeChange = (nutrient, type, value) => {
    setFilters(prev => ({
      ...prev,
      nutritionRange: {
        ...prev.nutritionRange,
        [nutrient]: {
          ...prev.nutritionRange[nutrient],
          [type]: parseInt(value) || 0
        }
      }
    }));
  };

  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleAdvancedFilters = () => {
    setFilters(prev => ({
      ...prev,
      showAdvancedFilters: !prev.showAdvancedFilters
    }));
  };

  // Navigate to food details page
  const handleFoodClick = (foodId) => {
    navigate(`/food/${foodId}`);
  };

  // Add to cart without navigating
  const handleAddToCart = (e, food) => {
    e.stopPropagation(); // Prevent navigation when clicking the button
    console.log('Add to cart:', food.name);
    // Add your cart logic here
  };

  // Get unique categories
  const categories = ['all', ...new Set(searchResults.map(food => food.category))];

  useEffect(() => {
    if (showFilters) {
      handleSearch();
    }
  }, [filters]);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStar = '★';
    const emptyStar = '☆';
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star filled">{fullStar}</span>);
      } else {
        stars.push(<span key={i} className="star empty">{emptyStar}</span>);
      }
    }
    
    return stars;
  };

  return (
    <div className="food-specifications-search">
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Caută după nume, descriere sau categorie..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Caută
        </button>
      </div>

      <button 
        onClick={toggleAdvancedFilters} 
        className="toggle-filters-button"
      >
        {filters.showAdvancedFilters ? 'Ascunde filtrele avansate' : 'Arată filtrele avansate'}
      </button>

      {filters.showAdvancedFilters && (
        <div className="advanced-filters">
          <h3>Filtre avansate de căutare</h3>
          
          <div className="filters-row">
            <div className="filter-group">
              <label>Filtrează după ingrediente:</label>
              <input
                type="text"
                value={filters.ingredients}
                onChange={(e) => handleFilterChange('ingredients', e.target.value)}
                placeholder="Ex: roșii, brânză, ciuperci..."
                className="ingredients-input"
              />
            </div>
            
            <div className="filter-group">
              <label>Filtrează după alergeni:</label>
              <input
                type="text"
                value={filters.allergens}
                onChange={(e) => handleFilterChange('allergens', e.target.value)}
                placeholder="Ex: gluten, lactate, nuci..."
                className="allergens-input"
              />
            </div>
          </div>

          <div className="filters-row">
            <div className="filter-group checkbox-group">
              <label>Preferințe dietetice:</label>
              <div className="dietary-options">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="isVegan"
                    checked={filters.isVegan}
                    onChange={(e) => handleFilterChange('isVegan', e.target.checked)}
                  />
                  <label htmlFor="isVegan">Vegană</label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="isVegetarian"
                    checked={filters.isVegetarian}
                    onChange={(e) => handleFilterChange('isVegetarian', e.target.checked)}
                  />
                  <label htmlFor="isVegetarian">Vegetariană</label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="isGlutenFree"
                    checked={filters.isGlutenFree}
                    onChange={(e) => handleFilterChange('isGlutenFree', e.target.checked)}
                  />
                  <label htmlFor="isGlutenFree">Fără Gluten</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="filters-row">
            <div className="filter-group range-group">
              <label>Interval calorii:</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.caloriesRange.min}
                  onChange={(e) => handleCaloriesRangeChange('min', e.target.value)}
                  min="0"
                />
                <span>până la</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.caloriesRange.max}
                  onChange={(e) => handleCaloriesRangeChange('max', e.target.value)}
                  min="0"
                />
              </div>
            </div>
            
            <div className="filter-group range-group">
              <label>Timp de preparare maxim:</label>
              <div className="prep-time-slider">
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={filters.prepTimeMax}
                  onChange={(e) => handleFilterChange('prepTimeMax', parseInt(e.target.value))}
                />
                <span>{filters.prepTimeMax} minute</span>
              </div>
            </div>
          </div>
          
          <div className="filters-row">
            <div className="filter-group">
              <label>Nivel maxim de condimente:</label>
              <div className="spicy-level-container">
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={filters.maxSpicyLevel}
                  onChange={(e) => handleFilterChange('maxSpicyLevel', parseInt(e.target.value))}
                />
                <span>{filters.maxSpicyLevel} / 5</span>
                <div className="spicy-display">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < filters.maxSpicyLevel ? "pepper active" : "pepper"}>
                      🌶️
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="nutrition-filters">
            <h4>Filtrare după valori nutriționale (g):</h4>
            <div className="nutrition-filters-grid">
              <div className="nutrition-filter">
                <label>Proteine:</label>
                <div className="range-inputs small">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.nutritionRange.protein.min}
                    onChange={(e) => handleNutritionRangeChange('protein', 'min', e.target.value)}
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.nutritionRange.protein.max}
                    onChange={(e) => handleNutritionRangeChange('protein', 'max', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="nutrition-filter">
                <label>Carbohidrați:</label>
                <div className="range-inputs small">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.nutritionRange.carbs.min}
                    onChange={(e) => handleNutritionRangeChange('carbs', 'min', e.target.value)}
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.nutritionRange.carbs.max}
                    onChange={(e) => handleNutritionRangeChange('carbs', 'max', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="nutrition-filter">
                <label>Grăsimi:</label>
                <div className="range-inputs small">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.nutritionRange.fat.min}
                    onChange={(e) => handleNutritionRangeChange('fat', 'min', e.target.value)}
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.nutritionRange.fat.max}
                    onChange={(e) => handleNutritionRangeChange('fat', 'max', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="nutrition-filter">
                <label>Fibre:</label>
                <div className="range-inputs small">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.nutritionRange.fiber.min}
                    onChange={(e) => handleNutritionRangeChange('fiber', 'min', e.target.value)}
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.nutritionRange.fiber.max}
                    onChange={(e) => handleNutritionRangeChange('fiber', 'max', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}

      {searchQuery && !loading && (
        <h2 className="search-results-title">
          Rezultate pentru: "{searchQuery}"
        </h2>
      )}

      {showFilters && !loading && (
        <div className="filters-container">
          <div className="filter-group">
            <label>Sortează după:</label>
            <select 
              value={filters.sortBy} 
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="relevance">Relevanță</option>
              <option value="name">Nume</option>
              <option value="price">Preț</option>
              <option value="category">Categorie</option>
              <option value="calories">Calorii</option>
              <option value="prepTime">Timp de preparare</option>
            </select>
            <button onClick={toggleSortOrder} className="sort-order-button">
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          <div className="filter-group">
            <label>Categorie:</label>
            <select 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Toate' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Interval preț:</label>
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              placeholder="Min"
            />
            <span>până la</span>
            <input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              placeholder="Max"
            />
          </div>
        </div>
      )}

      <div className="food-cards-grid">
        {searchResults.length > 0 ? (
          searchResults.map((food) => (
            <div 
              key={food._id} 
              className="food-card"
              onClick={() => handleFoodClick(food._id)}
            >
              <div className="food-card-image-container">
                <img 
                  src={`http://localhost:4000/images/${food.image}`}
                  alt={food.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/250x250?text=No+Image';
                  }}
                />
                <button 
                  className="add-to-cart-btn"
                  onClick={(e) => handleAddToCart(e, food)}
                >+</button>
                
                {/* Dietary labels */}
                <div className="card-badges">
                  {food.isVegan && <span className="badge vegan">Vegană</span>}
                  {food.isVegetarian && <span className="badge vegetarian">Vegetariană</span>}
                  {food.isGlutenFree && <span className="badge gluten-free">Fără Gluten</span>}
                  {food.calories > 0 && (
                    <span className="badge calories">{food.calories} cal</span>
                  )}
                </div>
              </div>
              <div className="food-card-content">
                <div className="food-name-rating">
                  <h3>{food.name}</h3>
                  <div className="food-rating">
                    {renderStars(4)}
                  </div>
                </div>
                <p className="food-description">{food.description}</p>
                <p className="food-price">${food.price}</p>
              </div>
            </div>
          ))
        ) : searchQuery && !loading ? (
          <div className="no-results">Nu s-au găsit rezultate</div>
        ) : null}
      </div>
    </div>
  );
};

export default FoodSpecificationsSearch; 