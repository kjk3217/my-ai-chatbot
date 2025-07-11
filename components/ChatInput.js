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
      // 메시지 전송 후 즉시 포커스 유지
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
    // 자동 높이 조절
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
  };

  return (
    <div className="relative">
      <div className="relative flex items-end border border-gray-200 rounded-xl bg-white focus-within:border-rose-300 focus-within:ring-1 focus-within:ring-rose-200 transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="업무 관련 질문을 입력하세요..."
          className="flex-1 p-3 pr-12 border-0 resize-none focus:outline-none focus:ring-0 rounded-xl max-h-32 min-h-[48px] placeholder-gray-400 text-gray-700 text-sm"
          disabled={disabled}
          rows={1}
          style={{
            height: 'auto',
            minHeight: '48px',
            maxHeight: '128px',
          }}
        />
        
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            className="w-8 h-8 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2 px-1">
        <div className="text-xs text-gray-500">
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
