import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/context";
import Loader from "react-js-loader";
import { toast } from "react-toastify";

export default function NearestFarmers() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState([]);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/marketplace/nearby/${user.phone}`
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API error:", res.status, errorText);
        toast.error("Failed to fetch farmers");
        throw new Error("API response error");
      }

      const data = await res.json();
      setFarmers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Something went wrong!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  return (
    <div className="mt-16 px-4 pb-24 bg-gray-50 w-full">
      <h1 className="text-3xl font-bold text-gray-700 mb-6 pt-4">Nearest Farmers</h1>

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
      ) : farmers.length === 0 ? (
        <p className="text-gray-500 text-sm text-center mt-10">
          No farmers found nearby.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {farmers.map((farmer, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-green-700">
                {farmer.user.first_name} {farmer.user.last_name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{farmer.description}</p>
              <div className="flex justify-between align-middle">
              <p className="text-sm text-gray-500 mt-2">
                📍 {farmer.distance_km.toFixed(1)} km away
              </p>
              <p className="text-sm text-gray-500">📞 {farmer.user.phone_no}</p>
              </div>
              <Link
                to={`/farmerProduct/${farmer.user.phone_no}`}
                className="mt-4 inline-block bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
              >
                View All Products
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
