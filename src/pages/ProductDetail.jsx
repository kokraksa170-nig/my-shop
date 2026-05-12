import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "../components/Toast";
import API from "../config";

export default function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/products/${id}`)
      .then(res => res.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product) return <p style={{ textAlign: "center", padding: "40px" }}>Product not found</p>;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

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
          <div className="product-detail-price">${product.price}</div>
          {product.description && <p className="product-detail-desc">{product.description}</p>}
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
    </div>
  );
}