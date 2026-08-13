import React, { useState, useEffect } from 'react';
import { Key, Settings, ExternalLink, Check, ShieldCheck, Sparkles, AlertCircle, Cpu, RefreshCw } from 'lucide-react';
import {
  AI_MODELS,
  getStoredApiKeys,
  setStoredApiKeys,
  getActiveKeyIndex,
  getSelectedModel,
  setSelectedModel
} from '../utils/apiKeyStorage';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMandatory?: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  isMandatory = false
}) => {
  const [keys, setKeys] = useState<[string, string, string]>(['', '', '']);
  const [activeIdx, setActiveIdx] = useState(0);
  const [currentModel, setCurrentModel] = useState('gemini-3-flash-preview');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setKeys(getStoredApiKeys());
      setActiveIdx(getActiveKeyIndex());
      setCurrentModel(getSelectedModel());
      setSavedSuccess(false);
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyChange = (index: number, val: string) => {
    const newKeys = [...keys] as [string, string, string];
    newKeys[index] = val;
    setKeys(newKeys);
  };

  const handleSave = () => {
    if (!keys[0].trim() && !keys[1].trim() && !keys[2].trim()) {
      setErrorMsg('Vui lòng nhập ít nhất 1 API Key từ Google AI Studio.');
      return;
    }
    setStoredApiKeys(keys);
    setSelectedModel(currentModel);
    setSavedSuccess(true);
    setErrorMsg('');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-900 space-y-4">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-blue-600 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-rose-600">
                <Settings className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                Cấu Hình 3 API Keys Xoay Vòng & Model AI
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Tự động xoay vòng sang Key dự phòng khi Key hiện tại hết Quota / Credit
              </p>
            </div>
          </div>
          {!isMandatory && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold transition cursor-pointer"
            >
              Đóng
            </button>
          )}
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Dòng hướng dẫn màu đỏ bắt buộc theo AI_INSTRUCTIONS.md */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
              <RefreshCw className="w-4 h-4 text-rose-600 animate-spin" />
              <span>Hệ thống tự xoay vòng 3 Key khi hết Credit (429 RESOURCE_EXHAUSTED)</span>
            </div>
            <a
              href="https://aistudio.google.com/api-keys"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-extrabold text-rose-600 hover:underline flex items-center gap-1 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 shrink-0"
            >
              <span>Lấy API key để sử dụng app</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Danh sách 3 API Keys */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-600" /> Danh Sách 3 API Keys Xoay Vòng:
            </label>

            {[0, 1, 2].map((idx) => {
              const isActive = activeIdx === idx;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-100 border border-blue-300 text-center font-mono text-[11px] leading-5 text-blue-800">
                        {idx + 1}
                      </span>
                      API Key #{idx + 1} {idx === 0 ? '(Key Chính)' : `(Dự phòng ${idx})`}
                    </span>

                    {isActive && keys[idx].trim().length > 0 && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Đang Hoạt Động
                      </span>
                    )}
                  </div>

                  <input
                    type="password"
                    value={keys[idx]}
                    onChange={(e) => handleKeyChange(idx, e.target.value)}
                    placeholder={`Nhập Gemini API Key #${idx + 1} (AIzaSy...)`}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition shadow-inner"
                  />
                </div>
              );
            })}
            <p className="text-xs text-slate-500">
              Khi Key 1 bị giới hạn Quota, hệ thống sẽ tự động chuyển sang Key 2 và Key 3 mà không làm gián đoạn việc phân tích file PDF.
            </p>
          </div>

          {/* Chọn Model AI (dạng Cards theo AI_INSTRUCTIONS.md) */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" /> Chọn Model AI Mặc Định
            </label>

            <div className="grid grid-cols-1 gap-3">
              {AI_MODELS.map((model) => {
                const isSelected = currentModel === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => setCurrentModel(model.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-4 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-400 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          {model.name}
                        </span>
                        {model.default && (
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{model.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Thông báo lỗi / thành công */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Đã lưu 3 API Keys và cài đặt Model xoay vòng thành công!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          {!isMandatory && (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              Hủy
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lưu 3 API Keys</span>
          </button>
        </div>
      </div>
    </div>
  );
};
