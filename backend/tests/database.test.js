// tests/database.test.js - Test database logic
describe('Database Operations', () => {
  // Mock database functions
  const mockDatabase = {
    execute: jest.fn(),
    query: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should simulate fetching messages from database', async () => {
    const mockMessages = [
      { id: 1, username: 'user1', content: 'Hello', created_at: new Date() },
      { id: 2, username: 'user2', content: 'Hi', created_at: new Date() }
    ];

    mockDatabase.execute.mockResolvedValue([mockMessages]);

    const result = await mockDatabase.execute('SELECT * FROM messages');
    
    expect(mockDatabase.execute).toHaveBeenCalledWith('SELECT * FROM messages');
    expect(result[0]).toEqual(mockMessages);
    expect(result[0]).toHaveLength(2);
  });

  it('should simulate inserting a message', async () => {
    const mockResult = { insertId: 123 };
    mockDatabase.execute.mockResolvedValue([mockResult]);

    const result = await mockDatabase.execute(
      'INSERT INTO messages (username, content) VALUES (?, ?)',
      ['testuser', 'Test message']
    );

    expect(mockDatabase.execute).toHaveBeenCalledWith(
      'INSERT INTO messages (username, content) VALUES (?, ?)',
      ['testuser', 'Test message']
    );
    expect(result[0].insertId).toBe(123);
  });

  it('should handle database errors', async () => {
    mockDatabase.execute.mockRejectedValue(new Error('Database connection failed'));

    await expect(mockDatabase.execute('SELECT * FROM messages'))
      .rejects
      .toThrow('Database connection failed');
  });
});