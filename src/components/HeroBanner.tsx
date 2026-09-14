import React from "react";
import { Sparkles, Phone, ArrowRight, Mic2, Music, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { ContactSettings } from "../types";

interface HeroBannerProps {
  settings: ContactSettings;
  onExploreServices: () => void;
  onBookNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ settings, onExploreServices, onBookNow }) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-zinc-800">
      {/* Background Ambience / Glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-yellow-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Dịch Vụ Âm Thanh Ánh Sáng Tiệc & Đám Cưới Hàng Đầu</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm font-bold tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <Music className="w-4 h-4 text-red-500" />
                <span>Hệ Thống Dàn Loa B-52 Pro Audio</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Bùng Nổ Cảm Xúc Với{" "}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Âm Thanh Đỉnh Cao
              </span>{" "}
              & Ánh Sáng Lung Linh
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl font-normal leading-relaxed">
              Chuyên cho thuê trọn gói dàn loa B-52 công nghệ Mỹ chuẩn sân khấu cho tiệc cưới, sinh nhật, thôi nôi và sự kiện doanh nghiệp. 
              Bass hầm uy lực đánh chắc nịch, dải mid sáng tôn giọng ca, chống hú tuyệt đối, có kỹ thuật viên trực trọn buổi tiệc.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-zinc-200 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Chống hú tuyệt đối 100%</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-200 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Kỹ thuật viên trực suốt tiệc</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-200 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Giao lắp trước giờ tiệc 2h</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExploreServices}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold rounded-xl text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Xem Báo Giá Trọn Gói</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onBookNow}
                className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl text-sm sm:text-base border border-zinc-700 transition-all cursor-pointer flex items-center gap-2"
              >
                <Music className="w-4 h-4 text-amber-400" />
                <span>Đặt Lịch Giữ Ngày</span>
              </button>

              <a
                href={`tel:${settings.hotline}`}
                className="px-5 py-3.5 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm sm:text-base flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi Nhanh: {settings.phoneDisplay}</span>
              </a>
            </div>

            {/* Quick Price Anchor */}
            <div className="pt-2 text-xs text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Giá thuê minh bạch chỉ từ <strong className="text-amber-400 font-bold text-sm">1.500.000đ/buổi</strong> (Không phát sinh chi phí)</span>
            </div>
          </div>

          {/* Right Column: Visual Stage Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/80 group">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
                alt="Sân khấu âm thanh ánh sáng tiệc cưới chuyên nghiệp"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

              {/* Floating badges on image */}
              <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-500/40 text-xs font-semibold text-red-400 flex items-center gap-1.5">
                <Mic2 className="w-3.5 h-3.5 text-red-500" />
                <span>Dàn Loa B-52 Chuẩn Sân Khấu</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/90 backdrop-blur-md p-4 rounded-xl border border-zinc-700/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base">Dàn B-52 Karaoke & Sân Khấu</h3>
                    <p className="text-xs text-zinc-400">Sub Hầm B-52 uy lực • Chống hú 100%</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-400 line-through">2.000.000đ</span>
                    <p className="text-sm sm:text-base font-extrabold text-amber-400">Từ 1.500.000đ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar below card */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 text-center">
                <p className="text-lg sm:text-xl font-extrabold text-amber-400">1.200+</p>
                <p className="text-[11px] text-zinc-400 font-medium">Sự Kiện Đã Làm</p>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 text-center">
                <p className="text-lg sm:text-xl font-extrabold text-emerald-400">100%</p>
                <p className="text-[11px] text-zinc-400 font-medium">Chống Hú & Đạt Chuẩn</p>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 text-center">
                <p className="text-lg sm:text-xl font-extrabold text-yellow-400">24/7</p>
                <p className="text-[11px] text-zinc-400 font-medium">Hỗ Trợ Tận Nơi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
