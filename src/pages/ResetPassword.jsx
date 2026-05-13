import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/Toast";
import API from "../config";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      toast("Passwords do not match ❌", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        toast("Password reset successfully ✅");
        setTimeout(() => navigate("/login"), 2000);
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
        <h1>Reset Password</h1>
        <p className="auth-subtitle">Enter your new password</p>

        {done ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h3 style={{ color: "var(--primary)" }}>Password Reset!</h3>
            <p style={{ color: "var(--gray)" }}>Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password →"}
            </button>
          </form>
        )}

        <p className="auth-link" style={{ marginTop: "20px" }}>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
