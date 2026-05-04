import { useEffect, useState } from "react";
import api from "../utils/api";

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/categories");
      setCategories(res.data);
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Categories</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category._id} className="bg-white p-5 rounded-2xl shadow">
            <h3 className="font-semibold text-lg">{category.name}</h3>
            <p className="text-gray-500 text-sm">{category.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;