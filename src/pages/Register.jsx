import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/Toast";
import API from "../config";

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        toast("Account created successfully ✅");
        navigate("/login");
      } else {
        toast(data.message, "error");
      }
    } catch {
      toast("Something went wrong ❌", "error");
    }
    setLoading(false);
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join ModernShop today</p>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="auth-btn" disabled={loading}>{loading ? "Creating account..." : "Create Account →"}</button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}