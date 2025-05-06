import { Link } from "react-router-dom";
import { useUser } from "../context/context";
import FullScreenLoader from "./fullScreenLoader";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function FarmerOrderCard({ productName, quantity, price, status, orderId, refresh, setRefresh }) {
    const {user} = useUser();
    const [loading, setLoading] = useState(false);  

    const handlePackClick = async () => {
        setLoading(true);  
        
        try {
            const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/orders/farmer/${user.phone}/${orderId}/pack`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (res.ok) {
                setRefresh(!refresh)
                
                toast.success("Order has been packed successfully!");
            } else {
                toast.error("Failed to pack the order.");
            }
        } catch (error) {
            toast.error("Something went wrong while packing the order.");
            console.error("Error packing order:", error);
        } finally {
            setLoading(false);  // Reset loading state
        }
    };
    const totalPrice = quantity * price;

    return (
        <div className="flex flex-col gap-4 justify-center items-center border border-gray-600 rounded-lg shadow-sm p-4 bg-white w-full max-w-sm">
            <FullScreenLoader show={loading}/>
            <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-800">{productName}</h3>
            </div>
            <div className="flex w-full justify-between">
                <div className="text-left">
                    <p className="text-sm text-gray-500">Qty</p>
                    <p className="text-base text-gray-700">{quantity}</p>
                </div>
                <div className="text-left">
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-base text-gray-700">₹{price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-green-600">₹{totalPrice.toFixed(2)}</p>
                </div>
            </div>

            <p className="text-sm italic text-gray-500">Status: {status}</p>

            {status === "Pending" && (
                <div className="flex gap-2 mt-2">
                    <button onClick={handlePackClick} className="px-3 py-1 bg-yellow-400 text-white rounded">Pack</button>
                </div>
            )}

            <div>
                <Link to={`../orders/${orderId}`} className="text-blue-600 underline">
                    View Details...
                </Link>
            </div>
        </div>
    );
}
