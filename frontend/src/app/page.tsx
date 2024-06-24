'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useWebSocket from '@/lib/hooks/useWebsocket';
import { useEffect, useRef, useState } from 'react';
import ChatMessage from '@/components/ChatMessage';
import axiosInstance from '@/api/axiosInstance';
import React from 'react';

interface Message {
  userMessage: string;
  aiMessage: string;
  createdAt: Date;
}

export default function Home() {
  const { messages, sendMessage } = useWebSocket('wss://localhost:5000');
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (prompt.trim() !== '') {
      sendMessage(prompt);
      setPrompt('');
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await axiosInstance.get<Message[]>('/api/v1/history');
      setHistory(response.data);
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, history]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <header className="bg-primary text-primary-foreground py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold">Chat AI</h1>
      </header>
      <main className="flex-1 overflow-auto px-4 md:px-6 pb-20" ref={messagesContainerRef}>
        <div className="space-y-2 flex flex-col mt-4">
          {history.map((message, index) => (
            <React.Fragment key={index}>
              <ChatMessage
                message={message.userMessage}
                isUser={true}
              />
              <ChatMessage
                message={message.aiMessage}
                isUser={false}
              />
            </React.Fragment>
          ))}
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.message}
              isUser={message.isUser}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <div className="bg-white py-4 px-4 md:px-6 fixed bottom-0 left-0 w-full flex items-center space-x-2">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your message"
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <Button
          onClick={handleSend}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
