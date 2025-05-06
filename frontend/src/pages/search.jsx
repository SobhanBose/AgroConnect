import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import SearchProduct from "../components/searchProduct";
import Loader from "react-js-loader";
import { toast } from "react-toastify";
import { useUser } from "../context/context";

const categories = ["All", "Vegetable", "Fruit", "Organic", "Dairy"];
const sortOptions = [
  { label: "Harvest Date", value: "harvest_date" },
  { label: "Price: Low to High", value: "rate" },
  { label: "Price: High to Low", value: "-rate" },
  { label: "Nearest Farmer", value: "nearest" },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Search() {
  const { user } = useUser();
  const queryParam = useQuery().get("q") || "";

  const [loading, setLoading] = useState(false);
  const [nearestSortedProducts, setNearestSortedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [sortBy, setSortBy] = useState("harvest_date");

  const bannerMessages = [
    "🌱 Welcome to AgroConnect! Fresh deals daily!",
    "🚚 Free delivery above ₹199",
    "⚡ Instant deals every hour",
    "🍎 Farm-fresh fruits at your doorstep",
    "🧀 Local dairy offers this week!",
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("phone_no", user.phone);
      if (queryParam) params.append("name", queryParam);

      const res = await fetch(
        `https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/marketplace/?${params.toString()}`
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API response error:", res.status, errorText);
        toast.error(`Failed to fetch: ${res.statusText}`);
        throw new Error("Invalid response from API");
      }

      const data = await res.json();
      const productList = Array.isArray(data) ? data : [];

      setNearestSortedProducts(productList); // Preserve original "nearest" order
      setProducts(applyFiltersAndSort(productList, filteredCategory, sortBy));
    } catch (err) {
      toast.error("Something went wrong!");
      console.error("Failed to fetch products", err);
      setNearestSortedProducts([]);
      setProducts([]);
    }
    setLoading(false);
  };

  const applyFiltersAndSort = (data, category, sortOption) => {
    let result = [...data];

    if (category !== "All") {
      result = result.filter(
        (p) => p.tag?.toLowerCase() === category.toLowerCase()
      );
    }

    if (sortOption === "rate") {
      result.sort((a, b) => a.rate - b.rate);
    } else if (sortOption === "-rate") {
      result.sort((a, b) => b.rate - a.rate);
    } else if (sortOption === "harvest_date") {
      result.sort(
        (a, b) => new Date(b.harvest_date) - new Date(a.harvest_date)
      );
    }

    // If 'nearest', keep original order from API
    return result;
  };

  useEffect(() => {
    fetchProducts();
  }, [queryParam]);

  useEffect(() => {
    const filtered = applyFiltersAndSort(
      nearestSortedProducts,
      filteredCategory,
      sortBy
    );
    setProducts(filtered);
  }, [filteredCategory, sortBy, nearestSortedProducts]);

  return (
    <div className="mt-16 h-full bg-gray-50 pb-24">
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

      <div className="px-2">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Products</h2>
        <Link
          className="underline font-semibold text-green-600"
          to={"/nearestFarmers"}
        >
          <p className="underline">Explore Your Nearest Farmers</p>
        </Link>

        <div className="flex flex-row-reverse flex-wrap justify-between items-center mb-4 mt-2">
          <div className="flex gap-2 justify-between">
            <div>
              <label>Sort By: </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 text-sm bg-green-600 text-white rounded-2xl"
              >
                {sortOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-white text-green-700 text-sm"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Filter: </label>
              <select
                value={filteredCategory}
                onChange={(e) => setFilteredCategory(e.target.value)}
                className="p-2 text-sm bg-green-600 text-white rounded-2xl"
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-white text-green-700 text-sm"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader
                type="bubble-loop"
                bgColor={"#00a63d"}
                color={"#00a63d"}
                title={"Loading..."}
                size={100}
              />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 mt-10 text-sm">
              No products matched.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <SearchProduct key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
