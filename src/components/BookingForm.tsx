import React, { useState, useEffect } from "react";
import { Send, CheckCircle2, Phone, Calendar, MapPin, Users, Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import { ServiceItem, ContactSettings } from "../types";

interface BookingFormProps {
  services: ServiceItem[];
  settings: ContactSettings;
  selectedService: ServiceItem | null;
  estimateNote?: string;
  onSuccessSubmit: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  services,
  settings,
  selectedService,
  estimateNote,
  onSuccessSubmit,
}) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("Tiệc Cưới & Đính Hôn");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [guestCount, setGuestCount] = useState<string>("50 - 100 khách");
  const [serviceId, setServiceId] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (selectedService) {
      setServiceId(selectedService.id);
      if (selectedService.category === "wedding") {
        setEventType("Tiệc Cưới & Đính Hôn");
      } else if (selectedService.category === "karaoke") {
        setEventType("Karaoke Tiệc Gia Đình / Sinh Nhật");
      } else {
        setEventType("Sự Kiện & Tất Niên");
      }
    }
  }, [selectedService]);

  useEffect(() => {
    if (estimateNote) {
      setNotes((prev) => (prev ? `${prev}\n[Dự toán]: ${estimateNote}` : `[Dự toán đã chọn]: ${estimateNote}`));
    }
  }, [estimateNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg("Vui lòng điền Họ tên và Số điện thoại để nhân viên liên hệ tư vấn.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        eventType,
        eventDate: eventDate || new Date().toISOString().split("T")[0],
        location: location.trim() || "Chưa cung cấp địa chỉ cụ thể",
        guestCount: parseInt(guestCount) || 50,
        serviceId: serviceId || undefined,
        notes: notes.trim(),
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể gửi dữ liệu, vui lòng thử lại.");
      }

      setSubmitted(true);
      onSuccessSubmit();
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi khi gửi yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="py-16 sm:py-24 bg-zinc-900/60 border-t border-zinc-800 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {submitted ? (
            <div className="text-center py-12 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Đăng Ký Đặt Lịch Thành Công!
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 max-w-lg mx-auto leading-relaxed">
                Cảm ơn bạn <strong className="text-amber-400">{fullName}</strong>. Chuyên viên kỹ thuật âm thanh ánh sáng của chúng tôi sẽ gọi lại theo số <strong className="text-amber-400">{phone}</strong> trong vòng 5 - 10 phút để xác nhận chi tiết kịch bản và báo giá ưu đãi nhất!
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <a
                  href={`tel:${settings.hotline}`}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Phone className="w-4 h-4" />
                  <span>Gọi Xác Nhận Ngay: {settings.phoneDisplay}</span>
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFullName("");
                    setPhone("");
                    setNotes("");
                  }}
                  className="px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Gửi Yêu Cầu Khác
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Đăng Ký Nhận Tư Vấn & Giữ Lịch
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Để Lại Thông Tin - Nhận Báo Giá Sau 5 Phút
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Chúng tôi bảo mật 100% số điện thoại và cam kết tư vấn đúng nhu cầu, không chèo kéo, không phát sinh chi phí.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Họ và tên */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      Họ Và Tên Của Bạn <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Anh Hoàng / Chị Thảo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      Số Điện Thoại (Zalo) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0987 654 321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Loại sự kiện */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      Loại Hình Sự Kiện
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3.5 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="Tiệc Cưới & Đính Hôn">Tiệc Cưới & Đính Hôn</option>
                      <option value="Karaoke Tiệc Gia Đình">Karaoke Tiệc Gia Đình</option>
                      <option value="Sinh Nhật / Thôi Nôi">Sinh Nhật / Thôi Nôi</option>
                      <option value="Tiệc Tất Niên / Tân Niên">Tiệc Tất Niên / Tân Niên</option>
                      <option value="Sự Kiện Khai Trương / Hội Nghị">Sự Kiện Khai Trương / Hội Nghị</option>
                      <option value="Khác">Nhu cầu khác</option>
                    </select>
                  </div>

                  {/* Ngày tổ chức */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      Ngày Tổ Chức Dự Kiến
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-3.5 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Quy mô khách */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      Số Lượng Khách Dự Kiến
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full px-3.5 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="20">Dưới 30 khách (Gia đình)</option>
                      <option value="60">30 - 80 khách (Vừa)</option>
                      <option value="200">100 - 300 khách (Tiệc cưới)</option>
                      <option value="500">300 - 600 khách (VIP)</option>
                      <option value="1000">Trên 600 khách (Sự kiện lớn)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Địa điểm */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      Địa Điểm Tổ Chức (Quận / Huyện / Tỉnh)
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Q. Tân Bình, TP.HCM hoặc Hà Đông, Hà Nội"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Gói dịch vụ quan tâm */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      Gói Dịch Vụ Quan Tâm (Nếu có)
                    </label>
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      className="w-full px-3.5 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Để kỹ thuật viên tư vấn gói tối ưu nhất --</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({new Intl.NumberFormat("vi-VN").format(s.price)}đ)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Yêu Cầu Riêng Hoặc Ghi Chú Kịch Bản
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Cần thêm 2 micro dự phòng, muốn test nhạc trước 2 tiếng, cần máy khói lạnh cho cô dâu chú rể..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-zinc-950 font-black rounded-xl text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer transition-all transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <span>Đang gửi thông tin...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Gửi Thông Tin - Nhận Báo Giá Chi Tiết Ngay</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-zinc-500 mt-2">
                    ⚡ Phản hồi siêu tốc trong 5 phút qua Zalo hoặc Cuộc gọi trực tiếp.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
