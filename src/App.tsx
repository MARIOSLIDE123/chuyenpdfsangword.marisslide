import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AnalysisPanel } from './components/AnalysisPanel';
import { DualViewerStudio } from './components/DualViewerStudio';
import { ArchitectChat } from './components/ArchitectChat';
import { FileUploadModal } from './components/FileUploadModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { EduQuizModal } from './components/EduQuizModal';
import { FooterBanner } from './components/FooterBanner';
import { INITIAL_EMPTY_DOCUMENT, SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { DocumentAnalysisReport } from './types';
import { generateDocxBlob, downloadBlob, DocxExportMode } from './utils/docxGenerator';
import { generatePptxBlob, downloadPptxFile } from './utils/pptxGenerator';
import { analyzeDocumentWithFallback, getActiveApiKey } from './utils/apiKeyStorage';
import {
  Split,
  BarChart3,
  Terminal,
  ShieldCheck,
  Upload,
  Download,
  Edit3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Gamepad2,
  Presentation,
  FileSpreadsheet,
  AlertTriangle,
  XCircle,
  Loader2,
  FileCheck
} from 'lucide-react';

export default function App() {
  const [currentDoc, setCurrentDoc] = useState<DocumentAnalysisReport>(INITIAL_EMPTY_DOCUMENT);
  const [activeTab, setActiveTab] = useState<'studio' | 'analysis' | 'strategy'>('studio');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingModel, setAnalyzingModel] = useState<string>('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [processStatus, setProcessStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasApiKey = Boolean(getActiveApiKey());

  // AI_INSTRUCTIONS.md: Khi chưa có key, hiển thị Modal bắt buộc nhập
  useEffect(() => {
    if (!hasApiKey) {
      setIsSettingsOpen(true);
    }
  }, [hasApiKey]);

  const handleSelectSample = (docName: string) => {
    const found = SAMPLE_DOCUMENTS.find((d) => d.documentName === docName);
    if (found) {
      setCurrentDoc(found);
      setAnalysisError(null);
      setProcessStatus('success');
    }
  };

  const handleDownloadDocx = async (mode: DocxExportMode = 'standard') => {
    try {
      const blob = await generateDocxBlob(currentDoc, mode);
      let suffix = '_ChuyenDoi';
      if (mode === 'student_exam') suffix = '_DeThiHocSinh';
      if (mode === 'teacher_key') suffix = '_DapAnGiaoVien';

      downloadBlob(blob, (currentDoc.documentName || 'Document').replace('.pdf', '') + `${suffix}.docx`);
    } catch (err: any) {
      console.error('Failed to generate DOCX:', err);
      alert('Đã xảy ra lỗi khi tạo tệp .docx: ' + (err?.message || 'Vui lòng thử lại.'));
    }
  };

  const handleDownloadPptx = async () => {
    try {
      const blob = await generatePptxBlob(currentDoc);
      downloadPptxFile(blob, (currentDoc.documentName || 'Document').replace('.pdf', '') + '_BaiGiang.ppt');
    } catch (err: any) {
      console.error('Failed to generate PPTX:', err);
      alert('Đã xảy ra lỗi khi xuất slide PowerPoint: ' + (err?.message || 'Vui lòng thử lại.'));
    }
  };

  const handleAnalyzeUploadedFile = async (fileName: string, base64: string, mimeType: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setProcessStatus('idle');

    try {
      const report: DocumentAnalysisReport = await analyzeDocumentWithFallback(
        { fileName, fileBase64: base64, mimeType },
        (info) => setAnalyzingModel(`${info.modelId} (API Key #${info.keyIndex + 1})`)
      );

      setCurrentDoc(report);
      setProcessStatus('success');
      setActiveTab('studio');
    } catch (err: any) {
      console.error('Full analysis error:', err);
      setProcessStatus('error');
      setAnalysisError(err.message || '429 RESOURCE_EXHAUSTED: Thất bại khi phân tích tài liệu.');
    } finally {
      setIsAnalyzing(false);
      setAnalyzingModel('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col w-full selection:bg-blue-500 selection:text-white">
      {/* Top Main Header */}
      <Header
        currentDoc={currentDoc}
        onSelectSample={handleSelectSample}
        onOpenUpload={() => setIsUploadOpen(true)}
        onDownloadDocx={() => handleDownloadDocx('standard')}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        sampleDocsList={SAMPLE_DOCUMENTS}
        isAnalyzing={isAnalyzing}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={hasApiKey}
      />

      {/* Main Container */}
      <main className="flex-1 w-full px-4 sm:px-8 py-6 space-y-6">
        {/* Thông báo lỗi màu đỏ nguyên văn API khi thất bại theo AI_INSTRUCTIONS.md */}
        {processStatus === 'error' && analysisError && (
          <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-5 shadow-lg space-y-2 animate-shake">
            <div className="flex items-center gap-3 text-rose-700 font-bold text-lg">
              <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
              <span>Đã dừng do lỗi: Phân tích tài liệu thất bại</span>
            </div>
            <p className="text-sm font-mono text-rose-800 bg-rose-100 p-3 rounded-xl border border-rose-300 leading-relaxed overflow-x-auto">
              {analysisError}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Kiểm Tra API Key / Chuyển Model Khác
              </button>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Thử Lại File Khác
              </button>
            </div>
          </div>
        )}

        {/* Thanh 3 Bước Hướng Dẫn & Bộ Công Cụ Xuất File Nâng Cấp */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 border border-blue-400 rounded-3xl p-6 shadow-xl space-y-5 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div
              onClick={() => setIsUploadOpen(true)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 p-4 rounded-2xl flex items-center gap-4 transition cursor-pointer group shadow-md"
            >
              <div className="w-12 h-12 rounded-2xl bg-white text-blue-700 font-extrabold text-lg flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition">
                    1. Tải Lên PDF Của Bạn
                  </h3>
                  <Upload className="w-4 h-4 text-cyan-200" />
                </div>
                <p className="text-xs sm:text-sm text-blue-100 mt-0.5">Tải tệp PDF hoặc ảnh tài liệu mới</p>
              </div>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setActiveTab('studio')}
              className={`bg-white/10 hover:bg-white/20 backdrop-blur-md border p-4 rounded-2xl flex items-center gap-4 transition cursor-pointer group shadow-md ${
                activeTab === 'studio' ? 'border-amber-300 bg-white/25' : 'border-white/25'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-extrabold text-lg flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition">
                    2. Xem & Chỉnh Trực Tiếp
                  </h3>
                  <Edit3 className="w-4 h-4 text-amber-300" />
                </div>
                <p className="text-xs sm:text-sm text-blue-100 mt-0.5">So sánh PDF và chỉnh văn bản Word</p>
              </div>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => handleDownloadDocx('standard')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 p-4 rounded-2xl flex items-center gap-4 transition cursor-pointer group shadow-md"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-slate-950 font-extrabold text-lg flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-200 transition">
                    3. Tải File Word (.docx)
                  </h3>
                  <Download className="w-4 h-4 text-emerald-300" />
                </div>
                <p className="text-xs sm:text-sm text-blue-100 mt-0.5">Xuất file Word chuẩn 1:1 lập tức</p>
              </div>
            </div>
          </div>

          {/* Thanh công cụ giáo dục bổ sung (SKILL EDUCATION) */}
          <div className="pt-3 border-t border-white/20 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
              <Sparkles className="w-4 h-4 fill-amber-300" />
              <span>Tính Năng Giáo Dục Nâng Cấp:</span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Xuất Đề thi Học sinh */}
              <button
                onClick={() => handleDownloadDocx('student_exam')}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileCheck className="w-4 h-4 text-cyan-200" />
                <span>Xuất Đề Thi (Học Sinh)</span>
              </button>

              {/* Xuất Đáp án Giáo viên */}
              <button
                onClick={() => handleDownloadDocx('teacher_key')}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-rose-200" />
                <span>Xuất Đáp Án (Giáo Viên)</span>
              </button>

              {/* Xuất Slide PowerPoint */}
              <button
                onClick={handleDownloadPptx}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Presentation className="w-4 h-4 text-slate-950" />
                <span>Xuất Slides PowerPoint (.ppt)</span>
              </button>

              {/* Mở Mini Game Quiz */}
              <button
                onClick={() => setIsQuizOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Gamepad2 className="w-4 h-4 text-purple-200" />
                <span>Trò Chơi Trắc Nghiệm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Split className="w-5 h-5 text-cyan-300" />
              <span>Phòng So Sánh & Chỉnh Sửa Song Song</span>
            </button>

            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'analysis'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-5 h-5 text-blue-300" />
              <span>Báo Cáo Phông Chữ & Khung Bảng</span>
            </button>

            <button
              onClick={() => setActiveTab('strategy')}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'strategy'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Terminal className="w-5 h-5 text-purple-300" />
              <span>Quy Trình Xử Lý Kỹ Thuật</span>
            </button>
          </div>

          {/* Trạng thái tệp hiện tại */}
          <div className="flex items-center gap-3">
            {isAnalyzing && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-300 text-blue-700 text-xs font-bold font-mono animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Model đang thử: {analyzingModel || 'Đang xử lý...'}</span>
              </div>
            )}

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-800 shadow-sm">
              {processStatus === 'error' ? (
                <>
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="text-rose-700 font-extrabold">Đã dừng do lỗi</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Tệp Hiện Tại: <strong className="text-blue-600">{currentDoc.documentName}</strong> ({currentDoc.pageCount} Trang)</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab 1: Studio So Sánh Song Song */}
        {activeTab === 'studio' && (
          <DualViewerStudio report={currentDoc} onDownloadDocx={() => handleDownloadDocx('standard')} />
        )}

        {/* Tab 2: Thông Số Bảng Biểu & Phông Chữ */}
        {activeTab === 'analysis' && <AnalysisPanel report={currentDoc} />}

        {/* Tab 3: Quy Trình Xử Lý */}
        {activeTab === 'strategy' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 text-slate-900 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-blue-600" />
                  Quy Trình Xử Lý Tái Cấu Trúc File Word Tự Động
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Được thiết lập dựa trên kết quả phân tích cấu trúc nhị phân của tài liệu
                </p>
              </div>
              <button
                onClick={() => handleDownloadDocx('standard')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm transition shadow-md cursor-pointer flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Xuất File Word (.docx) Ngay</span>
              </button>
            </div>

            <div className="space-y-4">
              {currentDoc.conversionStrategy.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 text-sm sm:text-base hover:border-blue-300 transition"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold font-mono flex items-center justify-center shrink-0 shadow-md">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">Bước {idx + 1}: Xử Lý Kỹ Thuật Tự Động</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer Banner Quảng Cáo Maris Slide */}
      <FooterBanner />

      {/* Floating Architect AI Assistant Drawer */}
      <ArchitectChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        documentContext={currentDoc}
      />

      {/* Upload File Modal */}
      <FileUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAnalyzeUploadedFile={handleAnalyzeUploadedFile}
        sampleDocsList={SAMPLE_DOCUMENTS}
        onSelectSample={handleSelectSample}
        isAnalyzing={isAnalyzing}
      />

      {/* Settings (API Key & Model Choice) Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isMandatory={!hasApiKey}
      />

      {/* Edu Quiz Game Modal */}
      <EduQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        report={currentDoc}
      />
    </div>
  );
}
