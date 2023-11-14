import WebsocketService from '../../services/WebsocketService';
import { io, Socket } from 'socket.io-client';

jest.mock('socket.io-client');

describe('WebSocketService', () => {
    let mockSocket: Partial<Socket>;

    beforeEach(() => {
        mockSocket = {
            emit: jest.fn(),
            disconnect: jest.fn(),
            connect: jest.fn()
        };

        // Mock the io function from socket.io-client
        (io as jest.Mock).mockReturnValue(mockSocket);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('connect should initialize socket connection', () => {
        WebsocketService.connect();
        expect(io).toHaveBeenCalled();
        expect(WebsocketService['socket']).toBe(mockSocket);
    });

    test('disconnect should terminate socket connection', () => {
        WebsocketService.connect(); // Connect first
        WebsocketService.disconnect();
        expect(mockSocket.disconnect).toHaveBeenCalled();
        expect(WebsocketService['socket']).toBeNull();
    });

    test('createRoom should emit create-room event', () => {
        WebsocketService.connect();
        WebsocketService.createRoom();
        expect(mockSocket.emit).toHaveBeenCalledWith('create-room');
    });

    test('nextQuestion should emit next-question event with correct parameters', () => {
        const roomName = 'testRoom';
        const question = { id: 1, text: 'Sample Question' };

        WebsocketService.connect();
        WebsocketService.nextQuestion(roomName, question);
        expect(mockSocket.emit).toHaveBeenCalledWith('next-question', { roomName, question });
    });

    // Add similar tests for launchStudentModeQuiz, endQuiz, and joinRoom methods
});
