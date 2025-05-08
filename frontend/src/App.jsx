import React, { useState } from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./components/Home"; //
import Login from "./components/Login";
import Signup from "./components/Signup";
import NavBar from "./components/NavBar";
import Slider from "./components/Slider";
import ContactForm from "./components/ContactForm";
import AboutUs from "./components/AboutUs";
import Admin from "./components/Admin";
import Cart from "./components/Cart";
import MyOrders from "./components/MyOrders";
import PaymentPage from "./components/PaymentPage";
import OrderSuccessPage from "./components/OrderSuccessPage";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin";

  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <>
      {!isAdminRoute && <NavBar user={user} onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Slider />} />
        <Route path="/slider" element={<Slider />} />

        <Route path="/home" element={<Home />} />

        <Route path="/contactus" element={<ContactForm />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        {!user && <Route path="/cart" element={<Login />} />}
        {user && <Route path="/cart" element={<Cart />} />}
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
      </Routes>
    </>
  );
}

export default App;
