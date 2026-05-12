import { useState, useMemo } from "react";
import ProductList from "../components/ProductList";

export default function Home({ products, addToCart, loading }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || p.category === category;
      const matchPrice = maxPrice === "" || p.price <= Number(maxPrice);
      return matchSearch && matchCategory && matchPrice;
    });
  }, [products, search, category, maxPrice]);

  return (
    <div>
      <div className="hero">
        <h2>Welcome to <span>my kak shop</span></h2>
        <p>Discover premium products at unbeatable prices</p>
        <button className="hero-btn" onClick={() => document.querySelector('.filters').scrollIntoView({ behavior: 'smooth' })}>
          Shop Now →
        </button>
      </div>

      <div className="filters">
        <input type="text" placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="filter-select">
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input type="number" placeholder="Max price $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="filter-input" />
        {(search || category !== "All" || maxPrice) && (
          <button onClick={() => { setSearch(""); setCategory("All"); setMaxPrice(""); }} className="clear-btn">✕ Clear</button>
        )}
      </div>

      <div className="products-section">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "60px", color: "#999" }}>No products found 😕</p>
        ) : (
          <>
            <p className="products-count">Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
            <ProductList products={filtered} addToCart={addToCart} />
          </>
        )}
      </div>
    </div>
  );
}