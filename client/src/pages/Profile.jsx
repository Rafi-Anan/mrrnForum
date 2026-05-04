import { useEffect, useState } from "react";
import api from "../utils/api";

function Profile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/users/me");
      setData(res.data);
    };

    fetchProfile();
  }, []);

  if (!data) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white p-8 rounded-3xl shadow">
        <h2 className="text-3xl font-bold mb-4">My Profile</h2>

        <p><strong>Name:</strong> {data.user.name}</p>
        <p><strong>Email:</strong> {data.user.email}</p>
        <p><strong>Role:</strong> {data.user.role}</p>
        <p><strong>Bio:</strong> {data.user.bio || "No bio added"}</p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">My Posts</h3>

        <div className="space-y-4">
          {data.posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            data.posts.map((post) => (
              <div key={post._id} className="border rounded-2xl p-4">
                <h4 className="font-semibold">{post.title}</h4>
                <p className="text-gray-500">{post.category?.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;