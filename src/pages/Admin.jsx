import { useEffect, useState } from "react";
import { useToast } from "../components/Toast";
import API from "../config";

const CATEGORIES = ["General", "Shoes", "Clothing", "Accessories", "Electronics", "Food"];
const STATUS_COLORS = { pending: "#e67e22", shipped: "#3498db", delivered: "#2ecc71" };

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("General");
  const [editingId, setEditingId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const toast = useToast();
  const token = localStorage.getItem("token");
  const authHeader = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  async function fetchProducts() {
    setLoadingProducts(true);
    const res = await fetch(`${API}/products`);
    const data = await res.json();
    setProducts(data);
    setLoadingProducts(false);
  }

  async function fetchOrders() {
    setLoadingOrders(true);
    const res = await fetch(`${API}/orders`, { headers: authHeader });
    const data = await res.json();
    setOrders(data);
    setLoadingOrders(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const url = editingId ? `${API}/products/${editingId}` : `${API}/products`;
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: authHeader,
      body: JSON.stringify({ name, price: Number(price), image, category })
    });
    const data = await res.json();
    if (res.ok) { toast(data.message); fetchProducts(); resetForm(); }
    else toast(data.message, "error");
  }

  function startEdit(product) {
    setEditingId(product._id);
    setName(product.name);
    setPrice(product.price);
    setImage(product.image);
    setCategory(product.category || "General");
  }

  function resetForm() {
    setEditingId(null); setName(""); setPrice(""); setImage(""); setCategory("General");
  }

  async function deleteProduct(id) {
    const res = await fetch(`${API}/products/${id}`, { method: "DELETE", headers: authHeader });
    const data = await res.json();
    if (res.ok) { toast(data.message); fetchProducts(); }
    else toast(data.message, "error");
  }

  async function updateStatus(orderId, status) {
    const res = await fetch(`${API}/orders/${orderId}/status`, {
      method: "PUT",
      headers: authHeader,
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (res.ok) { toast(data.message); fetchOrders(); }
    else toast(data.message, "error");
  }

  return (
    <div className="admin">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button onClick={() => setTab("products")} style={{ background: tab === "products" ? "#111" : "#ccc" }}>🛍️ Products</button>
        <button onClick={() => setTab("orders")} style={{ background: tab === "orders" ? "#111" : "#ccc" }}>📦 Orders ({orders.length})</button>
      </div>

      {tab === "products" && (
        <>
          <form onSubmit={handleSubmit} className="admin-form">
            <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
            <input type="text" placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} required />
            <select value={category} onChange={e => setCategory(e.target.value)} className="filter-select">
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
            {editingId && <button type="button" onClick={resetForm} style={{ background: "#999" }}>Cancel</button>}
          </form>
          {loadingProducts ? <div className="loading">Loading...</div> : (
            <div className="products">
              {products.map(product => (
                <div key={product._id} className="card">
                  <img src={product.image} alt={product.name} />
                  <span className="category-tag">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <button onClick={() => startEdit(product)}>✏️ Edit</button>
                  <button onClick={() => deleteProduct(product._id)} style={{ background: "#e74c3c", marginLeft: "8px" }}>🗑️ Delete</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "orders" && (
        <div className="orders-page">
          {loadingOrders ? <div className="loading">Loading orders...</div> : orders.length === 0 ? (
            <p>No orders yet 📦</p>
          ) : (
            orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="order-total">${order.total}</span>
                </div>
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">{item.name} × {item.qty} — ${item.price * item.qty}</div>
                  ))}
                </div>
                <div className="order-status-row" style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
                  <span style={{
                    background: STATUS_COLORS[order.status] || "#999",
                    color: "white", padding: "4px 12px", borderRadius: "99px", fontSize: "13px"
                  }}>{order.status}</span>
                  <select
                    defaultValue={order.status}
                    onChange={e => updateStatus(order._id, e.target.value)}
                    style={{ marginLeft: "12px", padding: "6px", borderRadius: "8px", border: "1px solid #ddd" }}
                  >
                    <option value="pending">pending</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}