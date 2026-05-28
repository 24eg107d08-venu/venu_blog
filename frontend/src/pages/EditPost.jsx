import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5001/api/posts/${id}`);
        if (data.author._id !== userInfo?._id) {
            navigate('/');
        }
        setTitle(data.title);
        setContent(data.content);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching post');
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      await axios.put(`http://localhost:5001/api/posts/${id}`, { title, content }, config);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating post');
    }
  };

  if (loading) return <div className="no-data">Loading post...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 className="post-detail-title" style={{ marginBottom: '2rem' }}>Edit Post</h1>
      {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Content</label>
          <textarea
            className="input-field"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
