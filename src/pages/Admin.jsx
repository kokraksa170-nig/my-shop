import { useEffect, useState } from "react";
import { useToast } from "../components/Toast";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();
  const token = localStorage.getItem("token");
  const authHeader = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("http://localhost:5000/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const url = editingId ? `http://localhost:5000/products/${editingId}` : "http://localhost:5000/products";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: authHeader,
      body: JSON.stringify({ name, price: Number(price), image })
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
  }

  function resetForm() {
    setEditingId(null); setName(""); setPrice(""); setImage("");
  }

  async function deleteProduct(id) {
    const res = await fetch(`http://localhost:5000/products/${id}`, { method: "DELETE", headers: authHeader });
    const data = await res.json();
    if (res.ok) { toast(data.message); fetchProducts(); }
    else toast(data.message, "error");
  }

  return (
    <div className="admin">
      <h1>Admin Dashboard</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
        <input type="text" placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} required />
        <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
        {editingId && <button type="button" onClick={resetForm} style={{ background: "#999" }}>Cancel</button>}
      </form>
      {loading ? <div className="loading">Loading...</div> : (
        <div className="products">
          {products.map(product => (
            <div key={product._id} className="card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button onClick={() => startEdit(product)}>✏️ Edit</button>
              <button onClick={() => deleteProduct(product._id)} style={{ background: "#e74c3c", marginLeft: "8px" }}>🗑️ Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}