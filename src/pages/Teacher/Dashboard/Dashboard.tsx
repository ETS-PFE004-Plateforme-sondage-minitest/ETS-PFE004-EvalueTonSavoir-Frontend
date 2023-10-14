// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './dashboard.css';

interface Quiz {
    id: string;
    title: string;
    questions: string;
}

const Dashboard: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch quizzes from local storage
    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    setQuizzes(storedQuizzes);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveQuiz = (id: string) => {
    const updatedQuizzes = quizzes.filter((quiz: Quiz) => quiz.id !== id);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
  };

  const handleDuplicateQuiz = (id: string) => {
    const quizToDuplicate = quizzes.find((quiz: Quiz) => quiz.id === id);
    if (!quizToDuplicate) return;
    const duplicatedQuiz: Quiz = { ...quizToDuplicate, id: uuidv4(), title: quizToDuplicate.title || 'Untitled Quiz' };
    const updatedQuizzes: Quiz[] = [...quizzes, duplicatedQuiz];
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
  };

  const filteredQuizzes: Quiz[] = quizzes.filter((quiz: Quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="wrapper">
        <div>
        <h2>Quiz Dashboard</h2>
        <div>
            <input type="text" placeholder="Search quizzes" value={searchTerm} onChange={handleSearch} />
            <Link to="/teacher/create-quiz">Create Quiz</Link>
        </div>
        <ul>
            {filteredQuizzes.map((quiz: Quiz) => (
            <li key={quiz.id}>
                <h3>{quiz.title}</h3>
                <button onClick={() => handleRemoveQuiz(quiz.id)}>Remove</button>
                <button onClick={() => handleDuplicateQuiz(quiz.id)}>Duplicate</button>
                <Link to={`/teacher/edit-quiz/${quiz.id}`}>Edit Quiz</Link>
                <Link to={`/quiz/${quiz.id}`}>Start Quiz</Link>
            </li>
            ))}
        </ul>
        </div>
    </div>
  );
};

export default Dashboard;