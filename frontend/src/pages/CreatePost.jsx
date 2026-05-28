import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      await axios.post('http://localhost:5001/api/posts', { title, content }, config);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 className="post-detail-title" style={{ marginBottom: '2rem' }}>Create New Post</h1>
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
            placeholder="Enter a catchy title..."
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
            placeholder="Write your blog post content here..."
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
