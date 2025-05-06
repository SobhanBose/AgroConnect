import React, { useState } from "react";
import { FaBars, FaTimes, FaSearch, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/context";
import { toast } from "react-toastify";

const Header = () => {
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput("");
    }
  };


    const handleLogout = () => {
        setUser({ phone: '', role: '' });
        navigate("/");  
        toast.success("Logged Out Successfully!!!")
    };

  const isLoggedIn = Boolean(user?.phone);
  const isFarmer = user?.role === "farmer";
  const dashboardLink = isFarmer ? "/farmer/dashboard" : "/customer/dashboard";

  return (
    <header className="h-16 w-screen fixed top-0 left-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Left: Logo + Mobile Search */}
        <div className="flex items-center gap-5 md:gap-6">
          <Link to="/">
            <div className="text-2xl font-bold text-green-600">AgroConnect</div>
          </Link>
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

        {/* Right: Desktop */}
        <div className="hidden md:flex items-center gap-6">
          

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

          {/* Auth Buttons / Profile */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to={dashboardLink} title="Dashboard">
                <FaUserCircle className="text-2xl text-green-600 hover:text-green-700" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-green-600 hover:text-white border border-green-600 px-4 py-1 rounded-full hover:bg-green-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link to="/login" className="text-green-600 hover:text-white border border-green-600 px-4 py-1 rounded-full hover:bg-green-600 transition">
                Login
              </Link>
              <Link to="/register" className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center ml-4">
          <button onClick={toggleMenu} className="text-2xl text-green-600">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="fixed top-0 right-0 w-64 rounded-lg bg-white shadow-lg z-50 px-6 py-6 space-y-4 text-gray-700 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-green-600">Menu</span>
            <button onClick={toggleMenu} className="text-2xl text-green-600">
              <FaTimes />
            </button>
          </div>


          {isLoggedIn ? (
            <>
              <Link
                to={dashboardLink}
                className="flex items-center gap-2 text-green-600 hover:text-green-700"
                onClick={toggleMenu}
              >
                <FaUserCircle /> Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="w-full text-left text-green-600 border border-green-600 px-4 py-1 rounded-full hover:bg-green-600 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-green-600 border border-green-600 px-4 py-1 rounded-full hover:bg-green-600 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full text-left bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
