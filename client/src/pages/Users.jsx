import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import siteConfig from "../config/siteConfig";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
    mobile: "",
    profilePhoto: null,
    nid: null
  });
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || siteConfig.backendUrl;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserDetails = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleUserFormChange = (e) => {
    const { name, value, type, files } = e.target;
    setUserForm({
      ...userForm,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', userForm.name);
    formData.append('email', userForm.email);
    formData.append('password', userForm.password);
    formData.append('role', userForm.role);
    formData.append('mobile', userForm.mobile);
    if (userForm.profilePhoto) formData.append('profilePhoto', userForm.profilePhoto);
    if (userForm.nid) formData.append('nid', userForm.nid);

    try {
      await api.post("/users", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("User created successfully");
      setUserForm({
        name: "",
        email: "",
        password: "",
        role: "member",
        mobile: "",
        profilePhoto: null,
        nid: null
      });
      setShowAddUser(false);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      alert("User deleted successfully");
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const totalDeposit = users.reduce((sum, user) => sum + (user.totalDeposit || 0), 0);
  const totalDue = users.reduce((sum, user) => sum + (user.dueAmount || 0), 0);
  const totalDueAndDeposit = totalDeposit + totalDue;


  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center text-sm md:text-base">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Users Management</h1>
        <button
          onClick={() => setShowAddUser(true)}
          className="w-full sm:w-auto bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base"
        >
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4 mb-6">
        <div className="rounded-lg md:rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs md:text-sm text-blue-700 font-semibold">Total Deposit</p>
          <p className="text-xl md:text-2xl font-bold text-blue-900">${totalDeposit.toFixed(2)}</p>
        </div>
        <div className="rounded-lg md:rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs md:text-sm text-red-700 font-semibold">Total Due</p>
          <p className="text-xl md:text-2xl font-bold text-red-900">${totalDue.toFixed(2)}</p>
        </div>
        <div className="rounded-lg md:rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs md:text-sm text-slate-700 font-semibold">Total (Deposit + Due)</p>
          <p className="text-xl md:text-2xl font-bold text-slate-900">${totalDueAndDeposit.toFixed(2)}</p>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-lg md:rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 md:p-6 flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold">Add New User</h2>
              <button
                onClick={() => setShowAddUser(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-4 md:p-6">
              <div className="mb-4">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={userForm.name}
                  onChange={handleUserFormChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter full name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleUserFormChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter email address"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={userForm.password}
                  onChange={handleUserFormChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter password"
                  minLength="6"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={userForm.mobile}
                  onChange={handleUserFormChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={userForm.role}
                  onChange={handleUserFormChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="president">President</option>
                  <option value="vice-president">Vice-President</option>
                  <option value="cashier">Cashier</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Profile Photo
                </label>
                <input
                  type="file"
                  name="profilePhoto"
                  onChange={handleUserFormChange}
                  accept="image/*"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  NID
                </label>
                <input
                  type="file"
                  name="nid"
                  onChange={handleUserFormChange}
                  accept="image/*"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg md:rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photo
                </th>
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deposit
                </th>
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due
                </th>
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap text-xs text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {user.profilePhoto ? (
                        <img
                          src={`${apiBaseUrl}/${user.profilePhoto}`}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-gray-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap">
                    <div className="text-xs md:text-sm font-medium text-gray-900 truncate max-w-xs">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap">
                    <div className="text-xs text-gray-500 truncate max-w-xs">{user.email}</div>
                  </td>
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap">
                    <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'president' ? 'bg-red-100 text-red-800' :
                      user.role === 'vice-president' ? 'bg-yellow-100 text-yellow-800' :
                      user.role === 'cashier' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'vice-president' ? 'VP' : user.role === 'member' ? 'Mem' : user.role.substring(0, 3).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap text-xs text-gray-900">
                    ${user.totalDeposit?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap text-xs text-gray-900">
                    ${user.dueAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap text-xs font-medium space-x-0.5">
                    <button
                      onClick={() => handleUserDetails(user._id)}
                      className="bg-blue-600 text-white px-1.5 md:px-2 py-0.5 md:py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      className="bg-red-600 text-white px-1.5 md:px-2 py-0.5 md:py-1 rounded text-xs hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm md:text-base">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
