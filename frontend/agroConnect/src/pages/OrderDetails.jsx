// export default function OrderDetails() {

//     const MapEmbed = ({ lat, lng }) => {
//         const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`

//         return (
//             <div className="w-full h-64 rounded-2xl overflow-hidden shadow">
//                 <iframe
//                     title="Google Map"
//                     src={mapSrc}
//                     width="100%"
//                     height="100%"
//                     style={{ border: 0 }}
//                     allowFullScreen
//                     loading="lazy"
//                 ></iframe>
//             </div>
//         )
//     }


//     const productName = 'Chilli';
//     const price = 45;
//     const quantity = 2;
//     const lat = 25.5941;
//     const long = 85.1376;
//     const totalPrice = quantity * price;



//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
//             <h1 className="text-3xl font-bold mb-4 text-left w-full">Order Details</h1>

//             {/* Order Info */}
//             <div className="flex flex-col gap-4 text-gray-700">
//                 <div>
//                     <p className="font-medium">Product Name:</p>
//                     <p className="text-2xl font-bold">{productName}</p>
//                 </div>

//                 <div>
//                     <p className="font-medium">Price:</p>
//                     <p className="text-2xl font-bold">${price.toFixed(2)}</p>
//                 </div>

//                 <div>
//                     <p className="font-medium">Quantity:</p>
//                     <p className="text-2xl font-bold">{quantity}</p>
//                 </div>

//                 <div>
//                     <p className="font-medium">Total Price:</p>
//                     <p className="text-green-600 text-2xl font-bold">${totalPrice.toFixed(2)}</p>
//                 </div>

//                 <div className="col-span-2">
//                     <p className="font-medium">Customer Coordinates:</p>
//                     <p className="text-2xl font-bold"><span className="text-xl font-normal">Latitude: </span>{lat}</p>
//                     <p className="text-2xl font-bold"><span className="text-xl font-normal">Longitude: </span>{long}</p>
//                 </div>
//             </div>

//             {/* Google Map Embed */}
//             <div className="w-full h-72">
//                 <MapEmbed lat={lat} lng={long} />
//             </div>
//         </div>
//     );
// }


import { useParams, Link } from "react-router-dom";

// Dummy data for demonstration (replace with API data later)
const dummyOrder = {
    orderId: "ORD123",
    orderDate: "2025-04-18T10:20:00Z",
    totalPrice: 89.75,
    products: [
        {
            name: "Tomato",
            farmerName: "Ravi Kumar",
            quantity: 2,
            price: 20,
            harvestDate: "2025-04-15",
        },
        {
            name: "Potato",
            farmerName: "Sita Devi",
            quantity: 3,
            price: 15,
            harvestDate: "2025-04-14",
        },
    ],
};

export default function OrderDetails() {
    const { orderId } = useParams();
    const order = dummyOrder; // Replace with actual fetch based on `orderId`

    return (
        <div className="max-w-3xl mx-auto p-4">
            <Link to="../orders" className="text-blue-600 underline mb-4 inline-block">← Back to Orders</Link>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order #{order.orderId}</h2>
            <p className="text-gray-600 text-sm mb-4">Date: {new Date(order.orderDate).toLocaleDateString()}</p>

            <div className="space-y-4">
                {order.products.map((product, index) => (
                    <div
                        key={index}
                        className="border rounded-md shadow-sm p-4 bg-white"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                            <span className="text-sm text-gray-500">
                                ₹{(product.price * product.quantity).toFixed(2)}
                            </span>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1">
                            <p className="flex gap-2">
                                <span className="font-medium">Farmer:</span>{" "}
                                <p className="text-green-600">
                                    {product.farmerName}
                                </p>
                            </p>
                            <p>
                                <span className="font-medium">Quantity:</span> {product.quantity}
                            </p>
                            <p>
                                <span className="font-medium">Harvest Date:</span>{" "}
                                {new Date(product.harvestDate).toLocaleDateString()}
                            </p>
                            <p>
                                <span className="font-medium">Price/unit:</span> ₹{product.price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-right mt-6">
                <p className="text-lg font-bold text-green-700">
                    Total: ₹{order.totalPrice.toFixed(2)}
                </p>
            </div>
        </div>
    );
}
