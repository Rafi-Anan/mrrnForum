import { useEffect, useState } from "react";
import api from "../utils/api";

function Profile() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");
        const res = await api.get("/users/me");

        if (!res.data?.user || !Array.isArray(res.data.posts)) {
          setData(null);
          setError("Profile API returned an invalid response. Check VITE_API_URL and the API deployment.");
          return;
        }

        // setData(res.data);
        setData(res.data);
      } catch (requestError) {
        setData(null);
        setError(requestError.response?.data?.message || "Could not load your profile. Check the API URL and server status.");
      }
    };

    fetchProfile();
  }, []);

  // if (!data) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;
  if (error) {
    return <div className="max-w-4xl mx-auto px-4 py-10 text-red-700">{error}</div>;
  }

  if (!data) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
      <div className="bg-white p-6 md:p-8 rounded-lg md:rounded-3xl shadow">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">My Profile</h2>

        <div className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-sm md:text-base">
          <p><strong>Name:</strong> {data.user.name}</p>
          <p><strong>Email:</strong> {data.user.email}</p>
          <p><strong>Role:</strong> {data.user.role}</p>
          <p><strong>Bio:</strong> {data.user.bio || "No bio added"}</p>
        </div>

        <h3 className="text-xl md:text-2xl font-semibold mt-6 md:mt-8 mb-4">My Posts</h3>

        <div className="space-y-3 md:space-y-4">
          {data.posts.length === 0 ? (
            <p className="text-sm md:text-base text-gray-500">No posts yet.</p>
          ) : (
            data.posts.map((post) => (
              <div key={post._id} className="border rounded-lg md:rounded-2xl p-4 md:p-5 hover:bg-gray-50 transition">
                <h4 className="font-semibold text-sm md:text-base">{post.title}</h4>
                <p className="text-gray-500 text-xs md:text-sm">{post.category?.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
