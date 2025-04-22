import { useState, useEffect } from "react";
import CartCard from "../components/cartCard";
import { useUser } from "../context/context";

export default function Cart() {
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useUser();
    const [cart, setCart] = useState({
        cart_items: [],
        total_amount: 0,
    });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch(
                    `https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/cart/${user.phone}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const data = await res.json();

                if (res.ok) {
                    setCart(data);
                } else {
                    console.error('Failed to fetch cart:', data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchCart();
    }, [user.phone]);

    // Filter products based on name if name is available
    const filteredItems = searchTerm
    ? cart.cart_items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cart.cart_items;


    console.log('filtered items: ', filteredItems);

    return (
        <div className="relative h-full">
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
                    {filteredItems.map((item) => (
                        <CartCard cart={item} />
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 w-full flex flex-col gap-1 h-38 border-t-2 border-t-green-500 bg-white p-4 rounded-t-2xl">
                <div className="flex justify-between w-full">
                    <span className="text-xl">Total Items</span>
                    <span className="text-2xl font-semibold text-green-700">{cart.cart_items.length}</span>
                </div>
                <div className="flex justify-between w-full">
                    <span className="text-xl">Total Payment</span>
                    <span className="text-2xl font-semibold text-green-700">₹ {cart.total_amount}</span>
                </div>
                <button className="w-full bg-green-600 text-white p-2 rounded-2xl">Checkout</button>
            </div>
        </div>
    );
}
