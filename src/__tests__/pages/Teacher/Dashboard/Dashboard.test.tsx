import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../../../pages/Teacher/Dashboard/Dashboard';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => (store[key] = value.toString()),
    clear: () => (store = {}),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));


describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorage.setItem('quizzes', JSON.stringify([]));
  });

  test('renders Dashboard with default state', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Tableau de bord/i)).toBeInTheDocument();
  });

  test('adds a quiz and checks if it is displayed', () => {
    const mockQuizzes = [
      {
        id: '1',
        title: 'Sample Quiz',
        questions: ['Question 1?', 'Question 2?'],
      },
    ];
    localStorage.setItem('quizzes', JSON.stringify(mockQuizzes));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Sample Quiz/i)).toBeInTheDocument();
  });

  test('opens ImportModal when "Importer" button is clicked', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Importer/i));

    expect(screen.getByText(/Importation de quiz/i)).toBeInTheDocument();
  });

});
