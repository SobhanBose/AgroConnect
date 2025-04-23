import { useState, useEffect } from "react";
import { useUser } from "../context/context";
import ConsumerOrderCard from "../components/ConsumerOrderCard";
import FullScreenLoader from "../components/fullScreenLoader";
import Loader from "react-js-loader";
import { toast } from 'react-toastify';


export default function ConsumerOrder() {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const { user } = useUser();
    const [orders, setOrders] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            try {
                const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/orders/consumer/${user.phone}`);
                const data = await res.json();
                if(res.ok){
                    setOrders(data);
                }else {
                    toast.error('Something went wrong!');
                    console.error('Failed to fetch profile:', data);
                }
                

            } catch (error) {
                toast.error('Something went wrong!');
                console.error("Failed to fetch orders:", error);
            }
            setLoading(false);
        }

        fetchOrders();
    }, [refresh]);

    return (
        <div className="p-2 w-full flex flex-col items-center">
            <FullScreenLoader show={show} />
            <h2 className="text-3xl font-bold mb-4 text-left w-full">My Orders</h2>
            {loading && 
            <div className="flex justify-center items-center h-40">
            <Loader type="bubble-loop" bgColor={"#0ee9ab"} color={"#0ee9ab"} title={"Loading..."} size={100} />
          </div>}

            <div className="flex flex-wrap justify-center gap-5 w-full overflow-scroll">
                {orders.map((order, key) => (
                    <ConsumerOrderCard key={key} order={order} refresh={refresh} setRefresh={setRefresh} setShow={setShow} />
                ))}
            </div>
        </div>
    );
}