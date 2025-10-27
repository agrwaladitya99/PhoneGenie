"use client";

import { useState, useMemo } from "react";
import { loadMobiles } from "@/lib/data/mobile-service";
import ProductCard from "@/components/product/ProductCard";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, Home } from "lucide-react";
import Link from "next/link";
import { Mobile } from "@/types/mobile";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "rating">("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const allPhones = loadMobiles();

  // Group phones by brand
  const phonesByBrand = useMemo(() => {
    const grouped = new Map<string, Mobile[]>();
    
    allPhones.forEach(phone => {
      const brand = phone.brand_name;
      if (!grouped.has(brand)) {
        grouped.set(brand, []);
      }
      grouped.get(brand)!.push(phone);
    });

    // Sort brands alphabetically
    const sortedEntries = Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    return new Map(sortedEntries);
  }, [allPhones]);

  const brands = Array.from(phonesByBrand.keys());

  // Filter and sort logic
  const filteredPhonesByBrand = useMemo(() => {
    const filtered = new Map<string, Mobile[]>();

    phonesByBrand.forEach((phones, brand) => {
      // Filter by selected brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(brand)) {
        return;
      }

      let brandPhones = phones.filter(phone => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (!phone.model.toLowerCase().includes(query)) {
            return false;
          }
        }

        // Price range filter
        if (phone.price < priceRange[0] || phone.price > priceRange[1]) {
          return false;
        }

        return true;
      });

      // Sort phones
      brandPhones.sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return b.rating - a.rating;
          case "name":
          default:
            return a.model.localeCompare(b.model);
        }
      });

      if (brandPhones.length > 0) {
        filtered.set(brand, brandPhones);
      }
    });

    return filtered;
  }, [phonesByBrand, searchQuery, priceRange, selectedBrands, sortBy]);

  const toggleBrandExpansion = (brand: string) => {
    const newExpanded = new Set(expandedBrands);
    if (newExpanded.has(brand)) {
      newExpanded.delete(brand);
    } else {
      newExpanded.add(brand);
    }
    setExpandedBrands(newExpanded);
  };

  const toggleBrandFilter = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const totalPhones = Array.from(filteredPhonesByBrand.values()).reduce((sum, phones) => sum + phones.length, 0);

  return (
    <div className="min-h-screen">
      {/* Header - Responsive */}
      <header className="glass sticky top-0 z-50 border-b border-white/10 backdrop-blur-2xl">
        <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/" className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Home size={18} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium hidden xs:inline">Back to Chat</span>
                <span className="text-xs sm:text-sm font-medium xs:hidden">Back</span>
              </Link>
              <div className="w-px h-5 sm:h-6 bg-gray-300 dark:bg-white/20"></div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight">
                <span className="text-gray-900 dark:text-white drop-shadow-lg">Phone </span>
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Catalog</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <div className="text-gray-600 dark:text-white/70 text-[11px] sm:text-sm font-medium hidden md:block">
                {totalPhones} phones • {filteredPhonesByBrand.size} brands
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Search and Filters Bar - Responsive */}
        <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-white/20">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {/* Search - Responsive */}
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/50" size={16} />
              <input
                type="text"
                placeholder="Search phones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-lg sm:rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/50 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Sort & Filter - Responsive */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 sm:flex-initial bg-black/5 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-base text-gray-900 dark:text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer [&>option]:bg-white dark:[&>option]:bg-gray-900 [&>option]:text-gray-900 dark:[&>option]:text-white"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-gray-900 dark:text-white flex items-center gap-1.5 sm:gap-2 transition-all text-xs sm:text-base"
              >
                <SlidersHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Filters</span>
                {(selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 200000) && (
                  <span className="bg-purple-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                    {selectedBrands.length > 0 ? selectedBrands.length : '•'}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Brand Filter */}
              <div>
                <label className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">Filter by Brand</label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 glass-dark rounded-lg p-3">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-1.5 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrandFilter(brand)}
                        className="w-4 h-4 rounded border-white/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                      />
                      <span className="text-gray-900 dark:text-white/90 text-sm capitalize">{brand}</span>
                      <span className="text-gray-500 dark:text-white/40 text-xs ml-auto">
                        ({phonesByBrand.get(brand)?.length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-gray-900 dark:text-white text-sm font-semibold mb-2 block">
                  Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                </label>
                <div className="space-y-3 glass-dark rounded-lg p-3">
                  <div>
                    <label className="text-gray-700 dark:text-white/70 text-xs mb-1 block">Min Price</label>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 dark:text-white/70 text-xs mb-1 block">Max Price</label>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setPriceRange([0, 200000]);
                      setSelectedBrands([]);
                    }}
                    className="w-full text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white text-xs py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brand Sections - Responsive */}
        {filteredPhonesByBrand.size === 0 ? (
          <div className="glass rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-white/20">
            <div className="text-gray-600 dark:text-white/50 text-base sm:text-lg mb-2">No phones found</div>
            <div className="text-gray-400 dark:text-white/30 text-xs sm:text-sm">Try adjusting your filters or search query</div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {Array.from(filteredPhonesByBrand.entries()).map(([brand, phones]) => (
              <div key={brand} className="glass rounded-xl sm:rounded-2xl border border-white/20 overflow-hidden">
                {/* Brand Header - Responsive */}
                <button
                  onClick={() => toggleBrandExpansion(brand)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1.5 sm:p-2 rounded-lg">
                      <span className="text-white font-bold text-base sm:text-xl capitalize">
                        {brand.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white capitalize">{brand}</h2>
                      <p className="text-gray-600 dark:text-white/60 text-xs sm:text-sm">{phones.length} models</p>
                    </div>
                  </div>
                  {expandedBrands.has(brand) ? (
                    <ChevronUp className="text-gray-600 dark:text-white/70" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-600 dark:text-white/70" size={20} />
                  )}
                </button>

                {/* Phone Grid - Responsive */}
                {expandedBrands.has(brand) && (
                  <div className="p-2 sm:p-4 pt-0 border-t border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                      {phones.map((phone, index) => (
                        <ProductCard key={`${phone.model}-${index}`} phone={phone} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

