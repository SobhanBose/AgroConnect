import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import FarmerSearchProduct from "../components/farmerSearchProduct";
import Loader from "react-js-loader";
import { toast } from "react-toastify";

export default function FarmerProducts() {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProduce = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/farmer/${id}/produce`);
        const data = await res.json();

        if (res.ok) {
          setProducts(data);
        } else {
          toast.error("Something went wrong!");
          console.error("Failed to fetch profile:", data);
        }
      } catch (error) {
        toast.error("Something went wrong!");
        console.error("Error:", error);
      }
      setLoading(false);
    };

    fetchProduce();
  }, [id]);

  const bannerMessages = [
    "👨‍🌾 You're viewing products from a local farmer",
    "🌿 All products are farm-fresh!",
    "🚚 Free delivery over ₹199",
  ];

  return (
    <div className="mt-16 min-h-screen bg-gray-50 pb-24">
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

      <div className="max-w-7xl mx-auto px-4">
        {products.length > 0 && (
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Products by Farmer
          </h2>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader type="bubble-loop" bgColor={"#00a63d"} color={"#00a63d"} title={"Loading..."} size={100} />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 text-sm">No products found for this farmer.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <FarmerSearchProduct key={product.id} phone={id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
