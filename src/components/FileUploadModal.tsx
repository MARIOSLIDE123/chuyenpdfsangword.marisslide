import React, { useState } from 'react';
import { Upload, X, FileText, AlertCircle, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { DocumentAnalysisReport } from '../types';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeUploadedFile: (fileName: string, base64: string, mimeType: string) => Promise<void>;
  sampleDocsList: DocumentAnalysisReport[];
  onSelectSample: (docName: string) => void;
  isAnalyzing: boolean;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeUploadedFile,
  sampleDocsList,
  onSelectSample,
  isAnalyzing
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadError(null);
    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      setUploadError('Chỉ hỗ trợ tệp định dạng PDF (.pdf) hoặc hình ảnh (.png, .jpg, .webp).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Dung lượng tệp vượt quá 20MB. Vui lòng chọn tệp nhỏ hơn.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !previewUrl) return;
    try {
      await onAnalyzeUploadedFile(selectedFile.name, previewUrl, selectedFile.type || 'image/png');
      onClose();
    } catch (err: any) {
      setUploadError(err.message || 'Lỗi khi xử lý tài liệu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-900 space-y-2">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-blue-600">
                <Upload className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl">Tải Lên File PDF Hoặc Ảnh Để Chuyển Đổi</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Hệ thống tự động phân tích OCR, nhận diện bảng biểu & phông chữ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Vùng Kéo Thả Sinh Động */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-3 border-dashed rounded-2xl p-8 text-center transition ${
              dragActive
                ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50'
            }`}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-base">{selectedFile.name}</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Tệp PDF'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-sm text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  Chọn tệp khác
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-inner">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold text-slate-900">
                    Kéo & thả tệp PDF hoặc ảnh tài liệu vào đây
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Hỗ trợ file PDF, PNG, JPG, WEBP (Tối đa 20MB)
                  </p>
                </div>
                <label className="inline-block cursor-pointer px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition shadow-lg transform hover:-translate-y-0.5">
                  Chọn Tệp Từ Máy Tính
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Chọn File Mẫu Sẵn Có */}
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Hoặc Chọn Ngay File Mẫu Tiêu Chuẩn:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sampleDocsList.map((doc) => (
                <button
                  key={doc.documentName}
                  onClick={() => {
                    onSelectSample(doc.documentName);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-400 text-left transition group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      {doc.pageCount} Trang
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition">
                    {doc.documentName}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || isAnalyzing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg disabled:opacity-50 transition cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang Phân Tích OCR...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Bắt Đầu Tái Tạo File Word</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
