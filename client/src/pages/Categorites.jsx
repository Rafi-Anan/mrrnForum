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
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Categories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
        {categories.map((category) => (
          <div key={category._id} className="bg-white p-4 md:p-5 rounded-lg md:rounded-2xl shadow hover:shadow-md transition">
            <h3 className="font-semibold text-base md:text-lg">{category.name}</h3>
            <p className="text-gray-500 text-xs md:text-sm">{category.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;