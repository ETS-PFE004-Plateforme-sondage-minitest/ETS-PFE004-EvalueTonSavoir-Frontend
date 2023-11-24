import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../../../pages/Teacher/Dashboard/Dashboard';

describe('Dashboard Component', () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };

  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  beforeAll(() => {
    // @ts-ignore
    global.localStorage = localStorageMock as Storage;
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

  });


  test('handles removing quiz', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const quizToRemove = { id: '1', title: 'Sample Quiz', questions: [] }; // Replace with actual quiz data
    const removeButton = screen.getByTitle('Supprimer le quiz');

    fireEvent.click(removeButton);

    expect(screen.getByText(`Êtes-vous sûr de vouloir supprimer le quiz "${quizToRemove.title}" ?`)).toBeInTheDocument();

    const confirmButton = screen.getByText('Confirmer');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('quizzes', expect.any(String));
    });
  });

});
