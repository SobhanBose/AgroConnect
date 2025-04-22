import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { Link } from 'react-router-dom';



export default function ProductCard({ product, onDelete }) {
    return (
        <div className="bg-white rounded-xl shadow-md w-30 h-fit">
            <img
                src={product.image_path}
                alt={product.name}
                className="w-full h-28 object-cover rounded-t-xl"
            />
            <div className="py-4 px-2">
                <h3 className="text-sm text-gray-600 mb-2 font-semibold truncate">{product.name}</h3>
                <p className="text-green-600 mb-3 text-sm">{product.harvest? `₹${product.harvest.rate}`: ''}</p>
                <p className="text-xs text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{product.description}</p>
                <Link to={`${product.id}`} className="text-xs underline text-green-700"> See all Harvests</Link>
                
                <div className="flex gap-2 justify-between items-center pt-2">
                    
                    <Link className='flex items-center gap-1 text-white rounded-2xl px-2 py-1 text-sm font-medium bg-green-600' to={`../editProduct/${product.id}`}><FaPlus /><span className="text-center">New Harvest</span></Link>
                    
                    <button
                        onClick={() => onDelete(product.id)}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 cursor-pointer"
                    >
                        <MdDelete className="w-6 h-6 shrink-0"/>
                    </button>
                </div>
            </div>
        </div>
    );
}