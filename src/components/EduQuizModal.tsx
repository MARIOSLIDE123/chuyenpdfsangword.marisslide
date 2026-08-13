import React, { useState, useMemo } from 'react';
import { X, Gamepad2, CheckCircle2, XCircle, RotateCcw, Trophy, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { DocumentAnalysisReport } from '../types';

interface EduQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: DocumentAnalysisReport;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function generateQuestionsFromReport(report: DocumentAnalysisReport): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // Q1: Tên tài liệu
  questions.push({
    question: `Tài liệu đang phân tích có tên gì?`,
    options: [
      report.documentName,
      'BaoCao_KyThuat_2025.pdf',
      'TaiLieu_HuongDan.pdf',
      'GiaoAn_MonToan.pdf'
    ],
    correctIndex: 0,
    explanation: `Tên tài liệu là "${report.documentName}".`
  });

  // Q2: Số trang
  questions.push({
    question: `Tài liệu "${report.documentName}" có bao nhiêu trang?`,
    options: [
      `${report.pageCount} trang`,
      `${report.pageCount + 3} trang`,
      `${Math.max(1, report.pageCount - 1)} trang`,
      `${report.pageCount + 7} trang`
    ],
    correctIndex: 0,
    explanation: `Tài liệu có tổng cộng ${report.pageCount} trang.`
  });

  // Q3: Độ phức tạp
  const complexityLevel = report.complexityScore >= 7 ? 'Cao' : report.complexityScore >= 4 ? 'Trung bình' : 'Thấp';
  questions.push({
    question: `Điểm phức tạp (Complexity Score) của tài liệu là bao nhiêu?`,
    options: [
      `${report.complexityScore}/10 (${complexityLevel})`,
      `${Math.min(10, report.complexityScore + 2)}/10`,
      `${Math.max(1, report.complexityScore - 3)}/10`,
      `5/10 (Trung bình)`
    ],
    correctIndex: 0,
    explanation: `Điểm phức tạp là ${report.complexityScore}/10, thuộc mức ${complexityLevel}.`
  });

  // Q4: Số bảng
  questions.push({
    question: `Tài liệu chứa bao nhiêu bảng biểu (tables)?`,
    options: [
      `${report.tableCount} bảng`,
      `${report.tableCount + 2} bảng`,
      `0 bảng`,
      `${report.tableCount + 5} bảng`
    ],
    correctIndex: 0,
    explanation: `Có tổng cộng ${report.tableCount} bảng biểu trong tài liệu.`
  });

  // Q5: Font chữ chính
  if (report.typographySpecs.length > 0) {
    const mainFont = report.typographySpecs[0];
    questions.push({
      question: `Font chữ chính được phát hiện trong tài liệu là gì?`,
      options: [
        mainFont.detectedFont,
        'Comic Sans MS',
        'Papyrus',
        'Impact'
      ],
      correctIndex: 0,
      explanation: `Font chữ chính là "${mainFont.detectedFont}", được khuyến nghị thay thế bằng "${mainFont.recommendedWordFont}" trong Word.`
    });
  }

  // Q6: Mật độ văn bản
  questions.push({
    question: `Mật độ văn bản (Text Density) của tài liệu là bao nhiêu phần trăm?`,
    options: [
      `${report.textDensityPct}%`,
      `${Math.min(100, report.textDensityPct + 15)}%`,
      `${Math.max(0, report.textDensityPct - 20)}%`,
      `50%`
    ],
    correctIndex: 0,
    explanation: `Mật độ văn bản chiếm ${report.textDensityPct}% diện tích tài liệu.`
  });

  // Shuffle options (trừ correctIndex tracking)
  return questions.map(q => {
    const correctAnswer = q.options[q.correctIndex];
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);
    return {
      ...q,
      options: shuffled,
      correctIndex: shuffled.indexOf(correctAnswer)
    };
  });
}

export const EduQuizModal: React.FC<EduQuizModalProps> = ({ isOpen, onClose, report }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const questions = useMemo(() => generateQuestionsFromReport(report), [report]);

  if (!isOpen) return null;

  const current = questions[currentQ];
  const totalQ = questions.length;

  const handleSelectAnswer = (idx: number) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === current.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < totalQ - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
  };

  const scorePct = Math.round((score / totalQ) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl text-slate-900">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">Trò Chơi Trắc Nghiệm Giáo Dục</h2>
              <p className="text-xs text-slate-500">Kiểm tra kiến thức từ tài liệu "{report.documentName}"</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!isFinished ? (
            <>
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    Câu {currentQ + 1} / {totalQ}
                  </span>
                  <span className="text-emerald-700">Đúng: {score}/{currentQ + (showResult ? 1 : 0)}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQ + (showResult ? 1 : 0)) / totalQ) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-relaxed">
                  {current.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {current.options.map((opt, idx) => {
                  let optStyle = 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
                  if (showResult) {
                    if (idx === current.correctIndex) {
                      optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800';
                    } else if (idx === selectedAnswer && idx !== current.correctIndex) {
                      optStyle = 'bg-rose-50 border-rose-400 text-rose-800';
                    } else {
                      optStyle = 'bg-slate-50 border-slate-200 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition flex items-center gap-3 ${optStyle}`}
                    >
                      <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {showResult && idx === current.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {showResult && idx === selectedAnswer && idx !== current.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation + Next */}
              {showResult && (
                <div className="space-y-3">
                  <div className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                    selectedAnswer === current.correctIndex
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border border-amber-200 text-amber-800'
                  }`}>
                    <span className="font-bold">
                      {selectedAnswer === current.correctIndex ? '✅ Chính xác!' : '❌ Sai rồi!'}{' '}
                    </span>
                    {current.explanation}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {currentQ < totalQ - 1 ? (
                      <>
                        <span>Câu Tiếp Theo</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4" />
                        <span>Xem Kết Quả</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Final Score Screen */
            <div className="text-center space-y-5 py-4">
              <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-lg ${
                scorePct >= 80 ? 'bg-gradient-to-tr from-emerald-500 to-teal-500' :
                scorePct >= 50 ? 'bg-gradient-to-tr from-amber-500 to-orange-500' :
                'bg-gradient-to-tr from-rose-500 to-pink-500'
              }`}>
                <Trophy className="w-12 h-12 text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {scorePct >= 80 ? '🎉 Xuất Sắc!' : scorePct >= 50 ? '👍 Khá Tốt!' : '📚 Cần Ôn Lại!'}
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  Bạn đã trả lời đúng <strong className="text-blue-700">{score}/{totalQ}</strong> câu hỏi ({scorePct}%)
                </p>
              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    scorePct >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                    scorePct >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                    'bg-gradient-to-r from-rose-500 to-pink-500'
                  }`}
                  style={{ width: `${scorePct}%` }}
                />
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi Lại</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm transition cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Đóng</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
