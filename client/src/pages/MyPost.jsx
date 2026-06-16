import { useEffect, useState } from "react";
import api from "../utils/api";
import PostCard from "../componets/PostCard"


function MyPost() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/users/me");
      setData(res.data);
    };

    fetchData();
  }, []);

  if (!data) return <div className="max-w-6xl mx-auto px-4 py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">My Posts</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {data.posts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-8 text-sm md:text-base">No posts created yet.</p>
        ) : (
          data.posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default MyPost;