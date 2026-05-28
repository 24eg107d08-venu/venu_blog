import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/posts');
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching posts');
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="no-data">Loading posts...</div>;
  if (error) return <div className="no-data" style={{ color: 'var(--error-color)' }}>{error}</div>;

  return (
    <div>
      <h1 className="post-detail-title" style={{ marginBottom: '2rem' }}>Latest Posts</h1>
      {posts.length === 0 ? (
        <div className="no-data">No posts found. Be the first to create one!</div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <Link to={`/post/${post._id}`} key={post._id} style={{ textDecoration: 'none' }}>
              <div className="card post-card">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">
                  {post.content.substring(0, 150)}...
                </p>
                <div className="post-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <User size={14} /> {post.author.username}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
