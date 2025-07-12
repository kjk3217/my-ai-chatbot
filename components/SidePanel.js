import { useState, useRef } from 'react';
import { FileText, X, Save, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SidePanel({ isOpen, onToggle, referenceText, onReferenceTextChange }) {
  const [savedTexts, setSavedTexts] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const textareaRef = useRef(null);

  const handleSave = () => {
    if (referenceText.trim()) {
      const newSaved = {
        id: Date.now(),
        title: `자료 ${savedTexts.length + 1}`,
        content: referenceText,
        date: new Date().toLocaleDateString()
      };
      setSavedTexts(prev => [newSaved, ...prev]);
      alert('참고자료가 저장되었습니다!');
    }
  };

  const handleLoad = (content) => {
    onReferenceTextChange(content);
  };

  const handleDelete = (id) => {
    setSavedTexts(prev => prev.filter(item => item.id !== id));
  };

  const handleClear = () => {
    if (confirm('참고자료를 모두 지우시겠습니까?')) {
      onReferenceTextChange('');
    }
  };

  return (
    <>
      {/* 토글 버튼 */}
      <button
        onClick={onToggle}
        className={`fixed top-20 z-20 p-2 bg-rose-500 text-white rounded-r-lg shadow-lg transition-all duration-300 ${
          isOpen ? 'left-80' : 'left-0'
        }`}
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* 사이드 패널 */}
      <div className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-10 ${
        isOpen ? 'w-80' : 'w-0 overflow-hidden'
      }`}>
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                참고자료
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={handleSave}
                  disabled={!referenceText.trim()}
                  className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                  title="저장"
                >
                  <Save className="w-3 h-3" />
                </button>
                <button
                  onClick={handleClear}
                  disabled={!referenceText.trim()}
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                  title="지우기"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 탭 */}
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab(0)}
                className={`px-3 py-1 text-xs rounded ${
                  activeTab === 0 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                작성
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`px-3 py-1 text-xs rounded ${
                  activeTab === 1 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                저장된 자료 ({savedTexts.length})
              </button>
            </div>
          </div>

          {/* 컨텐츠 영역 */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 0 ? (
              // 작성 탭
              <div className="h-full flex flex-col">
                <textarea
                  ref={textareaRef}
                  value={referenceText}
                  onChange={(e) => onReferenceTextChange(e.target.value)}
                  placeholder="참고할 자료를 입력하거나 붙여넣으세요...&#10;&#10;예시:&#10;- PDF 내용 복사 붙여넣기&#10;- 교육과정 문서&#10;- 학급 현황 정보&#10;- 수업 계획안 등"
                  className="flex-1 p-4 border-0 resize-none focus:outline-none text-sm leading-relaxed"
                />
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>💡 AI가 이 내용을 참고해서 답변합니다</span>
                    <span>{referenceText.length}/10000</span>
                  </div>
                </div>
              </div>
            ) : (
              // 저장된 자료 탭
              <div className="h-full overflow-y-auto">
                {savedTexts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    저장된 자료가 없습니다
                  </div>
                ) : (
                  <div className="p-2">
                    {savedTexts.map((item) => (
                      <div key={item.id} className="mb-2 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-medium text-gray-800">{item.title}</h4>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-3">
                          {item.content.substring(0, 100)}...
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">{item.date}</span>
                          <button
                            onClick={() => handleLoad(item.content)}
                            className="px-2 py-1 text-xs bg-rose-500 text-white rounded hover:bg-rose-600"
                          >
                            불러오기
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
