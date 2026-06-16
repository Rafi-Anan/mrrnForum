function CommentList({ comments }) {
  return (
    <div className="space-y-3 md:space-y-4">
      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm md:text-base">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="bg-gray-50 p-4 md:p-5 rounded-lg md:rounded-xl shadow-sm">
            <p className="font-semibold text-sm md:text-base">{comment.author?.name}</p>
            <p className="text-gray-700 mt-1 text-xs md:text-sm">{comment.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default CommentList;