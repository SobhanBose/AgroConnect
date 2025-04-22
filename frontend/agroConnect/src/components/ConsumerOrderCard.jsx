// import { Link } from "react-router-dom";

// export default function OrderCard({ productName, quantity, price }) {
//     const totalPrice = quantity * price;

//     return (
//         <div className="flex flex-col gap-4 justify-center items-center border border-gray-600 rounded-lg shadow-sm p-4 bg-white w-full">
//             {/* Product Name */}
//             <div className="flex-1">
//                 <h3 className="text-lg font-medium text-gray-800">{productName}</h3>
//             </div>
//             <div className="flex w-full justify-between">
//                 {/* Quantity */}
//                 <div className=" text-left">
//                     <p className="text-sm text-gray-500">Qty</p>
//                     <p className="text-base text-gray-700">{quantity}</p>
//                 </div>

//                 {/* Price */}
//                 <div className="text-left">
//                     <p className="text-sm text-gray-500">Price</p>
//                     <p className="text-base text-gray-700">${price.toFixed(2)}</p>
//                 </div>

//                 {/* Total */}
//                 <div className="text-right">
//                     <p className="text-sm text-gray-500">Total</p>
//                     <p className="text-lg font-semibold text-green-600">${totalPrice.toFixed(2)}</p>
//                 </div>
//             </div>
//             <div>
//                 <Link to={`../orders/${1}`} className="text-blue-600 underline">View Details... </Link>
//             </div>
//         </div>
//     );
// }


import { Link } from "react-router-dom";

export default function OrderCard({ order }) {
    const { orderId, products, totalPrice, orderDate, status } = order;

    // Get a comma-separated list of product names (limit to 3 for summary)
    const productNames = products.slice(0, 3).map(p => p.name).join(", ") + (products.length > 3 ? "..." : "");

    return (
        <div className="flex flex-col gap-3 border border-gray-300 rounded-lg shadow-sm p-4 bg-white w-full">
            {/* Order Summary Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Order #{orderId}</h3>
                <span className="text-sm text-gray-500">{new Date(orderDate).toLocaleDateString()}</span>
            </div>

            {/* Products Summary */}
            <div className="text-gray-700">
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-base">{productNames}</p>
            </div>

            {/* Status and Total */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-sm font-medium text-blue-600">{status}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-green-600">${totalPrice.toFixed(2)}</p>
                </div>
            </div>

            {/* Link to Full Details */}
            <div className="text-right">
                <Link to={`../orders/${orderId}`} className="text-blue-600 text-sm underline">View Details</Link>
            </div>
        </div>
    );
}

