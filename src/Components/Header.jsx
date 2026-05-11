import { Link, useNavigate } from "react-router-dom";

export default function Header({ cartCount = 0 }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("cart");
    navigate("/login");
  }

  return (
    <header className="header">
      <h1>ModernShop Pro</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/cart">🛒 Cart {cartCount > 0 && <span className="cart-badge">({cartCount})</span>}</Link>
        {isLoggedIn ? (
          <>
            <Link to="/orders">My Orders</Link>
            {isAdmin && <Link to="/admin">Admin</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}