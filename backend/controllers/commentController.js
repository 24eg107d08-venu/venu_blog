import Comment from '../models/Comment.js';

// @desc    Add a comment to a post
// @route   POST /api/comments/:postId
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    const comment = new Comment({
      text,
      post: postId,
      author: req.user._id
    });

    const createdComment = await comment.save();
    
    const populatedComment = await Comment.findById(createdComment._id).populate('author', 'username');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
                                  .populate('author', 'username')
                                  .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment) {
      if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this comment' });
      }

      await comment.deleteOne();
      res.json({ message: 'Comment removed' });
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
