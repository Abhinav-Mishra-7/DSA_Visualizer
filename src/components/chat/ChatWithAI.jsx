import { useState, useRef, useEffect } from 'react';
import { Send, Loader, AlertCircle, Brain , Bot , Plus, MessageCircle, X, ArrowLeft } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useStreamChat } from './useStreamChat';
import { useAutoSaveChat } from './useAutoSaveChat';

const API_BASE_URL = 'http://localhost:3000';

export default function ChatWithAI({
  algorithm,
  userEmail = null,
  userName = null,
  isPremium = false
}) {
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChatContent, setSelectedChatContent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [wasPageHidden, setWasPageHidden] = useState(false);
  const [isLoadedFromHistory, setIsLoadedFromHistory] = useState(false);

  if (!algorithm) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary">
        <div className="flex items-center gap-2">
          <AlertCircle size={20} />
          <span>Algorithm data not available</span>
        </div>
      </div>
    );
  }

  const {
    messages,
    setMessages,
    error,
    sendMessage,
    clearChat,
    isStreaming,
    isLoading: isLoadingHistoryLocal
  } = useStreamChat({
    title: algorithm?.name || 'Algorithm',
    description: algorithm?.description || '',
    testCases: algorithm?.testCases || [],
    startCode: algorithm?.startCode || ''
  });

  const algorithmSlug = algorithm?.slug || 'unknown';

  const { saveToMongo } = useAutoSaveChat({
    messages,
    algorithmSlug,
    algorithmName: algorithm?.name,
    userEmail,
    userName,
    isPremium
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChatContent]);

  // MAIN: Track when user LEAVES and RETURNS to Chat tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isPageHidden = document.hidden;

      if (isPageHidden && !wasPageHidden) {
        // User is LEAVING the Chat tab
        console.log('User LEAVING Chat tab - marking for save on return');
        setWasPageHidden(true);
      } else if (!isPageHidden && wasPageHidden) {
        // User is RETURNING to Chat tab
        console.log('User RETURNING to Chat tab - saving current and clearing');
        
        // Only save if messages are FRESH (not loaded from history)
        if (messages.length > 0 && !isLoadedFromHistory) {
          console.log('Saving current fresh chat before clearing...');
          saveCurrentChat();
        }

        // Always clear the current chat
        clearChat();
        setIsLoadedFromHistory(false);
        setSelectedChatId(null);
        setSelectedChatContent(null);

        // Refresh history
        setTimeout(() => {
          refreshHistory();
        }, 300);

        setWasPageHidden(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [messages, isLoadedFromHistory, wasPageHidden, clearChat]);

  // Save on page refresh/close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only save if messages are FRESH (not loaded from history)
      if (messages.length > 0 && !isLoadedFromHistory) {
        const sessionMessages = buildSessionMessages();
        if (sessionMessages.length > 0) {
          const payload = {
            name: userName || null,
            email: userEmail || null,
            isPremium: !!isPremium,
            algorithmSlug,
            algorithmName: algorithm?.name,
            messages: sessionMessages
          };
          
          navigator.sendBeacon(
            `${API_BASE_URL}/ai/save-session`,
            JSON.stringify(payload)
          );
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [messages, algorithmSlug, algorithm?.name, userEmail, userName, isPremium, isLoadedFromHistory]);

  // Load history on mount
  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      try {
        const url = userEmail
          ? `${API_BASE_URL}/ai/history?email=${encodeURIComponent(userEmail)}`
          : `${API_BASE_URL}/ai/history`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (!cancelled && data.success) {
          setHistory(data.chats || []);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    };

    fetchHistory();
    return () => {
      cancelled = true;
    };
  }, [userEmail]);

  const buildSessionMessages = () => {
    const result = [];
    messages.forEach((m, idx) => {
      if (m.role === 'user' && m.content) {
        const botMsg = messages
          .slice(idx + 1)
          .find((msg) => msg.role === 'model');

        if (botMsg && botMsg.content) {
          result.push({
            user: m.content,
            bot: botMsg.content
          });
        }
      }
    });
    return result;
  };

  const saveCurrentChat = async () => {
    if (messages.length === 0) return;

    const sessionMessages = buildSessionMessages();
    if (sessionMessages.length === 0) return;

    try {
      const payload = {
        name: userName || null,
        email: userEmail || null,
        isPremium: !!isPremium,
        algorithmSlug,
        algorithmName: algorithm?.name,
        messages: sessionMessages
      };

      console.log('Saving current chat to history...');
      const response = await fetch(`${API_BASE_URL}/ai/save-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        console.log('✅ Chat saved to history');
      }
    } catch (err) {
      console.error('Error saving chat:', err);
    }
  };

  const refreshHistory = async () => {
    try {
      const url = userEmail
        ? `${API_BASE_URL}/ai/history?email=${encodeURIComponent(userEmail)}`
        : `${API_BASE_URL}/ai/history`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setHistory(data.chats || []);
      }
    } catch (err) {
      console.error('Failed to refresh history:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      await sendMessage(input);
      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    // Only save if messages are FRESH (not from history)
    if (messages.length > 0 && !isLoadedFromHistory) {
      if (!window.confirm('Save current chat before starting new?')) {
        return;
      }
      await saveCurrentChat();
    }

    // Clear everything and mark as fresh
    clearChat();
    setIsLoadedFromHistory(false);
    setSelectedChatId(null);
    setSelectedChatContent(null);
    await refreshHistory();
  };

  const handleSelectChat = (chatId) => {
    const chatData = history.find(c => c._id === chatId);
    if (chatData) {
      setSelectedChatId(chatId);
      setSelectedChatContent(chatData);
    }
  };

  const handleContinueChat = () => {
    if (!selectedChatContent) return;

    if (selectedChatContent.algorithmSlug !== algorithmSlug) {
      alert('Switch to ' + selectedChatContent.algorithmName + ' to continue this chat');
      return;
    }

    const loadedMessages = [];
    selectedChatContent.messages.forEach((msg) => {
      loadedMessages.push({ role: 'user', content: msg.user });
      loadedMessages.push({ role: 'model', content: msg.bot });
    });
    
    // Load messages AND mark them as from history
    setMessages(loadedMessages);
    setIsLoadedFromHistory(false);

    setSelectedChatId(null);
    setSelectedChatContent(null);
  };

  const handleBackToCurrent = () => {
    setSelectedChatId(null);
    setSelectedChatContent(null);
  };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return 'Today';
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

    const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
    };

  const groupedHistory = history.reduce((acc, chat) => {
    const algorithmName = chat.algorithmName || 'Unknown';
    if (!acc[algorithmName]) {
      acc[algorithmName] = [];
    }
    acc[algorithmName].push(chat);
    return acc;
  }, {});

  const isViewingHistory = !!selectedChatContent;

  return (
    <div className="flex h-full bg-gradient-to-b from-card to-card/50 rounded-xl overflow-hidden scrollbar-hide">
      {/* SIDEBAR */}
      <div
        className={`flex-shrink-0 border-r border-border/50 bg-background/80 backdrop-blur-sm flex flex-col transition-all duration-300 scrollbar-hide ${
          sidebarOpen ? 'w-72' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex-shrink-0 border-b border-border/30 bg-gradient-to-r from-background/50 to-card/50 p-4.75 flex items-center justify-between scrollbar-hide">
          <div>
            <h3 className="font-bold text-text-primary text-sm">Chat History</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {historyLoading ? 'Loading...' : `${history.length} chats`}
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-text-secondary hover:text-text-primary transition-colors lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <button
          onClick={handleNewChat}
          className="m-3 flex items-center gap-2 px-4 py-2.5 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors border border-accent/30 hover:border-accent/50 font-medium text-sm"
        >
          <Plus size={16} />
          New Chat
        </button>

        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
          {historyLoading ? (
            <div className="flex items-center justify-center h-20 text-text-secondary">
              <Loader size={18} className="animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="p-4 text-center text-text-secondary text-xs">
              <Bot size={32} className="mx-auto mb-2 opacity-20" />
              <p>No chat history yet</p>
              <p className="mt-1 text-[11px]">Start chatting to begin</p>
            </div>
          ) : (
            <div className="p-2 space-y-4">
              {Object.entries(groupedHistory).map(([algorithmName, chats]) => (
                <div key={algorithmName}>
                  <div className="px-3 py-2 text-xs font-semibold text-text-secondary/70 uppercase tracking-wider">
                    {algorithmName}
                  </div>
                  
                  <div className="space-y-1">
                    {chats.map((chat) => (
                      <button
                        key={chat._id}
                        onClick={() => handleSelectChat(chat._id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                          selectedChatId === chat._id
                            ? 'bg-accent/20 border border-accent/50'
                            : 'hover:bg-background/80 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <MessageCircle size={14} className="text-accent mt-0.5 flex-shrink-0" />
                          <div className="flex-grow min-w-0">
                            <p className="text-xs font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                              {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
                            </p>
                            <p className="text-[10px] text-text-secondary/60 mt-1">
                              {formatDate(chat.createdAt)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="flex-shrink-0 border-b border-border/50 bg-gradient-to-r from-background/50 to-card/50 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-text-secondary hover:text-text-primary transition-colors lg:hidden"
              >
                <MessageCircle size={20} />
              </button>
            )}
            <div>
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <Bot size={18} className="text-accent" />
                {isViewingHistory ? 'Chat History' : 'Chat with AI Tutor'}
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                {isViewingHistory
                  ? `${selectedChatContent?.algorithmName} - ${selectedChatContent?.messages.length} messages`
                  : `Current session • ${algorithm?.name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isViewingHistory && selectedChatContent?.algorithmSlug === algorithmSlug && (
              <button
                onClick={handleContinueChat}
                className="text-xs px-3 py-1.5 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                Continue
              </button>
            )}
            {isViewingHistory && (
              <button
                onClick={handleBackToCurrent}
                className="text-xs px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            )}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto scrollbar-hide flex flex-col gap-3 p-4">
          {isViewingHistory ? (
            <>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-300 flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>
                  {selectedChatContent?.algorithmSlug === algorithmSlug
                    ? 'Click "Continue" to add messages.'
                    : 'Switch to ' + selectedChatContent?.algorithmName + ' to continue.'}
                </span>
              </div>
              {selectedChatContent?.messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${idx % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  {idx % 2 !== 0 && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
                      <Brain size={16} className="text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                      idx % 2 === 0
                        ? 'bg-accent text-white rounded-br-none'
                        : 'bg-background/80 border border-border/30 text-text-primary rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {idx % 2 === 0 ? msg.user : msg.bot}
                    </p>
                  </div>

                  {idx % 2 === 0 && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-white text-xs font-bold">U</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : isLoadingHistoryLocal ? (
            <div className="flex-grow flex items-center justify-center text-text-secondary">
              <div className="flex items-center gap-2">
                <Loader size={20} className="animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center text-text-secondary px-4">
              <Bot size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">Start your learning journey!</p>
              <p className="text-xs mt-1 opacity-70">
                Ask about {algorithm?.name}, get hints, discuss solutions
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={idx}
                  role={msg.role}
                  content={msg.content}
                  isStreaming={isStreaming && idx === messages.length - 1}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {error && !isViewingHistory && (
          <div className="flex-shrink-0 mx-4 mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-gap-2 gap-2">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {!isViewingHistory && (
          <form
            onSubmit={handleSend}
            className="flex-shrink-0 border-t border-border/50 bg-gradient-to-r from-background/50 to-card/50 p-3"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isStreaming || isLoading || isLoadingHistoryLocal}
                className="flex-grow px-3 py-2 bg-background border border-border/50 rounded-lg text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 disabled:opacity-50 transition-all"
              />
              <button
                type="submit"
                disabled={isStreaming || isLoading || !input.trim() || isLoadingHistoryLocal}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 flex-shrink-0"
              >
                {isStreaming || isLoading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}



// import { useState, useRef, useEffect } from 'react';
// import { Send, Loader, AlertCircle, Brain, Trash2, Plus, MessageCircle, X, ArrowLeft } from 'lucide-react';
// import MessageBubble from './MessageBubble';
// import { useStreamChat } from './useStreamChat';
// import { useAutoSaveChat } from './useAutoSaveChat';

// const API_BASE_URL = 'http://localhost:3000';

// export default function ChatWithAI({
//   algorithm,
//   userEmail = null,
//   userName = null,
//   isPremium = false
// }) {
//   const messagesEndRef = useRef(null);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [historyLoading, setHistoryLoading] = useState(true);
//   const [selectedChatId, setSelectedChatId] = useState(null);
//   const [selectedChatContent, setSelectedChatContent] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [wasPageHidden, setWasPageHidden] = useState(false);

//   if (!algorithm) {
//     return (
//       <div className="h-full flex items-center justify-center text-text-secondary">
//         <div className="flex items-center gap-2">
//           <AlertCircle size={20} />
//           <span>Algorithm data not available</span>
//         </div>
//       </div>
//     );
//   }

//   const {
//     messages,
//     error,
//     sendMessage,
//     clearChat,
//     isStreaming,
//     isLoading: isLoadingHistoryLocal,
//     setMessages
//   } = useStreamChat({
//     title: algorithm?.name || 'Algorithm',
//     description: algorithm?.description || '',
//     testCases: algorithm?.testCases || [],
//     startCode: algorithm?.startCode || ''
//   });

//   const algorithmSlug = algorithm?.slug || 'unknown';

//   const { saveToMongo } = useAutoSaveChat({
//     messages,
//     algorithmSlug,
//     algorithmName: algorithm?.name,
//     userEmail,
//     userName,
//     isPremium
//   });

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, selectedChatContent]);

//   // MAIN: Track when user LEAVES and RETURNS to Chat tab
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       const isPageHidden = document.hidden;

//       if (isPageHidden && !wasPageHidden) {
//         // User is LEAVING the Chat tab
//         console.log('User LEAVING Chat tab - marking for save on return');
//         setWasPageHidden(true);
//       } else if (!isPageHidden && wasPageHidden) {
//         // User is RETURNING to Chat tab
//         console.log('User RETURNING to Chat tab - saving current and clearing');
        
//         // Save whatever messages exist
//         if (messages.length > 0 && !selectedChatContent) {
//           console.log('Saving current chat before clearing...');
//           saveCurrentChat();
//         }

//         // Always clear the current chat
//         clearChat();
//         setSelectedChatId(null);
//         setSelectedChatContent(null);

//         // Refresh history
//         setTimeout(() => {
//           refreshHistory();
//         }, 300);

//         setWasPageHidden(false);
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
//   }, [messages, selectedChatContent, algorithmSlug, algorithm?.name, userEmail, userName, isPremium, wasPageHidden]);

//   // Save on page refresh/close
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       if (messages.length > 0 && !selectedChatContent) {
//         const sessionMessages = buildSessionMessages();
//         if (sessionMessages.length > 0) {
//           const payload = {
//             name: userName || null,
//             email: userEmail || null,
//             isPremium: !!isPremium,
//             algorithmSlug,
//             algorithmName: algorithm?.name,
//             messages: sessionMessages
//           };
          
//           navigator.sendBeacon(
//             `${API_BASE_URL}/ai/save-session`,
//             JSON.stringify(payload)
//           );
//         }
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//   }, [messages, algorithmSlug, algorithm?.name, userEmail, userName, isPremium, selectedChatContent]);

//   // Load history on mount
//   useEffect(() => {
//     let cancelled = false;

//     const fetchHistory = async () => {
//       try {
//         const url = userEmail
//           ? `${API_BASE_URL}/ai/history?email=${encodeURIComponent(userEmail)}`
//           : `${API_BASE_URL}/ai/history`;

//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);

//         const data = await response.json();
//         if (!cancelled && data.success) {
//           setHistory(data.chats || []);
//         }
//       } catch (err) {
//         console.error('Failed to load chat history:', err);
//       } finally {
//         if (!cancelled) setHistoryLoading(false);
//       }
//     };

//     fetchHistory();
//     return () => {
//       cancelled = true;
//     };
//   }, [userEmail]);

//   const buildSessionMessages = () => {
//     const result = [];
//     messages.forEach((m, idx) => {
//       if (m.role === 'user' && m.content) {
//         const botMsg = messages
//           .slice(idx + 1)
//           .find((msg) => msg.role === 'model');

//         if (botMsg && botMsg.content) {
//           result.push({
//             user: m.content,
//             bot: botMsg.content
//           });
//         }
//       }
//     });
//     return result;
//   };

//   const saveCurrentChat = async () => {
//     if (messages.length === 0) return;

//     const sessionMessages = buildSessionMessages();
//     if (sessionMessages.length === 0) return;

//     try {
//       const payload = {
//         name: userName || null,
//         email: userEmail || null,
//         isPremium: !!isPremium,
//         algorithmSlug,
//         algorithmName: algorithm?.name,
//         messages: sessionMessages
//       };

//       console.log('Saving current chat to history...');
//       const response = await fetch(`${API_BASE_URL}/ai/save-session`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();
//       if (data.success) {
//         console.log('✅ Chat saved to history');
//       }
//     } catch (err) {
//       console.error('Error saving chat:', err);
//     }
//   };

//   const refreshHistory = async () => {
//     try {
//       const url = userEmail
//         ? `${API_BASE_URL}/ai/history?email=${encodeURIComponent(userEmail)}`
//         : `${API_BASE_URL}/ai/history`;

//       const response = await fetch(url);
//       const data = await response.json();
//       if (data.success) {
//         setHistory(data.chats || []);
//       }
//     } catch (err) {
//       console.error('Failed to refresh history:', err);
//     }
//   };

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     setIsLoading(true);
//     try {
//       await sendMessage(input);
//       setInput('');
//     } catch (err) {
//       console.error('Error sending message:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleNewChat = async () => {
//     if (messages.length > 0 && !selectedChatContent) {
//       if (!window.confirm('Save current chat before starting new?')) {
//         return;
//       }
//       await saveCurrentChat();
//     }

//     clearChat();
//     setSelectedChatId(null);
//     setSelectedChatContent(null);
//     await refreshHistory();
//   };

//   const handleSelectChat = (chatId) => {
//     const chatData = history.find(c => c._id === chatId);
//     if (chatData) {
//       setSelectedChatId(chatId);
//       setSelectedChatContent(chatData);
//     }
//   };

//   const handleContinueChat = () => {
//     if (!selectedChatContent) return;

//     if (selectedChatContent.algorithmSlug !== algorithmSlug) {
//       alert('Switch to ' + selectedChatContent.algorithmName + ' to continue this chat');
//       return;
//     }

//     const loadedMessages = [];
//     selectedChatContent.messages.forEach((msg) => {
//       loadedMessages.push({ role: 'user', content: msg.user });
//       loadedMessages.push({ role: 'model', content: msg.bot });
//     });
//     setMessages(loadedMessages);

//     setSelectedChatId(null);
//     setSelectedChatContent(null);
//   };

//   const handleBackToCurrent = () => {
//     setSelectedChatId(null);
//     setSelectedChatContent(null);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return 'Today';
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

//   const groupedHistory = history.reduce((acc, chat) => {
//     const algorithmName = chat.algorithmName || 'Unknown';
//     if (!acc[algorithmName]) {
//       acc[algorithmName] = [];
//     }
//     acc[algorithmName].push(chat);
//     return acc;
//   }, {});

//   const isViewingHistory = !!selectedChatContent;

//   return (
//     <div className="flex h-full bg-gradient-to-b from-card to-card/50 rounded-xl overflow-hidden">
//       {/* SIDEBAR */}
//       <div
//         className={`flex-shrink-0 border-r border-border/50 bg-background/80 backdrop-blur-sm flex flex-col transition-all duration-300 ${
//           sidebarOpen ? 'w-72' : 'w-0'
//         } overflow-hidden`}
//       >
//         <div className="flex-shrink-0 border-b border-border/30 bg-gradient-to-r from-background/50 to-card/50 p-4 flex items-center justify-between">
//           <div>
//             <h3 className="font-bold text-text-primary text-sm">Chat History</h3>
//             <p className="text-xs text-text-secondary mt-0.5">
//               {historyLoading ? 'Loading...' : `${history.length} chats`}
//             </p>
//           </div>
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="text-text-secondary hover:text-text-primary transition-colors lg:hidden"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <button
//           onClick={handleNewChat}
//           className="m-3 flex items-center gap-2 px-4 py-2.5 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors border border-accent/30 hover:border-accent/50 font-medium text-sm"
//         >
//           <Plus size={16} />
//           New Chat
//         </button>

//         <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
//           {historyLoading ? (
//             <div className="flex items-center justify-center h-20 text-text-secondary">
//               <Loader size={18} className="animate-spin" />
//             </div>
//           ) : history.length === 0 ? (
//             <div className="p-4 text-center text-text-secondary text-xs">
//               <Brain size={32} className="mx-auto mb-2 opacity-20" />
//               <p>No chat history yet</p>
//               <p className="mt-1 text-[11px]">Start chatting to begin</p>
//             </div>
//           ) : (
//             <div className="p-2 space-y-4">
//               {Object.entries(groupedHistory).map(([algorithmName, chats]) => (
//                 <div key={algorithmName}>
//                   <div className="px-3 py-2 text-xs font-semibold text-text-secondary/70 uppercase tracking-wider">
//                     {algorithmName}
//                   </div>
                  
//                   <div className="space-y-1">
//                     {chats.map((chat) => (
//                       <button
//                         key={chat._id}
//                         onClick={() => handleSelectChat(chat._id)}
//                         className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group ${
//                           selectedChatId === chat._id
//                             ? 'bg-accent/20 border border-accent/50'
//                             : 'hover:bg-background/80 border border-transparent'
//                         }`}
//                       >
//                         <div className="flex items-start gap-2">
//                           <MessageCircle size={14} className="text-accent mt-0.5 flex-shrink-0" />
//                           <div className="flex-grow min-w-0">
//                             <p className="text-xs font-medium text-text-primary truncate group-hover:text-accent transition-colors">
//                               {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
//                             </p>
//                             <p className="text-[10px] text-text-secondary/60 mt-1">
//                               {formatDate(chat.createdAt)}
//                             </p>
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MAIN CHAT */}
//       <div className="flex-grow flex flex-col overflow-hidden">
//         <div className="flex-shrink-0 border-b border-border/50 bg-gradient-to-r from-background/50 to-card/50 px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             {!sidebarOpen && (
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="text-text-secondary hover:text-text-primary transition-colors lg:hidden"
//               >
//                 <MessageCircle size={20} />
//               </button>
//             )}
//             <div>
//               <h3 className="font-bold text-text-primary flex items-center gap-2">
//                 <Brain size={18} className="text-accent" />
//                 {isViewingHistory ? 'Chat History' : 'Chat with AI Tutor'}
//               </h3>
//               <p className="text-xs text-text-secondary mt-1">
//                 {isViewingHistory
//                   ? `${selectedChatContent?.algorithmName} - ${selectedChatContent?.messages.length} messages`
//                   : `Current session • ${algorithm?.name}`}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {isViewingHistory && selectedChatContent?.algorithmSlug === algorithmSlug && (
//               <button
//                 onClick={handleContinueChat}
//                 className="text-xs px-3 py-1.5 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-colors flex items-center gap-1.5"
//               >
//                 <ArrowLeft size={14} />
//                 Continue
//               </button>
//             )}
//             {isViewingHistory && (
//               <button
//                 onClick={handleBackToCurrent}
//                 className="text-xs px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-colors flex items-center gap-1.5"
//               >
//                 <ArrowLeft size={14} />
//                 Back
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="flex-grow overflow-y-auto scrollbar-hide flex flex-col gap-3 p-4">
//           {isViewingHistory ? (
//             <>
//               <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-300 flex items-start gap-2">
//                 <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
//                 <span>
//                   {selectedChatContent?.algorithmSlug === algorithmSlug
//                     ? 'Click "Continue" to add messages.'
//                     : 'Switch to ' + selectedChatContent?.algorithmName + ' to continue.'}
//                 </span>
//               </div>
//               {selectedChatContent?.messages.map((msg, idx) => (
//                 <div key={idx} className={`flex gap-3 ${idx % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
//                   {idx % 2 !== 0 && (
//                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
//                       <Brain size={16} className="text-white" />
//                     </div>
//                   )}

//                   <div
//                     className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
//                       idx % 2 === 0
//                         ? 'bg-accent text-white rounded-br-none'
//                         : 'bg-background/80 border border-border/30 text-text-primary rounded-bl-none'
//                     }`}
//                   >
//                     <p className="text-sm whitespace-pre-wrap break-words">
//                       {idx % 2 === 0 ? msg.user : msg.bot}
//                     </p>
//                   </div>

//                   {idx % 2 === 0 && (
//                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
//                       <span className="text-white text-xs font-bold">U</span>
//                     </div>
//                   )}
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </>
//           ) : isLoadingHistoryLocal ? (
//             <div className="flex-grow flex items-center justify-center text-text-secondary">
//               <div className="flex items-center gap-2">
//                 <Loader size={20} className="animate-spin" />
//                 <span className="text-sm">Loading...</span>
//               </div>
//             </div>
//           ) : messages.length === 0 ? (
//             <div className="flex-grow flex flex-col items-center justify-center text-center text-text-secondary px-4">
//               <Brain size={40} className="mb-3 opacity-30" />
//               <p className="text-sm font-medium">Start your learning journey!</p>
//               <p className="text-xs mt-1 opacity-70">
//                 Ask about {algorithm?.name}, get hints, discuss solutions
//               </p>
//             </div>
//           ) : (
//             <>
//               {messages.map((msg, idx) => (
//                 <MessageBubble
//                   key={idx}
//                   role={msg.role}
//                   content={msg.content}
//                   isStreaming={isStreaming && idx === messages.length - 1}
//                 />
//               ))}
//               <div ref={messagesEndRef} />
//             </>
//           )}
//         </div>

//         {error && !isViewingHistory && (
//           <div className="flex-shrink-0 mx-4 mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-gap-2 gap-2">
//             <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
//             <p className="text-xs text-red-300">{error}</p>
//           </div>
//         )}

//         {!isViewingHistory && (
//           <form
//             onSubmit={handleSend}
//             className="flex-shrink-0 border-t border-border/50 bg-gradient-to-r from-background/50 to-card/50 p-3"
//           >
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Ask a question..."
//                 disabled={isStreaming || isLoading || isLoadingHistoryLocal}
//                 className="flex-grow px-3 py-2 bg-background border border-border/50 rounded-lg text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 disabled:opacity-50 transition-all"
//               />
//               <button
//                 type="submit"
//                 disabled={isStreaming || isLoading || !input.trim() || isLoadingHistoryLocal}
//                 className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 flex-shrink-0"
//               >
//                 {isStreaming || isLoading ? (
//                   <Loader size={16} className="animate-spin" />
//                 ) : (
//                   <Send size={16} />
//                 )}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }







// import { useState, useRef, useEffect } from 'react';
// import { Send, Loader, AlertCircle, Brain, Trash2, Plus, MessageCircle, X } from 'lucide-react';
// import MessageBubble from './MessageBubble';
// import { useStreamChat } from './useStreamChat';
// import { useAutoSaveChat } from './useAutoSaveChat';

// const API_BASE_URL = 'http://localhost:3000';

// export default function ChatWithAI({
//   algorithm,
//   userEmail = null,
//   userName = null,
//   isPremium = false
// }) {
//   const messagesEndRef = useRef(null);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [historyLoading, setHistoryLoading] = useState(true);
//   const [selectedChatId, setSelectedChatId] = useState(null);
//   const [selectedChatContent, setSelectedChatContent] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   if (!algorithm) {
//     return (
//       <div className="h-full flex items-center justify-center text-text-secondary">
//         <div className="flex items-center gap-2">
//           <AlertCircle size={20} />
//           <span>Algorithm data not available</span>
//         </div>
//       </div>
//     );
//   }

//   const {
//     messages,
//     error,
//     sendMessage,
//     clearChat,
//     isStreaming,
//     isLoading: isLoadingHistoryLocal
//   } = useStreamChat({
//     title: algorithm?.name || 'Algorithm',
//     description: algorithm?.description || '',
//     testCases: algorithm?.testCases || [],
//     startCode: algorithm?.startCode || ''
//   });

//   const algorithmSlug = algorithm?.slug || 'unknown';

//   // Setup auto-save hook
//   const { saveToMongo } = useAutoSaveChat({
//     messages,
//     algorithmSlug,
//     algorithmName: algorithm?.name,
//     userEmail,
//     userName,
//     isPremium
//   });

//   // Auto-scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, selectedChatContent]);

//   // Fetch chat history when component mounts or email changes
//   useEffect(() => {
//     let cancelled = false;

//     const fetchHistory = async () => {
//       try {
//         const url = userEmail
//           ? `${API_BASE_URL}/api/chats/history?email=${encodeURIComponent(userEmail)}`
//           : `${API_BASE_URL}/api/chats/history`;

//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);

//         const data = await response.json();
//         if (!cancelled && data.success) {
//           setHistory(data.chats || []);
//         }
//       } catch (err) {
//         console.error('Failed to load chat history:', err);
//       } finally {
//         if (!cancelled) setHistoryLoading(false);
//       }
//     };

//     fetchHistory();

//     return () => {
//       cancelled = true;
//     };
//   }, [userEmail]);

//   const handleSend = async (e) => {
//     e.preventDefault();

//     if (!input.trim()) return;

//     setIsLoading(true);
//     try {
//       await sendMessage(input);
//       setInput('');
//     } catch (err) {
//       console.error('Error sending message:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEndSession = async () => {
//     if (!messages.length) return;

//     if (!window.confirm('Save and end this session?')) return;

//     // Build session messages and save
//     const sessionMessages = messages
//       .reduce((acc, m, idx) => {
//         if (m.role === 'user' && m.content) {
//           const botMsg = messages
//             .slice(idx + 1)
//             .find((msg) => msg.role === 'model');

//           if (botMsg && botMsg.content) {
//             acc.push({
//               user: m.content,
//               bot: botMsg.content
//             });
//           }
//         }
//         return acc;
//       }, []);

//     if (sessionMessages.length > 0) {
//       await saveToMongo(sessionMessages);
//       // Refresh history after saving
//       const url = userEmail
//         ? `${API_BASE_URL}/api/chats/history?email=${encodeURIComponent(userEmail)}`
//         : `${API_BASE_URL}/api/chats/history`;
//       try {
//         const response = await fetch(url);
//         const data = await response.json();
//         if (data.success) {
//           setHistory(data.chats || []);
//         }
//       } catch (err) {
//         console.error('Failed to refresh history:', err);
//       }
//     }

//     clearChat();
//     setSelectedChatId(null);
//     setSelectedChatContent(null);
//   };

//   const handleStartNewChat = () => {
//     setSelectedChatId(null);
//     setSelectedChatContent(null);
//     clearChat();
//   };

//   const handleSelectChat = async (chatId) => {
//     setSelectedChatId(chatId);
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`);
//       const data = await response.json();
//       if (data.success) {
//         setSelectedChatContent(data.chat);
//       }
//     } catch (err) {
//       console.error('Failed to load chat:', err);
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return 'Today';
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

//   // Display current chat or selected chat
//   const displayMessages = selectedChatContent
//     ? selectedChatContent.messages.map((msg, idx) => ({
//         role: idx % 2 === 0 ? 'user' : 'model',
//         content: idx % 2 === 0 ? msg.user : msg.bot
//       }))
//     : messages;

//   const isViewingPreviousChat = !!selectedChatContent;

//   return (
//     <div className="flex h-full bg-gradient-to-b from-card to-card/50 rounded-xl overflow-hidden">
//       {/* LEFT SIDEBAR - PREVIOUS CHATS */}
//       <div
//         className={`flex-shrink-0 border-r border-border/50 bg-background/80 backdrop-blur-sm flex flex-col transition-all duration-300 ${
//           sidebarOpen ? 'w-72' : 'w-0'
//         } overflow-hidden`}
//       >
//         {/* Sidebar Header */}
//         <div className="flex-shrink-0 border-b border-border/30 bg-gradient-to-r from-background/50 to-card/50 p-4 flex items-center justify-between">
//           <div>
//             <h3 className="font-bold text-text-primary text-sm">Chat History</h3>
//             <p className="text-xs text-text-secondary mt-0.5">
//               {historyLoading ? 'Loading...' : `${history.length} saved`}
//             </p>
//           </div>
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="text-text-secondary hover:text-text-primary transition-colors lg:hidden"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* New Chat Button */}
//         <button
//           onClick={handleStartNewChat}
//           className="m-3 flex items-center gap-2 px-4 py-2.5 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors border border-accent/30 hover:border-accent/50 font-medium text-sm"
//         >
//           <Plus size={16} />
//           New Chat
//         </button>

//         {/* Chat List */}
//         <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
//           {historyLoading ? (
//             <div className="flex items-center justify-center h-20 text-text-secondary">
//               <Loader size={18} className="animate-spin" />
//             </div>
//           ) : history.length === 0 ? (
//             <div className="p-4 text-center text-text-secondary text-xs">
//               <Brain size={32} className="mx-auto mb-2 opacity-20" />
//               <p>No chat history yet</p>
//               <p className="mt-1 text-[11px]">Start a new chat to begin</p>
//             </div>
//           ) : (
//             <div className="p-2 space-y-1">
//               {history.map((chat) => (
//                 <button
//                   key={chat._id}
//                   onClick={() => handleSelectChat(chat._id)}
//                   className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group ${
//                     selectedChatId === chat._id
//                       ? 'bg-accent/20 border border-accent/50'
//                       : 'hover:bg-background/80 border border-transparent'
//                   }`}
//                 >
//                   <div className="flex items-start gap-2">
//                     <MessageCircle size={14} className="text-accent mt-0.5 flex-shrink-0" />
//                     <div className="flex-grow min-w-0">
//                       <p className="text-xs font-medium text-text-primary truncate group-hover:text-accent transition-colors">
//                         {chat.algorithmName}
//                       </p>
//                       <p className="text-[11px] text-text-secondary mt-0.5 truncate">
//                         {chat.messages.length} messages
//                       </p>
//                       <p className="text-[10px] text-text-secondary/60 mt-1">
//                         {formatDate(chat.createdAt)}
//                       </p>
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MAIN CHAT AREA */}
//       <div className="flex-grow flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="flex-shrink-0 border-b border-border/50 bg-gradient-to-r from-background/50 to-card/50 px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             {!sidebarOpen && (
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="text-text-secondary hover:text-text-primary transition-colors lg:hidden"
//                 title="Show sidebar"
//               >
//                 <MessageCircle size={20} />
//               </button>
//             )}
//             <div>
//               <h3 className="font-bold text-text-primary flex items-center gap-2">
//                 <Brain size={18} className="text-accent" />
//                 {isViewingPreviousChat ? 'Chat History' : 'Chat with AI Tutor'}
//               </h3>
//               <p className="text-xs text-text-secondary mt-1">
//                 {isViewingPreviousChat
//                   ? `${selectedChatContent?.algorithmName} - ${selectedChatContent?.messages.length} messages`
//                   : `Ask questions about ${algorithm?.name}`}
//               </p>
//             </div>
//           </div>

//           {!isViewingPreviousChat && messages.length > 0 && (
//             <button
//               onClick={handleEndSession}
//               className="text-xs px-3 py-1.5 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors flex items-center gap-1.5"
//               title="Save and end this session"
//             >
//               <Trash2 size={14} />
//               End Session
//             </button>
//           )}
//         </div>

//         {/* Messages */}
//         <div className="flex-grow overflow-y-auto scrollbar-hide flex flex-col gap-3 p-4">
//           {isViewingPreviousChat ? (
//             // Read-only previous chat view
//             <>
//               <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-300 flex items-start gap-2">
//                 <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
//                 <span>Viewing saved chat history. Start a new chat to ask new questions.</span>
//               </div>
//               {selectedChatContent?.messages.map((msg, idx) => (
//                 <div key={idx} className={`flex gap-3 ${idx % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
//                   {idx % 2 !== 0 && (
//                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
//                       <Brain size={16} className="text-white" />
//                     </div>
//                   )}

//                   <div
//                     className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
//                       idx % 2 === 0
//                         ? 'bg-accent text-white rounded-br-none'
//                         : 'bg-background/80 border border-border/30 text-text-primary rounded-bl-none'
//                     }`}
//                   >
//                     <p className="text-sm whitespace-pre-wrap break-words">
//                       {idx % 2 === 0 ? msg.user : msg.bot}
//                     </p>
//                   </div>

//                   {idx % 2 === 0 && (
//                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
//                       <span className="text-white text-xs font-bold">U</span>
//                     </div>
//                   )}
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </>
//           ) : isLoadingHistoryLocal ? (
//             <div className="flex-grow flex items-center justify-center text-text-secondary">
//               <div className="flex items-center gap-2">
//                 <Loader size={20} className="animate-spin" />
//                 <span className="text-sm">Loading chat...</span>
//               </div>
//             </div>
//           ) : messages.length === 0 ? (
//             <div className="flex-grow flex flex-col items-center justify-center text-center text-text-secondary px-4">
//               <Brain size={40} className="mb-3 opacity-30" />
//               <p className="text-sm font-medium">Start your learning journey!</p>
//               <p className="text-xs mt-1 opacity-70">
//                 Ask about this algorithm, request hints, or discuss solutions
//               </p>
//             </div>
//           ) : (
//             <>
//               {displayMessages.map((msg, idx) => (
//                 <MessageBubble
//                   key={idx}
//                   role={msg.role}
//                   content={msg.content}
//                   isStreaming={isStreaming && idx === displayMessages.length - 1}
//                 />
//               ))}
//               <div ref={messagesEndRef} />
//             </>
//           )}
//         </div>

//         {/* Error Display */}
//         {error && !isViewingPreviousChat && (
//           <div className="flex-shrink-0 mx-4 mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-gap-2 gap-2">
//             <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
//             <p className="text-xs text-red-300">{error}</p>
//           </div>
//         )}

//         {/* Input Form - Only show when viewing current chat */}
//         {!isViewingPreviousChat && (
//           <form
//             onSubmit={handleSend}
//             className="flex-shrink-0 border-t border-border/50 bg-gradient-to-r from-background/50 to-card/50 p-3"
//           >
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Ask a question..."
//                 disabled={isStreaming || isLoading || isLoadingHistoryLocal}
//                 className="flex-grow px-3 py-2 bg-background border border-border/50 rounded-lg text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 disabled:opacity-50 transition-all"
//               />
//               <button
//                 type="submit"
//                 disabled={isStreaming || isLoading || !input.trim() || isLoadingHistoryLocal}
//                 className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 flex-shrink-0"
//               >
//                 {isStreaming || isLoading ? (
//                   <Loader size={16} className="animate-spin" />
//                 ) : (
//                   <Send size={16} />
//                 )}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }


// import { useState, useRef, useEffect } from 'react';
// import { Send, Loader, AlertCircle, Brain, Trash2, Clock } from 'lucide-react';
// import MessageBubble from './MessageBubble';
// import { useStreamChat } from './useStreamChat';
// import { useAutoSaveChat } from './useAutoSaveChat';

// const API_BASE_URL = 'http://localhost:3000';

// export default function ChatWithAI({
//   algorithm,
//   userEmail = null,
//   userName = null,
//   isPremium = false
// }) {
//   const messagesEndRef = useRef(null);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [historyLoading, setHistoryLoading] = useState(true);

//   if (!algorithm) {
//     return (
//       <div className="h-full flex items-center justify-center text-text-secondary">
//         <div className="flex items-center gap-2">
//           <AlertCircle size={20} />
//           <span>Algorithm data not available</span>
//         </div>
//       </div>
//     );
//   }

//   const {
//     messages,
//     error,
//     sendMessage,
//     clearChat,
//     isStreaming,
//     isLoading: isLoadingHistoryLocal
//   } = useStreamChat({
//     title: algorithm?.name || 'Algorithm',
//     description: algorithm?.description || '',
//     testCases: algorithm?.testCases || [],
//     startCode: algorithm?.startCode || ''
//   });

//   const algorithmSlug = algorithm?.slug || 'unknown';

//   // Setup auto-save hook
//   const { saveToMongo } = useAutoSaveChat({
//     messages,
//     algorithmSlug,
//     algorithmName: algorithm?.name,
//     userEmail,
//     userName,
//     isPremium
//   });

//   // Auto-scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Fetch chat history when component mounts or email changes
//   useEffect(() => {
//     let cancelled = false;

//     const fetchHistory = async () => {
//       try {
//         const url = userEmail
//           ? `${API_BASE_URL}/api/chats/history?email=${encodeURIComponent(userEmail)}`
//           : `${API_BASE_URL}/api/chats/history`;

//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);

//         const data = await response.json();
//         if (!cancelled && data.success) {
//           setHistory(data.chats || []);
//         }
//       } catch (err) {
//         console.error('Failed to load chat history:', err);
//       } finally {
//         if (!cancelled) setHistoryLoading(false);
//       }
//     };

//     fetchHistory();

//     return () => {
//       cancelled = true;
//     };
//   }, [userEmail]);

//   const handleSend = async (e) => {
//     e.preventDefault();

//     if (!input.trim()) return;

//     setIsLoading(true);
//     try {
//       await sendMessage(input);
//       setInput('');
//     } catch (err) {
//       console.error('Error sending message:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEndSession = async () => {
//     if (!messages.length) return;

//     if (!window.confirm('Save and end this session?')) return;

//     // Build session messages and save
//     const sessionMessages = messages
//       .reduce((acc, m, idx) => {
//         if (m.role === 'user' && m.content) {
//           const botMsg = messages
//             .slice(idx + 1)
//             .find((msg) => msg.role === 'model');

//           if (botMsg && botMsg.content) {
//             acc.push({
//               user: m.content,
//               bot: botMsg.content
//             });
//           }
//         }
//         return acc;
//       }, []);

//     if (sessionMessages.length > 0) {
//       await saveToMongo(sessionMessages);
//     }

//     clearChat();
//   };

//   return (
//     <div className="flex flex-col h-full bg-gradient-to-b from-card to-card/50 rounded-xl overflow-hidden">
//       {/* Header */}
//       <div className="flex-shrink-0 border-b border-border/50 bg-gradient-to-r from-background/50 to-card/50 px-4 py-4 flex items-center justify-between">
//         <div>
//           <h3 className="font-bold text-text-primary flex items-center gap-2">
//             <Brain size={18} className="text-accent" />
//             Chat with AI Tutor
//           </h3>
//           <p className="text-xs text-text-secondary mt-1">
//             Ask questions about {algorithm?.name}
//           </p>
//         </div>
//         {messages.length > 0 && (
//           <button
//             onClick={handleEndSession}
//             className="text-xs px-3 py-1.5 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors flex items-center gap-1.5"
//             title="Save and end this session"
//           >
//             <Trash2 size={14} />
//             End Session
//           </button>
//         )}
//       </div>

//       {/* Previous Sessions Summary */}
//       <div className="flex-shrink-0 border-b border-border/30 bg-background/60 px-4 py-3 text-xs text-text-secondary flex items-center gap-2">
//         <Clock size={12} className="text-accent" />
//         {historyLoading ? (
//           <span>Loading previous chats...</span>
//         ) : history.length === 0 ? (
//           <span>No previous chats yet. Start your first one!</span>
//         ) : (
//           <span>
//             {history.length} saved chat{history.length > 1 ? 's' : ''} available (last 15 days)
//           </span>
//         )}
//       </div>

//       {/* Messages Container */}
//       <div className="flex-grow overflow-y-auto scrollbar-hide flex flex-col gap-3 p-4">
//         {isLoadingHistoryLocal ? (
//           <div className="flex-grow flex items-center justify-center text-text-secondary">
//             <div className="flex items-center gap-2">
//               <Loader size={20} className="animate-spin" />
//               <span className="text-sm">Loading chat...</span>
//             </div>
//           </div>
//         ) : messages.length === 0 ? (
//           <div className="flex-grow flex flex-col items-center justify-center text-center text-text-secondary px-4">
//             <Brain size={40} className="mb-3 opacity-30" />
//             <p className="text-sm font-medium">Start your learning journey!</p>
//             <p className="text-xs mt-1 opacity-70">
//               Ask about this algorithm, request hints, or discuss solutions
//             </p>
//           </div>
//         ) : (
//           <>
//             {messages.map((msg, idx) => (
//               <MessageBubble
//                 key={idx}
//                 role={msg.role}
//                 content={msg.content}
//                 isStreaming={isStreaming && idx === messages.length - 1}
//               />
//             ))}
//             <div ref={messagesEndRef} />
//           </>
//         )}
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="flex-shrink-0 mx-4 mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-gap-2 gap-2">
//           <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
//           <p className="text-xs text-red-300">{error}</p>
//         </div>
//       )}

//       {/* Input Form */}
//       <form
//         onSubmit={handleSend}
//         className="flex-shrink-0 border-t border-border/50 bg-gradient-to-r from-background/50 to-card/50 p-3"
//       >
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask a question..."
//             disabled={isStreaming || isLoading || isLoadingHistoryLocal}
//             className="flex-grow px-3 py-2 bg-background border border-border/50 rounded-lg text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 disabled:opacity-50 transition-all"
//           />
//           <button
//             type="submit"
//             disabled={isStreaming || isLoading || !input.trim() || isLoadingHistoryLocal}
//             className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 flex-shrink-0"
//           >
//             {isStreaming || isLoading ? (
//               <Loader size={16} className="animate-spin" />
//             ) : (
//               <Send size={16} />
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// import { useState, useRef, useEffect } from 'react';
// import { Send, Loader, AlertCircle , Brain } from 'lucide-react';
// import MessageBubble from './MessageBubble';
// import ChatInput from './ChatInput';
// import { useStreamChat } from './useStreamChat';

// export default function ChatWithAI({ algorithm }) {
//   const messagesEndRef = useRef(null);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  
//   // Validate algorithm data
//   if (!algorithm) {
//     return (
//       <div className="h-full flex items-center justify-center text-text-secondary">
//         <div className="flex items-center gap-2">
//           <AlertCircle size={20} />
//           <span>Algorithm data not available</span>
//         </div>
//       </div>
//     );
//   }

//   const {
//     messages,
//     error,
//     sendMessage,
//     clearChat,
//     isStreaming
//   } = useStreamChat({
//     title: algorithm?.name || 'Algorithm',
//     description: algorithm?.description || '',
//     testCases: algorithm?.testCases || [],
//     startCode: algorithm?.startCode || ''
//   });

//   // Auto-scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
    
//     if (!input.trim()) return;
    
//     setIsLoading(true);
//     try {
//       await sendMessage(input);
//       setInput('');
//     } catch (err) {
//       console.error('Error sending message:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-gradient-to-b from-card to-card/50 rounded-xl overflow-hidden">
      
//       {/* Header */}
//       <div className="flex-shrink-0 border-b border-border/50 bg-gradient-to-r from-background/50 to-card/50 px-4 py-4 flex items-center justify-between">
//         <div>
//           <h3 className="font-bold text-text-primary flex items-center gap-2">
//             <Brain size={18} className="text-accent" />
//             Chat with AI Tutor
//           </h3>
//           <p className="text-xs text-text-secondary mt-1">
//             Ask questions about {algorithm?.name}
//           </p>
//         </div>
//         {messages.length > 0 && (
//           <button
//             onClick={clearChat}
//             className="text-xs px-3 py-1.5 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors"
//           >
//             Clear
//           </button>
//         )}
//       </div>

//       {/* Messages Container */}
//       <div className="flex-grow overflow-y-auto scrollbar-hide flex flex-col gap-3 p-4">
//         {messages.length === 0 ? (
//           <div className="flex-grow flex flex-col items-center justify-center text-center text-text-secondary px-4">
//             <Brain size={40} className="mb-3 opacity-30" />
//             <p className="text-sm font-medium">Start your learning journey!</p>
//             <p className="text-xs mt-1 opacity-70">Ask about this algorithm, request hints, or discuss solutions</p>
//           </div>
//         ) : (
//           <>
//             {messages.map((msg, idx) => (
//               <MessageBubble
//                 key={idx}
//                 role={msg.role}
//                 content={msg.content}
//                 isStreaming={isStreaming && idx === messages.length - 1}
//               />
//             ))}
//             <div ref={messagesEndRef} />
//           </>
//         )}
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="flex-shrink-0 mx-4 mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-gap-2 gap-2">
//           <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
//           <p className="text-xs text-red-300">{error}</p>
//         </div>
//       )}

//       {/* Input Form */}
//       <form
//         onSubmit={handleSend}
//         className="flex-shrink-0 border-t border-border/50 bg-gradient-to-r from-background/50 to-card/50 p-3"
//       >
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask a question..."
//             disabled={isStreaming || isLoading}
//             className="flex-grow px-3 py-2 bg-background border border-border/50 rounded-lg text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 disabled:opacity-50 transition-all"
//           />
//           <button
//             type="submit"
//             disabled={isStreaming || isLoading || !input.trim()}
//             className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 flex-shrink-0"
//           >
//             {isStreaming || isLoading ? (
//               <Loader size={16} className="animate-spin" />
//             ) : (
//               <Send size={16} />
//             )}
//           </button>
//         </div>
//       </form>

//     </div>
//   );
// }