import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Phone, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { ContactSettings, ChatMessage } from "../types";

interface ChatbotWidgetProps {
  settings: ContactSettings;
  onOpenBooking: () => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ settings, onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: `Xin chào quý khách! Em là Trợ lý Tư vấn Dàn Loa B-52 của ${settings.brandName}. Quý khách đang tìm dàn B-52 công nghệ Mỹ cho tiệc gia đình, tiệc cưới hay sự kiện ạ? Em sẵn sàng báo giá chi tiết ngay!`,
      timestamp: "Vừa xong",
      suggestions: [
        "Giá thuê dàn loa B-52?",
        "Loa B-52 có bị hú không?",
        "Báo giá âm thanh tiệc cưới 200 khách",
        "Có kỹ thuật viên trực suốt tiệc không?",
      ],
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || inputVal;
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.reply || "Dạ em đã ghi nhận, chuyên viên sẽ phản hồi thêm hoặc anh/chị có thể gọi ngay hotline để được tư vấn tức thì ạ!",
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorBotMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: `Dạ kết nối hơi chập chờn một chút. Quý khách vui lòng gọi ngay hotline ${settings.phoneDisplay} hoặc nhắn tin Zalo để được tư vấn tức thì nhé!`,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-5 sm:bottom-6 sm:right-6 z-40 p-4 bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 font-bold rounded-full shadow-2xl shadow-amber-500/30 hover:scale-110 transition-all cursor-pointer flex items-center gap-2 group"
          title="Tư vấn trực tiếp 24/7"
        >
          <Bot className="w-6 h-6" />
          <span className="hidden sm:inline-block text-xs font-extrabold pr-1">
            Tư Vấn Tức Thì 24/7
          </span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-zinc-950 animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm h-[520px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-4 text-zinc-950 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-zinc-950/20 flex items-center justify-center text-zinc-950">
                <Bot className="w-5 h-5 text-zinc-950" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight">Trợ Lý Âm Thanh Ánh Sáng</h4>
                <p className="text-[11px] font-semibold text-zinc-900/80 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
                  Đang trực tuyến • Trả lời tự động 24/7
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-black/15 text-zinc-950 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="max-w-[80%] space-y-2">
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-amber-500 text-zinc-950 font-medium rounded-tr-none shadow-md"
                        : "bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700/60"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Suggestions Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(sug)}
                          className="text-[11px] bg-zinc-800/90 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 px-2.5 py-1.5 rounded-lg border border-zinc-700/80 transition-all text-left cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-zinc-500 block px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-zinc-800/50 p-2.5 rounded-xl w-fit border border-zinc-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Trợ lý đang phân tích & soạn câu trả lời...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Direct Actions Footer */}
          <div className="bg-zinc-950 p-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <a
              href={`tel:${settings.hotline}`}
              className="flex items-center gap-1.5 text-amber-400 hover:underline font-semibold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi: {settings.phoneDisplay}</span>
            </a>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBooking();
              }}
              className="flex items-center gap-1 text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              <span>Điền Form Đặt Lịch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi cần tư vấn..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 rounded-xl cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
