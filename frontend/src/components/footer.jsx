import React from "react";
import {
  FaHome,
  FaThList,
  FaCommentDots,
  FaShoppingBasket,
  FaSeedling,
  FaSearch,
  FaUser,
  FaPlus
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useUser } from "../context/context";

const Footer = ({ role = "consumer" }) => {
  const {user} = useUser();

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-300 shadow sm:hidden">
      <div className="flex justify-around items-center py-2 text-xs text-gray-700">

        {/* Home */}
        <Link to="/" className="flex flex-col items-center hover:text-green-600">
          <FaHome className="text-lg" />
          <span className="mt-1">Home</span>
        </Link>

        {/* Search */}
        <Link to="/search" className="flex flex-col items-center hover:text-green-600">
          <FaSearch className="text-lg" />
          <span className="mt-1">Search</span>
        </Link>

        {/* Chat */}
        <Link to="/chat" className="flex flex-col items-center hover:text-green-600">
          <FaCommentDots className="text-lg" />
          <span className="mt-1">Chat</span>
        </Link>

        {/* Profile */}
        

        {/* Role-specific */}
        {user.role === "farmer" ? (
          <Link to="/farmer/dashboard" className="flex flex-col items-center hover:text-green-600">
          <CgProfile className="text-lg" />
          <span className="mt-1">Profile</span>
        </Link>
        ) : (
          <Link to="/consumer/dashboard" className="flex flex-col items-center hover:text-green-600">
            <CgProfile  className="text-lg" />
            <span className="mt-1">Profile</span>
          </Link>
        )}
      </div>
    </footer>
  );
};

export default Footer;
