import React, { useEffect, useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = ({ url }) => {

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    calories: 0,
    ingredients: "",
    allergens: "",
    prepTime: 0,
    dietaryInfo: "",
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    spicyLevel: 0
  });

  // Handler pentru schimbarea valorilor din formular
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;
    
    setData(data => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validarea formularului
    if (!data.name || !data.description || !data.price || !image) {
      toast.error("Please fill in all fields and upload an image.");
      return;
    }

    // Crearea unui obiect FormData pentru a trimite datele
    const formData = new FormData();
    
    // Adăugarea datelor de bază
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);
    
    // Adăugarea datelor nutriționale
    formData.append("calories", Number(data.calories));
    formData.append("protein", Number(data.protein));
    formData.append("carbs", Number(data.carbs));
    formData.append("fat", Number(data.fat));
    formData.append("fiber", Number(data.fiber));
    
    // Adăugarea ingredientelor și alergenilor
    formData.append("ingredients", data.ingredients);
    formData.append("allergens", data.allergens);
    
    // Adăugarea informațiilor dietetice
    formData.append("isVegan", data.isVegan);
    formData.append("isVegetarian", data.isVegetarian);
    formData.append("isGlutenFree", data.isGlutenFree);
    formData.append("dietaryInfo", data.dietaryInfo);
    
    // Adăugarea timpului de preparare și nivelului de condimente
    formData.append("prepTime", Number(data.prepTime));
    formData.append("spicyLevel", Number(data.spicyLevel));

    try {
      // Trimiterea cererii către server
      const response = await axios.post(`${url}/api/food/add`, formData);
      
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
          calories: 0,
          ingredients: "",
          allergens: "",
          prepTime: 0,
          dietaryInfo: "",
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          isVegan: false,
          isVegetarian: false,
          isGlutenFree: false,
          spicyLevel: 0
        });
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while adding the product.");
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Product Preview" />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name='name'
            placeholder='Type here'
            required
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder='Write content here'
            required
          ></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              onChange={onChangeHandler}
              name="category"
              value={data.category}
              required
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name='price'
              placeholder='$20'
              required
            />
          </div>
        </div>

        <h3 className="specifications-heading">Specificații produs</h3>

        <div className="nutritional-section">
          <h4>Valori nutriționale</h4>
          <div className="nutritional-values flex-row">
            <div className="nutritional-item flex-col">
              <p>Calorii</p>
              <input
                onChange={onChangeHandler}
                value={data.calories}
                type="number"
                name="calories"
                min="0"
              />
            </div>
            
            <div className="nutritional-item flex-col">
              <p>Proteine (g)</p>
              <input
                onChange={onChangeHandler}
                value={data.protein}
                type="number"
                name="protein"
                min="0"
              />
            </div>
            
            <div className="nutritional-item flex-col">
              <p>Carbohidrați (g)</p>
              <input
                onChange={onChangeHandler}
                value={data.carbs}
                type="number"
                name="carbs"
                min="0"
              />
            </div>
            
            <div className="nutritional-item flex-col">
              <p>Grăsimi (g)</p>
              <input
                onChange={onChangeHandler}
                value={data.fat}
                type="number"
                name="fat"
                min="0"
              />
            </div>
            
            <div className="nutritional-item flex-col">
              <p>Fibre (g)</p>
              <input
                onChange={onChangeHandler}
                value={data.fiber}
                type="number"
                name="fiber"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="ingredients-allergens flex-row">
          <div className="ingredients-section flex-col">
            <p>Ingrediente (separate prin virgulă)</p>
            <textarea
              onChange={onChangeHandler}
              value={data.ingredients}
              name="ingredients"
              rows="4"
              placeholder="Exemplu: Roșii, Brânză, Busuioc"
            ></textarea>
          </div>
          
          <div className="allergens-section flex-col">
            <p>Alergeni (separați prin virgulă)</p>
            <textarea
              onChange={onChangeHandler}
              value={data.allergens}
              name="allergens"
              rows="4"
              placeholder="Exemplu: Gluten, Lactate, Nuci"
            ></textarea>
          </div>
        </div>

        <div className="prep-diet-section flex-row">
          <div className="prep-time flex-col">
            <p>Timp de preparare (minute)</p>
            <input
              onChange={onChangeHandler}
              value={data.prepTime}
              type="number"
              name="prepTime"
              min="0"
            />
            <small className="help-text">Important: Acest câmp este necesar pentru afișarea corectă a timpului de preparare.</small>
          </div>
          
          <div className="dietary-info flex-col">
            <p>Informații dietetice (separate prin virgulă)</p>
            <textarea
              onChange={onChangeHandler}
              value={data.dietaryInfo}
              name="dietaryInfo"
              rows="2"
              placeholder="Exemplu: Low Carb, High Protein, Keto-friendly"
            ></textarea>
          </div>
        </div>

        <div className="dietary-labels flex-col">
          <h4>Etichete dietetice</h4>
          <div className="dietary-checkboxes flex-row">
            <div className="dietary-checkbox">
              <input
                type="checkbox"
                id="isVegan"
                name="isVegan"
                checked={data.isVegan}
                onChange={onChangeHandler}
              />
              <label htmlFor="isVegan">Vegană</label>
            </div>
            
            <div className="dietary-checkbox">
              <input
                type="checkbox"
                id="isVegetarian"
                name="isVegetarian"
                checked={data.isVegetarian}
                onChange={onChangeHandler}
              />
              <label htmlFor="isVegetarian">Vegetariană</label>
            </div>
            
            <div className="dietary-checkbox">
              <input
                type="checkbox"
                id="isGlutenFree"
                name="isGlutenFree"
                checked={data.isGlutenFree}
                onChange={onChangeHandler}
              />
              <label htmlFor="isGlutenFree">Fără Gluten</label>
            </div>
          </div>
        </div>

        <div className="spicy-level flex-col">
          <p>Nivel de condimente (0-5)</p>
          <input
            type="range"
            min="0"
            max="5"
            name="spicyLevel"
            value={data.spicyLevel}
            onChange={onChangeHandler}
          />
          <div className="spicy-display">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < data.spicyLevel ? "pepper active" : "pepper"}>
                🌶️
              </span>
            ))}
          </div>
        </div>

        <button type='submit' className='add-btn'>Add</button>
      </form>

      {/* Include ToastContainer for notifications */}
      <ToastContainer />
    </div>
  );
};

export default Add;
