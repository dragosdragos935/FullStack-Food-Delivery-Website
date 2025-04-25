import React, { useState } from 'react';
import axios from 'axios';
import './AdminFoodForm.css';

const AdminFoodForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    calories: '',
    ingredients: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    preparationTime: '',
    allergens: '',
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    spicyLevel: 0
  });
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Add image to FormData
      if (image) {
        formDataToSend.append('image', image);
      } else {
        setMessage({ text: 'Please select an image', type: 'error' });
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:4000/api/food/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage({ text: 'Product added successfully!', type: 'success' });
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          calories: '',
          ingredients: '',
          protein: '',
          carbs: '',
          fat: '',
          fiber: '',
          preparationTime: '',
          allergens: '',
          isVegan: false,
          isVegetarian: false,
          isGlutenFree: false,
          spicyLevel: 0
        });
        setImage(null);
      } else {
        setMessage({ text: response.data.message || 'Error adding product', type: 'error' });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error adding product', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Select Category', 'Pizza', 'Pasta', 'Burger', 'Salad', 
    'Dessert', 'Drink', 'Soup', 'Sandwich', 'Seafood', 'Other'
  ];

  return (
    <div className="admin-food-form-container">
      <h2 className="form-title">Add New Food Item</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form className="admin-food-form" onSubmit={handleSubmit}>
        <div className="form-sections">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((cat, index) => (
                    <option key={index} value={cat === 'Select Category' ? '' : cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                required
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Nutrition Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="calories">Calories</label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="preparationTime">Preparation Time (min)</label>
                <input
                  type="number"
                  id="preparationTime"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
            
            <div className="form-row nutrition-row">
              <div className="form-group">
                <label htmlFor="protein">Protein (g)</label>
                <input
                  type="number"
                  id="protein"
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="carbs">Carbs (g)</label>
                <input
                  type="number"
                  id="carbs"
                  name="carbs"
                  value={formData.carbs}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fat">Fat (g)</label>
                <input
                  type="number"
                  id="fat"
                  name="fat"
                  value={formData.fat}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fiber">Fiber (g)</label>
                <input
                  type="number"
                  id="fiber"
                  name="fiber"
                  value={formData.fiber}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="ingredients">Ingredients (comma-separated)</label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="e.g. Tomato, Cheese, Basil"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="allergens">Allergens (comma-separated)</label>
              <textarea
                id="allergens"
                name="allergens"
                value={formData.allergens}
                onChange={handleChange}
                placeholder="e.g. Gluten, Dairy, Nuts"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Dietary Information</h3>
            
            <div className="dietary-options">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="isVegan"
                  name="isVegan"
                  checked={formData.isVegan}
                  onChange={handleChange}
                />
                <label htmlFor="isVegan">Vegan</label>
              </div>
              
              <div className="form-check">
                <input
                  type="checkbox"
                  id="isVegetarian"
                  name="isVegetarian"
                  checked={formData.isVegetarian}
                  onChange={handleChange}
                />
                <label htmlFor="isVegetarian">Vegetarian</label>
              </div>
              
              <div className="form-check">
                <input
                  type="checkbox"
                  id="isGlutenFree"
                  name="isGlutenFree"
                  checked={formData.isGlutenFree}
                  onChange={handleChange}
                />
                <label htmlFor="isGlutenFree">Gluten Free</label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="spicyLevel">Spicy Level</label>
              <div className="spicy-level-container">
                <input
                  type="range"
                  id="spicyLevel"
                  name="spicyLevel"
                  min="0"
                  max="5"
                  value={formData.spicyLevel}
                  onChange={handleChange}
                />
                <span>{formData.spicyLevel} / 5</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Food Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminFoodForm; 