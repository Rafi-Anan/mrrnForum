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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">My Posts</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.posts.length === 0 ? (
          <p>No posts created yet.</p>
        ) : (
          data.posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default MyPost;