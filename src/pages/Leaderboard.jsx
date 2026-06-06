import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

const Leaderboard = () => {
  const { quizId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await API.get(`/results/leaderboard/${quizId}`);
        setLeaderboard(data);
        // Assuming the first result populated the quiz title
        if(data.length > 0 && data[0].quiz && data[0].quiz.title) {
            setQuizTitle(data[0].quiz.title);
        } else {
            // If leaderboard empty, we might need a separate API call just for title
            setQuizTitle('Quiz'); 
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [quizId]);

  if (loading) return <div className="text-center mt-5">Loading Leaderboard...</div>;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">🏆 Leaderboard</h1>
          <h3 className="text-primary">{quizTitle}</h3>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg border-0 rounded-4 p-4">
              {leaderboard.length === 0 ? (
                <p className="text-muted text-center py-5">No attempts recorded for this quiz yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Rank</th>
                        <th>Student Name</th>
                        <th>Score</th>
                        <th>Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => (
                        <tr key={entry._id} className={index < 3 ? 'table-warning' : ''}>
                          <td className="fw-bold fs-5">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </td>
                          <td className="fw-semibold">{entry.user?.name}</td>
                          <td className="fw-bold text-success fs-5">
                            {entry.score} / {entry.totalQuestions}
                          </td>
                          <td className="text-muted small">
                            {new Date(entry.completedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;