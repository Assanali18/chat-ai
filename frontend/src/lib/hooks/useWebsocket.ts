import { useEffect, useRef, useState } from 'react';

type WebSocketMessage = {
  message: string;
  isUser: boolean;
};

const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const webSocketRef = useRef<WebSocket | null>(null);
  const currentMessageRef = useRef<string>('');

  useEffect(() => {
    const connect = () => {
      const webSocket = new WebSocket(url);
      webSocketRef.current = webSocket;

      webSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.isFinal) {
            setMessages(prevMessages => [
              ...prevMessages,
              { message: currentMessageRef.current, isUser: false }
            ]);
            currentMessageRef.current = '';
          } else {
            currentMessageRef.current += data.message;
            setMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              if (updatedMessages.length > 0 && !updatedMessages[updatedMessages.length - 1].isUser) {
                updatedMessages[updatedMessages.length - 1].message = currentMessageRef.current;
              } else {
                updatedMessages.push({ message: currentMessageRef.current, isUser: false });
              }
              return updatedMessages;
            });
          }
        } catch (error) {
          console.log('Received non-JSON message:', event.data);
        }
      };

      webSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    };

    connect();

    return () => {
      webSocketRef.current?.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(message);
      setMessages(prevMessages => [
        ...prevMessages,
        { message, isUser: true }
      ]);
    } else {
      console.error('WebSocket is not open');
    }
  };

  return { messages, sendMessage };
};

export default useWebSocket;
