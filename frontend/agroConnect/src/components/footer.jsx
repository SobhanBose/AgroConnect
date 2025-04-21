import React from "react";
import {
  FaHome,
  FaThList,
  FaCommentDots,
  FaShoppingBasket,
  FaClipboardList,
  FaSeedling,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = ({ role = "consumer" }) => {
  return (
    <>
      {/* 📱 Mobile Bottom Nav - Role Based */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-300 shadow sm:hidden">
        <div className="flex justify-around items-center py-2 text-xs text-gray-700">
          {/* Home */}
          <div className="flex flex-col items-center hover:text-green-600">
            <FaHome className="text-lg" />
            <span className="mt-1">Home</span>
          </div>

          {/* Role-based 2nd icon */}
          {role === "farmer" ? (
            <div className="flex flex-col items-center hover:text-green-600">
              <FaSeedling className="text-lg" />
              <span className="mt-1">My Listings</span>
            </div>
          ) : (
            <div className="flex flex-col items-center hover:text-green-600">
              <FaThList className="text-lg" />
              <span className="mt-1">Category</span>
            </div>
          )}

          {/* Chat */}
          <div className="flex flex-col items-center hover:text-green-600">
            <FaCommentDots className="text-lg" />
            <span className="mt-1">Chat</span>
          </div>

          {/* Role-based 4th icon */}
          {role === "farmer" ? (
            <div className="flex flex-col items-center hover:text-green-600">
              <FaThList className="text-lg" />
              <span className="mt-1">Add Product</span>
            </div>
          ) : (
            <div className="flex flex-col items-center hover:text-green-600">
              <FaShoppingBasket className="text-lg" />
              <span className="mt-1">Cart</span>
            </div>
          )}
        </div>
      </footer>

      {/* 🖥️ Desktop Footer */}
      <footer className="hidden sm:block w-full bg-green-700 text-white pt-8 pb-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-3">AgroConnect</h3>
            <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Empowering farmers and connecting them directly with consumers.
              No middlemen, just fair trade.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><a href="#about" className="hover:underline">About Us</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-center md:justify-start items-center gap-2">
                <FaPhoneAlt />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex justify-center md:justify-start items-center gap-2">
                <FaEnvelope />
                <span>support@agroconnect.in</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-400 w-full" />

        <div className="text-center text-xs">
          &copy; {new Date().getFullYear()} <span className="font-semibold">AgroConnect</span>. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;