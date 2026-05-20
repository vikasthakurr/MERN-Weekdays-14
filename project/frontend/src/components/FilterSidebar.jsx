import { useState } from "react";
import { ChevronDown, X, Star } from "lucide-react";

export const SORT_OPTIONS = [
  { value: "newest",     label: "Newest first" },
  { value: "popular",    label: "Most popular" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const Section = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#E8E8E8] pb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-2 text-sm font-semibold text-[#1A1A1A]"
      >
        {title}
        <ChevronDown size={15} className={`text-[#717171] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

const PriceRange = ({ min, max, value, onChange }) => {
  const [lo, hi] = value;
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-medium text-[#717171]">
        <span>${lo}</span>
        <span>${hi}</span>
      </div>
      <div className="relative h-1 bg-[#E8E8E8] rounded-full">
        <div
          className="absolute h-1 bg-[#1A1A1A] rounded-full"
          style={{
            left:  `${((lo - min) / (max - min)) * 100}%`,
            right: `${100 - ((hi - min) / (max - min)) * 100}%`,
          }}
        />
        <input type="range" min={min} max={max} value={lo}
          onChange={(e) => { const v = Math.min(Number(e.target.value), hi - 1); onChange([v, hi]); }}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
          style={{ zIndex: lo > max - 10 ? 5 : 3 }}
        />
        <input type="range" min={min} max={max} value={hi}
          onChange={(e) => { const v = Math.max(Number(e.target.value), lo + 1); onChange([lo, v]); }}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
};

const RatingFilter = ({ value, onChange }) => (
  <div className="space-y-1">
    {[4, 3, 2, 1].map((r) => (
      <button key={r} onClick={() => onChange(value === r ? null : r)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors
          ${value === r
            ? "bg-[#1A1A1A] text-white"
            : "text-[#717171] hover:bg-[#F6F6F6] hover:text-[#1A1A1A]"}`}
      >
        <span className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11}
              fill={i < r ? (value === r ? "white" : "#F5A623") : "none"}
              className={i < r ? (value === r ? "text-white" : "text-[#F5A623]") : "text-[#E8E8E8]"}
            />
          ))}
        </span>
        <span>{r}+ stars</span>
      </button>
    ))}
  </div>
);

const FilterSidebar = ({ categories, filters, onChange, onReset }) => {
  const { category, priceRange, minRating, sort } = filters;
  const hasActive = category !== "all" || priceRange[0] > 0 || priceRange[1] < 1000 || minRating || sort !== "newest";

  return (
    <aside className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <span className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Filters</span>
        {hasActive && (
          <button onClick={onReset}
            className="flex items-center gap-1 text-xs font-medium text-[#717171] hover:text-[#1A1A1A] transition-colors">
            <X size={12} /> Reset
          </button>
        )}
      </div>

      {/* Sort */}
      <Section title="Sort by">
        <div className="space-y-0.5">
          {SORT_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => onChange({ sort: opt.value })}
              className={`w-full text-left px-3 py-2 rounded-full text-sm font-medium transition-colors
                ${sort === opt.value
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#717171] hover:bg-[#F6F6F6] hover:text-[#1A1A1A]"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Category */}
      <Section title="Category">
        <div className="space-y-0.5">
          {["all", ...categories].map((cat) => (
            <button key={cat} onClick={() => onChange({ category: cat })}
              className={`w-full text-left px-3 py-2 rounded-full text-sm font-medium capitalize transition-colors
                ${category === cat
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#717171] hover:bg-[#F6F6F6] hover:text-[#1A1A1A]"}`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </Section>

      {/* Price */}
      <Section title="Price Range">
        <PriceRange min={0} max={1000} value={priceRange} onChange={(v) => onChange({ priceRange: v })} />
      </Section>

      {/* Rating */}
      <Section title="Min Rating">
        <RatingFilter value={minRating} onChange={(v) => onChange({ minRating: v })} />
      </Section>
    </aside>
  );
};

export default FilterSidebar;
