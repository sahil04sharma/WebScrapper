import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">HN Scraper</Link>
      <div className="nav-links">
        <NavLink to="/" end>Stories</NavLink>
        {isAuthenticated && <NavLink to="/bookmarks">Bookmarks</NavLink>}
        {isAuthenticated ? (
          <>
            <span className="user-name">Hi, {user?.name}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
