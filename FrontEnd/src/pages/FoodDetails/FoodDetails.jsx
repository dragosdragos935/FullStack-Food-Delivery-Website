import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './FoodDetails.css'
import { StoreContext } from '../../context/StoreContext'

const FoodDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart, cartItems, removeFromCart } = useContext(StoreContext)

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/food/${id}`)
        if (response.data.success) {
          // Procesăm datele pentru a ne asigura că toate câmpurile sunt disponibile
          const foodData = response.data.data;
          
          console.log("Date primite de la server înainte de procesare:", foodData);
          
          // Verificăm și procesăm câmpul ingrediente
          if (typeof foodData.ingredients === 'string') {
            foodData.ingredients = foodData.ingredients.split(',').map(item => item.trim());
          } else if (!Array.isArray(foodData.ingredients)) {
            foodData.ingredients = [];
          }
          
          // Verificăm și procesăm câmpul alergeni
          if (typeof foodData.allergens === 'string') {
            foodData.allergens = foodData.allergens.split(',').map(item => item.trim());
          } else if (!Array.isArray(foodData.allergens)) {
            foodData.allergens = [];
          }
          
          // Verificăm isVegan, isVegetarian, isGlutenFree
          foodData.isVegan = foodData.isVegan || false;
          foodData.isVegetarian = foodData.isVegetarian || false;
          foodData.isGlutenFree = foodData.isGlutenFree || false;
          
          // Verificăm timpul de preparare
          foodData.preparationTime = foodData.preparationTime || 0;
          
          // Verificăm caloriile
          foodData.calories = foodData.calories || 0;
          
          // Ne asigurăm că avem un obiect nutritionFacts complet
          if (!foodData.nutritionFacts) {
            foodData.nutritionFacts = {
              protein: foodData.protein || 0,
              carbs: foodData.carbs || 0,
              fat: foodData.fat || 0,
              fiber: foodData.fiber || 0
            };
          } else {
            // Asigurăm că toate proprietățile sunt definite
            foodData.nutritionFacts.protein = foodData.nutritionFacts.protein || 0;
            foodData.nutritionFacts.carbs = foodData.nutritionFacts.carbs || 0;
            foodData.nutritionFacts.fat = foodData.nutritionFacts.fat || 0;
            foodData.nutritionFacts.fiber = foodData.nutritionFacts.fiber || 0;
          }
          
          console.log("Date procesate în frontend:", foodData);
          
          setFood(foodData);
        } else {
          setError('Product not found')
        }
      } catch (err) {
        console.error('Error fetching food details:', err)
        setError(err.response?.data?.message || 'Error loading product')
      } finally {
        setLoading(false)
      }
    }

    fetchFoodDetails()
  }, [id])

  if (loading) return <div className='loading'>Loading...</div>
  if (error) return <div className='error'>Error: {error}</div>
  if (!food) return <div className='error'>Product not found</div>

  // Function to render rating stars
  const renderStars = (rating = 4) => {
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
    
    return (
      <div className="product-rating">
        {stars}
      </div>
    );
  };

  // Function to render dietary labels
  const renderDietaryLabels = () => {
    const labels = [];
    
    if (food.isVegan) {
      labels.push(<span key="vegan" className="diet-label vegan">Vegană</span>);
    }
    
    if (food.isVegetarian) {
      labels.push(<span key="vegetarian" className="diet-label vegetarian">Vegetariană</span>);
    }
    
    if (food.isGlutenFree) {
      labels.push(<span key="glutenFree" className="diet-label gluten-free">Fără Gluten</span>);
    }
    
    return labels.length > 0 ? (
      <div className="dietary-labels">{labels}</div>
    ) : null;
  };

  // Function to render spicy level
  const renderSpicyLevel = () => {
    if (!food.spicyLevel || food.spicyLevel === 0) return null;
    
    const peppers = [];
    for (let i = 0; i < food.spicyLevel; i++) {
      peppers.push(<span key={i} className="pepper">🌶️</span>);
    }
    
    return (
      <div className="spicy-level">
        <span className="spicy-label">Nivel de condimente: </span>
        {peppers}
      </div>
    );
  };

  return (
    <div className="product-details-container">
      <div className="product-card">
        <div className="product-image">
          <img 
            src={`http://localhost:4000/images/${food.image}`}
            alt={food.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
            }}
          />
          {renderDietaryLabels()}
        </div>
        
        <div className="product-info">
          <h1>{food.name}</h1>
          
          {renderStars()}
          
          <p className="product-description">{food.description}</p>
          
          <div className="product-meta">
            <p className="product-category">Categorie: {food.category}</p>
            {renderSpicyLevel()}
          </div>
          
          <p className="product-price">Preț: ${food.price}</p>
          
          {!cartItems[id] ? (
            <button className="add-to-cart-btn" onClick={() => addToCart(id)}>
              Adaugă în coș
            </button>
          ) : (
            <div className="cart-controls">
              <button className="cart-btn minus" onClick={() => removeFromCart(id)}>-</button>
              <span className="cart-quantity">{cartItems[id]}</span>
              <button className="cart-btn plus" onClick={() => addToCart(id)}>+</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Specifications Section */}
      <div className="product-specifications">
        <h2>Specificații produs</h2>
        
        <div className="specifications-grid">
          {/* Nutrition Facts */}
          <div className="spec-card nutrition-card">
            <h3>Valori nutriționale</h3>
            <div className="nutrition-grid">
              {food.calories > 0 && (
                <div className="nutrition-item">
                  <span className="nutrition-value">{food.calories}</span>
                  <span className="nutrition-label">Calorii</span>
                </div>
              )}
              
              {food.nutritionFacts && food.nutritionFacts.protein > 0 && (
                <div className="nutrition-item">
                  <span className="nutrition-value">{food.nutritionFacts.protein}g</span>
                  <span className="nutrition-label">Proteine</span>
                </div>
              )}
              
              {food.nutritionFacts && food.nutritionFacts.carbs > 0 && (
                <div className="nutrition-item">
                  <span className="nutrition-value">{food.nutritionFacts.carbs}g</span>
                  <span className="nutrition-label">Carbohidrați</span>
                </div>
              )}
              
              {food.nutritionFacts && food.nutritionFacts.fat > 0 && (
                <div className="nutrition-item">
                  <span className="nutrition-value">{food.nutritionFacts.fat}g</span>
                  <span className="nutrition-label">Grăsimi</span>
                </div>
              )}
              
              {food.nutritionFacts && food.nutritionFacts.fiber > 0 && (
                <div className="nutrition-item">
                  <span className="nutrition-value">{food.nutritionFacts.fiber}g</span>
                  <span className="nutrition-label">Fibre</span>
                </div>
              )}
              
              {(!food.calories && (!food.nutritionFacts || 
                (food.nutritionFacts.protein <= 0 && 
                food.nutritionFacts.carbs <= 0 && 
                food.nutritionFacts.fat <= 0 && 
                food.nutritionFacts.fiber <= 0))) && (
                <div className="nutrition-item no-data">
                  <span className="nutrition-label">Informații nutriționale indisponibile</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Ingredients */}
          <div className="spec-card">
            <h3>Ingrediente</h3>
            {food.ingredients && food.ingredients.length > 0 ? (
              <ul className="ingredients-list">
                {food.ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="no-data-message">Informații despre ingrediente indisponibile</p>
            )}
          </div>
          
          {/* Allergens */}
          <div className="spec-card">
            <h3>Alergeni</h3>
            {food.allergens && food.allergens.length > 0 ? (
              <div className="allergens-container">
                {food.allergens.map((allergen, index) => (
                  <span key={index} className="allergen-badge">{allergen}</span>
                ))}
              </div>
            ) : (
              <p className="no-data-message">Informații despre alergeni indisponibile</p>
            )}
          </div>
          
          {/* Preparation Time */}
          <div className="spec-card">
            <h3>Timp de preparare</h3>
            {food.preparationTime > 0 ? (
              <div className="prep-time">
                <span className="prep-time-value">{food.preparationTime}</span>
                <span className="prep-time-unit"> minute</span>
              </div>
            ) : (
              <p className="no-data-message">Informații despre timpul de preparare indisponibile</p>
            )}
          </div>
          
          {/* Dietary Information */}
          <div className="spec-card">
            <h3>Informații dietetice</h3>
            {(food.isVegan || food.isVegetarian || food.isGlutenFree) ? (
              <div className="dietary-container">
                {food.isVegan && <span className="dietary-badge vegan">Vegană</span>}
                {food.isVegetarian && <span className="dietary-badge vegetarian">Vegetariană</span>}
                {food.isGlutenFree && <span className="dietary-badge gluten-free">Fără Gluten</span>}
              </div>
            ) : (
              <p className="no-data-message">Informații dietetice indisponibile</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodDetails