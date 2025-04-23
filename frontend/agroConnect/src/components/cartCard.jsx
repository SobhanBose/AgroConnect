import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useUser } from "../context/context";

export default function CartCard({cart, setRefresh, refresh}) {

    const {user} = useUser();

    const handleDeleteItem = async () =>{
        try {
            const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/cart/${user.phone}/${cart.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              }
            });
      
            const data = await res.json();
      
            if (res.ok) {
              console.log('ok');
              setRefresh(!refresh)
            } else {
              console.error('Failed to fetch profile:', data);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        };
    
    const totalPrice = cart.qty * cart.rate;

    return (
        <div className="flex flex-col gap-4 justify-center items-center border border-gray-600 rounded-lg shadow-sm p-4 bg-white w-full">
            {/* Product Name */}
            <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-800">{cart.name}</h3>
            </div>
            <div className="flex w-full justify-between">
                {/* Quantity */}
                <div className=" text-left">
                    <p className="text-sm text-gray-500">Qty</p>
                    <p className="text-base text-gray-700">{cart.qty}</p>
                </div>

                {/* Price */}
                <div className="text-left">
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-base text-gray-700">₹{cart.rate.toFixed(2)}</p>
                </div>

                {/* Total */}
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-green-600">₹{totalPrice.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-between w-full">
                {/* <Link to={`../../product/${cart.harvest_id}`} className="text-blue-600 underline">View Details... </Link> */}
                <button
                    onClick={handleDeleteItem}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 cursor-pointer"
                >
                    <MdDelete className="w-6 h-6 shrink-0" />
                </button>
            </div>
        </div>
    );
}

