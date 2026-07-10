import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import siteConfig from "../config/siteConfig";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    mobile: "",
    profilePhoto: null,
    nid: null
  });
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    month: "",
    year: new Date().getFullYear(),
    monthsCount: 1,
    description: "",
    status: "completed"
  });

  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || siteConfig.backendUrl;
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = currentUser?.role === "admin";
  const isOwnProfile = currentUser?.id === userId;

  const [selectedPayments, setSelectedPayments] = useState([]);

  useEffect(() => {
    fetchUserDetails();
    fetchUserPayments();
  }, [userId]);

  const openEditProfile = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      mobile: user.mobile || "",
      profilePhoto: null,
      nid: null
    });
    setShowEditProfile(true);
  };

  const fetchUserDetails = async () => {
    try {
      if (!isAdmin && !isOwnProfile) {
        navigate("/users");
        return;
      }

      const res = await api.get("/users");
      const foundUser = res.data.find(u => u._id === userId);
      if (foundUser) {
        setUser(foundUser);
      } else {
        console.error("User not found in response");
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error.response?.data || error.message);
      alert(`Failed to fetch user: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchUserPayments = async () => {
    try {
      const res = await api.get(`/payments/user/${userId}`);
      setPayments(res.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      // Payments might not exist yet, so don't show error
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const startMonthIndex = months.indexOf(paymentForm.month) + 1;
    const startYear = Number(paymentForm.year);
    const count = Math.max(1, Number(paymentForm.monthsCount));

    if (!paymentForm.month) {
      alert("Please select a starting month");
      return;
    }

    const createPaymentForMonth = async (monthIndex, year) => {
      const monthName = months[monthIndex - 1];
      const amount = year === 2022 ? 700 : 1000;
      const endpoint = isAdmin ? "/payments" : "/payments/request";
      return api.post(endpoint, {
        userId,
        amount,
        month: monthName,
        year,
        description: paymentForm.description,
        status: paymentForm.status
      });
    };

    try {
      const created = [];
      for (let i = 0; i < count; i += 1) {
        let monthIndex = startMonthIndex + i;
        let year = startYear;
        while (monthIndex > 12) {
          monthIndex -= 12;
          year += 1;
        }
        const res = await createPaymentForMonth(monthIndex, year);
        created.push(res.data);
      }

      alert(
        isAdmin
          ? `Created ${created.length} payment${created.length > 1 ? "s" : ""} successfully`
          : `Submitted ${created.length} payment request${created.length > 1 ? "s" : ""} for admin approval`
      );
      setPaymentForm({
        amount: "",
        month: "",
        year: new Date().getFullYear(),
        monthsCount: 1,
        description: "",
        status: "completed"
      });
      setShowAddPayment(false);
      fetchUserPayments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add payment");
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm({
      ...paymentForm,
      [name]: name === "monthsCount" ? Math.max(1, Number(value)) : value
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, files } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', editForm.name);
    formData.append('email', editForm.email);
    formData.append('mobile', editForm.mobile);
    if (editForm.profilePhoto) formData.append('profilePhoto', editForm.profilePhoto);
    if (editForm.nid) formData.append('nid', editForm.nid);

    try {
      await api.put(`/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Profile updated successfully");
      setShowEditProfile(false);
      fetchUserDetails();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDeletePayment = async (paymentId, monthYear) => {
    if (!window.confirm(`Delete payment for ${monthYear}? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/payments/${paymentId}`);
      alert("Payment deleted successfully");
      fetchUserPayments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete payment");
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const selectedYear = Number(paymentForm.year);
  const monthlyAmount = selectedYear === 2022 ? 700 : 1000;
  const totalAmount = monthlyAmount * Math.max(1, Number(paymentForm.monthsCount));

  const paidMonthsForSelectedYear = new Set(
    payments
      .filter((payment) => payment.year === selectedYear)
      .filter((payment) => payment.status !== "failed")
      .map((payment) => payment.month)
  );

  const isMonthDisabled = (month) => {
    const monthIndex = months.indexOf(month) + 1;
    if (selectedYear === 2022 && monthIndex < 9) return true;
    if (paidMonthsForSelectedYear.has(month)) return true;
    return false;
  };

  const totalDeposit = payments
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  const getMonthIndex = (monthName) => months.indexOf(monthName) + 1;
  const feeForYear = (year) => (year === 2022 ? 700 : 1000);

  const expectedAmount = (() => {
    const startYear = 2022;
    const startMonth = 9; // September
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let amount = 0;
    let year = startYear;
    let month = startMonth;

    while (year < currentYear || (year === currentYear && month <= currentMonth)) {
      amount += feeForYear(year);
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }

    return amount;
  })();

  const dueAmount = Math.max(0, Number((expectedAmount - totalDeposit).toFixed(2)));
  const lastDeposit = payments.length
    ? payments.reduce((latest, payment) => {
        const latestMonth = getMonthIndex(latest.month);
        const paymentMonth = getMonthIndex(payment.month);
        if (payment.year > latest.year) return payment;
        if (payment.year === latest.year && paymentMonth > latestMonth) return payment;
        return latest;
      })
    : null;

  const lastDepositLabel = lastDeposit
    ? `${lastDeposit.month.slice(0, 3)}/${lastDeposit.year}`
    : "N/A";

  const totalWithDue = Number((totalDeposit + dueAmount).toFixed(2));

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center text-sm md:text-base">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center text-red-600 text-sm md:text-base">User not found</div>
        <button
          onClick={() => navigate("/users")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">User Details</h1>
        <button
          onClick={() => navigate("/users")}
          className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm md:text-base"
        >
          Back to Users
        </button>
      </div>

      {/* User Info */}
      <div className="bg-white p-6 md:p-8 rounded-lg md:rounded-2xl shadow mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-semibold">User Information</h2>
          {isAdmin && (
            <button
              onClick={openEditProfile}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              Edit Profile
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mb-3 shadow-lg">
              {user.profilePhoto ? (
                <img
                  src={`${apiBaseUrl}/${user.profilePhoto}`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl md:text-3xl font-semibold text-gray-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-center text-gray-600 font-medium text-xs md:text-sm">Profile Photo</p>
          </div>

          {/* NID */}
          {isAdmin && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-32 md:w-32 md:h-40 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden mb-3 shadow-lg border-2 border-gray-300">
                {user.nid ? (
                  <img
                    src={`${apiBaseUrl}/${user.nid}`}
                    alt={`${user.name} NID`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-center text-gray-500 text-xs px-2">No NID uploaded</span>
                )}
              </div>
              <p className="text-center text-gray-600 font-medium text-xs md:text-sm">NID</p>
            </div>
          )}

          {/* User Details */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="space-y-3">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Name</p>
                <p className="text-base md:text-lg font-semibold text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Email</p>
                <p className="text-base md:text-lg font-semibold text-gray-900 truncate">{user.email}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Mobile</p>
                <p className="text-base md:text-lg font-semibold text-gray-900">{user.mobile || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Role</p>
                <p>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'president'
                      ? 'bg-red-100 text-red-800'
                      : user.role === 'vice-president'
                      ? 'bg-yellow-100 text-yellow-800'
                      : user.role === 'cashier'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Joined</p>
                <p className="text-base md:text-lg font-semibold text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-lg md:rounded-2xl shadow-xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b p-4 md:p-6 flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold">Edit Profile</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-4 md:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={editForm.mobile}
                  onChange={handleEditFormChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Update Profile Photo
                </label>
                <input
                  type="file"
                  name="profilePhoto"
                  onChange={handleEditFormChange}
                  accept="image/*"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Update NID
                </label>
                <input
                  type="file"
                  name="nid"
                  onChange={handleEditFormChange}
                  accept="image/*"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payments Section */}
      <div className="bg-white p-6 md:p-8 rounded-lg md:rounded-2xl shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-semibold">Monthly Payments</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowAddPayment(!showAddPayment)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm md:text-base"
            >
              {showAddPayment ? "Cancel" : isAdmin ? "Add Payment" : "Request Payment"}
            </button>
            {isAdmin && (
              <button
                onClick={async () => {
                  if (selectedPayments.length === 0) return;
                  if (!window.confirm(`Delete ${selectedPayments.length} selected payment(s)? This action cannot be undone.`)) return;
                  try {
                    await api.post('/payments/bulk-delete', { ids: selectedPayments });
                    alert('Selected payments deleted');
                    setSelectedPayments([]);
                    fetchUserPayments();
                  } catch (error) {
                    alert(error.response?.data?.message || 'Failed to delete selected payments');
                  }
                }}
                className={`bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm md:text-base ${selectedPayments.length===0? 'opacity-50 cursor-not-allowed':''}`}
                disabled={selectedPayments.length===0}
              >
                Delete Selected
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg md:rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs md:text-sm text-blue-700 font-semibold">Total Deposit</p>
            <p className="text-xl md:text-2xl font-bold text-blue-900">${totalDeposit.toFixed(2)}</p>
          </div>
          <div className="rounded-lg md:rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs md:text-sm text-blue-700 font-semibold">Due Amount</p>
            <p className="text-xl md:text-2xl font-bold text-blue-900">${dueAmount.toFixed(2)}</p>
          </div>
          <div className="rounded-lg md:rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs md:text-sm text-blue-700 font-semibold">Start Date</p>
            <p className="text-xl md:text-2xl font-bold text-blue-900">Sept/2022</p>
          </div>
          <div className="rounded-lg md:rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between">
            <div>
              <p className="text-xs md:text-sm text-slate-700 font-semibold">Total (Deposit + Due)</p>
              <p className="text-xl md:text-2xl font-bold text-slate-900">${totalWithDue.toFixed(2)}</p>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-white shadow-md">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="text-xs uppercase tracking-[0.2em]">Total Due + Deposit</span>
            </div>
          </div>
        </div>

        {/* Add Payment Form */}
        {showAddPayment && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">{isAdmin ? "Add New Payment" : "Request Payment"}</h3>
            <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Amount per Month
                </label>
                <input
                  type="number"
                  name="amount"
                  value={monthlyAmount}
                  disabled
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                  name="month"
                  value={paymentForm.month}
                  onChange={handlePaymentChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select Month</option>
                  {months.map((month) => {
                    const disabled = isMonthDisabled(month);
                    return (
                      <option key={month} value={month} disabled={disabled}>
                        {month}{disabled ? " (unavailable)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={paymentForm.year}
                  onChange={handlePaymentChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  min="2022"
                  max="2030"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Number of Months
                </label>
                <input
                  type="number"
                  name="monthsCount"
                  value={paymentForm.monthsCount}
                  onChange={handlePaymentChange}
                  required
                  min="1"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Enter number of months"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Create payments for the next months automatically.
                </p>
              </div>

              {isAdmin && (
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={paymentForm.status}
                    onChange={handlePaymentChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              )}

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={paymentForm.description}
                  onChange={handlePaymentChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Optional description"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <input
                  type="text"
                  value={`${totalAmount.toFixed(2)} Taka`}
                  disabled
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-sm"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base"
                >
                  {isAdmin ? "Add Payment" : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {isAdmin && (
                  <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedPayments.length === payments.length && payments.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedPayments(payments.map(p => p._id));
                        else setSelectedPayments([]);
                      }}
                    />
                  </th>
                )}
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month/Year
                </th>
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Desc
                </th>
                <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                {isAdmin && (
                  <th className="px-2 py-1.5 md:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  {isAdmin && (
                    <td className="px-2 py-1.5 md:py-2 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment._id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedPayments(prev => [...prev, payment._id]);
                          else setSelectedPayments(prev => prev.filter(id => id !== payment._id));
                        }}
                      />
                    </td>
                  )}
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap">
                    <div className="text-xs font-medium text-gray-900">
                      {payment.month.substring(0, 3)} {payment.year}
                    </div>
                  </td>
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap">
                    <div className="text-xs text-gray-900">
                      ${payment.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap">
                    <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded ${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status.substring(0, 3)}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap">
                    <div className="text-xs text-gray-500 truncate max-w-xs">
                      {payment.description ? payment.description.substring(0, 10) + '...' : "-"}
                    </div>
                  </td>
                  <td className="px-2 py-1.5 md:py-2 whitespace-nowrap text-xs text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}
                  </td>
                  {isAdmin && (
                    <td className="px-2 py-1.5 md:py-2 whitespace-nowrap text-xs font-medium">
                      <button
                        onClick={() => handleDeletePayment(payment._id, `${payment.month} ${payment.year}`)}
                        className="bg-red-600 text-white px-1.5 md:px-2 py-0.5 md:py-1 rounded hover:bg-red-700 transition-colors text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm md:text-base">
            No payments found for this user.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
