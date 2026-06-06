import { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Ensure this endpoint matches the one we just added to authRoutes.js
        const { data } = await API.get('/auth/users');
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.response?.data?.message || "Failed to load users. Are you logged in as Admin?");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        {/* Header Section */}
        <div className="text-center mb-5 text-white">
          <h1 className="fw-bold display-5">👥 User Management</h1>
          <p className="opacity-75 fs-5">Administrative control for all registered members</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger shadow-sm rounded-3 border-0 mb-4" role="alert">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        <div className="card shadow-lg border-0 rounded-4 overflow-hidden shadow-2xl">
          <div className="card-body p-0 bg-white">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr style={{ height: '60px' }}>
                    <th className="ps-4">Full Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th className="text-center">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted">Fetching users...</p>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <h5 className="text-muted">No users found in the database.</h5>
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="transition-all">
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 shadow-sm"
                              style={{ width: '35px', height: '35px', fontSize: '0.8rem' }}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="fw-bold text-dark">{u.name}</span>
                          </div>
                        </td>
                        <td className="text-secondary">{u.email}</td>
                        <td>
                          <span className={`badge rounded-pill px-3 py-2 ${
                            u.role === 'admin' 
                              ? 'bg-danger text-white' 
                              : 'bg-primary-subtle text-primary border border-primary-subtle'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-center text-muted small">
                          {new Date(u.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;