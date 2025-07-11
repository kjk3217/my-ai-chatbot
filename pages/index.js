import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { Feather, Sparkles, RotateCcw, Heart, Leaf } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end",
      inline: "nearest" 
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    const userMessage = { text: message, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const botMessage = { text: data.reply, isUser: false };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.message || '오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: '죄송해요. 잠시 문제가 발생했어요. 다시 시도해주세요.', 
        isUser: false 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col">
      {/* 헤더 */}
      <header className="border-b border-green-100 bg-white/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Feather className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                🤖 나의 AI 도우미
              </h1>
              <p className="text-sm text-emerald-600 font-medium">무엇이든 물어보세요</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 border border-green-200"
            >
              <RotateCcw className="w-4 h-4" />
              새 대화
            </button>
          )}
        </div>
      </header>

      {/* 채팅 영역 */}
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm">✨</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                  안녕하세요! 무엇을 도와드릴까요?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                  궁금한 것이 있으면 언제든 물어보세요. 
                  <br />최선을 다해 도움을 드리겠습니다! 😊
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { text: "안녕하세요!", icon: "👋" },
                    { text: "오늘 날씨는 어때요?", icon: "🌤️" },
                    { text: "추천해주고 싶은 것이 있나요?", icon: "💡" },
                    { text: "재미있는 이야기 해주세요", icon: "📚" }
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion.text)}
                      className="group p-4 text-sm text-gray-700 bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-300 text-left border border-gray-100 hover:border-green-200 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{suggestion.icon}</span>
                        <span className="group-hover:text-green-700 transition-colors">{suggestion.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message.text}
                  isUser={message.isUser}
                />
              ))}
              
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex gap-1 mb-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="border-t border-green-100 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50/80 backdrop-blur-sm px-4 py-4">
          <ChatInput 
            ref={inputRef}
            onSend={handleSendMessage} 
            disabled={isLoading} 
          />
        </div>
      </main>
    </div>
  );
}