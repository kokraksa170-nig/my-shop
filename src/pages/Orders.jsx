import { useEffect, useState } from "react";
import { useToast } from "../components/Toast";
import API from "../config";

const STEPS = ["pending", "shipped", "delivered"];

const STEP_INFO = {
  pending:   { icon: "📋", label: "Order Placed",    desc: "Your order has been received" },
  shipped:   { icon: "🚚", label: "Shipped",          desc: "Your order is on the way" },
  delivered: { icon: "✅", label: "Delivered",        desc: "Your order has been delivered" }
};

function OrderTimeline({ order }) {
  const currentStep = STEPS.indexOf(order.status);

  return (
    <div style={{ marginTop: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>

        {/* PROGRESS LINE */}
        <div style={{ position: "absolute", top: "20px", left: "10%", right: "10%", height: "3px", background: "var(--border)", zIndex: 0 }} />
        <div style={{
          position: "absolute", top: "20px", left: "10%",
          width: currentStep === 0 ? "0%" : currentStep === 1 ? "50%" : "80%",
          height: "3px", background: "var(--accent)", zIndex: 1,
          transition: "width 0.5s ease"
        }} />

        {STEPS.map((step, i) => {
          const done = i <= currentStep;
          const info = STEP_INFO[step];

          // Find date from statusHistory
          const historyEntry = order.statusHistory?.find(h => h.status === step);
          const date = historyEntry ? new Date(historyEntry.date).toLocaleDateString() : null;

          return (
            <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: 1, zIndex: 2 }}>
              <div style={{
                width: "40px", height: "40px",
                borderRadius: "50%",
                background: done ? "var(--accent)" : "var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px",
                transition: "background 0.3s",
                boxShadow: done ? "0 0 0 4px rgba(233,69,96,0.2)" : "none"
              }}>
                {info.icon}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: done ? "var(--accent)" : "var(--text-secondary)" }}>{info.label}</div>
                {date && <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>{date}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
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
        <div style={{ textAlign: "center", padding: "60px", color: "var(--text-secondary)" }}>
          <p style={{ fontSize: "18px" }}>No orders yet 📦</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            {/* ORDER HEADER */}
            <div className="order-header" style={{ cursor: "pointer" }} onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
              <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
              <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
              <span className="order-total">${order.total.toFixed(2)}</span>
              <span style={{ color: "var(--text-secondary)", fontSize: "18px" }}>{expanded === order._id ? "▲" : "▼"}</span>
            </div>

            {/* STATUS BADGE */}
            <div style={{ marginBottom: "12px" }}>
              <span className={`status-badge status-${order.status}`}>
                {order.status === "pending" && "⏳ "}
                {order.status === "shipped" && "🚚 "}
                {order.status === "delivered" && "✅ "}
                {order.status}
              </span>
              {order.couponCode && (
                <span style={{ marginLeft: "10px", fontSize: "12px", color: "#2ecc71", fontWeight: "600" }}>
                  🎟️ {order.couponCode} (-${order.discount?.toFixed(2)})
                </span>
              )}
            </div>

            {/* ✅ ORDER TRACKING TIMELINE */}
            <OrderTimeline order={order} />

            {/* EXPANDABLE ITEMS */}
            {expanded === order._id && (
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <h4 style={{ marginBottom: "12px", color: "var(--text-primary)", fontSize: "14px", fontWeight: "700" }}>Items</h4>
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    {item.name} × {item.qty} — ${(item.price * item.qty).toFixed(2)}
                  </div>
                ))}
                {order.discount > 0 && (
                  <div style={{ marginTop: "8px", fontSize: "13px", color: "#2ecc71", fontWeight: "600" }}>
                    Discount: -${order.discount.toFixed(2)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
