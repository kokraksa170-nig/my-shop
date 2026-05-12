import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
            color: star <= (hover || value) ? "#f59e0b" : "#d1d5db",
            transition: "color 0.1s"
          }}
        >★</span>
      ))}
    </div>
  );
}

export default function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
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
        setStars(0);
        setComment("");
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

          {/* AVERAGE RATING */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0" }}>
            <StarRating value={Math.round(avgRating)} readonly />
            <span style={{ color: "#999", fontSize: "14px" }}>
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

          <button
            className="add-to-cart-btn"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            style={{ fontSize: "16px", padding: "14px" }}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart 🛒"}
          </button>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div style={{ marginTop: "40px", background: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <h2 style={{ color: "#1a1a2e", marginBottom: "24px" }}>Customer Reviews</h2>

        {/* SUBMIT RATING */}
        {isLoggedIn ? (
          <form onSubmit={submitRating} style={{ marginBottom: "32px", padding: "20px", background: "#f8f9fa", borderRadius: "10px" }}>
            <h3 style={{ marginBottom: "12px", fontSize: "16px" }}>Write a Review</h3>
            <StarRating value={stars} onChange={setStars} />
            <textarea
              placeholder="Share your experience (optional)..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{ width: "100%", marginTop: "12px", padding: "10px", borderRadius: "8px", border: "2px solid #e0e0e0", fontSize: "14px", minHeight: "80px", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
            />
            <button type="submit" disabled={submitting} style={{ marginTop: "12px", padding: "10px 24px", background: "#e94560", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <p style={{ marginBottom: "24px", color: "#999", fontSize: "14px" }}>
            <Link to="/login" style={{ color: "#e94560" }}>Login</Link> to leave a review
          </p>
        )}

        {/* REVIEWS LIST */}
        {product.ratings?.length === 0 ? (
          <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No reviews yet — be the first!</p>
        ) : (
          product.ratings?.map((r, i) => (
            <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <StarRating value={r.stars} readonly />
                <span style={{ fontSize: "13px", color: "#999" }}>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              {r.comment && <p style={{ fontSize: "14px", color: "#555" }}>{r.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
