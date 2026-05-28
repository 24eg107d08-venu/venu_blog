import express from 'express';
import {
  addComment,
  getCommentsByPost,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:postId')
  .post(protect, addComment)
  .get(getCommentsByPost);

router.route('/:id')
  .delete(protect, deleteComment);

export default router;
