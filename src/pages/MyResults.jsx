import { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { downloadResultPDF } from '../utils/generatePDF'; // Import the utility

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyResults = async () => {
      try {
        const { data } = await API.get('/results/myresults');
        setResults(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching results", err);
        setLoading(false);
      }
    };
    fetchMyResults();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="fw-bold mb-4">Exam History & Reports</h2>
        <div className="card shadow-sm border-0 rounded-4 p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : results.length === 0 ? (
            <p className="text-muted text-center">No quiz data found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Quiz Title</th>
                    <th>Score</th>
                    <th>Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((res) => (
                    <tr key={res._id}>
                      <td className="fw-bold">{res.quiz?.title}</td>
                      <td>
                        <span className={`badge ${res.score / res.totalQuestions >= 0.5 ? 'bg-success' : 'bg-danger'}`}>
                          {res.score} / {res.totalQuestions}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {new Date(res.completedAt).toLocaleDateString()}
                      </td>
                      <td className="text-end">
                        <button 
                          className="btn btn-sm btn-outline-danger me-2 shadow-sm"
                          onClick={() => {
                            console.log("Generating PDF for:", res); // Debug log
                            downloadResultPDF(res);
                          }}
                        >
                          PDF 📄
                        </button>
                        <Link to={`/leaderboard/${res.quiz?._id}`} className="btn btn-sm btn-dark">
                          🏆 Rank
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyResults;