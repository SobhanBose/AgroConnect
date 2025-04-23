import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/context';
import Loader from "react-js-loader";
import { toast } from 'react-toastify';

export default function ProductDetails() {
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const { id } = useParams();
    const [product, setProduct] = useState({ produce: {}, harvests: [] });
    const [selectedHarvest, setSelectedHarvest] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/farmer/${user.phone}/harvest/${id}`
                );
                const data = await res.json();
                if (res.ok) {
                    setProduct(data);

                    // Sort harvests and set the most recent one as default
                    const sorted = [...data.harvests].sort(
                        (a, b) => new Date(b.harvest_date) - new Date(a.harvest_date)
                    );
                    setSelectedHarvest(sorted[0]);
                } else {
                    toast.error('Something went wrong!');
                    console.error('Failed to fetch product:', data);
                }
            } catch (error) {
                toast.error('Something went wrong!');
                console.error('Error fetching product:', error);
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id, user.phone]);

    const handleHarvestChange = (e) => {
        const selectedDate = e.target.value;
        const harvest = product.harvests.find(
            (h) => h.harvest_date === selectedDate
        );
        setSelectedHarvest(harvest);
    };

    
    if(loading){
        return(
            
                <div className="flex justify-center items-center h-40">
                <Loader type="bubble-loop" bgColor={"#0ee9ab"} color={"#0ee9ab"} title={"Loading..."} size={100} />
              </div>
        )
    }
    if (!product.harvests.length || !selectedHarvest) {
        return <p className="p-6 text-gray-600">No Harvests Found</p>;
    }

    return (
        <>
        
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{product.produce.name}</h2>
            <img
                src={product.produce.image_path}
                alt={product.produce.name}
                className="w-full max-w-md h-64 object-cover rounded-md mb-4"
            />
            <p className="text-gray-700 mb-2">{product.produce.description}</p>

            <label className="block mb-2 font-semibold" htmlFor="harvest-date">
                Select Harvest Date:
            </label>
            <select
                id="harvest-date"
                onChange={handleHarvestChange}
                value={selectedHarvest.harvest_date}
                className="mb-4 p-2 border border-gray-300 rounded"
            >
                {product.harvests
                    .sort((a, b) => new Date(b.harvest_date) - new Date(a.harvest_date))
                    .map((harvest) => (
                        <option key={harvest.id} value={harvest.harvest_date}>
                            {harvest.harvest_date}
                        </option>
                    ))}
            </select>

            <div className="bg-gray-100 p-4 rounded">
                <p className="text-gray-700 mb-1">
                    <strong>Price:</strong> ₹{selectedHarvest.rate}
                </p>
                <p className="text-gray-700 mb-1">
                    <strong>Quantity Harvested:</strong> {selectedHarvest.qty_harvested} kg
                </p>
                <p className="text-gray-700 mb-1">
                    <strong>Quantity Available:</strong> {selectedHarvest.qty_available} kg
                </p>
                <p className="text-gray-700">
                    <strong>Harvest Date:</strong> {selectedHarvest.harvest_date}
                </p>
            </div>
        </div>
        </>
    );
}
