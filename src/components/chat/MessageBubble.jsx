import { useEffect, useState } from 'react';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MessageBubble({ role, content, isStreaming }) {
  const [displayContent, setDisplayContent] = useState('');
  const isUser = role === 'user';

  // Smooth incremental reveal while streaming (without restarting from 0 on each chunk)
  useEffect(() => {
    if (!content) {
      setDisplayContent('');
      return;
    }

    if (!isStreaming) {
      setDisplayContent(content);
      return;
    }

    setDisplayContent((prev) =>
      prev.length > content.length ? content : prev
    );

    const timer = window.setInterval(() => {
      let shouldStop = false;

      setDisplayContent((prev) => {
        if (prev.length >= content.length) {
          shouldStop = true;
          return prev;
        }
        const nextLen = Math.min(prev.length + 2, content.length);
        return content.slice(0, nextLen);
      });

      if (shouldStop) window.clearInterval(timer);
    }, 16);

    return () => window.clearInterval(timer);
  }, [content, isStreaming]);

  return (
    <div className="w-full flex justify-center">
      <div className={`w-full max-w-4xl flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[85%] px-4 py-3 rounded-xl ${
          isUser
            ? 'bg-accent text-white rounded-br-md'
            : 'bg-background/80 border border-border/30 text-text-primary rounded-bl-md'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap break-words">{displayContent}</p>
        ) : (
          <div className="text-md prose prose-invert prose-sm max-w-none leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    // <SyntaxHighlighter
                    //   style={atomDark}
                    //   language={match[1]}
                    //   PreTag="div"
                    //   {...props}
                    //   className="rounded-lg my-2"
                    // >
                    //   {String(children).replace(/\n$/, '')}
                    // </SyntaxHighlighter>
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      wrapLongLines={true} // ✅ NO horizontal scroll
                      customStyle={{
                        fontSize: '18px', // ✅ smaller font
                        fontFamily: "'JetBrains Mono', monospace",
                        lineHeight: '1.2',
                        padding: '12px',
                        borderRadius: '10px',
                        overflowX: 'hidden', // ✅ remove scrollbar
                        whiteSpace: 'pre-wrap', // ✅ wrap lines
                        wordBreak: 'break-word'
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '12px'
                        }
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-background/60 px-1.5 py-0.5 rounded text-accent/80 text-[11px]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {children}
                    </code>
                  );
                },
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold text-accent mt-3 mb-2 first:mt-0">{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-xs font-semibold text-text-secondary mt-2 mb-1">{children}</h4>
                ),
                p: ({ children }) => (
                  <p className="mb-2 text-sm leading-6">{children}</p>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 text-xs space-y-1 leading-5">{children}</ol>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 text-xs space-y-1 leading-5">{children}</ul>
                ),
              }}
            >
              {displayContent}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-1 rounded-sm bg-accent/70 animate-pulse align-middle" />
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
    </div>
  );
}