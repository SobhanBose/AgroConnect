import { useState } from "react";
import ProductCard from "../components/productCard";

export default function FarmerProduct() {
    const [searchTerm, setSearchTerm] = useState("");

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
        <div className="p-6 flex flex-col w-full">
            <h2 className="text-3xl font-bold mb-4 text-left w-full">My Products</h2>

            <input
                type="text"
                placeholder="Search product by name..."
                className="mb-6 px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex flex-row flex-wrap justify-between w-full grow overflow-scroll gap-2">
                {filteredProducts.map(product => (
                    
                    <ProductCard
                        key={product._id}
                        product={product}
                        onEdit={(product) => console.log("Edit:", product)}
                        onDelete={(id) => console.log("Delete ID:", id)}
                    />
                ))}
            </div>
        </div>
    );
}
