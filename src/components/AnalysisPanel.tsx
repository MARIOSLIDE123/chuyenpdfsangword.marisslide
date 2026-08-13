import React from 'react';
import {
  Cpu,
  Layers,
  Type as TypeIcon,
  Layout,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  FileSpreadsheet,
  Grid
} from 'lucide-react';
import { DocumentAnalysisReport } from '../types';

interface AnalysisPanelProps {
  report: DocumentAnalysisReport;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ report }) => {
  return (
    <div className="space-y-6 text-slate-900 w-full">
      {/* 1. Thẻ Thông Số Tổng Quan Sinh Động */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Độ phức tạp */}
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-md relative overflow-hidden group hover:border-blue-400 transition">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Độ Phức Tạp Layout</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {report.complexityScore}
            </span>
            <span className="text-sm font-bold text-slate-500">/ 10</span>
          </div>
          <p className="text-xs text-blue-600 font-semibold mt-2">
            {report.complexityScore > 8.5 ? '⚡ Bố cục cao cấp (Cột kép & Bảng gộp ô)' : 'Nội dung tiêu chuẩn'}
          </p>
        </div>

        {/* Card 2: Mật độ chữ */}
        <div className="bg-white border border-indigo-200 rounded-2xl p-5 shadow-md relative overflow-hidden group hover:border-indigo-400 transition">
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Mật Độ Văn Bản</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <TypeIcon className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {report.textDensityPct}%
            </span>
          </div>
          <p className="text-xs text-indigo-600 font-semibold mt-2">Tái tạo phông chữ nhị phân 1:1</p>
        </div>

        {/* Card 3: Bảng biểu */}
        <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-md relative overflow-hidden group hover:border-purple-400 transition">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Bảng Biểu Đã Nhận Diện</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {report.tableCount}
            </span>
            <span className="text-sm font-bold text-slate-500">Khung Bảng</span>
          </div>
          <p className="text-xs text-purple-600 font-semibold mt-2">Khôi phục ô gộp & viền chuẩn Word</p>
        </div>

        {/* Card 4: Tổng số trang */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-md relative overflow-hidden group hover:border-emerald-400 transition">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Quy Mô Tài Liệu</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Layout className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {report.pageCount}
            </span>
            <span className="text-sm font-bold text-slate-500">Trang A4</span>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-2">Đã tối ưu hóa bố cục Word tự nhiên</p>
        </div>
      </div>

      {/* 2. Bảng Phông Chữ & Khung Bảng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phông Chữ Nổi Bật */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <TypeIcon className="w-5 h-5 text-blue-600" />
            Danh Sách Phông Chữ Nhận Diện & Tương Thích Word
          </h3>

          <div className="space-y-3">
            {report.typographySpecs.map((font, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 hover:border-blue-300 transition"
              >
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm">
                    {font.detectedFont} ➔ <span className="text-blue-600">{font.recommendedWordFont}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Kích thước: {font.fontSizePt}pt | Kiểu: {font.weight} | Chiều cao dòng: {font.lineHeightRatio}x
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Khớp {font.metricCompatibilityScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cảnh Báo & Tối Ưu Risk Mitigations */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            Cảnh Báo Vùng Tràn & Phương Án Tối Ưu Đã Áp Dụng
          </h3>

          <div className="space-y-3">
            {report.warnings.map((warn, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    {warn.title}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    {warn.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-700">{warn.description}</p>
                <p className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Giải pháp: {warn.mitigation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
