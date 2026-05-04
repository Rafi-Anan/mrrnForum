import { Link } from "react-router-dom";

function PostCard({ post }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition">
      <div className="mb-2 flex items-center gap-2 flex-wrap">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {post.category?.name}
        </span>
        <span className="text-xs text-gray-500">
          ❤️ {post.likes?.length || 0}
        </span>
      </div>

      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
      <p className="text-gray-600 mb-3">
        {post.content.length > 120 ? post.content.slice(0, 120) + "..." : post.content}
      </p>

      <div className="text-sm text-gray-500 mb-3">
        By {post.author?.name}
      </div>

      <Link
        to={`/post/${post._id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Read More
      </Link>
    </div>
  );
}

export default PostCard;