// tests/messageCreation.test.js
const request = require('supertest');
const express = require('express');

// Unit test for message creation functionality
describe('Message Creation Unit Test', () => {
  let app;
  
  // Setup a test Express app before all tests
  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Mock database - in a real unit test, you'd use your actual model
    const mockMessages = [];
    let messageId = 1;
    
    // POST /api/messages - Create new message endpoint
    app.post('/api/messages', (req, res) => {
      const { username, content } = req.body;
      
      // Input validation (this is what we're testing)
      if (!username || !content) {
        return res.status(400).json({ 
          error: 'Username and content are required' 
        });
      }
      
      if (username.trim().length === 0 || content.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Username and content cannot be empty' 
        });
      }
      
      if (content.length > 500) {
        return res.status(400).json({ 
          error: 'Message content too long (max 500 characters)' 
        });
      }
      
      // Create new message object
      const newMessage = {
        id: messageId++,
        username: username.trim(),
        content: content.trim(),
        created_at: new Date().toISOString(),
        timestamp: Date.now()
      };
      
      // Add to mock database
      mockMessages.push(newMessage);
      
      // Return success response
      res.status(201).json({
        success: true,
        message: 'Message created successfully',
        data: newMessage
      });
    });
    
    // GET /api/messages - Get all messages (to verify creation)
    app.get('/api/messages', (req, res) => {
      res.json({
        success: true,
        data: mockMessages,
        count: mockMessages.length
      });
    });
  });

  // Reset mock data before each test
  beforeEach(() => {
    // Clear any test data if needed
  });

  // Test Case: Successful Message Creation
  test('should create a new message successfully with valid data', async () => {
    // Arrange - Prepare test data
    const testMessage = {
      username: 'john_doe',
      content: 'Hello, this is a test message!'
    };

    // Act - Make the API call
    const response = await request(app)
      .post('/api/messages')
      .send(testMessage)
      .set('Content-Type', 'application/json');

    // Assert - Verify the response
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Message created successfully');
    
    // Verify the message data in response
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.username).toBe('john_doe');
    expect(response.body.data.content).toBe('Hello, this is a test message!');
    expect(response.body.data).toHaveProperty('created_at');
    expect(response.body.data).toHaveProperty('timestamp');
    
    // Verify the message was actually stored by fetching all messages
    const getResponse = await request(app).get('/api/messages');
    expect(getResponse.body.count).toBe(1);
    expect(getResponse.body.data[0].username).toBe('john_doe');
    expect(getResponse.body.data[0].content).toBe('Hello, this is a test message!');
  });

  // Test Case: Message Creation Validation - Missing Username
  test('should return 400 error when username is missing', async () => {
    const invalidMessage = {
      content: 'This message has no username'
    };

    const response = await request(app)
      .post('/api/messages')
      .send(invalidMessage);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username and content are required');
  });

  // Test Case: Message Creation Validation - Missing Content
  test('should return 400 error when content is missing', async () => {
    const invalidMessage = {
      username: 'john_doe'
    };

    const response = await request(app)
      .post('/api/messages')
      .send(invalidMessage);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username and content are required');
  });

  // Test Case: Message Creation Validation - Empty Strings
  test('should return 400 error when username or content are empty strings', async () => {
    const invalidMessage = {
      username: '   ', // Only spaces
      content: '   '   // Only spaces
    };

    const response = await request(app)
      .post('/api/messages')
      .send(invalidMessage);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username and content cannot be empty');
  });

  // Test Case: Message Creation Validation - Content Too Long
  test('should return 400 error when content exceeds maximum length', async () => {
    const longContent = 'a'.repeat(501); // 501 characters - exceeds 500 limit
    
    const invalidMessage = {
      username: 'john_doe',
      content: longContent
    };

    const response = await request(app)
      .post('/api/messages')
      .send(invalidMessage);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Message content too long (max 500 characters)');
  });

  // Test Case: Message Creation with Trimming
  test('should trim whitespace from username and content', async () => {
    const testMessage = {
      username: '  john_doe  ',
      content: '  Hello with spaces  '
    };

    const response = await request(app)
      .post('/api/messages')
      .send(testMessage);

    expect(response.status).toBe(201);
    expect(response.body.data.username).toBe('john_doe'); // Trimmed
    expect(response.body.data.content).toBe('Hello with spaces'); // Trimmed
  });
});