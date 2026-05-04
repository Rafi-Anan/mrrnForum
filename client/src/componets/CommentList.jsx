function CommentList({ comments }) {
  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="bg-white p-4 rounded-xl shadow">
            <p className="font-semibold">{comment.author?.name}</p>
            <p className="text-gray-700 mt-1">{comment.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default CommentList;