import { Socket } from 'socket.io';
import { MessageModel } from '../models/messageModel';

export const setupSocketHandlers = (io: any) => {
  let connectedUsers: Set<string> = new Set();

  io.on('connection', (socket: Socket) => {
    console.log('[Socket] User connected:', socket.id);

    socket.on('user_join', (username: string) => {
      connectedUsers.add(username);
      io.emit('users_update', Array.from(connectedUsers));
      io.emit('user_joined', { username, message: `${username} joined` });
    });

    socket.on('send_message', async (data: { username: string; content: string }) => {
      try {
        const message = await MessageModel.createMessage(data.username, data.content);
        io.emit('new_message', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to save message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('[Socket] User disconnected:', socket.id);
      io.emit('users_update', Array.from(connectedUsers));
    });

    socket.on('user_leave', (username: string) => {
      connectedUsers.delete(username);
      io.emit('users_update', Array.from(connectedUsers));
      io.emit('user_left', { username, message: `${username} left` });
    });
  });
};
