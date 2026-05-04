import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      tags: tags || [],
      author: req.user.id
    });

    const populated = await Post.findById(post._id)
      .populate("author", "name email role")
      .populate("category", "name slug");

    res.status(201).json({
      message: "Post created successfully",
      post: populated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const posts = await Post.find(query)
      .populate("author", "name email role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email role")
      .populate("category", "name slug");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.category = category ?? post.category;
    post.tags = tags ?? post.tags;

    await post.save();

    const updated = await Post.findById(post._id)
      .populate("author", "name email role")
      .populate("category", "name slug");

    res.json({
      message: "Post updated successfully",
      post: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};