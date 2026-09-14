import React, { useState } from "react";
import { Phone, MessageCircle, Menu, X, Shield, Sparkles, Volume2 } from "lucide-react";
import { ContactSettings } from "../types";

interface NavbarProps {
  settings: ContactSettings;
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onOpenAdmin, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      {/* Top Announcement Bar */}
      {settings.announcement && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs sm:text-sm font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
          <span>{settings.announcement}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-amber-400">
                <Volume2 className="w-6 h-6" />
              </div>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                {settings.brandName}
              </span>
              <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
                Âm Thanh • Ánh Sáng • Trang Trí Tiệc Cưới
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <button 
              onClick={() => handleNavClick("services")}
              className="hover:text-amber-400 transition-colors py-1 cursor-pointer"
            >
              Dịch Vụ & Báo Giá
            </button>
            <button 
              onClick={() => handleNavClick("gallery")}
              className="hover:text-amber-400 transition-colors py-1 cursor-pointer"
            >
              Hình Ảnh Thực Tế
            </button>
            <button 
              onClick={() => handleNavClick("calculator")}
              className="hover:text-amber-400 transition-colors py-1 cursor-pointer"
            >
              Dự Toán Chi Phí
            </button>
            <button 
              onClick={() => handleNavClick("booking")}
              className="hover:text-amber-400 transition-colors py-1 cursor-pointer"
            >
              Đăng Ký Tư Vấn
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium border border-zinc-800"
              title="Khu vực Quản trị viên"
            >
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Quản Trị</span>
            </button>

            <a
              href={settings.zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Zalo</span>
            </a>

            <a
              href={`tel:${settings.hotline}`}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span>{settings.phoneDisplay}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800"
              title="Quản trị"
            >
              <Shield className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-zinc-800 bg-zinc-950/95 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick("services")}
            className="w-full text-left py-2.5 px-3 rounded-lg text-zinc-200 hover:bg-zinc-900 font-medium"
          >
            Dịch Vụ & Báo Giá
          </button>
          <button
            onClick={() => handleNavClick("gallery")}
            className="w-full text-left py-2.5 px-3 rounded-lg text-zinc-200 hover:bg-zinc-900 font-medium"
          >
            Hình Ảnh Sự Kiện Thực Tế
          </button>
          <button
            onClick={() => handleNavClick("calculator")}
            className="w-full text-left py-2.5 px-3 rounded-lg text-zinc-200 hover:bg-zinc-900 font-medium"
          >
            Dự Toán Chi Phí Tức Thì
          </button>
          <button
            onClick={() => handleNavClick("booking")}
            className="w-full text-left py-2.5 px-3 rounded-lg text-zinc-200 hover:bg-zinc-900 font-medium"
          >
            Đăng Ký Đặt Lịch Tư Vấn
          </button>

          <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2">
            <a
              href={`tel:${settings.hotline}`}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold rounded-xl text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi Nhanh: {settings.phoneDisplay}</span>
            </a>
            <a
              href={settings.zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-center flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Nhắn Tin Zalo Tư Vấn</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
