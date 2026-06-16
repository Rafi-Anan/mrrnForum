import { Link } from "react-router-dom";

function PostCard({ post }) {
  return (
    <div className="bg-white p-4 md:p-5 rounded-lg md:rounded-2xl shadow hover:shadow-md transition h-full flex flex-col">
      <div className="mb-2 flex items-center gap-2 flex-wrap">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {post.category?.name}
        </span>
        <span className="text-xs text-gray-500">
          ❤️ {post.likes?.length || 0}
        </span>
      </div>

      <h3 className="text-lg md:text-xl font-semibold mb-2 flex-grow">{post.title}</h3>
      <p className="text-sm md:text-base text-gray-600 mb-3 flex-grow">
        {post.content.length > 120 ? post.content.slice(0, 120) + "..." : post.content}
      </p>

      <div className="text-xs md:text-sm text-gray-500 mb-3">
        By {post.author?.name}
      </div>

      <Link
        to={`/post/${post._id}`}
        className="inline-block bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg md:rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
      >
        Read More
      </Link>
    </div>
  );
}

export default PostCard;