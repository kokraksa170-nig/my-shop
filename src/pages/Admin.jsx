import { useEffect, useState } from "react";
import { useToast } from "../components/Toast";
import API from "../config";

const CATEGORIES = ["General", "Shoes", "Clothing", "Accessories", "Electronics", "Food"];

export default function Admin() {
  const [tab, setTab] = useState("analytics");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(10);
  const [editingId, setEditingId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const toast = useToast();
  const token = localStorage.getItem("token");
  const authHeader = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => { fetchProducts(); fetchOrders(); fetchAnalytics(); }, []);

  async function fetchAnalytics() {
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`${API}/analytics`, { headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      setAnalytics(data);
    } catch {}
    setLoadingAnalytics(false);
  }

  async function fetchProducts() {
    setLoadingProducts(true);
    const res = await fetch(`${API}/products`);
    const data = await res.json();
    setProducts(data);
    setLoadingProducts(false);
  }

  async function fetchOrders() {
    setLoadingOrders(true);
    const res = await fetch(`${API}/orders`, { headers: { "Authorization": `Bearer ${token}` } });
    const data = await res.json();
    setOrders(data);
    setLoadingOrders(false);
  }

  // ✅ Handle image file selection
  function handleImageFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  // ✅ Upload image to Cloudinary via backend
  async function uploadImage() {
    if (!imageFile) return image;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setImage(data.url);
        toast("Image uploaded ✅");
        return data.url;
      } else {
        toast(data.message || "Upload failed ❌", "error");
        return image;
      }
    } catch {
      toast("Upload failed ❌", "error");
      return image;
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let finalImage = image;
    if (imageFile) {
      finalImage = await uploadImage();
    }

    if (!finalImage) { toast("Please add an image ❌", "error"); return; }

    const url = editingId ? `${API}/products/${editingId}` : `${API}/products`;
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: authHeader,
      body: JSON.stringify({ name, price: Number(price), image: finalImage, category, description, stock: Number(stock) })
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
    setImagePreview(product.image);
    setImageFile(null);
    setCategory(product.category || "General");
    setDescription(product.description || "");
    setStock(product.stock || 0);
    setTab("products");
    window.scrollTo(0, 0);
  }

  function resetForm() {
    setEditingId(null); setName(""); setPrice(""); setImage("");
    setImageFile(null); setImagePreview("");
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
      method: "PUT", headers: authHeader, body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (res.ok) { toast(data.message); fetchOrders(); fetchAnalytics(); }
    else toast(data.message, "error");
  }

  const tabs = [
    { key: "analytics", label: "📊 Analytics" },
    { key: "products", label: "🛍️ Products" },
    { key: "orders", label: `📦 Orders (${orders.length})` }
  ];

  return (
    <div className="admin">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ background: tab === t.key ? "#1a1a2e" : "#ddd", color: tab === t.key ? "white" : "#333" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ANALYTICS TAB */}
      {tab === "analytics" && (
        <div>
          {loadingAnalytics ? <div className="loading">Loading analytics...</div> : !analytics ? <p>No data yet</p> : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
                {[
                  { label: "Total Revenue", value: `$${analytics.totalRevenue.toFixed(2)}`, color: "#e94560", icon: "💰" },
                  { label: "Total Orders", value: analytics.totalOrders, color: "#3498db", icon: "📦" },
                  { label: "Total Products", value: analytics.totalProducts, color: "#2ecc71", icon: "🛍️" },
                  { label: "Total Users", value: analytics.totalUsers, color: "#f59e0b", icon: "👥" }
                ].map(stat => (
                  <div key={stat.label} style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderLeft: `4px solid ${stat.color}` }}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: stat.color }}>{stat.value}</div>
                    <div style={{ color: "#999", fontSize: "14px", marginTop: "4px" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ marginBottom: "20px", color: "#1a1a2e" }}>Orders by Status</h3>
                  {Object.entries(analytics.statusCounts).map(([status, count]) => {
                    const colors = { pending: "#e67e22", shipped: "#3498db", delivered: "#2ecc71" };
                    const total = analytics.totalOrders || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={status} style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ textTransform: "capitalize", fontWeight: "600", fontSize: "14px" }}>{status}</span>
                          <span style={{ color: "#999", fontSize: "14px" }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ background: "#f0f0f0", borderRadius: "99px", height: "8px" }}>
                          <div style={{ width: `${pct}%`, background: colors[status], borderRadius: "99px", height: "8px" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ marginBottom: "20px", color: "#1a1a2e" }}>Top Products</h3>
                  {analytics.topProducts.length === 0 ? <p style={{ color: "#999" }}>No sales yet</p> :
                    analytics.topProducts.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
                        <span style={{ fontWeight: "600", fontSize: "14px" }}>{i + 1}. {p.name}</span>
                        <span style={{ color: "#e94560", fontWeight: "700" }}>${p.revenue.toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginTop: "20px" }}>
                <h3 style={{ marginBottom: "20px", color: "#1a1a2e" }}>Revenue — Last 7 Days</h3>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "120px" }}>
                  {analytics.last7Days.map((day, i) => {
                    const maxRev = Math.max(...analytics.last7Days.map(d => d.revenue), 1);
                    const height = Math.max((day.revenue / maxRev) * 100, 4);
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#e94560", fontWeight: "700" }}>{day.revenue > 0 ? `$${day.revenue}` : ""}</span>
                        <div style={{ width: "100%", height: `${height}%`, background: day.revenue > 0 ? "#e94560" : "#f0f0f0", borderRadius: "6px 6px 0 0" }} />
                        <span style={{ fontSize: "11px", color: "#999" }}>{day.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {tab === "products" && (
        <>
          <form onSubmit={handleSubmit} className="admin-form">
            <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="number" placeholder="Price ($)" value={price} onChange={e => setPrice(e.target.value)} required />
            <input type="number" placeholder="Stock quantity" value={stock} onChange={e => setStock(e.target.value)} required />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <textarea placeholder="Product description..." value={description} onChange={e => setDescription(e.target.value)} />

            {/* ✅ IMAGE UPLOAD */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Product Image</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  style={{ flex: 1, padding: "8px", border: "2px solid #e0e0e0", borderRadius: "8px" }}
                />
                <span style={{ color: "#999", fontSize: "13px" }}>or</span>
                <input
                  type="text"
                  placeholder="Paste image URL"
                  value={image}
                  onChange={e => { setImage(e.target.value); setImagePreview(e.target.value); setImageFile(null); }}
                  style={{ flex: 2, padding: "10px", border: "2px solid #e0e0e0", borderRadius: "8px" }}
                />
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "8px", border: "2px solid #e0e0e0" }} />
              )}
            </div>

            <button type="submit" disabled={uploadingImage} style={{ background: "#e94560" }}>
              {uploadingImage ? "Uploading..." : editingId ? "✅ Update" : "➕ Add Product"}
            </button>
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

      {/* ORDERS TAB */}
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
                  <select defaultValue={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                    style={{ padding: "6px 12px", borderRadius: "8px", border: "2px solid #e0e0e0", fontSize: "13px" }}>
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
