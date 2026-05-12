import { Link } from "react-router-dom";

export default function CartPage({ cart, increase, decrease }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="cart">
      <div className="cart-card">
        <h2>🛒 Your Cart</h2>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "18px", color: "#999", marginBottom: "20px" }}>Your cart is empty</p>
            <Link to="/"><button>Continue Shopping →</button></Link>
          </div>
        ) : (
          <>
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
                </div>
                <div className="cart-item-controls">
                  <button className="qty-btn" onClick={() => decrease(item._id)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => increase(item._id)}>+</button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-amount">${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout">
              <button style={{ width: "100%", marginTop: "20px", padding: "14px", background: "#e94560", fontSize: "16px", fontWeight: "700", borderRadius: "12px" }}>
                Proceed to Checkout →
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}