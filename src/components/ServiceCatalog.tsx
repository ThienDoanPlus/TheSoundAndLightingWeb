import React, { useState } from "react";
import { Check, Flame, Info, Phone, MessageCircle, ArrowRight, X, Sparkles } from "lucide-react";
import { ServiceItem, ContactSettings } from "../types";

interface ServiceCatalogProps {
  services: ServiceItem[];
  settings: ContactSettings;
  onSelectServiceForBooking: (service: ServiceItem) => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  services,
  settings,
  onSelectServiceForBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const categories = [
    { id: "all", label: "Tất Cả Gói Dịch Vụ" },
    { id: "karaoke", label: "Dàn Karaoke Tiệc" },
    { id: "wedding", label: "Âm Thanh & Tiệc Cưới" },
    { id: "lighting", label: "Ánh Sáng Sân Khấu" },
    { id: "stage_effects", label: "Hiệu Ứng (Khói, Pháo)" },
  ];

  const filteredServices = selectedCategory === "all"
    ? services
    : services.filter((s) => s.category === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Bảng Giá Dịch Vụ Minh Bạch 2026
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Gói Dịch Vụ Âm Thanh, Ánh Sáng & Trang Trí Tiệc
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Giá niêm yết công khai, cam kết không phụ thu phát sinh. Miễn phí vận chuyển và lắp đặt trong nội thành, 
            kỹ thuật viên chuyên nghiệp chỉnh âm thanh chuẩn xác suốt sự kiện.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto py-6 mt-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 shadow-lg shadow-amber-500/20 font-bold"
                  : "bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`group bg-zinc-900/70 border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                service.isPopular
                  ? "border-amber-500/60 shadow-amber-500/10"
                  : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {/* Card Image */}
              <div className="relative h-56 overflow-hidden bg-zinc-900">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {service.badge && (
                    <span className="px-2.5 py-1 bg-amber-500 text-zinc-950 text-xs font-bold rounded-lg shadow-md flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {service.badge}
                    </span>
                  )}
                  {service.isPopular && (
                    <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-lg shadow-md">
                      Hot
                    </span>
                  )}
                </div>

                {/* Unit tag bottom right */}
                <div className="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-300 border border-zinc-700/50">
                  {service.unit}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 line-clamp-2">
                    {service.shortDesc}
                  </p>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                      {formatPrice(service.price)}
                    </span>
                    {service.originalPrice && (
                      <span className="text-xs sm:text-sm text-zinc-400 line-through">
                        {formatPrice(service.originalPrice)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-amber-200/90 font-medium mt-1">
                    🎯 {service.recommendedFor}
                  </p>

                  {/* Key specs (first 3) */}
                  <div className="mt-4 pt-3 border-t border-zinc-800 space-y-2">
                    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Cấu hình tiêu biểu:</p>
                    {service.specs.slice(0, 3).map((spec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{spec}</span>
                      </div>
                    ))}
                    {service.specs.length > 3 && (
                      <button
                        onClick={() => setActiveModalService(service)}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 cursor-pointer pt-1"
                      >
                        + Xem thêm {service.specs.length - 3} thiết bị chi tiết
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onSelectServiceForBooking(service)}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/15 cursor-pointer"
                  >
                    <span>Đặt Lịch Giữ Gói</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveModalService(service)}
                    className="p-2.5 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer border border-zinc-700/60"
                    title="Xem chi tiết cấu hình"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Service Details */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-full cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 sm:h-72">
              <img
                src={activeModalService.image}
                alt={activeModalService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-2.5 py-1 bg-amber-500 text-zinc-950 text-xs font-bold rounded-md">
                  {activeModalService.badge || "Trọn Gói Chuyên Nghiệp"}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                  {activeModalService.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-zinc-800">
                <div>
                  <p className="text-xs text-zinc-400">Giá trọn gói:</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amber-400">
                      {formatPrice(activeModalService.price)}
                    </span>
                    {activeModalService.originalPrice && (
                      <span className="text-sm text-zinc-400 line-through">
                        {formatPrice(activeModalService.originalPrice)}
                      </span>
                    )}
                    <span className="text-xs text-zinc-400 font-medium">/{activeModalService.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-400">Khuyến nghị:</p>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-400">
                    {activeModalService.recommendedFor}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  Mô Tả Gói Dịch Vụ
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {activeModalService.shortDesc}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  Cấu Hình Chi Tiết Thiết Bị & Nhân Sự
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModalService.specs.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-200 bg-zinc-800/40 p-2.5 rounded-lg border border-zinc-800">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Cam Kết Dịch Vụ Của Chúng Tôi:
                </p>
                <p className="text-zinc-300">
                  • Luôn có mặt trước 60 - 90 phút để lắp đặt và test âm thanh kỹ lưỡng.<br />
                  • Micro Shure không dây đời mới, sóng cực xa, bắt giọng cực nhẹ.<br />
                  • Hỗ trợ kết nối Bluetooth / Tivi / iPad / Nhạc sàn / Acoustic linh hoạt.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => {
                    onSelectServiceForBooking(activeModalService);
                    setActiveModalService(null);
                  }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <span>Đặt Ngay Gói Này</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${settings.hotline}`}
                  className="py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Gọi Hotline: {settings.phoneDisplay}</span>
                </a>

                <a
                  href={settings.zaloLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Zalo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
