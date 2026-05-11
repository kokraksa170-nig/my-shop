import { useEffect, useState } from "react";
import { useToast } from "../components/Toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/orders", {
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
      {orders.length === 0 ? <p>No orders yet 📦</p> : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span>Order #{order._id.slice(-6).toUpperCase()}</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <span className="order-total">${order.total}</span>
            </div>
            <div className="order-items">
              {order.items.map((item, i) => (
                <div key={i} className="order-item">
                  {item.name} × {item.qty} — ${item.price * item.qty}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}