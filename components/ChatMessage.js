import { User, Feather, Heart, Leaf } from 'lucide-react';

export default function ChatMessage({ message, isUser }) {
  return (
    <div className="flex gap-4 group mb-6">
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg">
            <Leaf className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-1">
        <div className={`text-sm font-semibold ${
          isUser ? 'text-purple-600' : 'text-green-600'
        }`}>
          {isUser ? '나' : '초록시인'}
        </div>
        <div className="prose prose-sm max-w-none">
          <div className={`leading-relaxed whitespace-pre-wrap rounded-2xl p-4 ${
            isUser 
              ? 'text-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 shadow-sm' 
              : 'text-gray-800 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 shadow-sm'
          }`}>
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}