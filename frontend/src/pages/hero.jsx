import React from "react";
import farmerImg from "../assets/farmer.png";
import { Link } from "react-router-dom";
import { FaChartLine, FaHandshake, FaLock, FaTractor, FaLeaf, FaPhoneAlt } from "react-icons/fa";

export default function FarmerHeroPage() {
  const heroBgStyle = {
    backgroundImage: `url(${farmerImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="mt-12 w-full min-h-screen overflow-y-scroll bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col justify-center items-start px-6" style={heroBgStyle}>
        <div className="absolute inset-0 bg-opacity-40"></div>
        <div className="relative z-10 max-w-xl text-left">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Khet Se <br /> Phone Tak, <br /> Phone Se Grahak Tak
          </h1>
          <p className="text-white text-base mb-6">
            Connect with consumers, eliminate middlemen, and maximize your income with our intuitive platform.
          </p>
          <Link to={'/login'} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300">
            Get Started
          </Link>
          <div className="mt-3">
            <a href="#how-it-works" className="text-white underline hover:text-green-100">
              Learn How It Works
            </a>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-gray-100 py-14 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Why Farmers Love Us</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <FaChartLine className="mx-auto h-12 w-12 text-green-600" aria-label="Market Price Icon" />
            <h3 className="text-lg font-semibold mt-4">Real-Time Market Prices</h3>
            <p className="text-sm mt-2">Stay updated with current rates and make informed decisions.</p>
          </div>
          <div>
            <FaHandshake className="mx-auto h-12 w-12 text-green-600" aria-label="Direct Access Icon" />
            <h3 className="text-lg font-semibold mt-4">Direct Consumer Access</h3>
            <p className="text-sm mt-2">Reach your customers directly without third-party interference.</p>
          </div>
          <div>
            <FaLock className="mx-auto h-12 w-12 text-green-600" aria-label="Secure Transactions Icon" />
            <h3 className="text-lg font-semibold mt-4">Secure Transactions</h3>
            <p className="text-sm mt-2">Guaranteed and verified payments on every order.</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-green-50 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">How It Works</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div>
            <FaLeaf className="text-green-600 text-3xl mb-3" aria-label="Step 1: List Your Produce" />
            <h4 className="text-xl font-semibold">Step 1: List Your Produce</h4>
            <p className="text-sm mt-2">Easily upload product details and set your pricing.</p>
          </div>
          <div>
            <FaTractor className="text-yellow-600 text-3xl mb-3" aria-label="Step 2: Get Discovered" />
            <h4 className="text-xl font-semibold">Step 2: Get Discovered</h4>
            <p className="text-sm mt-2">Our platform connects you with thousands of buyers across regions.</p>
          </div>
          <div>
            <FaLock className="text-green-600 text-3xl mb-3" aria-label="Step 3: Get Paid" />
            <h4 className="text-xl font-semibold">Step 3: Get Paid</h4>
            <p className="text-sm mt-2">Receive payments directly and securely into your account.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 py-16 px-6 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Empower Your Farming Journey?</h2>
        <p className="mb-6">Join now and take control of your produce and profit.</p>
        <button className="bg-white text-green-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-all duration-300">
          Join Us Today
        </button>
      </div>

      {/* Testimonial Section */}
      <div className="bg-green-50 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-10">What Farmers Are Saying</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-md rounded-xl p-6">
            <blockquote className="text-lg italic text-gray-700">
              “Since joining, my profits have increased by 40%. It’s a game-changer!”
            </blockquote>
            <p className="mt-4 text-sm text-green-700 font-semibold">— Ravi Kumar, Punjab</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6">
            <blockquote className="text-lg italic text-gray-700">
              “I never thought selling directly could be this easy. I’m finally getting what my crops are worth.”
            </blockquote>
            <p className="mt-4 text-sm text-green-700 font-semibold">— Meera Devi, Uttar Pradesh</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6">
            <blockquote className="text-lg italic text-gray-700">
              “No more chasing buyers or worrying about payments. This platform has truly simplified our lives.”
            </blockquote>
            <p className="mt-4 text-sm text-green-700 font-semibold">— Harish Patel, Gujarat</p>
          </div>
        </div>
      </div>
    </div>
  );
}