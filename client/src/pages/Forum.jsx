import { useEffect, useState } from "react";
import api from "../utils/api";
import PostCard from "../componets/PostCard";
import SearchBar from "../componets/SearchBar";

function Forum() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchPosts = async (query = "") => {
    const res = await api.get(`/posts${query ? `?search=${query}` : ""}`);
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Forum Posts</h2>

      <SearchBar search={search} setSearch={setSearch} onSearch={() => fetchPosts(search)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {posts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-8">No posts found.</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default Forum;