import React, { useState } from "react";
import { Calculator, Check, ArrowRight, Sparkles, Layers, Sliders, Music, ShieldCheck } from "lucide-react";

interface PriceCalculatorProps {
  onApplyEstimate: (estimateText: string, totalBudget: number) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ onApplyEstimate }) => {
  // Scale
  const [scale, setScale] = useState<number>(1); // 0: 10-30, 1: 30-80, 2: 100-300, 3: 300-600, 4: >800
  // Stage Effects
  const [hasLowFog, setHasLowFog] = useState(false); // Máy khói lạnh CO2 (+1.5tr)
  const [hasSparklers, setHasSparklers] = useState(false); // Pháo sáng điện tử (+1.2tr)
  const [hasStarCurtain, setHasStarCurtain] = useState(false); // Màn sao sân khấu (+1.0tr)
  const [hasDjLights, setHasDjLights] = useState(false); // Đèn Moving Head Beam (+1.2tr)
  const [hasSoundTech, setHasSoundTech] = useState(true); // Kỹ thuật viên (Đã kèm miễn phí)

  const scaleOptions = [
    { label: "10 - 30 người (Gia đình)", basePrice: 1500000, desc: "2 Loa Full Bass 30 + 2 Micro Shure + Vang số" },
    { label: "30 - 80 người (Sinh nhật / Thôi nôi)", basePrice: 2500000, desc: "2 Loa Full + 1 Sub hầm + 2 Mic + Đèn Par Led" },
    { label: "100 - 300 người (Tiệc cưới tiêu chuẩn)", basePrice: 5500000, desc: "4 Loa Full + 2 Sub + Mixer 12 Line + 8 Par Led + 2 Beam" },
    { label: "300 - 600 người (Tiệc cưới VIP / Gala)", basePrice: 9500000, desc: "Line Array 4 Cặp + 2 Sub kép + 12 Par Led + 4 Beam" },
    { label: "Trên 800 người (Sự kiện ngoài trời)", basePrice: 15000000, desc: "Full Line Array lớn + Khung Truss nhôm + Mixer 32 Line" },
  ];

  const currentScale = scaleOptions[scale];
  let calculatedTotal = currentScale.basePrice;

  if (hasLowFog) calculatedTotal += 1500000;
  if (hasSparklers) calculatedTotal += 1200000;
  if (hasStarCurtain) calculatedTotal += 1000000;
  if (hasDjLights) calculatedTotal += 1200000;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  const handleApply = () => {
    const chosenEffects = [];
    if (hasLowFog) chosenEffects.push("Máy khói lạnh CO2");
    if (hasSparklers) chosenEffects.push("Pháo sáng điện tử");
    if (hasStarCurtain) chosenEffects.push("Màn sao sân khấu");
    if (hasDjLights) chosenEffects.push("Đèn Moving Head Beam");

    const summary = `Quy mô: ${currentScale.label}. Thiết bị chính: ${currentScale.desc}. Hiệu ứng bổ sung: ${
      chosenEffects.length > 0 ? chosenEffects.join(", ") : "Không chọn thêm"
    }.`;

    onApplyEstimate(summary, calculatedTotal);
  };

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-zinc-950 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            Công Cụ Dự Toán Chi Phí Tức Thì
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tự Lên Dự Toán Cho Bữa Tiệc Của Bạn
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-2">
            Chọn quy mô khách mời và các hiệu ứng mong muốn để xem báo giá ước tính chính xác, không lo phát sinh.
          </p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Step 1: Scale */}
          <div>
            <label className="block text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              1. Quy mô bữa tiệc / Sự kiện của bạn:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scaleOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setScale(idx)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    scale === idx
                      ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                      : "bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-950"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{opt.label}</span>
                    <span className="text-xs font-extrabold text-amber-400">{formatVND(opt.basePrice)}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Add-on Effects */}
          <div>
            <label className="block text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              2. Hiệu ứng & Trang trí sân khấu bổ sung (Tùy chọn):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Fog */}
              <div
                onClick={() => setHasLowFog(!hasLowFog)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  hasLowFog ? "bg-amber-500/15 border-amber-500 text-white" : "bg-zinc-950/60 border-zinc-800 text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${hasLowFog ? "bg-amber-500 border-amber-500 text-black" : "border-zinc-700"}`}>
                    {hasLowFog && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Máy khói lạnh CO2 bồng bềnh</p>
                    <p className="text-xs text-zinc-400">Tạo mây bồng bềnh cho cô dâu chú rể</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400">+1.500.000đ</span>
              </div>

              {/* Sparklers */}
              <div
                onClick={() => setHasSparklers(!hasSparklers)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  hasSparklers ? "bg-amber-500/15 border-amber-500 text-white" : "bg-zinc-950/60 border-zinc-800 text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${hasSparklers ? "bg-amber-500 border-amber-500 text-black" : "border-zinc-700"}`}>
                    {hasSparklers && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Pháo sáng điện tử đám cưới</p>
                    <p className="text-xs text-zinc-400">6 trụ pháo điện tử không mùi an toàn</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400">+1.200.000đ</span>
              </div>

              {/* Star curtain */}
              <div
                onClick={() => setHasStarCurtain(!hasStarCurtain)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  hasStarCurtain ? "bg-amber-500/15 border-amber-500 text-white" : "bg-zinc-950/60 border-zinc-800 text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${hasStarCurtain ? "bg-amber-500 border-amber-500 text-black" : "border-zinc-700"}`}>
                    {hasStarCurtain && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Màn sao Led lung linh sân khấu</p>
                    <p className="text-xs text-zinc-400">Backdrop màn sao Led 6m x 3m huyền ảo</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400">+1.000.000đ</span>
              </div>

              {/* DJ Beam Lights */}
              <div
                onClick={() => setHasDjLights(!hasDjLights)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  hasDjLights ? "bg-amber-500/15 border-amber-500 text-white" : "bg-zinc-950/60 border-zinc-800 text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${hasDjLights ? "bg-amber-500 border-amber-500 text-black" : "border-zinc-700"}`}>
                    {hasDjLights && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Đèn Moving Head Beam & Laser</p>
                    <p className="text-xs text-zinc-400">Hiệu ứng quẩy sung, nhạc sàn sôi động</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400">+1.200.000đ</span>
              </div>
            </div>
          </div>

          {/* Guaranteed items included free */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Đã bao gồm Kỹ Thuật Viên trực chỉnh âm suốt tiệc (0đ)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Check className="w-4 h-4" /> Vận chuyển & Lắp đặt tận nơi (0đ)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Check className="w-4 h-4" /> Micro dự phòng & dây nối đầy đủ (0đ)
            </span>
          </div>

          {/* Step 3: Total & Apply */}
          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Tổng Dự Toán Trọn Gói (Ước Tính):</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-amber-400">
                  {formatVND(calculatedTotal)}
                </span>
                <span className="text-xs text-zinc-400">/ trọn gói buổi tiệc</span>
              </div>
              <p className="text-xs text-emerald-400 font-medium mt-1">
                * Có thể điều chỉnh linh hoạt theo kích thước thực tế sân khấu.
              </p>
            </div>

            <button
              onClick={handleApply}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-extrabold rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer transform hover:-translate-y-0.5 transition-all"
            >
              <span>Điền Cấu Hình Này Vào Form Tư Vấn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
