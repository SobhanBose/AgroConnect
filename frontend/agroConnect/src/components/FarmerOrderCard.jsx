import { Link } from "react-router-dom";

export default function FarmerOrderCard({ productName, quantity, price, status, orderId }) {
    const totalPrice = quantity * price;

    return (
        <div className="flex flex-col gap-4 justify-center items-center border border-gray-600 rounded-lg shadow-sm p-4 bg-white w-full max-w-sm">
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
                    <p className="text-base text-gray-700">${price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-green-600">${totalPrice.toFixed(2)}</p>
                </div>
            </div>

            <p className="text-sm italic text-gray-500">Status: {status}</p>

            {status === "Pending" && (
                <div className="flex gap-2 mt-2">
                    <button className="px-3 py-1 bg-yellow-400 text-white rounded">Pack</button>
                    <button className="px-3 py-1 bg-green-500 text-white rounded">Mark Complete</button>
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
