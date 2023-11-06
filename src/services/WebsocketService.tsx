// WebSocketService.ts
import { io, Socket } from 'socket.io-client';

class WebSocketService {
    private socket: Socket | null = null;

    connect(): Socket {
        if (!this.socket) {
            this.socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
                transports: ['websocket'],
                reconnectionAttempts: 1
            });
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    createRoom() {
        if (this.socket) {
            this.socket.emit('create-room');
        }
    }

    nextQuestion(roomName: string, question: any) {
        if (this.socket) {
            this.socket.emit('next-question', { roomName, question });
        }
    }

    launchStudentModeQuiz(roomName: string, questions: any) {
        if (this.socket) {
            this.socket.emit('launch-student-mode', { roomName, questions });
        }
    }

    endQuiz(roomName: string) {
        if (this.socket) {
            this.socket.emit('end-quiz', { roomName });
        }
    }

    joinRoom(enteredRoomName: string, username: string) {
        if (this.socket) {
            this.socket.emit('join-room', { enteredRoomName, username });
        }
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
