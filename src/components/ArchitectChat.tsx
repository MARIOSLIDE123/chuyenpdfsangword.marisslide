import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, X, Loader2, Copy, Check, ShieldCheck } from 'lucide-react';
import { ChatMessage, DocumentAnalysisReport } from '../types';
import { getActiveApiKey, getSelectedModel } from '../utils/apiKeyStorage';

interface ArchitectChatProps {
  isOpen: boolean;
  onClose: () => void;
  documentContext: DocumentAnalysisReport;
}

export const ArchitectChat: React.FC<ArchitectChatProps> = ({ isOpen, onClose, documentContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'architect',
      timestamp: 'Ngay bây giờ',
      content: `**Chào bạn! Tôi là Trợ Lý Kỹ Thuật AI Chuyên Về Định Dạng PDF & Giáo Dục.**

Tôi nắm vững cấu trúc tài liệu PDF, Microsoft Word (.docx) và Slide Bài Giảng (.pptx). Bạn có thể yêu cầu tôi:

• Tóm tắt nội dung bài học & phân tích ma trận đề thi
• Soạn 5-10 câu hỏi trắc nghiệm kèm giải thích
• Gợi ý phông chữ và định dạng bảng biểu 1:1`
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const quickPrompts = [
    '📝 Tóm tắt bài học & trọng tâm',
    '❓ Soạn 5 câu hỏi trắc nghiệm',
    '📊 Lập ma trận đề thi',
    '📽️ Hướng dẫn xuất PowerPoint slide',
    'Gợi ý phông chữ Word khớp 1:1'
  ];

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || inputMsg;
    if (!promptText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: promptText
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setIsLoading(true);

    try {
      const userApiKey = getActiveApiKey();
      const requestedModel = getSelectedModel();

      const res = await fetch('/api/gemini/architect-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: promptText,
          documentContext,
          conversationHistory: messages,
          userApiKey: userApiKey || undefined,
          requestedModel
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');

      const architectReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'architect',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: data.reply
      };

      setMessages((prev) => [...prev, architectReply]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'architect',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `⚠️ **Thông báo kết nối AI:** ${err.message || 'Không thể lấy phản hồi lúc này.'}`
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-900 animate-slide-left">
      {/* Header Drawer */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              Trợ Lý Kỹ Thuật Chuyển Đổi AI
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                1:1 Precision
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Hỗ trợ giải đáp & tối ưu file Word theo yêu cầu</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Prompts Nhanh */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto flex items-center gap-2 text-xs scrollbar-none">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 font-medium transition shrink-0 cursor-pointer text-xs sm:text-sm shadow-sm"
          >
            💡 {qp}
          </button>
        ))}
      </div>

      {/* Nội Dung Trò Chuyện */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-sm bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500 font-mono">
              {msg.sender === 'architect' ? (
                <>
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-purple-800">Trợ Lý AI</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-blue-800">Bạn</span>
                </>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            <div
              className={`p-4 rounded-2xl max-w-[92%] leading-relaxed border shadow-md text-sm sm:text-base ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 rounded-tr-none font-medium'
                  : 'bg-white text-slate-900 border-slate-200 rounded-tl-none space-y-2'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.content}
              </div>

              {msg.sender === 'architect' && (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-mono cursor-pointer"
                  >
                    {copiedId === msg.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId === msg.id ? 'Đã sao chép' : 'Sao chép văn bản'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-sm text-purple-800 font-mono bg-purple-50 p-4 rounded-2xl border border-purple-200">
            <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
            <span>Trợ Lý AI đang phân tích dữ liệu kĩ thuật...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Khung Nhập Khảo Hỏi */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Nhập câu hỏi hoặc yêu cầu tư vấn kỹ thuật..."
            className="flex-1 bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-50 transition shadow-lg cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
