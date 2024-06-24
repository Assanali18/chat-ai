import React from 'react';
import { cn } from '@/lib/utils';

type ChatMessageProps = {
  message: string;
  isUser: boolean;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  if(!message) return null;
  const formatMessage = (text: string) => {
    const parts = text.split('**').map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
    return <>{parts}</>;
  };

  return (
    <div className={cn(
      "bg-white shadow-md p-6 rounded-lg max-w-full w-full md:max-w-[600px]",
      isUser ? "ml-auto bg-blue-100" : "mr-auto bg-gray-100"
    )}>
      <pre className="text-lg whitespace-pre-wrap">{formatMessage(message)}</pre>
    </div>
  );
};

export default ChatMessage;
