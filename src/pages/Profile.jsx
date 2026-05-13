import { useState, useEffect } from "react";
import { useToast } from "../components/Toast";
import { Link } from "react-router-dom";
import API from "../config";

export default function Profile() {
  const toast = useToast();
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  // Decode name/email from token
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const userName = payload.name || "User";
  const userEmail = payload.email || "";
  const isAdmin = payload.isAdmin || false;

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch(`${API}/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch {}
    setLoadingOrders(false);
  }

  async function changePassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast("Passwords do not match ❌", "error");
      return;
    }
    if (newPassword.length < 6) {
      toast("Password must be at least 6 characters ❌", "error");
      return;
    }
    setChanging(true);
    try {
      const res = await fetch(`${API}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        toast("Password changed successfully ✅");
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      } else {
        toast(data.message, "error");
      }
    } catch {
      toast("Something went wrong ❌", "error");
    }
    setChanging(false);
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ color: "var(--primary)", marginBottom: "24px" }}>My Profile</h1>

      {/* USER INFO CARD */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{
            width: "70px", height: "70px", borderRadius: "50%",
            background: "var(--accent)", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", fontWeight: "800"
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: 0, color: "var(--primary)" }}>{userName}</h2>
            <p style={{ color: "var(--gray)", margin: "4px 0" }}>{userEmail}</p>
            {isAdmin && <span style={{ background: "#e94560", color: "white", padding: "2px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: "700" }}>ADMIN</span>}
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "24px" }}>
          {[
            { label: "Total Orders", value: orders.length, icon: "📦" },
            { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: "💰" },
            { label: "Delivered", value: orders.filter(o => o.status === "delivered").length, icon: "✅" }
          ].map(stat => (
            <div key={stat.label} style={{ background: "var(--light)", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "24px" }}>{stat.icon}</div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--accent)" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "var(--gray)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CHANGE PASSWORD */}
      <div style={cardStyle}>
        <h2 style={{ color: "var(--primary)", marginBottom: "20px" }}>🔐 Change Password</h2>
        <form onSubmit={changePassword} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <input style={inputStyle} type="password" placeholder="Current password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
          <input style={inputStyle} type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <input style={inputStyle} type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          <button type="submit" disabled={changing} style={{ padding: "12px", background: "var(--accent)", color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", fontSize: "15px" }}>
            {changing ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* ORDER HISTORY */}
      <div style={cardStyle}>
        <h2 style={{ color: "var(--primary)", marginBottom: "20px" }}>📦 Order History</h2>
        {loadingOrders ? (
          <div className="loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "var(--gray)" }}>
            <p>No orders yet</p>
            <Link to="/"><button style={{ marginTop: "12px" }}>Start Shopping →</button></Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} style={{ padding: "16px", background: "var(--light)", borderRadius: "10px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontWeight: "700", color: "var(--primary)" }}>#{order._id.slice(-6).toUpperCase()}</span>
                <span style={{ color: "var(--gray)", fontSize: "13px" }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                <span style={{ fontWeight: "800", color: "var(--accent)" }}>${order.total.toFixed(2)}</span>
              </div>
              {order.items.map((item, i) => (
                <div key={i} style={{ fontSize: "13px", color: "var(--gray)", padding: "3px 0" }}>
                  {item.name} × {item.qty}
                </div>
              ))}
              <div style={{ marginTop: "10px" }}>
                <span className={`status-badge status-${order.status}`}>
                  {order.status === "pending" && "⏳ "}
                  {order.status === "shipped" && "🚚 "}
                  {order.status === "delivered" && "✅ "}
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "var(--card-bg, white)",
  borderRadius: "12px",
  padding: "28px",
  marginBottom: "20px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
};

const inputStyle = {
  padding: "12px 16px",
  border: "2px solid var(--border)",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none",
  fontFamily: "inherit",
  background: "var(--input-bg, white)",
  color: "var(--text-color, #333)"
};