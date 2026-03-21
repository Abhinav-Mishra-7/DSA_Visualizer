import { useEffect, useState } from 'react';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MessageBubble({ role, content, isStreaming }) {
  const [displayContent, setDisplayContent] = useState('');
  const isUser = role === 'user';

  // Streaming effect
  useEffect(() => {
    if (isStreaming && content) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < content.length) {
          setDisplayContent(content.substring(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 10);
      return () => clearInterval(timer);
    } else {
      setDisplayContent(content);
    }
  }, [content, isStreaming]);

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg  ${
          isUser
            ? 'bg-accent text-white rounded-br-none'
            : 'bg-background/80 border border-border/30 text-text-primary rounded-bl-none'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap break-words">{displayContent}</p>
        ) : (
          <div className="text-md prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                      className="rounded-lg my-2"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-background/60 px-1.5 py-0.5 rounded text-accent/80 font-mono text-xs" {...props}>
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
                  <p className="mb-2 text-sm leading-relaxed">{children}</p>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 text-xs space-y-1">{children}</ol>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 text-xs space-y-1">{children}</ul>
                ),
              }}
            >
              {displayContent}
            </ReactMarkdown>
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
  );
}