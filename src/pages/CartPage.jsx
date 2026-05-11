import { Link } from "react-router-dom";

export default function CartPage({ cart, increase, decrease }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty 🛒 <Link to="/">Shop now</Link></p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <p>{item.name} — ${item.price} × {item.qty}</p>
              <div>
                <button onClick={() => increase(item._id)}>+</button>
                <button onClick={() => decrease(item._id)}>−</button>
              </div>
            </div>
          ))}
          <h3>Total: ${total}</h3>
          <Link to="/checkout"><button>Go to Checkout →</button></Link>
        </>
      )}
    </div>
  );
}