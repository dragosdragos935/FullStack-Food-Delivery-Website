import React, { useState } from 'react'
import { Navbar } from './components/Navbar/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Cart from './pages/Cart/Cart'
import Home from './pages/Home/home'
import Footer from './components/Footer/Footer'
import Loginpopup from './components/LoginPopup/Loginpopup'
import Verify from './pages/Verify/Verify'
import SearchResults from './pages/SearchResults/SearchResults'
import FoodDetails from './pages/FoodDetails/FoodDetails'

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  
  return (
    <>
      {showLogin && <Loginpopup setShowLogin={setShowLogin}/>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={<Home/>} />
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/order' element={<PlaceOrder/>}/>
          <Route path='/verify' element={<Verify/>}/>
          <Route path="/search-results" element={<SearchResults />} />

          <Route path='/food/:id' element={<FoodDetails/>}/>
        </Routes>
      </div>
      <Footer/>
    </>
  )
}

export default App