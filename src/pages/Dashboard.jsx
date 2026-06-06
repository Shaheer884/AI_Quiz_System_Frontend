import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        {/* Welcome Header */}
        <div className="text-center mb-5 text-white">
          <h1 className="display-4 fw-bold">Welcome back, {user?.name}!</h1>
          <p className="opacity-75 fs-5">Ready to test your knowledge or manage the portal?</p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* --- Student Options --- */}
          
          {/* Manual Quizzes Card */}
          <div className="col-md-6 col-lg-6">
            <div className="card h-100 border-0 shadow-lg p-4 rounded-4 text-center">
              <div className="display-4 mb-3">📝</div>
              <h4 className="fw-bold">Standard Quizzes</h4>
              <p className="text-muted small">Attempt official exams and practice quizzes created by instructors.</p>
              <div className="mt-auto">
                <Link to="/quizzes" className="btn btn-primary w-100 py-2 fw-bold">Browse Quizzes</Link>
              </div>
            </div>
          </div>

          {/* AI Generator Card */}
          <div className="col-md-6 col-lg-6">
            <div className="card h-100 border-0 shadow-lg p-4 rounded-4 text-center border-top border-4 border-info">
              <div className="display-4 mb-3">🤖</div>
              <h4 className="fw-bold text-info">AI Quiz Master</h4>
              <p className="text-muted small">Type any topic and let Gemini 2.0 generate instant MCQs for you.</p>
              <div className="mt-auto">
                <Link to="/ai-generator" className="btn btn-dark w-100 py-2 fw-bold">Try AI Mode</Link>
              </div>
            </div>
          </div>

          {/* --- Admin Only Options --- */}
          {user?.role === 'admin' && (
            <>
              {/* Instructor Panel (Create Quiz) */}
              <div className="col-md-6 col-lg-6">
                <div className="card h-100 border-0 shadow-lg p-4 rounded-4 text-center bg-light">
                  <div className="display-4 mb-3">➕</div>
                  <h4 className="fw-bold text-danger">Quiz Creator</h4>
                  <p className="text-muted small">Design new quizzes, add questions, and set time limits for students.</p>
                  <div className="mt-auto">
                    <Link to="/create-quiz" className="btn btn-danger w-100 py-2 fw-bold">Create New Quiz</Link>
                  </div>
                </div>
              </div>

              {/* User Management Card (NEW) */}
              <div className="col-md-6 col-lg-6">
                <div className="card h-100 border-0 shadow-lg p-4 rounded-4 text-center">
                  <div className="display-4 mb-3">👥</div>
                  <h4 className="fw-bold">User Management</h4>
                  <p className="text-muted small">View all registered students and admins. Track user growth.</p>
                  <div className="mt-auto">
                    <Link to="/manage-users" className="btn btn-outline-dark w-100 py-2 fw-bold">Manage Users</Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Link */}
        <div className="text-center mt-5">
          <Link to="/my-results" className="text-white text-decoration-none fw-bold p-2 px-4 rounded-pill border border-white border-opacity-25 transition-all bg-white bg-opacity-10 hover-bg-opacity-20">
            📊 View My Performance History →
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;