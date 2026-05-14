import { useState, useMemo } from "react";
import ProductList from "../components/ProductList";
import { useLang } from "../components/LangContext.jsx";

export default function Home({ products, addToCart, loading }) {
  const { t } = useLang();
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
      {/* HERO */}
      <div className="hero">
        <h2>{t.heroTitle} <span>ModernShop</span></h2>
        <p>{t.heroSubtitle}</p>
        <button className="hero-btn" onClick={() => document.querySelector('.filters')?.scrollIntoView({ behavior: 'smooth' })}>
          {t.shopNow}
        </button>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <input type="text" placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="filter-select">
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input type="number" placeholder={t.maxPrice} value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="filter-input" />
        {(search || category !== "All" || maxPrice) && (
          <button onClick={() => { setSearch(""); setCategory("All"); setMaxPrice(""); }} className="clear-btn">{t.clearFilters}</button>
        )}
      </div>

      {/* PRODUCTS */}
      <div className="products-section">
        {loading ? (
          <div className="loading">{t.loading}</div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "60px", color: "#999" }}>{t.noProducts}</p>
        ) : (
          <>
            <p className="products-count">
              {t.showingProducts} {filtered.length} {filtered.length !== 1 ? t.products : t.product}
            </p>
            <ProductList products={filtered} addToCart={addToCart} />
          </>
        )}
      </div>
    </div>
  );
}
