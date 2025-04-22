import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFilter, FaSort, FaMapMarkerAlt } from "react-icons/fa";
import SearchProduct from "../components/searchProduct";

const API_URL = "https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/marketplace/";

const categories = ["All", "Vegetable", "Fruit", "Organic", "Dairy"];
const sortOptions = [
  { label: "Harvest Date", value: "harvest_date" },
  { label: "Price: Low to High", value: "rate" },
  { label: "Price: High to Low", value: "-rate" },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Search() {
  const queryParam = useQuery().get("q") || "";
  const [products, setProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [sortBy, setSortBy] = useState("harvest_date");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (queryParam) params.append("name", queryParam);
        if (sortBy) params.append("sort_by", sortBy);

        const res = await fetch(`${API_URL}?${params.toString()}`);
        const data = await res.json();

        let productList = Array.isArray(data) ? data : [];

        if (filteredCategory !== "All") {
          productList = productList.filter(
            (p) => p.tag?.toLowerCase() === filteredCategory.toLowerCase()
          );
        }

        setProducts(productList);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, [queryParam, filteredCategory, sortBy]);

  const bannerMessages = [
    "🌱 Welcome to AgroConnect! Fresh deals daily!",
    "🚚 Free delivery above ₹199",
    "⚡ Instant deals every hour",
    "🍎 Farm-fresh fruits at your doorstep",
    "🧀 Local dairy offers this week!",
  ];

  return (
    <div className="mt-16 min-h-screen bg-gray-50 pb-24">
      {/* Banner */}
      <div className="w-full overflow-hidden bg-green-100 py-3 mb-4">
        <motion.div
          className="flex gap-10 text-sm font-medium text-green-900 whitespace-nowrap px-4"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {bannerMessages.concat(bannerMessages).map((msg, idx) => (
            <span key={idx}>{msg}</span>
          ))}
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <FaMapMarkerAlt className="text-green-600 text-base" />
          <span>
            Delivering to <span className="font-medium">Kolkata, West Bengal</span>
          </span>
        </div>

        <div className="flex gap-3">
          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center bg-green-600 text-white text-sm py-1.5 px-3 rounded-md hover:bg-green-700"
            >
              <FaSort className="mr-1.5 text-base" /> Sort
            </button>
            {showSort && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg w-48 z-10 text-sm">
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSort(false);
                    }}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center bg-green-600 text-white text-sm py-1.5 px-3 rounded-md hover:bg-green-700"
            >
              <FaFilter className="mr-1.5 text-base" /> Filter
            </button>
            {showFilter && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-10 text-sm">
                {categories.map((category) => (
                  <div
                    key={category}
                    onClick={() => {
                      setFilteredCategory(category);
                      setShowFilter(false);
                    }}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Products</h2>
        {isLoading ? (
          <p className="text-center text-gray-500 mt-10 text-sm">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 text-sm">No products matched.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <SearchProduct key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
