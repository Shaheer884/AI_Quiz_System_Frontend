import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
// Added Link to the import below
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        
        {/* Left Side: Design/Image */}
        <div 
          className="col-md-6 col-lg-7 d-none d-md-flex flex-column justify-content-center align-items-center text-white"
          style={{
            background: `linear-gradient(135deg, rgba(79, 70, 229, 0.85), rgba(124, 58, 237, 0.9)), url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="p-5 text-center fade-in">
            <h1 className="fw-bolder display-4 mb-3">AI Quiz Generator</h1>
            <p className="fs-5 opacity-75 mx-auto" style={{ maxWidth: '400px' }}>
              Welcome back. Log in to manage your quizzes and start testing your knowledge.
            </p>
          </div>
        </div>

        {/* Right Side: Input Form */}
        <div className="col-md-6 col-lg-5 d-flex align-items-center justify-content-center bg-white shadow-lg">
          <div className="w-100 p-4 p-md-5" style={{ maxWidth: '450px' }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold text-dark">Welcome Back</h2>
              <p className="text-muted small">Login to access your dashboard</p>
            </div>

            {error && <div className="alert alert-danger py-2 text-center small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label className="form-label fw-bold small">Email Address</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg bg-light border-0"
                  placeholder="name@email.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="mb-4 text-start">
                <label className="form-label fw-bold small">Password</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg bg-light border-0"
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold mb-3 shadow-sm">
                Sign In
              </button>
              
              <p className="text-center small mb-0">
                Don't have an account? <Link to="/register" className="text-decoration-none fw-bold">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;