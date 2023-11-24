import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Socket } from 'socket.io-client';
import { BrowserRouter } from 'react-router-dom';
import JoinRoom from '../../../../pages/Student/JoinRoom/JoinRoom';
import webSocketService from '../../../../services/WebsocketService';

jest.mock('../../../../services/WebsocketService');

describe('JoinRoom', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the initial join room form', () => {
        render(<JoinRoom />);
        expect(screen.getByText('Rejoindre une salle')).toBeInTheDocument();
    });

    it('successfully connects to the room and renders waiting text for student mode', async () => {
        render(<JoinRoom />);
        const socketMock = jest.fn() as unknown as Socket;

        (webSocketService.connect as jest.Mock).mockReturnValue(socketMock);

        fireEvent.change(screen.getByPlaceholderText('Nom d\'utilisateur'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Nom de la salle'), { target: { value: 'Room123' } });
        fireEvent.click(screen.getByText('Join'));

        await waitFor(() => {
            expect((socketMock as Socket).on).toHaveBeenCalledWith('join-success', expect.any(Function));
            expect(screen.getByText("En attente que le professeur lance le questionnaire...")).toBeInTheDocument();
        });
    });

    it('handles submission of answers in student mode', async () => {
        const socketMock = jest.fn() as unknown as Socket;

        (webSocketService.connect as jest.Mock).mockReturnValue(socketMock);

        const { rerender } = render(<JoinRoom />);
        fireEvent.change(screen.getByPlaceholderText('Nom d\'utilisateur'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Nom de la salle'), { target: { value: 'Room123' } });
        fireEvent.click(screen.getByText('Join'));

        await waitFor(() => {
            expect(socketMock.on).toHaveBeenCalledWith('launch-student-mode', expect.any(Function));
        });

        const submitAnswerMock = jest.fn();
        rerender(
            <BrowserRouter>
                <JoinRoom />
            </BrowserRouter>
        );

        act(() => {
            const question = screen.getByText('Sample Question');
            expect(question).toBeInTheDocument();
            fireEvent.click(question); // You might need to adjust this based on your actual UI.
        });

        act(() => {
            const answerInput = screen.getByPlaceholderText('Type your answer here...');
            fireEvent.change(answerInput, { target: { value: 'My Answer' } });
        });

        act(() => {
            const submitButton = screen.getByText('Submit Answer');
            fireEvent.click(submitButton);
        });

        expect(submitAnswerMock).toHaveBeenCalledWith('My Answer', '1');
    });

});
