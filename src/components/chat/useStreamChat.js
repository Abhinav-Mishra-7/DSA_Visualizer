// frontend/src/components/chat/useStreamChat.js
import { useState, useCallback, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000'; // or import from env
const STORAGE_KEY_PREFIX = 'chat_history_';

export function useStreamChat({ title, description, testCases, startCode }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use algorithm title as key. Empty title fallback so key is stable.
  const storageKey = `${STORAGE_KEY_PREFIX}${title || 'unknown_algorithm'}`;

  // 1) Load messages from localStorage ONLY once on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // 2) Save messages to localStorage whenever they change
  //    If messages becomes empty, also clear storage so that
  //    a fresh open of the website starts with empty chat.
  useEffect(() => {
    if (isLoading) return;

    try {
      if (messages.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (err) {
      console.error('Error saving chat history:', err);
    }
  }, [messages, storageKey, isLoading]);

  // 3) Clear chat API – used when user presses "Clear"
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.error('Error clearing chat history:', err);
    }
  }, [storageKey]);

  // 4) Send message + streaming logic
  const sendMessage = useCallback(
    async (userMessage) => {
      if (!userMessage.trim()) return;

      setError(null);
      setIsStreaming(true);

      // append user message
      const updatedMessages = [
        ...messages,
        { role: 'user', content: userMessage, parts: [{ text: userMessage }] }
      ];
      setMessages(updatedMessages);

      try {
        // format for Gemini
        const formattedMessages = updatedMessages.map((msg) => {
          if (msg.parts && Array.isArray(msg.parts)) {
            return {
              role: msg.role === 'model' ? 'model' : 'user',
              parts: msg.parts
            };
          }
          return {
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.content || '' }]
          };
        });

        const payload = {
          messages: formattedMessages,
          title: title || 'Algorithm',
          description: description || '',
          testCases: testCases || [],
          startCode: startCode || ''
        };

        let aiResponse = '';

        const response = await fetch(`${API_BASE_URL}/ai/chat-stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;

            try {
              const data = JSON.parse(line.slice(6));

              if (data.text === '[DONE]') {
                setIsStreaming(false);
                continue;
              }

              aiResponse += data.text;

              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];

                if (lastMsg?.role === 'model') {
                  lastMsg.content = aiResponse;
                } else {
                  newMessages.push({
                    role: 'model',
                    content: aiResponse,
                    parts: [{ text: aiResponse }]
                  });
                }
                return newMessages;
              });
            } catch {
              // ignore partial chunk parse errors
            }
          }
        }

        setIsStreaming(false);
      } catch (err) {
        console.error('Stream chat error:', err);
        setError(err.message || 'Failed to get response from AI. Please try again.');
        setIsStreaming(false);
      }
    },
    [messages, title, description, testCases, startCode]
  );

  return {
    messages,
    setMessages,
    error,
    sendMessage,
    clearChat,
    isStreaming,
    isLoading
  };
}