import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Send } from 'lucide-react';

const ChatInput = forwardRef(({ onSend, disabled }, ref) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }));

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
  };

  return (
    <div className="relative">
      <div className="relative flex items-end border-2 border-green-200 rounded-2xl bg-white focus-within:border-green-400 focus-within:shadow-lg transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="궁금한 것을 물어보세요... 🌱"
          className="flex-1 p-4 pr-14 border-0 resize-none focus:outline-none focus:ring-0 rounded-2xl max-h-32 min-h-[56px] placeholder-gray-400 text-gray-700"
          disabled={disabled}
          rows={1}
          style={{
            height: 'auto',
            minHeight: '56px',
            maxHeight: '128px',
          }}
        />
        
        <div className="absolute right-3 bottom-3 flex items-center gap-1">
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 px-2 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <span>✨</span>
          Shift + Enter로 줄바꿈
        </div>
        <div className="text-xs text-gray-400">
          {message.length}/2000
        </div>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;