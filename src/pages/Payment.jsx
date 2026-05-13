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

  // ✅ Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discount) / 100) : 0;
  const total = subtotal - discount;

  function formatCardNumber(val) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(val) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  }

  // ✅ Apply coupon
  async function applyCoupon() {
    if (!couponInput.trim()) { toast("Enter a coupon code ❌", "error"); return; }
    setCouponLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ code: couponInput })
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data);
        toast(data.message);
      } else {
        toast(data.message, "error");
      }
    } catch {
      toast("Something went wrong ❌", "error");
    }
    setCouponLoading(false);
  }

  async function handlePayment(e) {
    e.preventDefault();
    if (cart.length === 0) { toast("Cart is empty ❌", "error"); return; }
    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length !== 16) { toast("Invalid card number ❌", "error"); return; }
    if (cvv.length < 3) { toast("Invalid CVV ❌", "error"); return; }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ items: cart, couponCode: appliedCoupon?.code || "" })
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
      <div className="section-card" style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "16px", color: "var(--text-primary)", fontSize: "20px", fontWeight: "700" }}>Order Summary</h2>
        {cart.map(item => (
          <div key={item._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: "14px", color: "var(--text-primary)" }}>
            <span>{item.name} × {item.qty}</span>
            <span style={{ fontWeight: "600" }}>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}

        {/* COUPON INPUT */}
        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Coupon code (e.g. SAVE10)"
            value={couponInput}
            onChange={e => setCouponInput(e.target.value.toUpperCase())}
            disabled={!!appliedCoupon}
            style={{ flex: 1, padding: "10px 14px", border: "2px solid var(--border)", borderRadius: "8px", fontSize: "14px", background: "var(--input-bg)", color: "var(--text-primary)", fontFamily: "inherit" }}
          />
          {appliedCoupon ? (
            <button type="button" onClick={() => { setAppliedCoupon(null); setCouponInput(""); }} style={{ padding: "10px 16px", background: "#999", borderRadius: "8px", margin: 0, whiteSpace: "nowrap" }}>
              Remove
            </button>
          ) : (
            <button type="button" onClick={applyCoupon} disabled={couponLoading} style={{ padding: "10px 16px", background: "var(--accent)", borderRadius: "8px", margin: 0, whiteSpace: "nowrap" }}>
              {couponLoading ? "..." : "Apply"}
            </button>
          )}
        </div>

        {appliedCoupon && (
          <div style={{ marginTop: "8px", padding: "8px 12px", background: "#e8f8f0", borderRadius: "8px", color: "#2ecc71", fontSize: "13px", fontWeight: "600" }}>
            ✅ {appliedCoupon.discount}% discount applied!
          </div>
        )}

        {/* TOTALS */}
        <div style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--text-secondary)", marginBottom: "6px" }}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#2ecc71", marginBottom: "6px", fontWeight: "600" }}>
              <span>Discount ({appliedCoupon.discount}%)</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "800", borderTop: "2px solid var(--border)", paddingTop: "12px", marginTop: "8px" }}>
            <span style={{ color: "var(--text-primary)" }}>Total</span>
            <span style={{ color: "var(--accent)" }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* PAYMENT FORM */}
      <div className="section-card">
        <h2 style={{ marginBottom: "8px", color: "var(--text-primary)", fontSize: "20px", fontWeight: "700" }}>💳 Payment Details</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "24px" }}>Demo only — no real payment is processed</p>

        <form onSubmit={handlePayment} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Cardholder Name</label>
            <input style={inputStyle} type="text" placeholder="John Doe" value={cardName} onChange={e => setCardName(e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Card Number</label>
            <input style={inputStyle} type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} maxLength={19} required />
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Expiry Date</label>
              <input style={inputStyle} type="text" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} maxLength={5} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>CVV</label>
              <input style={inputStyle} type="text" placeholder="123" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} required />
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: "8px", padding: "16px", background: loading ? "#ccc" : "var(--accent)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Processing payment..." : `Pay $${total.toFixed(2)} →`}
          </button>
        </form>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px", justifyContent: "center", opacity: 0.5 }}>
          {["VISA", "MASTERCARD", "AMEX"].map(c => (
            <span key={c} style={{ padding: "4px 10px", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px", fontWeight: "700", color: "var(--text-primary)" }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" };
const inputStyle = { width: "100%", padding: "12px 16px", border: "2px solid var(--border)", borderRadius: "10px", fontSize: "15px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "var(--input-bg)", color: "var(--text-primary)" };
