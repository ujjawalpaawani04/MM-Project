import { useState } from "react";
import { useSearchParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FiFilter, FiX, FiSearch } from "react-icons/fi";
import { PackageSearch } from "lucide-react";

import { products } from "../../data/products";
import { useProductFilters } from "../../hooks/useProductFilters";
import useTypewriter from "../../hooks/useTypewriter";
import ProductFilters from "./Components/ProductFilter";
import ProductCard from "../../components/website/ProductCard";
import ProductQuickView from "../../components/website/ProductQuickView";
import ShopHero from "./Components/ShopHero";
import ShopByCategory from "./Components/ShopByCategory";
import ShopRecentlyViewed from "./Components/ShopRecentlyViewed";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import Seo from "../../components/common/Seo";

// Animated placeholder suggestions — Shop search only. Module-level constant so
// its identity is stable across renders (won't re-trigger the typewriter effect).
const SEARCH_SUGGESTIONS = [
  "Naruto Miniatures",
  "One Piece Figures",
  "Dragon Ball Collectibles",
  "Demon Slayer Miniatures",
  "Jujutsu Kaisen Figures",
  "Attack on Titan Figures",
  "Marvel Collectibles",
  "DC Superhero Figures",
  "Limited Edition Miniatures",
  "Best Selling Figures",
  "New Arrivals",
  "Premium Collectibles",
];
export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const f = useProductFilters(products, initialSearch, initialCategory);
  const [quickView, setQuickView] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Typewriter placeholder runs only while the field is empty; it freezes the
  // moment the user starts typing and resumes when the field is cleared.
  const typed = useTypewriter(SEARCH_SUGGESTIONS, {
    enabled: f.filters.search.length === 0,
  });

  return (
    <>
      <Seo
        title="Shop"
        url="https://mohanmaya.com/shop"
        description="Browse all handcrafted devotional miniatures — festival, wedding, birthday & limited-edition collections. Free shipping over ₹1999."
      />
      <ShopHero />

      <section className="bg-cream-100 dark:bg-ink-900">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-20">     
             {/* Search + toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-gray-400" />
            <input
              type="search"
              value={f.filters.search}
              onChange={(e) => f.setSearch(e.target.value)}
              placeholder={`${typed}│`}
              aria-label="Search products"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black dark:border-slate-700 dark:bg-slate-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-brand-400"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {f.totalResults} product{f.totalResults !== 1 ? "s" : ""}
            </p>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="xl:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium"
            >
              <FiFilter /> Filters
              {f.activeFilterCount > 0 && (
                <span className="bg-brand-500 text-white text-xs px-1.5 rounded-full">
                  {f.activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Desktop filters */}
          <div className="hidden xl:block">
            <ProductFilters
              filters={f.filters}
              toggleArrayValue={f.toggleArrayValue}
              setSort={f.setSort}
              clearFilters={f.clearFilters}
              activeFilterCount={f.activeFilterCount}
            />
          </div>

          {/* Grid */}
          <div className="flex-1">
            {f.results.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No products found"
                description="Try adjusting your filters or search term."
                actionLabel="Clear all filters"
                onAction={f.clearAll}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {f.results.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={setQuickView}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={f.page}
                  totalPages={f.totalPages}
                  onPageChange={f.setPage}
                  className="mt-12"
                />
              </>
            )}
          </div>
        </div></div>

      </section>
      <ShopRecentlyViewed />
      {/* <ShopTestimonials /> */}
      {/* Premium discovery sections */}
      <ShopByCategory />
      {/* <WhyChooseMohanMaya /> */}


      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="xl:hidden fixed inset-0 z-[999]">
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white dark:bg-slate-900 overflow-y-auto p-4"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold dark:text-white">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <FiX />
                </button>
              </div>
              <ProductFilters
                filters={f.filters}
                toggleArrayValue={f.toggleArrayValue}
                setSort={f.setSort}
                clearFilters={f.clearFilters}
                activeFilterCount={f.activeFilterCount}
              />
              <Button
                fullWidth
                className="mt-4"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Show {f.totalResults} results
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ProductQuickView
        product={quickView}
        isOpen={!!quickView}
        onClose={() => setQuickView(null)}
      />
    </>
  );
}
