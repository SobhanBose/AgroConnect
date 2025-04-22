import { useState } from "react";
import ProductCard from "../components/productCard";
import OrderCard from "../components/ConsumerOrderCard";


export default function ConsumerOrder(){
    const [searchTerm, setSearchTerm] = useState("");

const order =    {
        orderId: "ORD123",
        orderDate: "2025-04-18T10:20:00Z",
        status: "Delivered",
        totalPrice: 89.75,
        products: [
            { name: "Tomato", quantity: 2 },
            { name: "Potato", quantity: 1 },
            { name: "Onion", quantity: 3 },
            { name: "Carrot", quantity: 1 },
        ]
    }
    
    
        const products = [
            {
                _id: '1',
                name: 'Fresh Tomatoes',
                price: 40,
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
            },
            {
                _id: '2',
                name: 'Long Brinjals',
                price: 30,
                imageUrl: 'https://fpsstore.in/cdn/shop/products/BrinjalLong.jpg?v=1641627205',
            },
            {
                _id: '3',
                name: 'Green Chilies',
                price: 20,
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Green_Chillies.jpg',
            },
            {
                _id: '4',
                name: 'Red Onions',
                price: 35,
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Red_Onions.jpg',
            },
        ];
    
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        return (
            <div className="p-6 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-4 text-left w-full">My Orders</h2>
    
                <input
                    type="text"
                    placeholder="Search product by name..."
                    className="mb-6 px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
    
                <div className="flex flex-wrap justify-center gap-5 w-full overflow-scroll">
                    {filteredProducts.map(product => (
                        <OrderCard order={order} />
                    ))}
                </div>
            </div>
        );
}