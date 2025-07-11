import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { BookOpen, Sparkles, RotateCcw, Send, User, GraduationCap } from 'lucide-react';

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

    // 포커스 유지 - 메시지 전송 후
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
      // 포커스 유지 - AI 응답 완료 후
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

  const ChatMessage = ({ message, isUser }) => (
    <div className="flex gap-3 group mb-5">
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <User className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-1">
        <div className={`text-xs font-medium ${
          isUser ? 'text-indigo-600' : 'text-rose-600'
        }`}>
          {isUser ? '선생님' : 'JK'}
        </div>
        <div className="prose prose-sm max-w-none">
          <div className={`leading-relaxed whitespace-pre-wrap rounded-lg p-3 ${
            isUser 
              ? 'text-indigo-900 bg-indigo-50 border border-indigo-100' 
              : 'text-gray-800 bg-gray-50 border border-gray-100'
          }`}>
            {message}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col">
      {/* 헤더 */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                JK
              </h1>
              <p className="text-xs text-gray-500">중학교 업무 도우미</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
            >
              <RotateCcw className="w-3 h-3" />
              새 대화
            </button>
          )}
        </div>
      </header>

      {/* 채팅 영역 */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  안녕하세요, 선생님!
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  중학교 업무와 관련된 모든 것을 도와드립니다. 
                  수업 계획부터 학생 관리까지, 언제든 편하게 물어보세요.
                </p>
                
                <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                  {[
                    { text: "수업 계획 도움이 필요해요", icon: "📚" },
                    { text: "학생 상담 방법을 알려주세요", icon: "💬" },
                    { text: "학급 운영 팁이 궁금해요", icon: "🎯" },
                    { text: "평가 기준 설정을 도와주세요", icon: "📝" }
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion.text)}
                      className="group p-3 text-sm text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 text-left border border-gray-100 hover:border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{suggestion.icon}</span>
                        <span className="group-hover:text-gray-900 transition-colors">{suggestion.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message.text}
                  isUser={message.isUser}
                />
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="text-xs font-medium text-rose-600 mb-2">JK</div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 bg-white px-4 py-4">
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
