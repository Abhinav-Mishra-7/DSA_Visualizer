import { useEffect, useRef } from 'react';

const API_BASE_URL = 'http://localhost:3000';

export function useAutoSaveChat({
  messages,
  algorithmSlug,
  algorithmName,
  userEmail = null,
  userName = null,
  isPremium = false
}) {
  const hasBeenSaved = useRef(false);

  // Convert messages format from streaming format to storage format
  const buildSessionMessages = () => {
    const result = [];

    messages.forEach((m) => {
      // Skip incomplete pairs
      if (m.role === 'user' && m.content) {
        // Find the corresponding bot response
        const currentIndex = messages.indexOf(m);
        const botMessage = messages
          .slice(currentIndex + 1)
          .find((msg) => msg.role === 'model');

        if (botMessage && botMessage.content) {
          result.push({
            user: m.content,
            bot: botMessage.content
          });
        }
      }
    });

    return result;
  };

  // Function to save chat to backend
  const saveToMongo = async (messagesToSave) => {
    if (!messagesToSave || messagesToSave.length === 0) {
      console.log('No messages to save');
      return;
    }

    try {
      const payload = {
        name: userName || null,
        email: userEmail || null,
        isPremium: !!isPremium,
        algorithmSlug,
        algorithmName,
        messages: messagesToSave
      };

      console.log('Saving chat to MongoDB:', payload);

      const response = await fetch(`${API_BASE_URL}/api/chats/save-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        console.log('Chat saved successfully:', data.chatId);
        hasBeenSaved.current = true;
        return data.chatId;
      } else {
        console.error('Failed to save chat:', data.error);
      }
    } catch (err) {
      console.error('Error saving chat to MongoDB:', err);
    }
  };

  // Save when algorithm slug changes (user switched to different algorithm)
  useEffect(() => {
    return () => {
      // Cleanup: save before unmounting
      if (messages.length > 0 && !hasBeenSaved.current) {
        const sessionMessages = buildSessionMessages();
        saveToMongo(sessionMessages);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithmSlug]);

  // Save on page refresh/close (beforeunload event)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (messages.length > 0 && !hasBeenSaved.current) {
        const sessionMessages = buildSessionMessages();
        // Use sendBeacon for better reliability on page unload
        const payload = {
          name: userName || null,
          email: userEmail || null,
          isPremium: !!isPremium,
          algorithmSlug,
          algorithmName,
          messages: sessionMessages
        };

        navigator.sendBeacon(
          `${API_BASE_URL}/api/chats/save-session`,
          JSON.stringify(payload)
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [messages, algorithmSlug, algorithmName, userEmail, userName, isPremium]);

  return { saveToMongo };
}