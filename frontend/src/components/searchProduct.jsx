import { Link } from 'react-router-dom';

export default function SearchProduct({ product }) {
  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden"
    >
      <img
        src={product.image_path}
        alt={product.name}
        className="w-full h-36 object-cover"
      />
      <div className="p-3">
        <h3 className="text-sm font-medium truncate">{product.name}</h3>
        <p className="text-xs text-gray-500">{product.tag}</p>
        <div className="flex gap-2 items-center mt-1">
          <span className="text-green-600 text-sm">Farmer: </span>
          <span className="text-sm text-gray-400">
            {`${product.farmer.user.first_name} ${product.farmer.user.last_name}`}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-green-600 font-semibold text-sm">₹{product.rate}</span>
          <span className="text-[10px] text-gray-400">
            {new Date(product.harvest_date).toLocaleDateString()}
          </span>
        </div>
        <Link
          to={`../product/${product.id}&&`+`${product.farmer.user.phone_no}`}
          className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700 inline-block mt-2"
        >
          View
        </Link>
      </div>
    </div>
  );
}
