import React from "react";
import { Phone, MessageCircle, Facebook, Calendar, Bot } from "lucide-react";
import { ContactSettings } from "../types";

interface FloatingContactBarProps {
  settings: ContactSettings;
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

export const FloatingContactBar: React.FC<FloatingContactBarProps> = ({
  settings,
  onOpenBooking,
  onOpenChat,
}) => {
  return (
    <>
      {/* Desktop Left/Right Quick Contact Widget */}
      <div className="hidden sm:flex flex-col fixed bottom-24 left-6 z-40 gap-3">
        {/* Hot Quick Call Button with Ripple Effect */}
        <a
          href={`tel:${settings.hotline}`}
          className="relative group flex items-center"
          title="Gọi nhanh trực tiếp"
        >
          <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping" />
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:scale-110 transition-transform">
            <Phone className="w-5 h-5 animate-bounce" />
          </div>
          <span className="ml-3 px-3 py-1.5 bg-zinc-900/90 text-white text-xs font-bold rounded-lg border border-zinc-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Gọi ngay: {settings.phoneDisplay}
          </span>
        </a>

        {/* Zalo Button */}
        <a
          href={settings.zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group flex items-center"
          title="Tư vấn qua Zalo"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/30 hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="ml-3 px-3 py-1.5 bg-zinc-900/90 text-white text-xs font-bold rounded-lg border border-zinc-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat Zalo 24/7
          </span>
        </a>

        {/* Facebook Button */}
        <a
          href={settings.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group flex items-center"
          title="Fanpage Facebook"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 hover:scale-110 transition-transform">
            <Facebook className="w-5 h-5" />
          </div>
          <span className="ml-3 px-3 py-1.5 bg-zinc-900/90 text-white text-xs font-bold rounded-lg border border-zinc-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Xem Fanpage Facebook
          </span>
        </a>
      </div>

      {/* Mobile Bottom Fixed Bar (Sticky Dock for High Conversion) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 px-3 py-2 flex items-center justify-around gap-1 shadow-2xl">
        <a
          href={`tel:${settings.hotline}`}
          className="flex-1 py-2 px-1 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold rounded-xl text-center flex flex-col items-center justify-center shadow-md shadow-emerald-600/20"
        >
          <Phone className="w-4 h-4 mb-0.5 animate-pulse" />
          <span className="text-[11px] leading-tight">Gọi Ngay</span>
        </a>

        <a
          href={settings.zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-1 bg-blue-600 text-white font-bold rounded-xl text-center flex flex-col items-center justify-center shadow-md shadow-blue-600/20"
        >
          <MessageCircle className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] leading-tight">Zalo</span>
        </a>

        <button
          onClick={onOpenBooking}
          className="flex-1 py-2 px-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-extrabold rounded-xl text-center flex flex-col items-center justify-center shadow-md shadow-amber-500/20"
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] leading-tight">Báo Giá</span>
        </button>

        <button
          onClick={onOpenChat}
          className="flex-1 py-2 px-1 bg-zinc-800 text-amber-400 border border-zinc-700 font-semibold rounded-xl text-center flex flex-col items-center justify-center"
        >
          <Bot className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] leading-tight">Chat AI</span>
        </button>
      </div>
    </>
  );
};
