import { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'student' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await API.post('/auth/register', formData);
      alert("Registration Successful! Redirecting to Login...");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
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
              Create, share, and play AI-generated quizzes in a fully modernized environment. Join our learning platform today.
            </p>
          </div>
        </div>

        {/* Right Side: Input Form */}
        <div className="col-md-6 col-lg-5 d-flex align-items-center justify-content-center bg-white shadow-lg">
          <div className="w-100 p-4 p-md-5" style={{ maxWidth: '450px' }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold text-dark">Create Account</h2>
              <p className="text-muted small">Join the Quiz Portal today</p>
            </div>

            {error && <div className="alert alert-danger py-2 text-center small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label className="form-label small fw-bold">Full Name</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg bg-light border-0" 
                  placeholder="Enter your name" 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>

              <div className="mb-3 text-start">
                <label className="form-label small fw-bold">Email Address</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg bg-light border-0" 
                  placeholder="name@email.com" 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>

              <div className="mb-3 text-start">
                <label className="form-label small fw-bold">Password</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg bg-light border-0" 
                  placeholder="••••••••" 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required 
                />
              </div>

              <div className="mb-4 text-start">
                <label className="form-label small fw-bold">Join as</label>
                <select 
                  className="form-select form-select-lg bg-light border-0" 
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  value={formData.role}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <div className="text-center mt-4">
                <p className="text-muted small mb-0">
                  Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;