import { Send, Sparkles, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  error?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  inputRef,
  error,
}: ChatInputProps) {
  const [charCount, setCharCount] = useState(0);
  const MAX_LENGTH = 500;

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim() && charCount <= MAX_LENGTH) {
        onSend();
      }
    }
  };

  const isOverLimit = charCount > MAX_LENGTH;
  const isNearLimit = charCount > MAX_LENGTH * 0.8;

  return (
    <div className="glass border-t border-slate-200/50 dark:border-slate-700/50 backdrop-blur-2xl p-3 sm:p-6 flex-shrink-0">
      <div className="container mx-auto max-w-5xl">
        {/* Error message */}
        {error && (
          <div 
            className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex-1 relative group">
            <div className={`absolute inset-0 rounded-xl sm:rounded-2xl blur-xl opacity-0 transition-opacity duration-500 ${
              isOverLimit 
                ? "bg-red-500 group-hover:opacity-20" 
                : "bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:opacity-20"
            }`}></div>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about mobile phones..."
              disabled={disabled}
              maxLength={MAX_LENGTH + 50} // Soft limit with UI feedback
              aria-label="Chat message input"
              aria-describedby="chat-input-help chat-input-counter"
              aria-invalid={isOverLimit}
              className={`relative w-full px-3 sm:px-6 py-2.5 sm:py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-2 rounded-xl sm:rounded-2xl 
                       text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400
                       focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300
                       text-sm sm:text-[15px] font-normal leading-relaxed pr-10 sm:pr-12 ${
                         isOverLimit 
                           ? "border-red-400 dark:border-red-600 focus:ring-red-400/40 focus:border-red-400" 
                           : "border-slate-200 dark:border-slate-700 focus:ring-indigo-400/40 focus:border-indigo-400"
                       }`}
            />
            <Sparkles 
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" 
              size={16}
              aria-hidden="true"
            />
          </div>
          <button
            onClick={onSend}
            disabled={disabled || !value.trim() || isOverLimit}
            aria-label="Send message"
            title={isOverLimit ? "Message is too long" : "Send message (Enter)"}
            className="relative group px-4 sm:px-7 py-2.5 sm:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                     text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-[15px]
                     hover:scale-[1.02] hover:shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     transition-all duration-300 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                     flex items-center gap-1.5 sm:gap-2 overflow-hidden flex-shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
            <span className="relative z-10 hidden sm:inline">Send</span>
            <Send size={16} className="relative z-10" aria-hidden="true" />
          </button>
        </div>

        {/* Helper text and character counter */}
        <div className="flex items-center justify-between mt-2 sm:mt-4 px-2">
          <div id="chat-input-help" className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal">
            <span className="hidden sm:inline">💡 Try: &quot;Best camera phone under ₹30k?&quot; • &quot;Compare Pixel 8a vs OnePlus 12R&quot; • &quot;What is OIS?&quot;</span>
            <span className="sm:hidden">💡 Try: &quot;Best phone under ₹30k&quot; • &quot;Compare phones&quot;</span>
          </div>
          <div 
            id="chat-input-counter"
            className={`text-[10px] sm:text-xs font-medium transition-colors ${
              isOverLimit 
                ? "text-red-600 dark:text-red-400" 
                : isNearLimit 
                  ? "text-amber-600 dark:text-amber-400" 
                  : "text-slate-400 dark:text-slate-500"
            }`}
            aria-live="polite"
            aria-atomic="true"
          >
            {charCount}/{MAX_LENGTH}
          </div>
        </div>
      </div>
    </div>
  );
}


