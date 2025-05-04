import React, { useState } from 'react';
import './App.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './components/Home'; // 
import Login from './components/Login';
import Signup from './components/Signup';
import NavBar from './components/NavBar';
import Slider from './components/Slider';
import ContactForm from './components/ContactForm';
import AboutUs from './components/AboutUs';
import Admin from './components/Admin';
import Cart from './components/Cart';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/'); // Redirect to Slider on logout
  };

  return (
    <>
      {!isAdminRoute && <NavBar user={user} onLogout={handleLogout} />}

      <Routes>
        {/* Default landing route */}
        <Route path="/" element={<Slider />} />
        <Route path="/slider" element={<Slider />} />

        {/* Real Home page route */}
        <Route path="/home" element={<Home />} />

        {/* Other routes */}
        <Route path="/contactus" element={<ContactForm />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        {user && <Route path="/cart" element={<Cart />} />}
      </Routes>
    </>
  );
}

export default App;
