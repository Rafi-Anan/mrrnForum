import { Link } from "react-router-dom";
import siteConfig from "../config/siteConfig";

function Navbar() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={siteConfig.logo} alt="logo" className="w-10 h-10 rounded-full object-cover" />
          <span className="font-bold text-xl">{siteConfig.siteName}</span>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/forum" className="hover:text-blue-600">Forum</Link>
          <Link to="/categories" className="hover:text-blue-600">Categories</Link>

          {token && <Link to="/create-post" className="hover:text-blue-600">Create Post</Link>}
          {token && <Link to="/my-posts" className="hover:text-blue-600">My Posts</Link>}
          {token && <Link to="/profile" className="hover:text-blue-600">Profile</Link>}
          {token && <Link to="/users" className="hover:text-blue-600">Users</Link>}
          {user?.role === "admin" && <Link to="/admin" className="hover:text-blue-600">Admin</Link>}

          {!token && <Link to="/login" className="hover:text-blue-600">Login</Link>}
          {!token && <Link to="/register" className="hover:text-blue-600">Register</Link>}

          {token && (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;