import { Copy, Check, Download, Code2, Eye, EyeOff, Share2 } from 'lucide-react';
import { useState } from 'react';
import { codeSnippets } from './algorithms/index';

const CodeSnippets = ({ algorithm }) => {
  const [activeLanguage, setActiveLanguage] = useState('cpp');
  const [copyStatus, setCopyStatus] = useState({});
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [hoveredLine, setHoveredLine] = useState(null);

  const languages = [
    { id: 'c', label: 'C', color: 'from-blue-600 to-blue-400', extension: '.c' },
    { id: 'cpp', label: 'C++', color: 'from-blue-600 to-blue-400', extension: '.cpp' },
    { id: 'java', label: 'Java', color: 'from-blue-600 to-blue-400', extension: '.java' },
    { id: 'python', label: 'Python', color: 'from-blue-600 to-blue-400', extension: '.py' }
  ];

  const handleCopyCode = () => {
    const code = codeSnippets[algorithm?.slug]?.[activeLanguage];
    if (!code) return;
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopyStatus(prev => ({ ...prev, [activeLanguage]: true }));
        setTimeout(() => {
          setCopyStatus(prev => ({ ...prev, [activeLanguage]: false }));
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy code: ', err);
      });
  };

  const handleDownloadCode = () => {
    const code = codeSnippets[algorithm?.slug]?.[activeLanguage];
    if (!code) return;
    const ext = languages.find(l => l.id === activeLanguage)?.extension || '';
    const fileName = `${algorithm?.slug || 'snippet'}_${activeLanguage}${ext}`;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(code)}`
    );
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFilteredCode = code => {
    if (!code) return '';
    if (!showComments) {
      let filtered = code;

      // 1. Remove multi-line comments (/* ... */) for C, C++, Java
      if (['c', 'cpp', 'java'].includes(activeLanguage)) {
        filtered = filtered.replace(/\/\*[\s\S]*?\*\//g, '');
      }

      // 2. Remove single-line comments (// ...) for C, C++, Java
      if (['c', 'cpp', 'java'].includes(activeLanguage)) {
        filtered = filtered.replace(/\/\/.*$/gm, '');
      }

      // 3. Remove Python comments (# ...) BUT NOT in C/C++
      if (activeLanguage === 'python') {
        filtered = filtered.replace(/#.*$/gm, '');
      }

      // 4. Remove extra blank lines created by removal
      filtered = filtered.replace(/^\s*\n/gm, '');
      
      return filtered.trim();
    }
    return code;
  };


  const handleShareCode = async () => {
    const shareData = {
      title: `${algorithm?.name || 'Algorithm'} - ${activeLanguage.toUpperCase()}`,
      text: `Check out this ${algorithm?.name || 'algorithm'} implementation in ${activeLanguage}!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyCode();
    }
  };

  const hasCodeSnippets = codeSnippets[algorithm?.slug];

  if (!hasCodeSnippets) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full mb-6 animate-pulse">
            <Code2 size={56} className="text-accent" />
          </div>
          <p className="text-text-secondary text-xl mb-3 font-semibold">
            No code snippets available
          </p>
          <p className="text-text-secondary/70 text-sm">
            Code examples for this algorithm will be added soon.
          </p>
        </div>
      </div>
    );
  }

  const currentCode = codeSnippets[algorithm?.slug][activeLanguage];
  const filteredCode = getFilteredCode(currentCode);
  const codeLines = filteredCode.split('\n');
  const currentLangDetail = languages.find(l => l.id === activeLanguage);

  return (
    <div className="flex-grow flex flex-col h-full bg-gradient-to-br from-background via-background to-card/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 animate-pulse pointer-events-none opacity-30" />

      <div className="relative z-10 flex flex-col h-full ">
        {/* HEADER */}
        <div className="p-6 border-b border-border/50 bg-gradient-to-r from-background/80 to-card/40 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-accent/40 to-accent/5 rounded-xl">
              <Code2 size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-text-secondary/70 uppercase tracking-widest font-bold mb-1">
                Code Implementation
              </p>
              <p className="text-lg md:text-xl font-bold from-text-primary to-accent">
                {algorithm?.name}
              </p>
            </div>
          </div>

          {/* LANGUAGE TABS */}
          <div className="flex gap-2 flex-wrap">
            {languages.map(lang => (
              <button
                key={lang.id}
                onClick={() => setActiveLanguage(lang.id)}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                  activeLanguage === lang.id
                    ? `bg-gradient-to-r ${lang.color} text-white shadow-lg shadow-accent/30 scale-105 transform`
                    : 'bg-card text-text-primary/80 border border-border/40 hover:border-accent/50 hover:bg-card/80 hover:text-accent'
                }`}
              >
                <span
                  className={`absolute inset-0 bg-gradient-to-r ${lang.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <span className="relative flex items-center gap-1.5">
                  <span className="text-lg">{lang.icon}</span>
                  {lang.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex items-center justify-between p-4 bg-card/30 border-b border-border/30 flex-wrap gap-3">
          <div className="flex items-center gap-3 text-xs text-text-secondary/90 flex-wrap">
            <div className="px-3 py-1 bg-background/60 rounded border border-border/30 hover:border-accent/50 transition-colors">
              {activeLanguage.toUpperCase()}
            </div>
            <span>•</span>
            <div className="px-3 py-1 bg-background/60 rounded border border-border/30">
              {codeLines.length} lines
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Comments toggle */}
            <button
              onClick={() => setShowComments(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                showComments
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-background border border-border/30 text-text-secondary/70 hover:border-border/60'
              }`}
            >
              {showComments ? <Eye size={12} /> : <EyeOff size={12} />}
              <span className="hidden sm:inline">
                {showComments ? 'Comments' : 'No Comments'}
              </span>
            </button>

            {/* Line numbers toggle */}
            <button
              onClick={() => setShowLineNumbers(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                showLineNumbers
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-background border border-border/30 text-text-secondary/70 hover:border-border/60'
              }`}
            >
              {showLineNumbers ? '№ On' : '№ Off'}
            </button>

            {/* Share */}
            <button
              onClick={handleShareCode}
              className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border/50 rounded-lg text-text-primary/80 hover:text-accent hover:border-accent/50 cursor-pointer transition-all duration-200 text-xs font-medium group"
            >
              <Share2 size={14} className="group-hover:animate-bounce" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Download */}
            <button
              onClick={handleDownloadCode}
              className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border/50 rounded-lg text-text-primary/80 hover:text-accent hover:border-accent/50 cursor-pointer transition-all duration-200 text-xs font-medium group"
            >
              <Download size={14} className="group-hover:animate-bounce" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Copy */}
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-accent/80 to-accent rounded-lg text-white hover:from-accent hover:to-accent cursor-pointer transition-all duration-200 text-xs font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105 transform"
            >
              {copyStatus[activeLanguage] ? (
                <>
                  <Check size={14} className="animate-pulse" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CODE DISPLAY */}
        <div className="flex-grow overflow-y-auto scrollbar-hide relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <pre
            style={{ fontFamily: 'var(--font-sans)' }}
            className="p-6 text-text-primary/85 text-sm leading-relaxed whitespace-pre-wrap break-words font-medium relative z-10"
          >
            {showLineNumbers ? (
              <div className="flex gap-4">
                <div className="text-text-secondary/40 select-none font-mono text-xs leading-relaxed min-w-fit">
                  {codeLines.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-6 flex items-center transition-colors duration-200 cursor-pointer ${
                        hoveredLine === idx ? 'text-accent/60' : ''
                      }`}
                      onMouseEnter={() => setHoveredLine(idx)}
                      onMouseLeave={() => setHoveredLine(null)}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  ))}
                </div>

                <div className="w-px bg-gradient-to-b from-border/50 via-border/30 to-transparent" />

                <code
                  style={{ fontFamily: 'var(--font-sans)' }}
                  className="font-medium flex-1 text-text-primary/85"
                >
                  {filteredCode}
                </code>
              </div>
            ) : (
              <code
                style={{ fontFamily: 'var(--font-sans)' }}
                className="font-medium text-text-primary/85"
              >
                {filteredCode}
              </code>
            )}
          </pre>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-card/50 border-t border-border/30 flex items-center justify-between text-xs text-text-secondary/70 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentLangDetail.color} animate-pulse`}
            />
            <span>💡 Syntax highlighting enabled • Click & interact</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary/50">✨ Ready to use</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippets;