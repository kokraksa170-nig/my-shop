import { useEffect, useState } from "react";
import { useToast } from "../components/Toast";
import API from "../config";

const CATEGORIES = ["General", "Shoes", "Clothing", "Accessories", "Electronics", "Food"];

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(10);
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
      body: JSON.stringify({ name, price: Number(price), image, category, description, stock: Number(stock) })
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
    setDescription(product.description || "");
    setStock(product.stock || 0);
  }

  function resetForm() {
    setEditingId(null); setName(""); setPrice(""); setImage("");
    setCategory("General"); setDescription(""); setStock(10);
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
        <button onClick={() => setTab("products")} style={{ background: tab === "products" ? "#1a1a2e" : "#ddd", color: tab === "products" ? "white" : "#333" }}>🛍️ Products</button>
        <button onClick={() => setTab("orders")} style={{ background: tab === "orders" ? "#1a1a2e" : "#ddd", color: tab === "orders" ? "white" : "#333" }}>📦 Orders ({orders.length})</button>
      </div>

      {tab === "products" && (
        <>
          <form onSubmit={handleSubmit} className="admin-form">
            <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="number" placeholder="Price ($)" value={price} onChange={e => setPrice(e.target.value)} required />
            <input type="number" placeholder="Stock quantity" value={stock} onChange={e => setStock(e.target.value)} required />
            <input type="text" placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} required />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <textarea placeholder="Product description..." value={description} onChange={e => setDescription(e.target.value)} />
            <button type="submit" style={{ background: "#e94560" }}>{editingId ? "✅ Update" : "➕ Add Product"}</button>
            {editingId && <button type="button" onClick={resetForm} style={{ background: "#999" }}>Cancel</button>}
          </form>
          {loadingProducts ? <div className="loading">Loading...</div> : (
            <div className="products">
              {products.map(product => (
                <div key={product._id} className="card">
                  <div className="card-img-wrap">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="card-body">
                    <span className="category-tag">{product.category}</span>
                    <h3>{product.name}</h3>
                    <div className="card-footer">
                      <span className="price">${product.price}</span>
                      <span style={{ fontSize: "13px", color: product.stock === 0 ? "#e94560" : "#2ecc71", fontWeight: "600" }}>Stock: {product.stock}</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      <button onClick={() => startEdit(product)} style={{ flex: 1, background: "#1a1a2e", margin: 0 }}>✏️ Edit</button>
                      <button onClick={() => deleteProduct(product._id)} style={{ flex: 1, background: "#e94560", margin: 0 }}>🗑️ Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "orders" && (
        <div className="orders-page" style={{ margin: 0, maxWidth: "100%" }}>
          {loadingOrders ? <div className="loading">Loading orders...</div> : orders.length === 0 ? (
            <p>No orders yet 📦</p>
          ) : (
            orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="order-total">${order.total.toFixed(2)}</span>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">{item.name} × {item.qty} — ${(item.price * item.qty).toFixed(2)}</div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className={`status-badge status-${order.status}`}>{order.status}</span>
                  <select defaultValue={order.status} onChange={e => updateStatus(order._id, e.target.value)} style={{ padding: "6px 12px", borderRadius: "8px", border: "2px solid #e0e0e0", fontSize: "13px" }}>
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