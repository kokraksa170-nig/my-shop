import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, addToCart }) {
  const navigate = useNavigate();

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  function getStockBadge() {
    if (isOutOfStock) return <span className="stock-badge out-of-stock">Out of Stock</span>;
    if (isLowStock) return <span className="stock-badge low-stock">Only {product.stock} left!</span>;
    return <span className="stock-badge in-stock">In Stock</span>;
  }

  return (
    <div className="card" onClick={() => navigate(`/product/${product._id}`)}>
      <div className="card-img-wrap">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="card-body">
        <span className="category-tag">{product.category || "General"}</span>
        <h3>{product.name}</h3>
        {product.description && <p className="card-desc">{product.description}</p>}
        <div className="card-footer">
          <span className="price">${product.price}</span>
          {getStockBadge()}
        </div>
        <button
          className="add-to-cart-btn"
          disabled={isOutOfStock}
          onClick={e => {
            e.stopPropagation();
            addToCart(product);
          }}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart 🛒"}
        </button>
      </div>
    </div>
  );
}