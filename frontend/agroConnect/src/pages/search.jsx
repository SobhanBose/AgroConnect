import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaFilter, FaSort,FaMapMarkerAlt } from 'react-icons/fa';

const isAuthenticated = true;

const mockProducts = [
  {
    id: 1,
    name: "Organic Tomatoes",
    price: 40,
    category: "Vegetable",
    location: "Kolkata",
    rating: 4.5,
    quantity: "1 kg",
    distance: 2.3,
    image: "https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg",
  },
  {
    id: 2,
    name: "Fresh Mangoes",
    price: 100,
    category: "Fruit",
    location: "Howrah",
    rating: 4.7,
    quantity: "1 dozen",
    distance: 6.5,
    image: "https://images.pexels.com/photos/5945903/pexels-photo-5945903.jpeg",
  },
  {
    id: 3,
    name: "Farm Potatoes",
    price: 20,
    category: "Vegetable",
    location: "Nearby",
    rating: 4.2,
    quantity: "5 kg",
    distance: 1.1,
    image: "https://images.pexels.com/photos/48888/potatoes-vegetables-potato-vegetable-48888.jpeg",
  },
  {
    id: 4,
    name: "Fresh Milk (Full Cream)",
    price: 60,
    category: "Dairy",
    location: "Kolkata",
    rating: 4.8,
    quantity: "1 L",
    distance: 1.5,
    image: "https://images.pexels.com/photos/3735159/pexels-photo-3735159.jpeg",
  },
  {
    id: 5,
    name: "Sweet Bananas",
    price: 45,
    category: "Fruit",
    location: "North 24 Parganas",
    rating: 4.6,
    quantity: "1 dozen",
    distance: 3.8,
    image: "https://images.pexels.com/photos/41957/banana-fruit-food-healthy-41957.jpeg",
  },
];

const categories = ["All", "Vegetable", "Fruit", "Organic", "Dairy"];
const sortOptions = ["Nearest", "Price: Low to High", "Price: High to Low"];

const bannerMessages = [
  "🌱 Welcome to AgroConnect! Fresh deals daily!",
  "🚚 Free delivery above ₹199",
  "⚡ Instant deals every hour",
  "🍎 Farm-fresh fruits at your doorstep",
  "🧀 Local dairy offers this week!",
];

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
};

export default function Search() {
    const [products, setProducts] = useState([]);
    const [filteredCategory, setFilteredCategory] = useState("All");
    const [sortBy, setSortBy] = useState("Nearest");
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
  
    useEffect(() => {
      let data = [...mockProducts];
      if (filteredCategory !== "All") {
        data = data.filter((p) => p.category === filteredCategory);
      }
      switch (sortBy) {
        case "Price: Low to High":
          data.sort((a, b) => a.price - b.price);
          break;
        case "Price: High to Low":
          data.sort((a, b) => b.price - a.price);
          break;
        case "Nearest":
          data.sort((a, b) => a.distance - b.distance);
          break;
      }
      setProducts(data);
    }, [filteredCategory, sortBy]);

  return (
    <div className="mt-16 min-h-screen bg-gray-50 pb-24">
      {/* Hero auto-scrolling banner */}
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

      {/* Sort and Filter Buttons */}
      <div className="flex justify-between items-center mb-6 px-4">
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaMapMarkerAlt className="text-green-600 text-base" />
            <span>
            Delivering to <span className="font-medium">Kolkata, West Bengal</span>
            </span>
        </div>

        {/* Sort & Filter */}
        <div className="flex gap-3">
            {/* Sort Button */}
            <div className="relative">
            <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center bg-green-600 text-white text-sm py-1.5 px-3 rounded-md hover:bg-green-700"
            >
                <FaSort className="mr-1.5 text-base" /> Sort
            </button>
            {showSort && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-10 text-sm">
                {sortOptions.map((option) => (
                    <div
                    key={option}
                    onClick={() => {
                        setSortBy(option);
                        setShowSort(false);
                    }}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                    >
                    {option}
                    </div>
                ))}
                </div>
            )}
            </div>

            {/* Filter Button */}
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


      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <img
          src="https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Ad Banner"
          className="w-full h-40 object-cover rounded-xl shadow"
        />
      </div>

      {/* Product Carousel */}
        <div className="max-w-7xl mx-auto px-4">
        {/* Recommended for You */}
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Recommended for You</h2>
        <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={4000}>
            {mockProducts.map((product) => (
            <div key={product.id} className="p-2">
                <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-28 object-cover"
                />
                <div className="p-2">
                    <h3 className="text-sm font-medium truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.quantity}</p>
                    <div className="flex justify-between items-center mt-1">
                    <span className="text-green-600 font-semibold text-sm">₹{product.price}</span>
                    <span className="text-[10px] text-gray-400">{product.distance} km</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                    <button className="flex-1 bg-green-600 text-white text-xs py-1 rounded hover:bg-green-700">View</button>
                    <button className="flex-1 border border-green-600 text-green-600 text-xs py-1 rounded hover:bg-green-100">Add</button>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </Carousel>
        </div>

        {/* Trending Products */}
        <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Trending Products</h2>
        <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={4000}>
            {mockProducts.map((product) => (
            <div key={product.id} className="p-2">
                <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-28 object-cover"
                />
                <div className="p-2">
                    <h3 className="text-sm font-medium truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.quantity}</p>
                    <div className="flex justify-between items-center mt-1">
                    <span className="text-green-600 font-semibold text-sm">₹{product.price}</span>
                    <span className="text-[10px] text-gray-400">{product.distance} km</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                    <button className="flex-1 bg-green-600 text-white text-xs py-1 rounded hover:bg-green-700">View</button>
                    <button className="flex-1 border border-green-600 text-green-600 text-xs py-1 rounded hover:bg-green-100">Add</button>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </Carousel>
        </div>

        {/* Ad Section with Framer Motion */}
      <motion.div
        className="bg-green-600 text-white p-4 rounded-lg shadow-lg my-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-semibold text-xl">Special Offer: 20% Off on All Products!</h2>
        <p className="mt-2 text-sm">Get 20% off on all items in our store. Limited time offer!</p>
        <button className="mt-4 bg-white text-green-600 py-2 px-4 rounded-lg hover:bg-green-100">
          Shop Now
        </button>
      </motion.div>

        {/* Best Deals */}
        <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Best Deals</h2>
        <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={4000}>
            {mockProducts.map((product) => (
            <div key={product.id} className="p-2">
                <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-28 object-cover"
                />
                <div className="p-2">
                    <h3 className="text-sm font-medium truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.quantity}</p>
                    <div className="flex justify-between items-center mt-1">
                    <span className="text-green-600 font-semibold text-sm">₹{product.price}</span>
                    <span className="text-[10px] text-gray-400">{product.distance} km</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                    <button className="flex-1 bg-green-600 text-white text-xs py-1 rounded hover:bg-green-700">View</button>
                    <button className="flex-1 border border-green-600 text-green-600 text-xs py-1 rounded hover:bg-green-100">Add</button>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </Carousel>
        </div>

        {/* Top Rated Products */}
        <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Top Rated Products</h2>
        <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={4000}>
            {mockProducts.map((product) => (
            <div key={product.id} className="p-2">
                <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-28 object-cover"
                />
                <div className="p-2">
                    <h3 className="text-sm font-medium truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.quantity}</p>
                    <div className="flex justify-between items-center mt-1">
                    <span className="text-green-600 font-semibold text-sm">₹{product.price}</span>
                    <span className="text-[10px] text-gray-400">{product.distance} km</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                    <button className="flex-1 bg-green-600 text-white text-xs py-1 rounded hover:bg-green-700">View</button>
                    <button className="flex-1 border border-green-600 text-green-600 text-xs py-1 rounded hover:bg-green-100">Add</button>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </Carousel>
        </div>

        {/* New Arrivals */}
        <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">New Arrivals</h2>
        <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={4000}>
            {mockProducts.map((product) => (
            <div key={product.id} className="p-2">
                <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-28 object-cover"
                />
                <div className="p-2">
                    <h3 className="text-sm font-medium truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.quantity}</p>
                    <div className="flex justify-between items-center mt-1">
                    <span className="text-green-600 font-semibold text-sm">₹{product.price}</span>
                    <span className="text-[10px] text-gray-400">{product.distance} km</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                    <button className="flex-1 bg-green-600 text-white text-xs py-1 rounded hover:bg-green-700">View</button>
                    <button className="flex-1 border border-green-600 text-green-600 text-xs py-1 rounded hover:bg-green-100">Add</button>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </Carousel>
        </div>

      {/* No Products */}
      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-sm">No products found.</p>
      )}
    </div>
  );
}