import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: ""
  });

  useEffect(() => {
    const loadData = async () => {
      const [postRes, categoryRes] = await Promise.all([
        api.get(`/posts/${id}`),
        api.get("/categories")
      ]);

      const post = postRes.data;

      setFormData({
        title: post.title,
        content: post.content,
        category: post.category?._id || "",
        tags: post.tags?.join(", ") || ""
      });

      setCategories(categoryRes.data);
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/posts/${id}`, {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      });

      alert("Post updated successfully");
      navigate(`/post/${id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">Edit Post</h2>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-3 mb-4"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-3 mb-4"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 mb-4"
        />

        <textarea
          name="content"
          rows="8"
          value={formData.content}
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-3 mb-4"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;