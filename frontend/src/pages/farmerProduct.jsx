import { useState, useEffect } from "react";
import { useUser } from "../context/context";

import ProductCard from "../components/productCard";
import Loader from "react-js-loader";
import { toast } from 'react-toastify';

export default function FarmerProduct() {
  const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useUser();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchFarmerProduce = async () => {
          setLoading(true);
          try {
            const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/farmer/${user.phone}/produce`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });
      
            const data = await res.json();
      
            if (res.ok) {
              setProducts(data);
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
      
        fetchFarmerProduce();
      }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 flex flex-col w-full">
            <h2 className="text-3xl font-bold mb-4 text-left w-full">My Products</h2>

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

            <div className="flex flex-row flex-wrap justify-between w-full grow overflow-scroll gap-2">
                {filteredProducts.map(product => (
                    
                    <ProductCard
                        key={product.id}
                        product={product}
                        onDelete={(id) => console.log("Delete ID:", id)}
                    />
                ))}
            </div>
        </div>
    );
}
