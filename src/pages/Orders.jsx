import { useEffect, useState } from "react";
import { useToast } from "../components/Toast";
import API from "../config";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch {
      toast("Failed to load orders ❌", "error");
    }
    setLoading(false);
  }

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
          <p style={{ fontSize: "18px" }}>No orders yet 📦</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
              <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
              <span className="order-total">${order.total.toFixed(2)}</span>
            </div>
            <div style={{ marginBottom: "12px" }}>
              {order.items.map((item, i) => (
                <div key={i} className="order-item">
                  {item.name} × {item.qty} — ${(item.price * item.qty).toFixed(2)}
                </div>
              ))}
            </div>
            <span className={`status-badge status-${order.status}`}>
              {order.status === "pending" && "⏳ "}
              {order.status === "shipped" && "🚚 "}
              {order.status === "delivered" && "✅ "}
              {order.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}