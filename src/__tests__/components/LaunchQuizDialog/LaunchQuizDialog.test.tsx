import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LaunchQuizDialog from '../../../components/LaunchQuizDialog/LaunchQuizDialog';

// Mock the functions passed as props
const mockHandleOnClose = jest.fn();
const mockLaunchQuiz = jest.fn();
const mockSetQuizMode = jest.fn();

const renderComponent = (open: boolean) => {
  render(
    <LaunchQuizDialog
      open={open}
      handleOnClose={mockHandleOnClose}
      launchQuiz={mockLaunchQuiz}
      setQuizMode={mockSetQuizMode}
    />
  );
};

describe('LaunchQuizDialog', () => {
  it('renders with correct title', () => {
    renderComponent(true);
    expect(screen.getByText('Options de lancement du quiz')).toBeInTheDocument();
  });

  it('renders radio buttons for teacher and student modes', () => {
    renderComponent(true);
    expect(screen.getByLabelText('Rythme du professeur')).toBeInTheDocument();
    expect(screen.getByLabelText('Rythme de l\'étudiant')).toBeInTheDocument();
  });

  it('calls handleOnClose when "Annuler" button is clicked', () => {
    renderComponent(true);

    fireEvent.click(screen.getByText('Annuler'));

    expect(mockHandleOnClose).toHaveBeenCalled();
  });

  it('calls launchQuiz when "Lancer" button is clicked', () => {
    renderComponent(true);

    fireEvent.click(screen.getByText('Lancer'));

    expect(mockLaunchQuiz).toHaveBeenCalled();
  });

  it('does not render when open is false', () => {
    renderComponent(false);
    expect(screen.queryByText('Options de lancement du quiz')).toBeNull();
  });
});
