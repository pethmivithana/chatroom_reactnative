import { Message } from '../types';
import { Card } from '../components/ui/card';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  currentUser: string;
}

export default function MessageList({ messages, loading, currentUser }: MessageListProps) {
  if (loading) {
    return <div className="text-muted-foreground">Loading messages...</div>;
  }

  return (
    <div className="space-y-2 max-w-2xl mx-auto">
      {messages.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No messages yet. Start the conversation!
        </div>
      ) : (
        // Messages are already sorted oldest first in Redux store
        messages.map((msg) => (
          <Card
            key={msg.id}
            className={`p-3 ${
              msg.username === currentUser
                ? 'bg-primary text-primary-foreground ml-auto max-w-xs'
                : 'bg-card max-w-xs'
            }`}
          >
            <p className="text-sm font-semibold">{msg.username}</p>
            <p className="text-sm break-words">{msg.content}</p>
            <p className="text-xs opacity-70 mt-1">
              {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : 'N/A'}
            </p>
          </Card>
        ))
      )}
    </div>
  );
}