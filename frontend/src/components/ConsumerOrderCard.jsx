import { Link } from "react-router-dom";
import { useUser } from "../context/context";
import { toast } from 'react-toastify';

export default function ConsumerOrderCard({ order, refresh, setRefresh, setShow}) {

    const {user} = useUser();
    let productNames;

    const handleCancelOrder = async() => {
        setShow(true);
        try {
            const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/orders/consumer/${user.phone}/${order.id}/cancel`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              }
            });
      
            const data = await res.json();
      
            if (res.ok) {
                toast.success("Order Cancelled Successfully !!!")
                setRefresh(!refresh);
                console.log("ok");
            } else {
                toast.error('Something went wrong!');
              console.error('Failed to fetch profile:', data);
            }
          } catch (error) {
            toast.error('Something went wrong!');
            console.error('Error:', error);
          }
          setShow(false);
    };

    return (
        <div className="flex flex-col gap-3 border border-gray-300 rounded-lg shadow-sm p-4 bg-white w-full">
            <div className="flex flex-col justify-between">
                <h3 className="font-semibold text-gray-800">Order ID: {order.id}</h3>
                <span className="text-sm text-gray-500">{new Date(order.order_date).toLocaleDateString()}</span>
            </div>

            <div className="text-gray-700">
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-base">{productNames}</p>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-sm font-medium text-blue-600">{order.order_status}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    <p className="text-sm font-medium text-gray-700">{order.payment_mode}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-green-600">₹{order.total_amount.toFixed(2)}</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <Link to={`../orders/${order.id}`} className="text-blue-600 text-sm underline">
                    View Details
                </Link>
                {order.order_status!='Cancelled' && <button
                    onClick={handleCancelOrder}
                    className="text-sm p-2 rounded-2xl text-white bg-red-600 font-medium hover:underline"
                >
                    Cancel Order
                </button>}
            </div>
        </div>
    );
}
