import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import API from "../config";

function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            fontSize: readonly ? "18px" : "28px",
            cursor: readonly ? "default" : "pointer",
            color: star <= (hover || value) ? "#f59e0b" : "var(--border)",
            transition: "color 0.1s"
          }}
        >★</span>
      ))}
    </div>
  );
}

export default function ProductDetail({ addToCart, products = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    const res = await fetch(`${API}/products/${id}`);
    const data = await res.json();
    setProduct(data);
    setLoading(false);
  }

  async function submitRating(e) {
    e.preventDefault();
    if (!stars) { toast("Please select a star rating ❌", "error"); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/products/${id}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ stars, comment })
      });
      const data = await res.json();
      if (res.ok) {
        toast("Rating submitted ✅");
        setStars(0); setComment("");
        fetchProduct();
      } else {
        toast(data.message, "error");
      }
    } catch {
      toast("Something went wrong ❌", "error");
    }
    setSubmitting(false);
  }

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product) return <p style={{ textAlign: "center", padding: "40px" }}>Product not found</p>;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const avgRating = product.avgRating || 0;

  // ✅ Related products — same category, exclude current
  const related = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);

  function handleAddToCart() {
    addToCart(product);
    toast(`${product.name} added to cart 🛒`);
  }

  return (
    <div className="product-detail">
      <Link to="/" className="back-btn">← Back to Products</Link>

      <div className="product-detail-card">
        <img src={product.image} alt={product.name} className="product-detail-img" />

        <div className="product-detail-body">
          <span className="category-tag">{product.category || "General"}</span>
          <h1>{product.name}</h1>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0" }}>
            <StarRating value={Math.round(avgRating)} readonly />
            <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              {avgRating.toFixed(1)} ({product.ratings?.length || 0} reviews)
            </span>
          </div>

          <div className="product-detail-price">${product.price}</div>

          {product.description && (
            <p className="product-detail-desc">{product.description}</p>
          )}

          <div className="product-detail-stock">
            {isOutOfStock && <span className="stock-badge out-of-stock">Out of Stock</span>}
            {isLowStock && <span className="stock-badge low-stock">⚠️ Only {product.stock} left!</span>}
            {!isOutOfStock && !isLowStock && <span className="stock-badge in-stock">✅ In Stock ({product.stock} available)</span>}
          </div>

          <button className="add-to-cart-btn" disabled={isOutOfStock} onClick={handleAddToCart} style={{ fontSize: "16px", padding: "14px" }}>
            {isOutOfStock ? "Out of Stock" : "Add to Cart 🛒"}
          </button>
        </div>
      </div>

      {/* ✅ RELATED PRODUCTS */}
      {related.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ color: "var(--text-primary)", marginBottom: "20px", fontSize: "22px", fontWeight: "700" }}>
            Related Products
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
            {related.map(p => (
              <div
                key={p._id}
                className="card"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <div className="card-img-wrap" style={{ height: "160px" }}>
                  <img src={p.image} alt={p.name} />
                </div>
                <div className="card-body">
                  <h3 style={{ fontSize: "14px" }}>{p.name}</h3>
                  <div className="card-footer">
                    <span className="price" style={{ fontSize: "16px" }}>${p.price}</span>
                    <span className={`stock-badge ${p.stock === 0 ? "out-of-stock" : "in-stock"}`}>
                      {p.stock === 0 ? "Out" : "In Stock"}
                    </span>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    disabled={p.stock === 0}
                    onClick={e => { e.stopPropagation(); addToCart(p); toast(`${p.name} added to cart 🛒`); }}
                    style={{ fontSize: "13px", padding: "8px" }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS */}
      <div style={{ marginTop: "40px", background: "var(--bg-card)", borderRadius: "12px", padding: "30px", boxShadow: "var(--card-shadow)" }}>
        <h2 style={{ color: "var(--text-primary)", marginBottom: "24px" }}>Customer Reviews</h2>

        {isLoggedIn ? (
          <form onSubmit={submitRating} style={{ marginBottom: "32px", padding: "20px", background: "var(--bg)", borderRadius: "10px" }}>
            <h3 style={{ marginBottom: "12px", fontSize: "16px", color: "var(--text-primary)" }}>Write a Review</h3>
            <StarRating value={stars} onChange={setStars} />
            <textarea
              placeholder="Share your experience (optional)..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{ width: "100%", marginTop: "12px", padding: "10px", borderRadius: "8px", border: "2px solid var(--border)", fontSize: "14px", minHeight: "80px", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", background: "var(--input-bg)", color: "var(--text-primary)" }}
            />
            <button type="submit" disabled={submitting} style={{ marginTop: "12px", padding: "10px 24px", background: "var(--accent)", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <p style={{ marginBottom: "24px", color: "var(--text-secondary)", fontSize: "14px" }}>
            <Link to="/login" style={{ color: "var(--accent)" }}>Login</Link> to leave a review
          </p>
        )}

        {product.ratings?.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "20px" }}>No reviews yet — be the first!</p>
        ) : (
          product.ratings?.map((r, i) => (
            <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <StarRating value={r.stars} readonly />
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              {r.comment && <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{r.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
