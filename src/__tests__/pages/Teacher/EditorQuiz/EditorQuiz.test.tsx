import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import QuizForm from '../../../../pages/Teacher/EditorQuiz/EditorQuiz';
import { waitFor } from '@testing-library/react';

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

describe('QuizForm Component', () => {
  test('renders QuizForm with default state for a new quiz', () => {
    render(
      <MemoryRouter initialEntries={['/teacher/editor-quiz/new']}>
          <QuizForm />
      </MemoryRouter>
    );

    expect(screen.queryByText('Éditeur de quiz')).toBeInTheDocument();
    expect(screen.queryByText('Éditeur')).toBeInTheDocument();
    expect(screen.queryByText('Prévisualisation')).toBeInTheDocument();
  });

  test('renders QuizForm for a new quiz', async () => {
    render(
      <MemoryRouter initialEntries={['/teacher/editor-quiz']}>
          <QuizForm />
      </MemoryRouter>
    );

    expect(screen.getByText(/Éditeur de quiz/i)).toBeInTheDocument();

    const editorTextArea = screen.getByRole('textbox');
    fireEvent.change(editorTextArea, { target: { value: 'Sample question?' } });

    await waitFor(() => {
      const sampleQuestionElements = screen.queryAllByText(/Sample question\?/i);
      expect(sampleQuestionElements.length).toBeGreaterThan(0);
    });

    const saveButton = screen.getByText(/Enregistrer/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Sauvegarder le questionnaire/i)).toBeInTheDocument();
    });
  });

});
