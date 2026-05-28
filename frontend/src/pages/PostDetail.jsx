import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, Edit, Trash2 } from 'lucide-react';
import CommentSection from '../components/CommentSection';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5001/api/posts/${id}`);
        setPost(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching post');
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5001/api/posts/${id}`, config);
        navigate('/');
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting post');
      }
    }
  };

  if (loading) return <div className="no-data">Loading post...</div>;
  if (error) return <div className="no-data" style={{ color: 'var(--error-color)' }}>{error}</div>;
  if (!post) return <div className="no-data">Post not found</div>;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <header className="post-detail-header">
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} /> {post.author.username}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </header>

      {userInfo && userInfo._id === post.author._id && (
        <div className="post-actions">
          <Link to={`/edit-post/${post._id}`} className="btn btn-secondary">
            <Edit size={16} /> Edit Post
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            <Trash2 size={16} /> Delete Post
          </button>
        </div>
      )}

      <div className="post-detail-content">
        {post.content}
      </div>

      <CommentSection postId={post._id} userInfo={userInfo} />
    </div>
  );
};

export default PostDetail;
