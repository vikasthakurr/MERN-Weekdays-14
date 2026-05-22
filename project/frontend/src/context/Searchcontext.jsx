import { createContext, useContext, useState, useMemo } from "react";
import rawProducts from "../data/products.json";

const ALL_PRODUCTS = rawProducts.products.map((p) => ({
  _id: String(p.id),
  name: p.title,
  image: p.thumbnail,
  price: p.price,
  category: p.category,
  rating: p.rating,
  stock: p.stock,
  description: p.description,
  reviews: p.reviews ?? [],
}));

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");

  // When query is empty → return all products, otherwise filter
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [query]);

  const clearSearch = () => setQuery("");

  return (
    <SearchContext.Provider value={{ query, setQuery, results, clearSearch, allProducts: ALL_PRODUCTS }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);
