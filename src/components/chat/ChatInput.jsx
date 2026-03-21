import { Send } from 'lucide-react';

export default function ChatInput({ onSubmit, value, onChange, disabled, placeholder = "Ask a question..." }) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-grow px-3 py-2 bg-background border border-border/50 rounded-lg text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 disabled:opacity-50 transition-all"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
      >
        <Send size={16} />
      </button>
    </form>
  );
}