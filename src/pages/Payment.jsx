import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import API from "../config";

export default function Payment({ cart, setCart }) {
  const navigate = useNavigate();
  const toast = useToast();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Format card number with spaces
  function formatCardNumber(val) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  // Format expiry MM/YY
  function formatExpiry(val) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  }

  async function handlePayment(e) {
    e.preventDefault();

    if (cart.length === 0) { toast("Cart is empty ❌", "error"); return; }

    // Basic validation
    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length !== 16) { toast("Invalid card number ❌", "error"); return; }
    if (cvv.length < 3) { toast("Invalid CVV ❌", "error"); return; }

    setLoading(true);

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ items: cart })
      });
      const data = await res.json();
      if (res.ok) {
        toast("Payment successful! Order placed ✅");
        setCart([]);
        localStorage.removeItem("cart");
        navigate("/orders");
      } else {
        toast(data.message, "error");
      }
    } catch {
      toast("Something went wrong ❌", "error");
    }

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>

      {/* ORDER SUMMARY */}
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <h2 style={{ marginBottom: "16px", color: "#1a1a2e" }}>Order Summary</h2>
        {cart.map(item => (
          <div key={item._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontSize: "14px" }}>
            <span>{item.name} × {item.qty}</span>
            <span style={{ fontWeight: "600" }}>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", fontSize: "20px", fontWeight: "800" }}>
          <span>Total</span>
          <span style={{ color: "#e94560" }}>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* PAYMENT FORM */}
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <h2 style={{ marginBottom: "8px", color: "#1a1a2e" }}>💳 Payment Details</h2>
        <p style={{ color: "#999", fontSize: "13px", marginBottom: "24px" }}>This is a demo — no real payment is processed</p>

        <form onSubmit={handlePayment} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <div>
            <label style={labelStyle}>Cardholder Name</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="John Doe"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Card Number</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Expiry Date</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>CVV</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="123"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              padding: "16px",
              background: loading ? "#ccc" : "#e94560",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s"
            }}
          >
            {loading ? "Processing payment..." : `Pay $${total.toFixed(2)} →`}
          </button>

        </form>

        {/* CARD LOGOS */}
        <div style={{ display: "flex", gap: "12px", marginTop: "20px", justifyContent: "center", opacity: 0.5 }}>
          <span style={cardLogoStyle}>VISA</span>
          <span style={cardLogoStyle}>MASTERCARD</span>
          <span style={cardLogoStyle}>AMEX</span>
        </div>

      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#555"
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  border: "2px solid #e0e0e0",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit"
};

const cardLogoStyle = {
  padding: "4px 10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.5px"
};
