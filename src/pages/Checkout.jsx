import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

export default function Checkout({ cart, setCart }) {
  const navigate = useNavigate();
  const toast = useToast();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  async function placeOrder() {
    if (cart.length === 0) { toast("Cart is empty ❌", "error"); return; }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/orders", {
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
      <h1>Checkout</h1>
      {cart.length === 0 ? <p>Your cart is empty 🛒</p> : (
        <>
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <span>{item.name}</span>
              <span>${item.price} × {item.qty}</span>
            </div>
          ))}
          <h2>Total: ${total}</h2>
          <button onClick={placeOrder}>Place Order</button>
        </>
      )}
    </div>
  );
}