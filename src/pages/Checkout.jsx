import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import API from "../config";

export default function Checkout({ cart, setCart }) {
  const navigate = useNavigate();
  const toast = useToast();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  async function placeOrder() {
    if (cart.length === 0) { toast("Cart is empty ❌", "error"); return; }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ items: cart })
      });
      const data = await res.json();
      if (res.ok) {
        toast("Order placed successfully ✅");
        setCart([]);
        localStorage.removeItem("cart");
        navigate("/orders");
      } else {
        toast(data.message, "error");
      }
    } catch {
      toast("Something went wrong ❌", "error");
    }
  }

  return (
    <div className="checkout">
      <div className="checkout-card">
        <h1>Order Summary</h1>
        {cart.length === 0 ? <p style={{ textAlign: "center", color: "#999" }}>Your cart is empty 🛒</p> : (
          <>
            {cart.map(item => (
              <div key={item._id} className="checkout-item">
                <span>{item.name} × {item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="checkout-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="place-order-btn" onClick={placeOrder}>Place Order ✅</button>
          </>
        )}
      </div>
    </div>
  );
}