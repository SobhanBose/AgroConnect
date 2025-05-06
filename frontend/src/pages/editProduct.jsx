import { useState, useEffect } from "react"
import { useUser } from "../context/context";
import { useParams } from "react-router-dom";
import FullScreenLoader from "../components/fullScreenLoader";
import Loader from "react-js-loader";
import { toast } from 'react-toastify';

export default function EditProduct() {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const { user } = useUser();
    const [product, setProduct] = useState(null);
    const [form, setForm] = useState({
        price: '0',
        quantity: '0',
        date: null,
    });
    const { id } = useParams();

    useEffect(() => {
        const fetchProduce = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/farmer/${user.phone}/produce/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await res.json();

                if (res.ok) {
                    setProduct(data);
                } else {
                    toast.error('Something went wrong!');
                    console.error('Failed to fetch profile:', data);
                }
            } catch (error) {
                toast.error('Something went wrong!');
                console.error('Error:', error);
            }
            setLoading(false);
        };

        fetchProduce();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'image') {
            setForm((prev) => ({ ...prev, image: files[0] }))
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {

        setShow(true);

        e.preventDefault();
        try {
            const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/farmer/${user.phone}/harvest/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'produce_id': id,
                    "qty_harvested": form.quantity,
                    "harvest_date": new Date(form.date).toISOString().split('T')[0],
                    "rate": form.price
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Harvest Added Successfully !!!");
                console.log('ok');
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
        <>
            <FullScreenLoader show={show} />
            <div>
            {loading && 
            <div className="flex justify-center items-center h-40">
            <Loader type="bubble-loop" bgColor={"#00a63d"} color={"#00a63d"} title={"Loading..."} size={100} />
          </div>}
                {product && <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
                    <img
                        src={product.image_path}
                        alt={product.name}
                        className="w-full max-w-md h-64 object-cover rounded-md mb-4"
                    />
                    <p className="text-gray-700">{product.description}</p>

                </div>}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl space-y-5"
                >
                    <h2 className="text-3xl font-bold mb-4 text-left w-full">Add New Harvest</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Quantity (kg/units)</label>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Harvest Date</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </>
    )
}