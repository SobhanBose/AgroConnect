import { useEffect, useState } from "react";
import { useUser } from "../context/context";
import FarmerOrderCard from "../components/FarmerOrderCard";
import Loader from "react-js-loader";
import { toast } from 'react-toastify';

export default function FarmerOrder() {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    // const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            try {
                const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/orders/farmer/${user.phone}`);
                const data = await res.json();
                if (res.ok) {
                    setOrders(data);
                } else {
                    toast.error('Something went wrong!');
                    console.error('Failed to fetch orders:', data);
                }
            } catch (error) {
                toast.error('Something went wrong!');
                console.error("Failed to fetch orders:", error);
            }
            setLoading(false);
        }

        fetchOrders();
    }, [user.phone]);

    const filteredOrders = orders.filter(orderObj =>
        statusFilter === "All" || orderObj.order.order_status === statusFilter
    );

    return (
        <>
        
        <div className="p-6 flex flex-col items-center w-full">
            <h2 className="text-3xl font-bold mb-4 text-left w-full">My Orders</h2>

            <div className="flex flex-col items-start w-full gap-2 mb-6">
                <label className="text-sm font-medium text-gray-700">Filter by Order Status</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-60"
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {loading && 
                    <div className="flex justify-center items-center h-40">
                    <Loader type="bubble-loop" bgColor={"#0ee9ab"} color={"#0ee9ab"} title={"Loading..."} size={100} />
                  </div>}
            <div className="flex flex-wrap justify-center gap-5 w-full overflow-scroll">
                {filteredOrders.map(orderObj =>
                    orderObj.order_items.map((item, idx) => (
                        <FarmerOrderCard
                            key={`${orderObj.order.id}-${idx}`}
                            productName={item.harvest.produce.name}
                            quantity={item.qty}
                            price={item.rate}
                            status={orderObj.order.order_status}
                            orderId={orderObj.order.id}
                        />
                    ))
                )}
            </div>
        </div>
        </>
    );
}
