import ProductList from "../components/ProductList";

export default function Home({ products, addToCart, loading }) {
  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>Products</h2>
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center" }}>No products found.</p>
      ) : (
        <ProductList products={products} addToCart={addToCart} />
      )}
    </div>
  );
}