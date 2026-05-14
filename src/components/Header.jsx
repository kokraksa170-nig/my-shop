import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "./LangContext.jsx";
import { usePushNotifications } from "../hooks/usePushNotifications.js";

export default function Header({ cartCount = 0, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang();
  const { permission, supported, requestPermission } = usePushNotifications();
  const isLoggedIn = !!localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [menuOpen, setMenuOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("cart");
    navigate("/login");
    setMenuOpen(false);
  }

  function closeMenu() { setMenuOpen(false); }

  async function handleNotificationToggle() {
    if (permission === "granted") return;
    await requestPermission();
  }

  return (
    <header className="header">
      <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <span style={{ color: "#e94560" }}>Modern</span>Shop
      </h1>

      {/* DESKTOP NAV */}
      <nav className="desktop-nav">
        <Link to="/">{t.home}</Link>
        <Link to="/cart">🛒 {t.cart} {cartCount > 0 && <span className="cart-badge">({cartCount})</span>}</Link>

        {isLoggedIn ? (
          <>
            <Link to="/orders">{t.myOrders}</Link>
            <Link to="/profile">{t.profile}</Link>
            {isAdmin && <Link to="/admin">{t.admin}</Link>}
            <button onClick={logout}>{t.logout}</button>
          </>
        ) : (
          <>
            <Link to="/login">{t.login}</Link>
            <Link to="/register">{t.register}</Link>
          </>
        )}

        {/* ✅ Push notification bell */}
        {supported && isLoggedIn && (
          <button
            onClick={handleNotificationToggle}
            title={permission === "granted" ? "Notifications enabled" : "Enable notifications"}
            style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.3)", fontSize: "18px", padding: "6px 10px", margin: 0 }}
          >
            {permission === "granted" ? "🔔" : "🔕"}
          </button>
        )}

        {/* ✅ Language toggle */}
        <button
          onClick={toggleLang}
          style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.3)", fontSize: "13px", padding: "6px 10px", fontWeight: "700", margin: 0 }}
        >
          {lang === "en" ? "🇰🇭 KM" : "🇺🇸 EN"}
        </button>

        {/* Dark mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.3)", fontSize: "18px", padding: "6px 10px", margin: 0 }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </nav>

      {/* MOBILE RIGHT */}
      <div className="mobile-nav-right">
        <button onClick={toggleLang} style={{ background: "transparent", border: "none", fontSize: "13px", fontWeight: "700", padding: "6px", marginTop: 0, color: "white" }}>
          {lang === "en" ? "🇰🇭" : "🇺🇸"}
        </button>
        <button onClick={() => setDarkMode(!darkMode)} style={{ background: "transparent", border: "none", fontSize: "18px", padding: "6px", marginTop: 0 }}>
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={closeMenu}>🏠 {t.home}</Link>
          <Link to="/cart" onClick={closeMenu}>🛒 {t.cart} {cartCount > 0 && `(${cartCount})`}</Link>
          {isLoggedIn ? (
            <>
              <Link to="/orders" onClick={closeMenu}>📦 {t.myOrders}</Link>
              <Link to="/profile" onClick={closeMenu}>👤 {t.profile}</Link>
              {isAdmin && <Link to="/admin" onClick={closeMenu}>⚙️ {t.admin}</Link>}
              {supported && (
                <button onClick={() => { handleNotificationToggle(); closeMenu(); }} style={{ textAlign: "left" }}>
                  {permission === "granted" ? "🔔 Notifications On" : "🔕 Enable Notifications"}
                </button>
              )}
              <button onClick={logout}>{t.logout}</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>{t.login}</Link>
              <Link to="/register" onClick={closeMenu}>{t.register}</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
