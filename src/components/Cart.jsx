export default function Cart({ cart, increase, decrease, goToCheckout }) {

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="cart">

      <h2>Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item._id} className="cart-item">

              <p>
                {item.name} - ${item.price} x {item.qty}
              </p>

              <button onClick={() => increase(item._id)}>+</button>
              <button onClick={() => decrease(item._id)}>-</button>

            </div>
          ))}

          <h3>Total: ${total}</h3>

          <button onClick={goToCheckout}>
            Checkout
          </button>
        </>
      )}

    </div>
  );
}