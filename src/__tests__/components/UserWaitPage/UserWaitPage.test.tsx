// Importez le type UserType s'il n'est pas déjà importé
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserWaitPage from '../../../components/UserWaitPage/UserWaitPage';

describe('UserWaitPage Component', () => {
    const mockUsers = [
        { id: '1', name: 'User1' },
        { id: '2', name: 'User2' },
        { id: '3', name: 'User3' },
      ];

      const mockProps = {
        users: mockUsers,
        launchQuiz: jest.fn(),
        roomName: 'Test Room',
        setQuizMode: jest.fn(),
      };

    test('renders UserWaitPage with correct content', () => {
        render(<UserWaitPage {...mockProps} />);

        expect(screen.getByText(/Salle: Test Room/)).toBeInTheDocument();

        const launchButton = screen.getByRole('button', { name: /Lancer/i });
        expect(launchButton).toBeInTheDocument();

        mockUsers.forEach((user) => {
          expect(screen.getByText(user.name)).toBeInTheDocument();
        });
      });

      test('clicking on "Lancer" button opens LaunchQuizDialog', () => {
        render(<UserWaitPage {...mockProps} />);

        fireEvent.click(screen.getByRole('button', { name: /Lancer/i }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

})
