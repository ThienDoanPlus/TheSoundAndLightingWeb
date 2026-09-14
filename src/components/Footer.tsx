import React from "react";
import { Phone, Mail, MapPin, Clock, Volume2, Shield, Heart, Facebook, MessageCircle } from "lucide-react";
import { ContactSettings } from "../types";

interface FooterProps {
  settings: ContactSettings;
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin, onNavigate }) => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/80 pt-16 pb-28 sm:pb-16 text-zinc-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-amber-400">
                  <Volume2 className="w-5 h-5" />
                </div>
              </div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                {settings.brandName}
              </span>
            </div>

            <p className="text-zinc-400 leading-relaxed text-xs">
              Đơn vị tiên phong trong lĩnh vực cho thuê âm thanh karaoke gia đình, ánh sáng sân khấu biểu diễn và trang trí tiệc cưới sang trọng. Cam kết thiết bị mới đẹp, âm thanh trung thực không hú rít, phục vụ tận tâm 24/7.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-800 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-800 transition-colors"
                title="Zalo"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${settings.hotline}`}
                className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-800 transition-colors"
                title="Gọi Hotline"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Dịch Vụ Nổi Bật
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  • Cho thuê dàn karaoke gia đình & sinh nhật (từ 1.5tr)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  • Âm thanh ánh sáng tiệc cưới tiêu chuẩn & VIP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  • Trang trí backdrop & màn sao sân khấu đám cưới
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  • Hiệu ứng khói lạnh CO2 & pháo sáng điện tử tiệc cưới
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("calculator")}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  • Công cụ tính toán dự toán chi phí tự động
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Thông Tin Liên Hệ Trực Tiếp
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Hotline tư vấn 24/7:</p>
                  <a href={`tel:${settings.hotline}`} className="text-amber-400 font-bold hover:underline">
                    {settings.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Zalo kỹ thuật:</p>
                  <a href={settings.zaloLink} target="_blank" rel="noopener noreferrer" className="hover:underline text-zinc-300">
                    {settings.zaloPhone} (Nhắn tin ngay)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Hòm thư báo giá:</p>
                  <p className="text-zinc-300">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Khu vực phục vụ:</p>
                  <p className="text-zinc-300">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Thời gian làm việc:</p>
                  <p className="text-zinc-300">{settings.workingHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Commitments */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Cam Kết Vàng
            </h4>
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs">
              <p className="text-zinc-200 font-semibold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400" />
                Chuẩn Thiết Bị - Đúng Kịch Bản
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Hoàn tiền 100% nếu âm thanh bị hú rè, micro chập chờn hoặc kỹ thuật viên đến trễ làm ảnh hưởng đến thời gian tổ chức tiệc của quý khách.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>Cổng Quản Trị Hệ Thống (Admin)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© 2026 {settings.brandName}. Bản quyền thuộc về dịch vụ âm thanh ánh sáng sự kiện chuyên nghiệp.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Phục vụ bằng cả cái tâm <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </span>
            <button onClick={onOpenAdmin} className="hover:underline text-zinc-400">
              Quản Trị Viên
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
