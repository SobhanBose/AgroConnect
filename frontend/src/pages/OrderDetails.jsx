import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from '../context/context';
import Loader from "react-js-loader";
import { toast } from 'react-toastify';

export default function OrderDetails() {
    const { id } = useParams();
    const { user } = useUser();
    const [items, setItems] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);

            try {
                const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/orders/consumer/${user.phone}/${id}`);
                const data = await res.json();
                if(res.ok){
                    setItems(data);
                }else{
                    toast.error('Something went wrong!');
                    console.log(res);
                }
                

            } catch (error) {
                toast.error('Something went wrong!');
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    return (
        <div className="max-w-3xl mx-auto p-4">
            <Link to="../orders" className="text-blue-600 underline mb-4 inline-block">← Back to Orders</Link>
            {loading && 
            <div className="flex justify-center items-center h-40">
            <Loader type="bubble-loop" bgColor={"#00a63d"} color={"#00a63d"} title={"Loading..."} size={100} />
          </div>}
            {items &&
                <>
                <h2 className="font-nrmal text-gray-800 mb-2"><span className="font-bold">Order ID:</span> {items.id}</h2>
                <p className="text-gray-800 text-sm mb-1"><span className="font-bold">Date:</span> {new Date(items.order_date).toLocaleDateString()}</p>
                <p className="text-gray-800 text-sm mb-1"><span className="font-bold">Status:</span> {items.order_status}</p>
                <p className="text-gray-800 text-sm mb-1"><span className="font-bold">Delivery Mode:</span> {items.delivery_mode}</p>
                <p className="text-gray-800 text-sm mb-1"><span className="font-bold">Delivery Charges:</span> {items.delivery_charges}</p>
                <p className="text-gray-800 text-sm mb-1"><span className="font-bold">Payment Mode:</span> {items.payment_mode}</p>
                <div className="space-y-4 mt-4">
                    {items.order_items.map((product, index) => (
                        <div
                            key={index}
                            className="border rounded-md shadow-sm p-4 bg-white"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">{product.harvest.produce.name}</h3>
                                <span className="text-sm text-gray-500">
                                    ₹{product.order.total_amount.toFixed(2)}
                                </span>
                            </div>
                            <div className="text-sm text-gray-700 space-y-1">

                                <p>
                                    <span className="font-medium">Quantity:</span> {product.qty}
                                </p>
                                <p>
                                    <span className="font-medium">Harvest Date:</span>{" "}
                                    {new Date(product.harvest.harvest_date).toLocaleDateString()}
                                </p>
                                <p>
                                    <span className="font-medium">Price/unit:</span> ₹{product.rate}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-right mt-6">
                    <p className="text-lg font-bold text-green-700">
                        Total: ₹{items.total_amount.toFixed(2)}
                    </p>
                </div>
            </>}
        </div>
    );
}
