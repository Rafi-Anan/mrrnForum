import { useEffect, useState } from "react";
import api from "../utils/api";
import siteConfig from "../config/siteConfig";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || siteConfig.backendUrl;

  useEffect(() => {
    fetchUsers();
  }, []);

  const createCategory = async (e) => {
    e.preventDefault();

    try {
      await api.post("/categories", { name: categoryName });
      alert("Category created successfully");
      setCategoryName("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create category");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="bg-white p-6 md:p-8 rounded-lg md:rounded-2xl shadow mb-6 md:mb-8">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Create Category</h3>
        <form onSubmit={createCategory} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category name"
            required
            className="flex-1 border rounded-lg md:rounded-xl px-4 py-2 md:py-3 text-sm md:text-base"
          />
          <button className="bg-blue-600 text-white px-5 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl hover:bg-blue-700 transition text-sm md:text-base whitespace-nowrap">
            Create
          </button>
        </form>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg md:rounded-2xl shadow">
        <h3 className="text-lg md:text-xl font-semibold mb-4">All Users</h3>

        <div className="space-y-3 md:space-y-4">
          {users.map((user) => (
            <div key={user._id} className="border rounded-lg md:rounded-xl p-4 flex items-center gap-3 md:gap-4 hover:bg-gray-50 transition">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.profilePhoto ? (
                  <img
                    src={`${apiBaseUrl}/${user.profilePhoto}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs md:text-sm font-semibold text-gray-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base"><strong>{user.name}</strong> <span className="text-xs md:text-sm text-gray-600">({user.role})</span></p>
                <p className="text-xs md:text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;