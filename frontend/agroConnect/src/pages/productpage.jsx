import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin,Leaf, CheckCircle, PackageCheck, ShieldCheck, Store } from 'lucide-react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [showMore, setShowMore] = useState(false);

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

  useEffect(() => {
    setProduct({
      id: productId,
      name: 'Organic Tomato',
      price: 49,
      quantity: '1kg',
      description: 'Fresh organic tomatoes grown directly on the farm.',
      rating: 4.5,
      distance: '12 km',
      seller: {
        name: 'Ramesh Das',
        id: 'farmer123',
      },
      images: [
        'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/29476617/pexels-photo-29476617/free-photo-of-fresh-red-tomato-on-wooden-surface.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/30705642/pexels-photo-30705642/free-photo-of-close-up-of-fresh-dew-covered-tomatoes.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      ],
      availability: 'In Stock',
      delivery: 'Delivery in 2-3 days',
      returnPolicy: '7-day return applicable',
    });
  }, [productId]);

  const similarProducts = [
    {
      id: '1',
      name: 'Organic Potatoes',
      image: 'https://images.pexels.com/photos/1431335/pexels-photo-1431335.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 39,
      quantity: '500g',
      distance: 10,
    },
    {
      id: '2',
      name: 'Green Chillies',
      image: 'https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 25,
      quantity: '250g',
      distance: 8,
    },
    {
      id: '3',
      name: 'Fresh Carrots',
      image: 'https://images.pexels.com/photos/4109748/pexels-photo-4109748.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 30,
      quantity: '1kg',
      distance: 15,
    },
  ];

  const productCarouselResponsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  const similarCarouselResponsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
  };

  if (!product) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="mt-20 max-w-6xl mx-auto px-4 space-y-10">
      <div className="flex items-center gap-2 text-sm text-gray-700 bg-green-50 p-3 rounded-md">
        <MapPin className="w-4 h-4 text-green-600" />
        Delivering to <span className="font-medium ml-1">Soumik Bag, Kolkata - 700001</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="w-full">
          <Carousel
            responsive={productCarouselResponsive}
            showDots={true}
            infinite
            autoPlay
            autoPlaySpeed={3000}
            keyBoardControl
            containerClass="carousel-container"
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name}-${index}`}
                className="w-full h-[400px] object-cover rounded-xl shadow-md"
              />
            ))}
          </Carousel>
        </div>

        {/* PRICE + ACTION SECTION */}
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-green-100 rounded-xl p-4 shadow-sm w-full">
  {/* Price Block */}
  <div className="flex items-center gap-3 text-xl font-semibold text-green-700">
    <div className="flex items-center gap-2">
      <span className="line-through text-gray-400 text-base">₹59</span>
      <span className="text-green-800">₹{product.price}</span>
    </div>
    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium">
      16% OFF
    </span>
  </div>

  {/* Buttons */}
  <div className="flex gap-3">
    <button className="bg-green-700 hover:bg-green-800 text-white text-sm sm:text-base font-medium px-4 py-2 rounded-lg transition">
      Buy Now
    </button>
    <button className="border border-green-700 text-green-700 hover:bg-green-100 text-sm sm:text-base font-medium px-4 py-2 rounded-lg transition">
      Add to Cart
    </button>
  </div>
</div>

        {/* PRODUCT DETAILS */}
        <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl shadow-xl p-8 space-y-8 max-w-5xl mx-auto transition-all duration-300">
        <h2 className="text-3xl font-bold text-green-900 tracking-tight">Product Details</h2>

        <p className="text-green-700 text-sm sm:text-base">
            Say Yes to fresh! You're buying directly from farmers. Grown with care and delivered with honesty — no middlemen, just pure goodness.
        </p>

        {/* DETAILS SPLIT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            {(showMore
            ? [
                { label: 'Product', value: 'Tomato' },
                { label: 'Quantity', value: '500 g' },
                { label: 'Health Benefits', value: 'Rich in Vitamin C & Antioxidants' },
                { label: 'Shelf Life', value: 'Best within 2 days of delivery' },
                { label: 'Grown In', value: 'India (Local Farms)' },
                { label: 'Farmer Contact', value: 'info@agroconnect.in' },
                { label: 'Supplier', value: 'SUPERWELL COMTRADE PRIVATE LIMITED' },
                { label: 'FSSAI License', value: '13323999000038' },
                ]
            : [
                { label: 'Product', value: 'Tomato' },
                { label: 'Quantity', value: '500 g' },
                { label: 'Health Benefits', value: 'Rich in Vitamin C & Antioxidants' },
                { label: 'Shelf Life', value: 'Best within 2 days of delivery' },
                ]
            ).map((item, i) => (
            <div
                key={i}
                className="bg-white border border-green-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
                <p className="text-green-700 font-medium mb-1">{item.label}</p>
                <p className="text-green-900">{item.value}</p>
            </div>
            ))}
        </div>

        {/* TOGGLE BUTTON */}
        <button
            className="mt-2 text-sm text-green-700 font-medium underline hover:text-green-900 transition"
            onClick={() => setShowMore(!showMore)}
        >
            {showMore ? 'View Less' : 'View More'}
        </button>
        </div>
      </div>
     
     {/*Similar Products*/}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Similar Products</h2>
        <Carousel responsive={similarCarouselResponsive} infinite autoPlay autoPlaySpeed={4000}>
          {similarProducts.map((product) => (
            <div key={product.id} className="p-2">
              <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-28 object-cover"
                />
                <div className="p-2">
                  <h3 className="text-sm font-medium truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.quantity}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[#16a34a] font-semibold text-sm">₹{product.price}</span>
                    <span className="text-[10px] text-gray-400">{product.distance} km</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <button className="flex-1 bg-[#16a34a] text-white text-xs py-1 rounded hover:bg-[#15803d]">
                      View
                    </button>
                    <button className="flex-1 border border-[#16a34a] text-[#16a34a] text-xs py-1 rounded hover:bg-[#f0fdf4]">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      
        {/* SELLER SECTION */}
        <section className="bg-gradient-to-br from-green-50 to-white py-12 px-4 sm:px-6 md:px-12 border-t border-green-100">
        <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12 transition-all duration-300">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-900 text-center tracking-tight">
            Say Yes to Fresh!
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
                <div
                key={index}
                className="bg-white border border-green-100 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300"
                >
                {/* Icon with soft green circle */}
                <div className="w-12 h-12 flex items-center justify-center bg-green-100 text-green-700 rounded-full mb-4">
                    {feature.icon}
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-1">
                    {feature.title}
                </h3>
                <p className="text-sm text-green-700 leading-relaxed">
                    {feature.desc}
                </p>
                </div>
            ))}
            </div>
        </div>
        </section>

    </div>
  );
};

export default ProductPage;