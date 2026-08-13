import React from 'react';
import { FileText, Download, ShieldCheck, Upload, Bot, Sparkles, CheckCircle2, Settings, ExternalLink } from 'lucide-react';
import { DocumentAnalysisReport } from '../types';

interface HeaderProps {
  currentDoc: DocumentAnalysisReport;
  onSelectSample: (docName: string) => void;
  onOpenUpload: () => void;
  onDownloadDocx: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  sampleDocsList: DocumentAnalysisReport[];
  isAnalyzing: boolean;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentDoc,
  onSelectSample,
  onOpenUpload,
  onDownloadDocx,
  onToggleChat,
  isChatOpen,
  sampleDocsList,
  isAnalyzing,
  onOpenSettings,
  hasApiKey
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-md">
      <div className="w-full px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo & Tên Ứng Dụng */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-extrabold text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 tracking-tight flex items-center gap-2">
                Chuyển PDF Sang Word Chuẩn 1:1
              </h1>
              <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Giữ Nguyên Khung & Font
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 hidden sm:block mt-0.5 font-medium">
              Hệ thống nhận diện thông minh • Tái tạo bảng biểu & định dạng Word tự nhiên
            </p>
          </div>
        </div>

        {/* Bảng Điều Khiển & Nút Thao Tác Chính */}
        <div className="flex items-center gap-3">
          {/* Nút Settings API Key với Dòng Chữ Màu Đỏ theo AI_INSTRUCTIONS.md */}
          <div className="flex flex-col items-end">
            <button
              onClick={onOpenSettings}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
                hasApiKey
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 hover:border-blue-500 shadow-sm'
                  : 'bg-rose-100 text-rose-700 border-rose-400 hover:bg-rose-200 shadow-md animate-bounce'
              }`}
            >
              <Settings className="w-4 h-4 text-amber-600" />
              <span>Settings (API Key)</span>
            </button>

            {/* Dòng chữ màu đỏ lấy API key bắt buộc theo AI_INSTRUCTIONS.md */}
            <a
              href="https://aistudio.google.com/api-keys"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-extrabold text-rose-600 hover:text-rose-700 underline flex items-center gap-0.5 mt-0.5"
            >
              <span>Lấy API key để sử dụng app</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Chọn File Mẫu Tiếng Việt (chỉ hiển thị nếu có file mẫu) */}
          {sampleDocsList && sampleDocsList.length > 0 && (
            <div className="relative hidden xl:block">
              <select
                value={currentDoc.documentName}
                onChange={(e) => onSelectSample(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-sm font-semibold rounded-xl px-4 py-2.5 pr-8 border border-slate-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition shadow-sm"
              >
                <option disabled>-- Chọn File Mẫu --</option>
                {sampleDocsList.map((doc) => (
                  <option key={doc.documentName} value={doc.documentName}>
                    📄 {doc.documentName} ({doc.pageCount} Trang)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Nút Tải PDF / Ảnh */}
          <button
            onClick={onOpenUpload}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-400 transition active:scale-95 disabled:opacity-50 shadow-sm cursor-pointer"
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Tải File PDF / Ảnh</span>
            <span className="sm:hidden">Tải lên</span>
          </button>

          {/* Nút Tải Word .DOCX Nổi Bật */}
          <button
            onClick={onDownloadDocx}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-600/25 transition active:scale-95 cursor-pointer transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Tải File Word (.docx)</span>
            <span className="sm:hidden">Tải Word</span>
          </button>

          {/* Nút Trợ Lý AI */}
          <button
            onClick={onToggleChat}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition cursor-pointer ${
              isChatOpen
                ? 'bg-purple-100 text-purple-800 border-purple-400 shadow-md'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-400'
            }`}
          >
            <Bot className="w-5 h-5 text-purple-600" />
            <span className="hidden lg:inline">Hỏi Trợ Lý AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
