import React, { useState } from "react";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput(""); // optional: clear input
    }
  };

  return (
    <header className="h-16 w-screen fixed top-0 left-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Left Section: Logo + Mobile Search */}
        <div className="flex items-center gap-5 md:gap-6">
          <Link to="/">
            <div className="text-2xl font-bold text-green-600">AgroConnect</div>
          </Link>

          {/* Mobile Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-auto sm:w-48 md:hidden"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search..."
              className="w-full pr-8 pl-3 py-1.5 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button type="submit">
              <FaSearch className="absolute right-2 top-2.5 text-gray-500 text-sm" />
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-6">
          {/* Nav Links */}
          <nav className="flex space-x-6 font-medium text-gray-700">
            <a href="#home" className="hover:text-green-600">Home</a>
            <a href="#features" className="hover:text-green-600">Features</a>
            <a href="#about" className="hover:text-green-600">About</a>
            <a href="#contact" className="hover:text-green-600">Contact</a>
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-64">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full pr-10 pl-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button type="submit">
              <FaSearch className="absolute right-3 top-2.5 text-gray-500" />
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="flex space-x-3">
            <button className="text-green-600 hover:text-white border border-green-600 px-4 py-1 rounded-full hover:bg-green-600 transition">
              Login
            </button>
            <button className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition">
              Register
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center ml-4">
          <button onClick={toggleMenu} className="text-2xl text-green-600">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="fixed top-0 right-0 w-64 rounded-lg bg-white shadow-lg z-50 px-6 py-6 space-y-4 text-gray-700 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-green-600">Menu</span>
            <button onClick={toggleMenu} className="text-2xl text-green-600">
              <FaTimes />
            </button>
          </div>

          <a href="#home" className="block hover:text-green-600">Home</a>
          <a href="#features" className="block hover:text-green-600">Features</a>
          <a href="#about" className="block hover:text-green-600">About</a>
          <a href="#contact" className="block hover:text-green-600">Contact</a>
          <hr />
          <button className="block w-full text-left text-green-600 border border-green-600 px-4 py-1 rounded-full hover:bg-green-600 hover:text-white transition">
            Login
          </button>
          <button className="block w-full text-left bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition">
            Register
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
