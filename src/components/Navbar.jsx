import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm"
      style={{
        background: 'rgba(31, 41, 55, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to="/dashboard">
          <span className="me-2" style={{ fontSize: '1.5rem' }}>🎓</span>
          <span className="bg-gradient-to-r from-info to-primary">QuizPortal</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links Section */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item mx-2">
              <Link className="nav-link px-3 rounded-pill transition-all hover-bg-light" to="/quizzes">
                Browse Quizzes
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className="nav-link px-3 rounded-pill fw-semibold text-info"
                to="/ai-generator"
                style={{ border: '1px solid rgba(13, 202, 240, 0.3)' }}
              >
                🤖 AI Generator
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link px-3 rounded-pill transition-all" to="/my-results">
                My History
              </Link>
            </li>
          </ul>

          {/* User Profile & Logout */}
          <div className="d-flex align-items-center mt-3 mt-lg-0">
            <div className="me-3 text-end d-none d-md-block">
              <small className="text-white-50 d-block" style={{ fontSize: '0.7rem' }}>Logged in as</small>
              <span className="text-white fw-semibold small">{user?.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm px-4 rounded-pill fw-bold shadow-sm"
              style={{ transition: '0.3s' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;  