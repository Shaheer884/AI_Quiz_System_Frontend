import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import QuizList from './pages/QuizList';
import QuizPage from './pages/QuizPage';
import MyResults from './pages/MyResults';
import Leaderboard from './pages/Leaderboard';
import AIQuizGenerator from './pages/AIQuizGenerator';
import UserManagement from './pages/UserManagement'; // Added for Admin
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        {/* Redirect root (/) to register to onboard new users */}
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* --- Shared Protected Routes (Student & Admin) --- */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/quizzes" element={
          <ProtectedRoute>
            <QuizList />
          </ProtectedRoute>
        } />

        <Route path="/quiz/:id" element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        } />

        <Route path="/my-results" element={
          <ProtectedRoute>
            <MyResults />
          </ProtectedRoute>
        } />

        <Route path="/leaderboard/:quizId" element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        } />

        <Route path="/ai-generator" element={
          <ProtectedRoute>
            <AIQuizGenerator />
          </ProtectedRoute>
        } />

        {/* --- Admin Only Routes --- */}
        
        {/* Route to manually create a quiz */}
        <Route path="/create-quiz" element={
          <ProtectedRoute adminOnly={true}>
            <CreateQuiz />
          </ProtectedRoute>
        } />

        {/* Route to see and manage all registered users */}
        <Route path="/manage-users" element={
          <ProtectedRoute adminOnly={true}>
            <UserManagement />
          </ProtectedRoute>
        } />

        {/* --- Fallback Route --- */}
        {/* Any undefined URL redirects to login for security */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;