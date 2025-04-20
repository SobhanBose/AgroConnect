import { Link } from "react-router-dom";

export default function OrderCard({ productName, quantity, price }) {
    const totalPrice = quantity * price;

    return (
        <div className="flex flex-col gap-4 justify-center items-center border border-gray-600 rounded-lg shadow-sm p-4 bg-white w-full">
            {/* Product Name */}
            <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-800">{productName}</h3>
            </div>
            <div className="flex w-full justify-between">
                {/* Quantity */}
                <div className=" text-left">
                    <p className="text-sm text-gray-500">Qty</p>
                    <p className="text-base text-gray-700">{quantity}</p>
                </div>

                {/* Price */}
                <div className="text-left">
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-base text-gray-700">${price.toFixed(2)}</p>
                </div>

                {/* Total */}
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-green-600">${totalPrice.toFixed(2)}</p>
                </div>
            </div>
            <div>
                <Link to={`../orders/${1}`} className="text-blue-600 underline">View Details... </Link>
            </div>
        </div>
    );
}

