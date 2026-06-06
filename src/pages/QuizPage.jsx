import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State Management
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Stores { questionIndex: optionIndex }
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Load Quiz Data from MongoDB
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await API.get(`/quizzes/${id}`);
        setQuiz(data);
        setTimeLeft(data.timeLimit * 60); // Minutes to Seconds
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        alert("Could not load quiz.");
        navigate('/quizzes');
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  // 2. Real-time Countdown Timer
  useEffect(() => {
    if (loading || timeLeft <= 0) {
      if (timeLeft === 0 && quiz && !submitting) handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, quiz]);

  // 3. Handle Option Selection
  const handleSelect = (optionIndex) => {
    setSelectedAnswers({ 
      ...selectedAnswers, 
      [currentQuestion]: optionIndex 
    });
  };

  // 4. Final Submission to Backend
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      // Sending payload to our new Result route
      const { data } = await API.post('/results/submit', {
        quizId: id,
        answers: selectedAnswers
      });

      alert(`Quiz Completed! Your Score: ${data.score} / ${data.totalQuestions}`);
      navigate('/my-results'); // Redirect to their history page
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Error saving your results. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      <Navbar />
      <div className="container mt-4 pb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            
            {/* Header: Title and Timer */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold text-dark mb-0">{quiz.title}</h2>
                <span className="badge bg-light text-primary border">{quiz.category}</span>
              </div>
              <div className={`card px-3 py-2 shadow-sm ${timeLeft < 60 ? 'bg-danger text-white' : 'bg-white'}`}>
                <span className="fw-bold fs-5">
                  ⏱️ {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </div>
            </div>

            {/* Quiz Card */}
            <div className="card shadow border-0 rounded-4 p-4 p-md-5">
              
              {/* Progress Bar */}
              <div className="progress mb-4" style={{ height: '10px', borderRadius: '5px' }}>
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated" 
                  style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>

              <div className="mb-4">
                <span className="text-muted fw-bold small text-uppercase">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </span>
                <h4 className="fw-bold mt-2">{quiz.questions[currentQuestion].questionText}</h4>
              </div>

              {/* Options Grid */}
              <div className="d-grid gap-3">
                {quiz.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    className={`btn btn-lg text-start py-3 px-4 border-2 transition-all ${
                      selectedAnswers[currentQuestion] === index 
                        ? 'btn-primary shadow-sm' 
                        : 'btn-outline-light text-dark bg-light'
                    }`}
                  >
                    <span className="me-3 fw-bold">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt-5">
                <button 
                  className="btn btn-outline-secondary btn-lg px-4 fw-bold" 
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                >
                  Previous
                </button>
                
                {currentQuestion + 1 === quiz.questions.length ? (
                  <button 
                    className="btn btn-success btn-lg px-5 fw-bold shadow" 
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Finish & Submit'}
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary btn-lg px-5 fw-bold shadow" 
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizPage;