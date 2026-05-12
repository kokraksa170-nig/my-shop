import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import CartPage from "./pages/CartPage.jsx";
import Orders from "./pages/Orders.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Header from "./components/Header.jsx";
import Checkout from "./pages/Checkout.jsx";
import { ToastProvider } from "./components/Toast.jsx";
import API from "./config.js";
import "./styles.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function addToCart(product) {
    const exist = cart.find(item => item._id === product._id);
    if (exist) {
      setCart(cart.map(item =>
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  }

  function increase(id) {
    setCart(cart.map(item =>
      item._id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  }

  function decrease(id) {
    setCart(
      cart.map(item =>
        item._id === id ? { ...item, qty: item.qty - 1 } : item
      ).filter(item => item.qty > 0)
    );
  }

  return (
    <ToastProvider>
      <div>
        <Header cartCount={cart.reduce((sum, i) => sum + i.qty, 0)} />
        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} loading={loading} />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} increase={increase} decrease={decrease} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout cart={cart} setCart={setCart} /></ProtectedRoute>} />
        </Routes>
      </div>
    </ToastProvider>
  );
}