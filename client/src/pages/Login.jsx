import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful");
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-3 mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-3 mb-4"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;