import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY_PREFIX = 'chat_history_';

export function useStreamChat({ title, description, testCases, startCode }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = `${STORAGE_KEY_PREFIX}${title || 'unknown_algorithm'}`;

  // LOAD FROM LOCAL STORAGE
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    if (isLoading) return;

    try {
      if (messages.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (err) {
      console.error(err);
    }
  }, [messages, storageKey, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  // 🚀 STREAM MESSAGE (FETCH ONLY)
  const sendMessage = useCallback(
    async (userMessage) => {
      if (!userMessage.trim()) return;

      setError(null);
      setIsStreaming(true);

      const updatedMessages = [
        ...messages,
        { role: 'user', content: userMessage }
      ];

      setMessages(updatedMessages);

      try {
        const payload = {
          messages: updatedMessages,
          message: userMessage,
          algorithmName: title || 'Algorithm',
          description,
          testCases,
          startCode
        };

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/ai/chat-stream`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let aiResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;

            try {
              const data = JSON.parse(line.slice(6));

              if (!data.text || data.text === "[DONE]") {
                setIsStreaming(false);
                continue;
              }

              aiResponse += data.text;

              setMessages((prev) => {
                const newMessages = [...prev];
                const last = newMessages[newMessages.length - 1];

                if (last?.role === "model") {
                  last.content = aiResponse;
                } else {
                  newMessages.push({
                    role: "model",
                    content: aiResponse
                  });
                }

                return newMessages;
              });

            } catch {
              // ignore partial chunks
            }
          }
        }

        setIsStreaming(false);

      } catch (err) {
        console.error(err);
        setError(err.message || "Streaming failed");
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