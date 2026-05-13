import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ cartCount = 0, darkMode, setDarkMode }) {
  const navigate = useNavigate();
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

  return (
    <header className="header">
      <h1><span>Modern</span>Shop</h1>

      {/* DESKTOP NAV */}
      <nav className="desktop-nav">
        <Link to="/">Home</Link>
        <Link to="/cart">🛒 Cart {cartCount > 0 && <span className="cart-badge">({cartCount})</span>}</Link>
        {isLoggedIn ? (
          <>
            <Link to="/orders">My Orders</Link>
            <Link to="/profile">Profile</Link>
            {isAdmin && <Link to="/admin">Admin</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.3)", fontSize: "18px", padding: "6px 10px" }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </nav>

      {/* MOBILE RIGHT SIDE */}
      <div className="mobile-nav-right">
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ background: "transparent", border: "none", fontSize: "18px", padding: "6px", marginTop: 0 }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={closeMenu}>🏠 Home</Link>
          <Link to="/cart" onClick={closeMenu}>🛒 Cart {cartCount > 0 && `(${cartCount})`}</Link>
          {isLoggedIn ? (
            <>
              <Link to="/orders" onClick={closeMenu}>📦 My Orders</Link>
              <Link to="/profile" onClick={closeMenu}>👤 Profile</Link>
              {isAdmin && <Link to="/admin" onClick={closeMenu}>⚙️ Admin</Link>}
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link to="/register" onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}