import { Link, useNavigate } from 'react-router-dom';
import { LogOut, PenSquare, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          NeonBlog
        </Link>
        <div className="navbar-links">
          {userInfo ? (
            <>
              <Link to="/create-post" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <PenSquare size={16} /> Write Post
              </Link>
              <div className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserIcon size={18} /> {userInfo.username}
              </div>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
