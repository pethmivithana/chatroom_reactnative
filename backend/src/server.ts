// backend/src/server.ts
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

const onlineUsers = new Set<string>();

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'chat_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());
app.use(express.json());

// Routes

// GET /api/messages - Fetch all messages
app.get('/api/messages', async (req, res) => {
  try {
    // Changed ORDER BY to ASC to get oldest messages first
    const [messages] = await db.execute(
      'SELECT * FROM messages ORDER BY created_at ASC LIMIT 100'
    );
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/messages - Create new message
app.post('/api/messages', async (req, res) => {
  try {
    const { username, content } = req.body;
    
    // Validation
    if (!username || !content) {
      return res.status(400).json({ error: 'Username and content are required' });
    }

    if (typeof username !== 'string' || typeof content !== 'string') {
      return res.status(400).json({ error: 'Username and content must be strings' });
    }

    // Save to database
    const [result] = await db.execute(
      'INSERT INTO messages (username, content) VALUES (?, ?)',
      [username, content]
    );

    // Return the new message
    const newMessage = {
      id: (result as any).insertId,
      username,
      content,
      created_at: new Date()
    };

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// GET /api/online-users - Get current online users
app.get('/api/online-users', (req, res) => {
  res.json(Array.from(onlineUsers));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Backend running',
    onlineUsers: onlineUsers.size
  });
});

// Socket.IO handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join chat event
  socket.on('join_chat', (username: string) => {
    socket.data.username = username;
    onlineUsers.add(username);
    socket.join('chat_room');
    console.log(`User ${username} joined chat room`);
    
    // Broadcast updated users list to ALL clients
    io.emit('users_update', Array.from(onlineUsers));
    console.log(`Online users: ${Array.from(onlineUsers).join(', ')}`);
  });

  // Leave chat event (manual leave)
  socket.on('leave_chat', () => {
    const name = socket.data.username;
    if (name) {
      onlineUsers.delete(name);
      // Broadcast updated users list to ALL clients
      io.emit('users_update', Array.from(onlineUsers));
      console.log(`User ${name} left chat room`);
      console.log(`Online users: ${Array.from(onlineUsers).join(', ')}`);
    }
  });

  // Handle new message
  socket.on('send_message', async (messageData) => {
    try {
      console.log('New message received:', messageData);

      // Validation
      if (!messageData.username || !messageData.content) {
        socket.emit('error', { message: 'Username and content are required' });
        return;
      }

      // Save to database
      const [result] = await db.execute(
        'INSERT INTO messages (username, content) VALUES (?, ?)',
        [messageData.username, messageData.content]
      );

      // Create message object with ID
      const newMessage = {
        id: (result as any).insertId,
        username: messageData.username,
        content: messageData.content,
        created_at: new Date()
      };

      console.log('Message saved to database:', newMessage);

      // Broadcast to all connected clients
      io.emit('new_message', newMessage);
      
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (username) => {
    socket.data.username = username;
    socket.to('chat_room').emit('user_typing', username);
    console.log(`User ${username} is typing...`);
  });

  socket.on('typing_stop', () => {
    const name = socket.data.username;
    socket.to('chat_room').emit('user_stop_typing', name || '');
    console.log(`User ${name || 'Unknown'} stopped typing`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const name = socket.data.username;
    if (name) {
      onlineUsers.delete(name);
      // Broadcast updated users list to ALL clients
      io.emit('users_update', Array.from(onlineUsers));
      console.log(`User ${name} disconnected`);
      console.log(`Online users: ${Array.from(onlineUsers).join(', ')}`);
    }
    console.log('User disconnected:', socket.id);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Messages API: http://localhost:${PORT}/api/messages`);
  console.log(`Online users API: http://localhost:${PORT}/api/online-users`);
});
// Export for testing
export { app, server };
export default app;