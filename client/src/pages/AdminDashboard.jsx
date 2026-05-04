import { useEffect, useState } from "react";
import api from "../utils/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Create Category</h3>
        <form onSubmit={createCategory} className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category name"
            required
            className="flex-1 border rounded-xl px-4 py-3"
          />
          <button className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700">
            Create
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold mb-4">All Users</h3>

        <div className="space-y-3">
          {users.map((user) => (
            <div key={user._id} className="border rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.profilePhoto ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${user.profilePhoto}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p><strong>{user.name}</strong> ({user.role})</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;