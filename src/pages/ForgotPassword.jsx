import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../components/Toast";
import API from "../config";

export default function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        toast("Reset email sent ✅");
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
        <h1>Forgot Password</h1>
        <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>

        {sent ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
            <h3 style={{ color: "var(--primary)" }}>Check your email!</h3>
            <p style={{ color: "var(--gray)", marginTop: "8px" }}>
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <p style={{ color: "var(--gray)", fontSize: "13px", marginTop: "8px" }}>
              The link expires in 1 hour.
            </p>
            <Link to="/login">
              <button style={{ marginTop: "20px", width: "100%", padding: "12px", background: "var(--accent)", borderRadius: "10px" }}>
                Back to Login
              </button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link →"}
            </button>
          </form>
        )}

        <p className="auth-link" style={{ marginTop: "20px" }}>
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
