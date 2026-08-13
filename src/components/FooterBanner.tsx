import React from 'react';
import { Phone, Sparkles, Award, GraduationCap, Laptop, BookOpen, Layers, PhoneCall } from 'lucide-react';

export const FooterBanner: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white mt-12 py-10 px-4 sm:px-8 border-t-4 border-amber-400 shadow-2xl relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/15 shadow-xl">
          {/* Left Brand Details */}
          <div className="space-y-3 text-center lg:text-left flex-1">
            <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap">
              <span className="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 fill-slate-950" /> Đối Tác Giáo Dục Hàng Đầu
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                🎓 MARIS SLIDE
              </h2>
            </div>

            <p className="text-base sm:text-lg text-blue-100 font-semibold leading-relaxed max-w-3xl">
              Chuyên nhận đào tạo và thiết kế <strong>Giáo án điện tử</strong> • <strong>Thiết bị dạy học số</strong> • <strong>Bài dự thi E-Learning</strong> • <strong>Sáng kiến kinh nghiệm (SKKN)</strong> • <strong>Ứng dụng trí tuệ AI vào giảng dạy</strong>
            </p>

            {/* Service Tags */}
            <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap pt-2 text-xs font-bold text-blue-200">
              <span className="px-3 py-1 rounded-xl bg-blue-800/60 border border-blue-400/30 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-300" /> Thiết Kế Bài Giảng Chuẩn KNTT / Cánh Diều
              </span>
              <span className="px-3 py-1 rounded-xl bg-blue-800/60 border border-blue-400/30 flex items-center gap-1">
                <Laptop className="w-3.5 h-3.5 text-cyan-300" /> E-Learning Thi Quốc Gia & Tỉnh
              </span>
              <span className="px-3 py-1 rounded-xl bg-blue-800/60 border border-blue-400/30 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-300" /> Tập Huấn AI Cho Giáo Viên
              </span>
            </div>
          </div>

          {/* Right Hotline Call to Action Box */}
          <div className="shrink-0 text-center lg:text-right bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 p-1 rounded-3xl shadow-2xl transform hover:scale-105 transition duration-300">
            <div className="bg-slate-950 px-6 py-5 rounded-[22px] text-white space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 block">
                Tư Vấn & Hỗ Trợ 24/7
              </span>
              <a
                href="tel:0396581283"
                className="text-2xl sm:text-3xl font-black text-amber-300 hover:text-white flex items-center justify-center lg:justify-end gap-2 font-mono transition"
              >
                <PhoneCall className="w-7 h-7 text-amber-400 animate-bounce" />
                <span>0396.581.283</span>
              </a>
              <p className="text-xs text-slate-300 font-medium">
                Liên hệ ngay để nhận ưu đãi thiết kế & đào tạo AI
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="flex items-center justify-between text-xs text-blue-200/80 flex-wrap gap-2 pt-2 border-t border-white/10">
          <span>© {new Date().getFullYear()} Maris Slide - Giải Pháp Công Nghệ Giáo Dục Hàng Đầu. All rights reserved.</span>
          <span className="font-semibold text-amber-300">Hotline Zalo: 0396.581.283</span>
        </div>
      </div>
    </footer>
  );
};
