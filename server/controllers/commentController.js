import Comment from "../models/Comments.js";

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    const comment = await Comment.create({
      post: postId,
      author: req.user.id,
      content
    });

    const populated = await Comment.findById(comment._id).populate("author", "name role");

    res.status(201).json({
      message: "Comment added",
      comment: populated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "name role")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};