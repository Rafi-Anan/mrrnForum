import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function CreatePost() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: ""
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/categories");
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/posts", {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      });

      alert("Post created successfully");
      navigate("/forum");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 md:py-10 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg md:rounded-2xl shadow">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Create Post</h2>

        <input
          type="text"
          name="title"
          placeholder="Post title"
          onChange={handleChange}
          required
          className="w-full border rounded-lg md:rounded-xl px-4 py-2 md:py-3 mb-4 text-sm md:text-base"
        />

        <select
          name="category"
          onChange={handleChange}
          required
          className="w-full border rounded-lg md:rounded-xl px-4 py-2 md:py-3 mb-4 text-sm md:text-base"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          onChange={handleChange}
          className="w-full border rounded-lg md:rounded-xl px-4 py-2 md:py-3 mb-4 text-sm md:text-base"
        />

        <textarea
          name="content"
          rows="8"
          placeholder="Write your content..."
          onChange={handleChange}
          required
          className="w-full border rounded-lg md:rounded-xl px-4 py-2 md:py-3 mb-4 text-sm md:text-base"
        />

        <button className="w-full bg-blue-600 text-white py-2 md:py-3 rounded-lg md:rounded-xl hover:bg-blue-700 transition text-sm md:text-base">
          Publish Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;