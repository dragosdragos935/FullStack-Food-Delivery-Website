import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './FoodDetails.css'

const FoodDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axios.get(`/api/food/${id}`)
        if (response.data.success) {
          setFood(response.data.data)
        } else {
          setError('Produsul nu a fost găsit')
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Eroare la încărcarea produsului')
      } finally {
        setLoading(false)
      }
    }

    fetchFoodDetails()
  }, [id])

  if (loading) return <div className='loading'>Se încarcă...</div>
  if (error) return <div className='error'>Eroare: {error}</div>

  return (
    <div className='food-details'>
      <img src={`/uploads/${food.image}`} alt={food.name} />
      <div className='details-info'>
        <h1>{food.name}</h1>
        <p className='description'>{food.description}</p>
        <p className='category'>Categorie: {food.category}</p>
        <p className='price'>Preț: {food.price} lei</p>
        <button 
          className='add-to-cart'
          onClick={() => navigate('/cart')}
        >
          Adaugă în coș
        </button>
      </div>
    </div>
  )
}

export default FoodDetails