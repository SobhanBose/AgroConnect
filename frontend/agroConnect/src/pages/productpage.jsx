import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/context';
import FullScreenLoader from "../components/fullScreenLoader";
import Loader from "react-js-loader";
import { toast } from 'react-toastify';

import {
  MapPin,
  Leaf,
  CheckCircle,
  PackageCheck,
  ShieldCheck,
  Store,
} from 'lucide-react';

const ProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { id } = useParams();
  const [prod_id, phone] = id.split('&&');
  const [product, setProduct] = useState(null);
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const { user } = useUser();

  const features = [
    {
      icon: <Leaf className="text-green-600 w-8 h-8" />,
      title: "Sourced Fresh Daily",
      desc: "Our fruits and vegetables are sourced daily for optimal freshness.",
    },
    {
      icon: <CheckCircle className="text-green-600 w-8 h-8" />,
      title: "Sourced By Experts",
      desc: "Inhouse expert team selects the best fruit orchards, direct farms, importers, and certified vendors.",
    },
    {
      icon: <PackageCheck className="text-green-600 w-8 h-8" />,
      title: "Daily Thorough Quality Checks",
      desc: "Fresh produce undergoes daily quality checks before being sent to the stores.",
    },
    {
      icon: <ShieldCheck className="text-green-600 w-8 h-8" />,
      title: "High Packaging Standards",
      desc: "Produce is packed and stored safely with hygiene to ensure freshness.",
    },
    {
      icon: <Store className="text-green-600 w-8 h-8" />,
      title: "Quality Assurance At Stores",
      desc: "Continuous quality checks and daily audits at stores and during dispatch.",
    },
  ];

  const handleAddToCart = async () => {
    
    if (!user.phone || user.role !== "consumer") {
      toast.error("Please login as a consumer to add items to cart.");
      navigate("/login");
      return; 
    }

    setShow(true);
    try {
      const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/cart/${user.phone}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'harvest_id': selectedHarvest.id,
          'qty': quantity
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Items Successfully Added to Cart !!!")
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


  useEffect(() => {
    const fetchProduce = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://advisory-tallou-sobhanbose-a5410a15.koyeb.app/farmer/${phone}/harvest/${prod_id}`);
        const data = await res.json();

        if (res.ok) {
          setProduct(data);
          setSelectedHarvest(data.harvests?.[0] || null);
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

  const handleHarvestChange = (e) => {
    const selected = product.harvests.find(h => h.harvest_date === e.target.value);
    setSelectedHarvest(selected);
    setQuantity(1); // reset quantity when harvest date changes
  };

  const incrementQty = () => {
    if (quantity < selectedHarvest?.qty_available) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQty = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleActionClick = () => {
    setShowQuantitySelector(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader type="bubble-loop" bgColor={"#0ee9ab"} color={"#0ee9ab"} title={"Loading..."} size={100} />
      </div>
    )
  }

  if (!product || !selectedHarvest) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="mt-20 max-w-6xl mx-auto px-4 space-y-10 pb-40 relative">
      <FullScreenLoader show={show} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="w-full">
          <img
            src={product.produce.image_path}
            alt={product.produce.name}
            className="w-full h-[300px] object-cover rounded-xl shadow-md"
          />
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-green-900">{product.produce.name}</h1>
          <p className="text-gray-600">{product.produce.description}</p>
          <div className="text-xl font-semibold text-green-700">
            ₹{selectedHarvest?.rate ?? 'N/A'}
          </div>

          <p className="text-sm text-green-700">Harvest Date: {new Date(selectedHarvest.harvest_date).toDateString()}</p>

          <Link to={`../farmerProduct/${phone}`} className='underline'><p className="text-sm text-green-700 underline">See Other Products By This Farmer</p></Link>

          <div className="flex flex-col gap-1">
            <label htmlFor="harvestDate" className="text-sm font-medium text-green-700">
              Select Harvest Date
            </label>
            <select
              id="harvestDate"
              className="border border-green-300 rounded-md p-2 text-green-800"
              value={selectedHarvest.harvest_date}
              onChange={handleHarvestChange}
            >
              {product.harvests.map((harvest, i) => (
                <option key={i} value={harvest.harvest_date}>
                  {new Date(harvest.harvest_date).toDateString()}
                </option>
              ))}
            </select>
          </div>

          {!showQuantitySelector && (
            <div className="flex gap-4">
              <button
                className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-md"
                onClick={handleActionClick}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PRODUCT DETAILS SECTION */}
      <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl shadow-xl p-8 space-y-8">
        <h2 className="text-3xl font-bold text-green-900">Product Details</h2>
        <p className="text-green-700">Say Yes to fresh! You're buying directly from farmers.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          {([
            { label: 'Product', value: product.produce.name },
            { label: 'Quantity Available', value: `${selectedHarvest.qty_available} kg` },
          ]).map((item, i) => (
            <div key={i} className="bg-white border border-green-100 rounded-xl p-4 shadow-sm">
              <p className="text-green-700 font-medium">{item.label}</p>
              <p className="text-green-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="bg-gradient-to-br from-green-50 to-white py-12 border-t border-green-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 md:px-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-green-100 rounded-2xl p-5 shadow-md hover:shadow-lg"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-green-900">{feature.title}</h3>
              <p className="text-sm text-green-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM BAR FOR QUANTITY SELECTOR */}
      {showQuantitySelector && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-200 shadow-md px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-50">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Quantity (kg):</span>
            <div className="flex items-center border border-green-300 rounded-md overflow-hidden">
              <button
                className="px-3 py-1 text-lg text-green-700 hover:bg-green-100"
                onClick={decrementQty}
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="px-3 py-1 text-lg text-green-700 hover:bg-green-100"
                onClick={incrementQty}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleAddToCart} className="border border-green-700 text-green-700 px-6 py-2 rounded-lg hover:bg-green-100">
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
