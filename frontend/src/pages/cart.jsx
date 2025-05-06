import { useState, useEffect } from "react";
import CartCard from "../components/cartCard";
import { useUser } from "../context/context";
import FullScreenLoader from "../components/fullScreenLoader";
import Loader from "react-js-loader";
import { toast } from 'react-toastify'

export default function Cart() {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useUser();
    const [refresh, setRefresh] = useState(false);
    const [cart, setCart] = useState({
        cart_items: [],
        total_amount: 0,
    });
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [deliveryMode, setDeliveryMode] = useState("Delivery");
    const [paymentMode, setPaymentMode] = useState("POD");

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
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
                    toast.error('Something went wrong!');
                    console.error('Failed to fetch cart:', data);
                }
            } catch (error) {
                toast.error('Something went wrong!');
                console.error('Error:', error);
            }
            setLoading(false);
        };

        fetchCart();
    }, [refresh]);

    const handlePlaceOrder = async () => {
        setShow(true)
        const orderPayload = {
            delivery_mode: deliveryMode,
            payment_mode: paymentMode,
        };

        try {
            const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/orders/consumer/${user.phone}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
            });

            const data = await res.json();

            if (res.ok) {
                console.log('ok');
                setShowCheckoutModal(false);
                setRefresh(!refresh);
                toast.success("Order Placed Successfully !!!")
            } else {
                toast.error('Something went wrong!');
                console.error('Order failed:', data);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Something went wrong!');
        }
        setShow(false);
    };


    // Filter products based on name if name is available
    const filteredItems = searchTerm
        ? cart.cart_items.filter(item =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : cart.cart_items;


    console.log('filtered items: ', filteredItems);

    return (
        <div className="relative h-full">
            <FullScreenLoader show={show} />
            <div className="p-6 flex flex-col items-center h-full pb-40">
                <h2 className="text-3xl font-bold mb-4 text-left w-full">My Cart</h2>

                <input
                    type="text"
                    placeholder="Search product by name..."
                    className="mb-6 px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {loading &&
                    <div className="flex justify-center items-center h-40">
                        <Loader type="bubble-loop" bgColor={"#00a63d"} color={"#00a63d"} title={"Loading..."} size={100} />
                    </div>}

                <div className="flex flex-wrap justify-center gap-5 w-full overflow-scroll">
                    {filteredItems.map((item) => (
                        <CartCard cart={item} setRefresh={setRefresh} refresh={refresh} />
                    ))}
                </div>
            </div>

            {showCheckoutModal && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-30">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-4/5 max-w-md relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowCheckoutModal(false)}
                            className="absolute top-2 right-3 text-2xl font-bold text-gray-600 hover:text-red-500"
                        >
                            &times;
                        </button>

                        <h3 className="text-2xl font-semibold mb-4 text-center">Select Options</h3>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-lg font-medium">Delivery Mode:</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    value={deliveryMode}
                                    onChange={(e) => setDeliveryMode(e.target.value)}
                                >
                                    <option value="Delivery">Delivery</option>
                                    <option value="Pickup">Pickup</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-lg font-medium">Payment Mode:</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)}
                                >
                                    <option value="POD">POD</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Card">Card</option>
                                    <option value="NetBanking">NetBanking</option>
                                </select>
                            </div>

                            <button
                                className="bg-green-600 text-white py-2 px-4 rounded-2xl"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <div className="absolute bottom-0 w-full flex flex-col gap-1 h-38 border-t-2 border-t-green-500 bg-white p-4 rounded-t-2xl">
                <div className="flex justify-between w-full">
                    <span className="text-xl">Total Items</span>
                    <span className="text-2xl font-semibold text-green-700">{cart.cart_items.length}</span>
                </div>
                <div className="flex justify-between w-full">
                    <span className="text-xl">Total Payment</span>
                    <span className="text-2xl font-semibold text-green-700">₹ {cart.total_amount}</span>
                </div>
                <button onClick={() => setShowCheckoutModal(true)} className="w-full bg-green-600 text-white p-2 rounded-2xl">Checkout</button>
            </div>
        </div>
    );
}
