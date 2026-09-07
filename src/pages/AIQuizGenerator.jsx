import { useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const AIQuizGenerator = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const fetchQuestions = async (isNewSearch = true) => {
    setLoading(true);
    try {
      const { data } = await API.post('/quizzes/generate-ai', { topic });
      if (isNewSearch) {
        setQuestions(data); // Replaces old questions
        setSelectedAnswers({});
        setShowResults(false);
        setScore(0);
      } else {
        // ANTIGRAVITY: Appends new 5 to the existing list safely
        setQuestions(prev => [...prev, ...data]); 
        setShowResults(false);
      }
    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      alert(serverMessage || "AI generation error. Please verify your connection or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIdx, oIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qIdx]: oIdx
    }));
  };

  const calculateScore = () => {
    let currentScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        currentScore += 1;
      }
    });
    setScore(currentScore);
    setShowResults(true);
  };

  const handleSaveQuiz = async () => {
    if (questions.length === 0) return;
    setSaving(true);
    try {
      await API.post('/quizzes/save-ai', {
        title: `AI Quiz: ${topic}`,
        description: `Auto-generated quiz about ${topic}`,
        category: topic,
        timeLimit: questions.length * 2, // 2 minutes per question
        questions: questions
      });
      alert("Quiz saved to your library successfully!");
      navigate('/quizzes');
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to save quiz: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        {/* Header Section */}
        <div className="text-center mb-5 text-white">
          <h1 className="display-4 fw-bold">🤖 AI Quiz Master</h1>
          <p className="opacity-75 fs-5">Instant learning powered by Gemini 2.0</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-9">
            {/* Search Card */}
            <div className="card shadow-lg border-0 rounded-4 p-4 mb-5">
              <div className="input-group input-group-lg shadow-sm">
                <input 
                  type="text" 
                  className="form-control border-end-0 ps-4" 
                  placeholder="Enter a topic (e.g. React Hooks, History of Pakistan...)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={loading}
                />
                <button 
                  className="btn btn-primary px-5 fw-bold" 
                  onClick={() => fetchQuestions(true)}
                  disabled={loading || !topic}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : 'Generate'}
                </button>
              </div>
            </div>

            {/* Questions List */}
            {questions.length > 0 && (
              <div className="fade-in">
                {questions.map((q, qIdx) => (
                  <div key={qIdx} className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden border-start border-4 border-info">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-start mb-3">
                        <span className="badge bg-info text-dark me-3 mt-1">Q{qIdx + 1}</span>
                        <h5 className="fw-bold mb-0">{q.questionText}</h5>
                      </div>
                      
                      <div className="row g-3">
                        {q.options.map((opt, oIdx) => {
                          let optionClass = "bg-light";
                          if (showResults) {
                            if (oIdx === q.correctAnswerIndex) {
                              optionClass = "bg-success text-white border-success";
                            } else if (selectedAnswers[qIdx] === oIdx) {
                              optionClass = "bg-danger text-white border-danger";
                            }
                          } else if (selectedAnswers[qIdx] === oIdx) {
                            optionClass = "bg-primary text-white border-primary";
                          }
                          
                          return (
                            <div key={oIdx} className="col-md-6">
                              <div 
                                className={`p-3 border rounded-3 small transition-all ${optionClass}`}
                                onClick={() => !showResults && handleOptionSelect(qIdx, oIdx)}
                                style={{ cursor: showResults ? 'default' : 'pointer' }}
                              >
                                <span className="fw-bold me-2">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Footer Actions */}
                {showResults && (
                  <div className="text-center mb-4">
                    <h3 className="fw-bold text-white">Your Score: {score} / {questions.length}</h3>
                  </div>
                )}
                
                <div className="d-flex gap-3 justify-content-center mt-5 mb-5">
                  {!showResults && (
                    <button 
                      className="btn btn-warning btn-lg px-4 fw-bold shadow-sm"
                      onClick={calculateScore}
                    >
                      ✅ Submit Quiz
                    </button>
                  )}
                  
                  <button 
                    className="btn btn-outline-light btn-lg px-4 fw-bold shadow-sm" 
                    onClick={() => fetchQuestions(false)}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : '➕ Add 5 More'}
                  </button>
                  
                  <button 
                    className="btn btn-success btn-lg px-4 fw-bold shadow-sm"
                    onClick={handleSaveQuiz}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : '💾 Save to Library'}
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && questions.length === 0 && (
              <div className="text-center text-white opacity-50 py-5">
                <i className="bi bi-robot fs-1 d-block mb-3"></i>
                <p>No questions generated yet. Type a topic above to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AIQuizGenerator;