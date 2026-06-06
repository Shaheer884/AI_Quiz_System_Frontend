import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }
  ]);
  const navigate = useNavigate();

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/quizzes', { title, timeLimit, questions });
      alert('Quiz Created Successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert('Error creating quiz: ' + err.response?.data?.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container pb-5">
        <div className="card shadow-sm p-4">
          <h2 className="mb-4">Create New Quiz</h2>
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-bold">Quiz Title</label>
                <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Time Limit (Minutes)</label>
                <input type="number" className="form-control" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} required />
              </div>
            </div>

            <hr />

            {questions.map((q, qIndex) => (
              <div key={qIndex} className="card mb-4 bg-light p-3">
                <h5>Question {qIndex + 1}</h5>
                <input 
                  type="text" className="form-control mb-3" placeholder="Enter Question Text"
                  value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)} required 
                />
                <div className="row">
                  {q.options.map((opt, oIndex) => (
                    <div className="col-md-6 mb-2" key={oIndex}>
                      <div className="input-group">
                        <span className="input-group-text">{oIndex + 1}</span>
                        <input 
                          type="text" className="form-control" placeholder={`Option ${oIndex + 1}`}
                          value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} required 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <label className="me-2 fw-bold small">Correct Option Index (0-3):</label>
                  <input 
                    type="number" min="0" max="3" className="form-control d-inline-block w-auto"
                    value={q.correctAnswerIndex} onChange={(e) => handleQuestionChange(qIndex, 'correctAnswerIndex', parseInt(e.target.value))}
                  />
                </div>
              </div>
            ))}

            <button type="button" className="btn btn-secondary mb-4" onClick={addQuestion}>+ Add Another Question</button>
            <button type="submit" className="btn btn-success w-100 btn-lg">Save Quiz</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateQuiz;