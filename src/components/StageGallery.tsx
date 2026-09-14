import React, { useState } from "react";
import { Sparkles, Maximize2, X, Music, Heart, Zap, Award } from "lucide-react";

import imgTiecCuoiLangMang from '../assets/TiecCuoiLangMang.jpg';
import imgKaraokeSanVuon from '../assets/KaraokeSanVuon.jpg';
import imgTrangTriSanKhau from '../assets/TrangTriSanKhau.jpg';
import imgAnhSangSanKhau from '../assets/AnhSangSanKhau.jpg';
import imgHieuUngSanKhau from '../assets/HieuUngSanKhau.jpg';
import imgSuKienNgoaiTroi from '../assets/SuKienNgoaiTroi.jpg';
import imgKaraokeGiaDinh from '../assets/KaraokeGiaDinh.jpg';
import imgHoiNghiGala from '../assets/HoiNghiGala.jpg';

interface GalleryItem {
  id: string;
  title: string;
  category: "wedding" | "karaoke" | "lighting" | "effects";
  categoryLabel: string;
  image: string;
  caption: string;
  eventScale: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Tiệc Cưới Hoàng Gia - Hiệu Ứng Khói Lạnh & Màn Sao",
    category: "wedding",
    categoryLabel: "Tiệc Cưới Lãng Mạn",
    image: imgTiecCuoiLangMang,
    caption: "Sân khấu đám cưới bồng bềnh như mây với 2 máy khói lạnh CO2, màn sao Led và hệ thống âm thanh chuẩn tiệc cưới 400 khách.",
    eventScale: "400 khách • Sảnh tiệc cưới",
  },
  {
    id: "gal-2",
    title: "Dàn Âm Thanh Karaoke Tiệc Sân Vườn Biệt Thự",
    category: "karaoke",
    categoryLabel: "Karaoke Sân Vườn",
    image: imgKaraokeSanVuon,
    caption: "Hệ thống loa full Bass 30cm, micro Shure cao cấp và đèn Par Led tạo không khí sôi động cho tiệc sinh nhật 50 người.",
    eventScale: "50 khách • Biệt thự sân vườn",
  },
  {
    id: "gal-3",
    title: "Trang Trí Backdrop Cưới & Lối Đi Hoa Sang Trọng",
    category: "wedding",
    categoryLabel: "Trang Trí Sân Khấu",
    image: imgTrangTriSanKhau,
    caption: "Tone màu trắng kem thanh lịch kết hợp đèn rọi nghệ thuật, tôn vinh từng khoảnh khắc ngọt ngào của đôi uyên ương.",
    eventScale: "300 khách • Hội trường tư gia",
  },
  {
    id: "gal-4",
    title: "Ánh Sáng Moving Head & Laser Show Sân Khấu Ca Nhạc",
    category: "lighting",
    categoryLabel: "Ánh Sáng Sân Khấu",
    image: imgAnhSangSanKhau,
    caption: "Dàn 8 Beam 260 + 16 Par Led đổi màu đồng bộ theo giai điệu DJ và ca sĩ biểu diễn.",
    eventScale: "600 khách • Tiệc tất niên công ty",
  },
  {
    id: "gal-5",
    title: "Khoảnh Khắc Cắt Bánh Cưới Với Pháo Sáng Điện Tử",
    category: "effects",
    categoryLabel: "Hiệu Ứng Sân Khấu",
    image: imgHieuUngSanKhau,
    caption: "Pháo sáng điện tử thế hệ mới không khói, không mùi hôi, tuyệt đối an toàn trong phòng kín và tạo điểm nhấn bùng nổ.",
    eventScale: "Nghi thức lễ cưới & Sinh nhật",
  },
  {
    id: "gal-6",
    title: "Hệ Thống Loa Line Array Đẳng Cấp Cho Sự Kiện Lớn",
    category: "lighting",
    categoryLabel: "Sự Kiện Ngoài Trời",
    image: imgSuKienNgoaiTroi,
    caption: "Dàn âm thanh Line Array công suất khủng, phủ âm đều khắp không gian hơn 1000m² mà không bị chói gắt.",
    eventScale: "1000+ khách • Gala Ngoài Trời",
  },
  {
    id: "gal-7",
    title: "Gói Karaoke Gia Đình Tiệc Thôi Nôi Ấm Cúng",
    category: "karaoke",
    categoryLabel: "Karaoke Gia Đình",
    image: imgKaraokeGiaDinh,
    caption: "Gọn gàng, thẩm mỹ, chọn bài trên màn hình cảm ứng, người lớn tuổi và trẻ em đều dễ dàng hát vang những bản nhạc yêu thích.",
    eventScale: "25 khách • Phòng khách gia đình",
  },
  {
    id: "gal-8",
    title: "Ánh Sáng Sân Khấu Gala Dinner & Hội Nghị Khách Hàng",
    category: "lighting",
    categoryLabel: "Hội Nghị & Gala",
    image: imgHoiNghiGala,
    caption: "Không gian tiệc sang trọng chuẩn 5 sao với ánh sáng vàng ấm và âm thanh micro nói rõ từng chữ.",
    eventScale: "500 khách • Khách sạn 5 sao",
  },
];

export const StageGallery: React.FC<{ onBookNow: () => void }> = ({ onBookNow }) => {
  const [filter, setFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems = filter === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === filter);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-zinc-900/40 border-t border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Hình Ảnh Dự Án Thực Tế
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Khoảnh Khắc Sân Khấu Đáng Nhớ
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-xl">
              Chiêm ngưỡng các dự án tiệc cưới lãng mạn, sự kiện biểu diễn và dàn karaoke tiệc mà chúng tôi đã thực hiện trực tiếp.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Tất Cả" },
              { id: "wedding", label: "Tiệc Cưới & Backdrop" },
              { id: "karaoke", label: "Karaoke Tiệc" },
              { id: "lighting", label: "Ánh Sáng Sân Khấu" },
              { id: "effects", label: "Hiệu Ứng Khói & Pháo" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === f.id
                    ? "bg-amber-500 text-zinc-950 shadow-md font-bold"
                    : "bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 cursor-pointer shadow-lg hover:border-amber-500/50 transition-all duration-300"
            >
              <div className="aspect-[4/3] sm:aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Category pill */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-zinc-900/90 backdrop-blur-md text-amber-300 border border-amber-500/30 rounded-md text-[11px] font-semibold">
                  {item.categoryLabel}
                </span>
              </div>

              {/* Zoom icon on hover */}
              <div className="absolute top-3 right-3 p-1.5 bg-zinc-950/70 rounded-md text-zinc-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Bottom text */}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-[11px] text-amber-400 font-semibold mb-0.5">
                  {item.eventScale}
                </p>
                <h4 className="text-white text-sm font-bold line-clamp-2 leading-snug">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-zinc-950/70 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Bạn muốn không gian sự kiện của mình lung linh như thế này?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Liên hệ ngay để được khảo sát địa điểm miễn phí và lên layout âm thanh ánh sáng 3D theo yêu cầu.
            </p>
          </div>
          <button
            onClick={onBookNow}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold rounded-xl text-sm whitespace-nowrap shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            Nhận Tư Vấn Miễn Phí
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900/80 rounded-full cursor-pointer z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[65vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full max-h-[65vh] object-contain"
              />
            </div>

            <div className="p-6 bg-zinc-950 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md text-xs font-semibold">
                  {selectedImage.categoryLabel} • {selectedImage.eventScale}
                </span>
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    onBookNow();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold text-xs rounded-lg cursor-pointer"
                >
                  Tư Vấn Gói Này
                </button>
              </div>

              <h3 className="text-xl font-bold text-white">{selectedImage.title}</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{selectedImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
