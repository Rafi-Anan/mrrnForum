import { Link } from "react-router-dom";
import siteConfig from "../config/siteConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={siteConfig.logo} alt="logo" className="w-10 h-10 rounded-full object-cover" />
          <span className="font-bold text-lg md:text-xl">{siteConfig.siteName}</span>
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-gray-800 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-800 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-800 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2 lg:gap-4 items-center flex-wrap">
          <Link to="/" className="text-sm lg:text-base hover:text-blue-600 transition">Home</Link>
         
          {token && <Link to="/create-post" className="text-sm lg:text-base hover:text-blue-600 transition">Create Post</Link>}
          {token && <Link to="/my-posts" className="text-sm lg:text-base hover:text-blue-600 transition">My Posts</Link>}
          {token && <Link to="/profile" className="text-sm lg:text-base hover:text-blue-600 transition">Profile</Link>}
          {token && <Link to="/users" className="text-sm lg:text-base hover:text-blue-600 transition">Users</Link>}
          {user?.role === "admin" && <Link to="/admin" className="text-sm lg:text-base hover:text-blue-600 transition">Admin</Link>}

          {!token && <Link to="/login" className="text-sm lg:text-base hover:text-blue-600 transition">Login</Link>}
          {!token && <Link to="/register" className="text-sm lg:text-base hover:text-blue-600 transition">Register</Link>}

          {token && (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer text-sm lg:text-base transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            <Link to="/" onClick={closeMenu} className="block hover:text-blue-600 transition py-2">Home</Link>
            <Link to="/forum" onClick={closeMenu} className="block hover:text-blue-600 transition py-2">Forum</Link>
            <Link to="/categories" onClick={closeMenu} className="block hover:text-blue-600 transition py-2">Categories</Link>

            {token && <Link to="/create-post" onClick={closeMenu} className="block hover:text-blue-600 transition py-2">Create Post</Link>}
            {token && <Link to="/my-posts" onClick={closeMenu} className="block hover:text-blue-600 transition py-2">My Posts</Link>}
            {token && <Link to="/profile" onClick={closeMenu} className="block hover:text-blue-600 transition py-2">Profile</Link>}
            {token && <Link to="/users" onClick={closeMenu} className="block hover:text-blue-600 transition py-2">Users</Link>}
            {user?.role === "admin" && <Link to="/admin" onClick={closeMenu} className="block hover:text-blue-600 transition py-2">Admin</Link>}

            {!token && <Link to="/login" onClick={closeMenu} className="block hover:text-blue-600 transition py-2">Login</Link>}
            {!token && <Link to="/register" onClick={closeMenu} className="block hover:text-blue-600 transition py-2">Register</Link>}

            {token && (
              <button
                onClick={() => { logout(); closeMenu(); }}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer transition text-left"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;