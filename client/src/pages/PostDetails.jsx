import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import CommentList from "./../componets/CommentList";

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const fetchPost = async () => {
    const res = await api.get(`/posts/${id}`);
    setPost(res.data);
  };

  const fetchComments = async () => {
    const res = await api.get(`/comments/${id}`);
    setComments(res.data);
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/comments/${id}`, { content: comment });
      setComment("");
      fetchComments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to comment");
    }
  };

  const handleLike = async () => {
    try {
      await api.patch(`/posts/${id}/like`);
      fetchPost();
    } catch (error) {
      alert(error.response?.data?.message || "Login required to like");
    }
  };

  const handleDelete = async () => {
    const ok = confirm("Are you sure?");
    if (!ok) return;

    try {
      await api.delete(`/posts/${id}`);
      alert("Post deleted");
      navigate("/forum");
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  if (!post) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;

  const canEditOrDelete =
    user && (user.id === post.author?._id || user.role === "admin");

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
      <div className="bg-white p-6 md:p-8 rounded-lg md:rounded-3xl shadow mb-6 md:mb-8">
        <div className="flex gap-3 flex-wrap mb-3">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs md:text-sm">
            {post.category?.name}
          </span>
          <span className="text-gray-500 text-xs md:text-sm">❤️ {post.likes?.length || 0}</span>
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-sm md:text-base text-gray-600 mb-4">By {post.author?.name}</p>
        <div className="text-sm md:text-base text-gray-800 whitespace-pre-wrap mb-6 break-words">{post.content}</div>

        <div className="flex gap-2 md:gap-3 flex-col sm:flex-row flex-wrap">
          <button
            onClick={handleLike}
            className="bg-pink-500 text-white px-4 md:px-5 py-2 md:py-2 rounded-lg md:rounded-xl hover:bg-pink-600 transition text-sm md:text-base"
          >
            Like / Unlike
          </button>

          {canEditOrDelete && (
            <>
              <Link
                to={`/edit-post/${post._id}`}
                className="bg-yellow-500 text-white px-4 md:px-5 py-2 md:py-2 rounded-lg md:rounded-xl hover:bg-yellow-600 transition text-sm md:text-base"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 md:px-5 py-2 md:py-2 rounded-lg md:rounded-xl hover:bg-red-600 transition text-sm md:text-base"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg md:rounded-3xl shadow">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Comments</h2>

        {user ? (
          <form onSubmit={handleComment} className="mb-6">
            <textarea
              rows="4"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full border rounded-lg md:rounded-xl px-4 py-2 md:py-3 mb-3 text-sm md:text-base"
            />
            <button className="bg-blue-600 text-white px-4 md:px-5 py-2 md:py-2 rounded-lg md:rounded-xl hover:bg-blue-700 transition text-sm md:text-base">
              Add Comment
            </button>
          </form>
        ) : (
          <p className="text-gray-500 mb-4 text-sm md:text-base">Login to comment.</p>
        )}

        <CommentList comments={comments} />
      </div>
    </div>
  );
}

export default PostDetails;