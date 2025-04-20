import { useState } from "react";
import ProductCard from "../components/productCard";
import OrderCard from "../components/FarmerOrderCard";
import CartCard from "../components/cartCard";


export default function Cart() {
    const [searchTerm, setSearchTerm] = useState("");

    const products = [
        {
            _id: '1',
            name: 'Fresh Tomatoes',
            price: 40,
            quantity: 2,
        },
        {
            _id: '2',
            name: 'Long Brinjals',
            price: 30,
            quantity: 2,
        },
        {
            _id: '3',
            name: 'Green Chilies',
            price: 20,
            quantity: 2,
        },
        {
            _id: '4',
            name: 'Red Onions',
            price: 35,
            quantity: 2,
        },
    ];

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative h-full ">
            <div className="p-6 flex flex-col items-center h-full pb-40">
                <h2 className="text-3xl font-bold mb-4 text-left w-full">My Cart</h2>

                <input
                    type="text"
                    placeholder="Search product by name..."
                    className="mb-6 px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="flex flex-wrap justify-center gap-5 w-full overflow-scroll">
                    {filteredProducts.map(product => (
                        <CartCard productName={product.name} quantity={product.quantity} price={product.price} />
                    ))}
                </div>


            </div>
            <div className="absolute bottom-0 w-full flex flex-col gap-1 h-38 border-t-2 border-t-green-500 bg-white p-4 rounded-t-2xl">
                <div className="flex justify-between w-full">
                    <span className="text-xl ">Total Items</span>
                    <span className="text-2xl font-semibold text-green-700">{products.length}</span>
                </div>
                <div className="flex justify-between w-full">
                    <span className="text-xl ">Total Payment</span>
                    <span className="text-2xl font-semibold text-green-700">₹ {255}</span>
                </div>
                <button className="w-full bg-green-600 text-white p-2 rounded-2xl">Checkout</button>
            </div>
        </div>
    );
}