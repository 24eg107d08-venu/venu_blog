import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const CommentSection = ({ postId, userInfo }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5001/api/comments/${postId}`);
      setComments(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load comments');
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`http://localhost:5001/api/comments/${postId}`, { text: newComment }, config);
      setComments([data, ...comments]);
      setNewComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5001/api/comments/${commentId}`, config);
        setComments(comments.filter((c) => c._id !== commentId));
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting comment');
      }
    }
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">Comments ({comments.length})</h3>
      
      {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      {userInfo ? (
        <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
          <textarea
            className="input-field"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
            required
            style={{ marginBottom: '1rem' }}
          />
          <button type="submit" className="btn btn-primary">Post Comment</button>
        </form>
      ) : (
        <div className="card" style={{ padding: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Please log in to leave a comment.</p>
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading comments...</div>
      ) : comments.length === 0 ? (
        <div style={{ color: 'var(--text-secondary)' }}>No comments yet. Be the first to share your thoughts!</div>
      ) : (
        <div>
          {comments.map((comment) => (
            <div key={comment._id} className="comment-card">
              <div className="comment-header">
                <span className="comment-author">{comment.author.username}</span>
                <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="comment-text">{comment.text}</div>
              
              {userInfo && userInfo._id === comment.author._id && (
                <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDeleteComment(comment._id)}
                    className="btn btn-danger"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
