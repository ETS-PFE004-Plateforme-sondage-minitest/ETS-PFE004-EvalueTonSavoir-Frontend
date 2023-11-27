import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../../../pages/Teacher/Dashboard/Dashboard';

describe('Dashboard Component', () => {
  const sampleQuiz = {
    id: '1',
    title: 'Sample Quiz',
    questions: ['Question 1', 'Question 2', 'Question 3'],
  };

  beforeEach(() => {
    localStorage.setItem('quizzes', JSON.stringify([sampleQuiz]));
  });

  test('renders dashboard with initial state', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
  });

  test('handles search input', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Rechercher un quiz');
    fireEvent.change(searchInput, { target: { value: 'Sample Quiz' } });

    const quizTitleToSearch = 'Sample Quiz';

    const quizTitleElement = screen.getByText(quizTitleToSearch);
    expect(quizTitleElement).toBeInTheDocument();
  });


});
