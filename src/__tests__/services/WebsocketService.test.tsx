//WebsocketService.test.tsx
import WebsocketService from '../../services/WebsocketService';
import { io, Socket } from 'socket.io-client';
import { ENV_VARIABLES } from '../../constants';

jest.mock('socket.io-client');

jest.mock('../../constants', () => ({
    ENV_VARIABLES: {
        VITE_BACKEND_URL: 'https://ets-glitch-backend.glitch.me/'
    }
}));

describe('WebSocketService', () => {
    let mockSocket: Partial<Socket>;

    beforeEach(() => {
        mockSocket = {
            emit: jest.fn(),
            disconnect: jest.fn(),
            connect: jest.fn()
        };

        (io as jest.Mock).mockReturnValue(mockSocket);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('connect should initialize socket connection', () => {
        WebsocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
        expect(io).toHaveBeenCalled();
        expect(WebsocketService['socket']).toBe(mockSocket);
    });

    test('disconnect should terminate socket connection', () => {
        mockSocket = WebsocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
        expect(WebsocketService['socket']).toBeTruthy();
        WebsocketService.disconnect();
        expect(mockSocket.disconnect).toHaveBeenCalled();
        expect(WebsocketService['socket']).toBeNull();
    });

    test('createRoom should emit create-room event', () => {
        WebsocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
        WebsocketService.createRoom();
        expect(mockSocket.emit).toHaveBeenCalledWith('create-room');
    });

    test('nextQuestion should emit next-question event with correct parameters', () => {
        const roomName = 'testRoom';
        const question = { id: 1, text: 'Sample Question' };

        mockSocket = WebsocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
        WebsocketService.nextQuestion(roomName, question);
        expect(mockSocket.emit).toHaveBeenCalledWith('next-question', { roomName, question });
    });

    test('launchStudentModeQuiz should emit launch-student-mode event with correct parameters', () => {
        const roomName = 'testRoom';
        const questions = [{ id: 1, text: 'Sample Question' }];

        mockSocket = WebsocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
        WebsocketService.launchStudentModeQuiz(roomName, questions);
        expect(mockSocket.emit).toHaveBeenCalledWith('launch-student-mode', {
            roomName,
            questions
        });
    });

    test('endQuiz should emit end-quiz event with correct parameters', () => {
        const roomName = 'testRoom';

        mockSocket = WebsocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
        WebsocketService.endQuiz(roomName);
        expect(mockSocket.emit).toHaveBeenCalledWith('end-quiz', { roomName });
    });

    test('joinRoom should emit join-room event with correct parameters', () => {
        const enteredRoomName = 'testRoom';
        const username = 'testUser';

        mockSocket = WebsocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
        WebsocketService.joinRoom(enteredRoomName, username);
        expect(mockSocket.emit).toHaveBeenCalledWith('join-room', { enteredRoomName, username });
    });
});
