import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Registration successful");
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 md:py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg md:rounded-2xl shadow">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="w-full border rounded-lg md:rounded-xl px-4 py-2 md:py-3 mb-4 text-sm md:text-base"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full border rounded-lg md:rounded-xl px-4 py-2 md:py-3 mb-4 text-sm md:text-base"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full border rounded-lg md:rounded-xl px-4 py-2 md:py-3 mb-4 text-sm md:text-base"
        />

        <button className="w-full bg-blue-600 text-white py-2 md:py-3 rounded-lg md:rounded-xl hover:bg-blue-700 transition text-sm md:text-base">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;