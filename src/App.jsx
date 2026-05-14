import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Home from "./pages/Home.jsx";
import CartPage from "./pages/CartPage.jsx";
import Orders from "./pages/Orders.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Payment from "./pages/Payment.jsx";
import Profile from "./pages/Profile.jsx";
import Header from "./components/Header.jsx";
import { ToastProvider } from "./components/Toast.jsx";
import { LangProvider } from "./components/LangContext.jsx";
import API from "./config.js";
import "./styles.css";

// ✅ Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(() => console.log("SW registered ✅"))
      .catch(err => console.log("SW error:", err));
  });
}

export default function App() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // ✅ PWA install prompt
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstall(true);
    });
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setShowInstall(false);
  }

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setProducts([]); setLoading(false); });
  }, []);

  function addToCart(product) {
    const exist = cart.find(item => item._id === product._id);
    if (exist) {
      setCart(cart.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  }

  function increase(id) {
    setCart(cart.map(item => item._id === id ? { ...item, qty: item.qty + 1 } : item));
  }

  function decrease(id) {
    setCart(cart.map(item => item._id === id ? { ...item, qty: item.qty - 1 } : item).filter(item => item.qty > 0));
  }

  return (
    <LangProvider>
      <ToastProvider>
        <div>
          <Header
            cartCount={cart.reduce((sum, i) => sum + i.qty, 0)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          {/* ✅ PWA Install Banner */}
          {showInstall && (
            <div style={{
              background: "#1a1a2e", color: "white", padding: "12px 24px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              fontSize: "14px"
            }}>
              <span>📱 Install ModernShop on your phone for a better experience!</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={handleInstall} style={{ background: "#e94560", padding: "8px 16px", borderRadius: "8px", margin: 0, fontSize: "13px" }}>
                  Install App
                </button>
                <button onClick={() => setShowInstall(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 16px", borderRadius: "8px", margin: 0, fontSize: "13px" }}>
                  Later
                </button>
              </div>
            </div>
          )}

          <Routes>
            <Route path="/" element={<Home products={products} addToCart={addToCart} loading={loading} />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} products={products} />} />
            <Route path="/cart" element={<CartPage cart={cart} increase={increase} decrease={decrease} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Payment cart={cart} setCart={setCart} /></ProtectedRoute>} />
          </Routes>
        </div>
      </ToastProvider>
    </LangProvider>
  );
}
