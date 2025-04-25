import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id,name,price,description,image,isVegan,isVegetarian,isGlutenFree,preparationTime,calories}) => {
    const {cartItems,addToCart,removeFromCart,url} = useContext(StoreContext);
    
    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={url+"/images/"+image} alt='' />
                {!cartItems[id]
                    ?<img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt=''/>
                    :<div className='food-item-counter'>
                        <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt=''/>
                        <p>{cartItems[id]}</p>
                        <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt=""/>
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt=''/>
                </div>
                <p className="food-item-desc">{description}</p>
                <div className="food-item-dietary-info">
                    {isVegan && <span className="dietary-badge vegan">Vegan</span>}
                    {isVegetarian && <span className="dietary-badge vegetarian">Vegetarian</span>}
                    {isGlutenFree && <span className="dietary-badge gluten-free">Fără Gluten</span>}
                </div>
                <div className="food-item-details">
                    <p className="preparation-time">⏱️ {preparationTime} min</p>
                    <p className="calories">🔥 {calories} kcal</p>
                </div>
                <p className="food-item-price">${price}</p>
            </div>
        </div>
    )
}

export default FoodItem;