import React, { useState } from "react";
import { 
  X, Plus, Trash2, Edit3, Save, Phone, Calendar, Mail, 
  MapPin, Users, CheckCircle, RefreshCw, Layers, Sliders, Shield, Tag, LogOut, Key
} from "lucide-react";
import { ServiceItem, LeadItem, ContactSettings } from "../types";

interface AdminPanelProps {
  services: ServiceItem[];
  leads: LeadItem[];
  settings: ContactSettings;
  onClose: () => void;
  onRefreshData: () => void;
  onUpdateSettings: (newSettings: ContactSettings) => Promise<void>;
  onSaveService: (service: ServiceItem, isNew: boolean) => Promise<void>;
  onDeleteService: (serviceId: string) => Promise<void>;
  onUpdateLeadStatus: (leadId: string, newStatus: LeadItem["status"]) => Promise<void>;
  onDeleteLead: (leadId: string) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  services,
  leads,
  settings,
  onClose,
  onRefreshData,
  onUpdateSettings,
  onSaveService,
  onDeleteService,
  onUpdateLeadStatus,
  onDeleteLead,
}) => {
  const [activeTab, setActiveTab] = useState<"services" | "leads" | "settings">("services");
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("adminToken"));
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
        onRefreshData(); // Fetch leads and other protected data
      } else {
        setLoginError(data.error || "Đăng nhập thất bại");
      }
    } catch (err) {
      setLoginError("Lỗi kết nối đến máy chủ");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<ContactSettings>({ ...settings });
  const [savingSettings, setSavingSettings] = useState(false);

  // Service edit/create state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNewService, setIsNewService] = useState(false);
  const [savingService, setSavingService] = useState(false);
  const [specsText, setSpecsText] = useState("");

  // Lead filter
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("all");

  const startEditService = (srv: ServiceItem) => {
    setEditingService({ ...srv });
    setSpecsText(srv.specs.join("\n"));
    setIsNewService(false);
  };

  const startNewService = () => {
    const fresh: ServiceItem = {
      id: `srv-${Date.now()}`,
      title: "",
      category: "karaoke",
      price: 2000000,
      originalPrice: 2500000,
      unit: "buổi",
      badge: "Mới",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      shortDesc: "",
      specs: ["2 Loa công suất lớn", "2 Micro Shure chống hú", "Kỹ thuật viên trực"],
      recommendedFor: "Phù hợp tiệc 20 - 50 khách",
      isPopular: false,
    };
    setEditingService(fresh);
    setSpecsText(fresh.specs.join("\n"));
    setIsNewService(true);
  };

  const handleSaveServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setSavingService(true);
    try {
      const specsArray = specsText
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const toSave: ServiceItem = {
        ...editingService,
        specs: specsArray.length > 0 ? specsArray : ["Thiết bị chuẩn chất lượng"],
      };

      await onSaveService(toSave, isNewService);
      setEditingService(null);
    } catch (err) {
      alert("Không thể lưu dịch vụ: " + err);
    } finally {
      setSavingService(false);
    }
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await onUpdateSettings(settingsForm);
      alert("Đã cập nhật thông tin liên hệ thành công!");
    } catch (err) {
      alert("Lỗi khi lưu cài đặt: " + err);
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredLeads = leadStatusFilter === "all"
    ? leads
    : leads.filter((l) => l.status === leadStatusFilter);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white text-center">Xác Thực Quản Trị Viên</h2>
            <p className="text-sm text-zinc-400 text-center mt-1">Vui lòng nhập mật khẩu để truy cập Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  autoFocus
                />
              </div>
              {loginError && <p className="text-red-400 text-sm mt-2">{loginError}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isLoggingIn || !password}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? "Đang kiểm tra..." : "Đăng Nhập"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="bg-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                Hệ Thống Quản Trị Viên (Admin Panel)
              </h2>
              <p className="text-xs text-zinc-400">
                Quản lý bảng giá, gói dịch vụ & danh sách khách hàng tiềm năng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshData}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg cursor-pointer transition-colors"
              title="Tải lại dữ liệu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-400 hover:text-red-400 bg-zinc-800 rounded-lg cursor-pointer transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="bg-zinc-900/60 px-6 pt-3 border-b border-zinc-800/80 flex gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("services")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "services"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Quản Lý Dịch Vụ & Báo Giá ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "leads"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Khách Hàng Đăng Ký (Leads: {leads.length})</span>
            {leads.filter((l) => l.status === "new").length > 0 && (
              <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full">
                {leads.filter((l) => l.status === "new").length} mới
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "settings"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Cấu Hình Hotline & Liên Hệ</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: SERVICES MANAGEMENT */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Danh sách các gói dịch vụ hiển thị trên web</h3>
                  <p className="text-xs text-zinc-400">Bạn có thể sửa giá, cập nhật hình ảnh, thông số loa mic hoặc thêm gói mới.</p>
                </div>
                <button
                  onClick={startNewService}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Gói Mới</span>
                </button>
              </div>

              {/* Service List Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div key={srv.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4 items-start">
                    <img
                      src={srv.image}
                      alt={srv.title}
                      className="w-24 h-24 object-cover rounded-lg shrink-0 bg-zinc-800"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] font-semibold rounded uppercase">
                          {srv.category}
                        </span>
                        {srv.badge && (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                            {srv.badge}
                          </span>
                        )}
                        {srv.isPopular && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded">
                            Hot
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">{srv.title}</h4>
                      <p className="text-xs font-black text-amber-400">
                        {new Intl.NumberFormat("vi-VN").format(srv.price)}đ / {srv.unit}
                      </p>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">{srv.shortDesc}</p>
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => startEditService(srv)}
                          className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Chỉnh sửa</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn xóa dịch vụ "${srv.title}"?`)) {
                              onDeleteService(srv.id);
                            }
                          }}
                          className="px-3 py-1 bg-red-950/40 hover:bg-red-900 text-red-400 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer border border-red-900/50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LEADS CRM */}
          {activeTab === "leads" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Danh Sách Khách Hàng Đăng Ký Tư Vấn</h3>
                  <p className="text-xs text-zinc-400">Theo dõi thông tin, ngày tổ chức tiệc và cập nhật tiến độ tư vấn chốt lịch.</p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Lọc theo:</span>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg focus:outline-none"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="new">Mới đăng ký</option>
                    <option value="contacted">Đã liên hệ</option>
                    <option value="confirmed">Đã chốt cọc</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>

              {filteredLeads.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                  <Users className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400 font-medium">Chưa có khách hàng nào trong mục này</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm sm:text-base font-extrabold text-white">{lead.fullName}</h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              lead.status === "new"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                                : lead.status === "contacted"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : lead.status === "confirmed"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {lead.status === "new"
                              ? "Chờ gọi tư vấn"
                              : lead.status === "contacted"
                              ? "Đã tư vấn"
                              : lead.status === "confirmed"
                              ? "Đã chốt cọc giữ lịch"
                              : lead.status === "completed"
                              ? "Tiệc hoàn tất"
                              : "Đã hủy"}
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {new Date(lead.createdAt).toLocaleDateString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-zinc-300">
                          <p className="flex items-center gap-1.5 font-bold text-amber-400">
                            <Phone className="w-3.5 h-3.5" />
                            <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Ngày tiệc: <strong>{lead.eventDate}</strong></span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="truncate">{lead.location}</span>
                          </p>
                        </div>

                        <div className="text-xs text-zinc-400 pt-1">
                          <span className="text-zinc-200 font-semibold">Loại hình:</span> {lead.eventType} • {lead.guestCount ? `${lead.guestCount} khách` : "Quy mô vừa"}
                          {lead.notes && (
                            <p className="text-zinc-300 mt-1 bg-zinc-950 p-2 rounded-lg border border-zinc-800 italic">
                              "{lead.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status changer & actions */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                          className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 text-xs text-zinc-200 rounded-lg focus:outline-none"
                        >
                          <option value="new">Mới đăng ký</option>
                          <option value="contacted">Đã liên hệ</option>
                          <option value="confirmed">Đã cọc</option>
                          <option value="completed">Hoàn thành</option>
                          <option value="cancelled">Hủy</option>
                        </select>

                        <div className="flex gap-2">
                          <a
                            href={`tel:${lead.phone}`}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Gọi</span>
                          </a>

                          <a
                            href={`https://zalo.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1"
                          >
                            <span>Zalo</span>
                          </a>

                          <button
                            onClick={() => {
                              if (confirm("Bạn có chắc chắn muốn xóa thông tin khách hàng này?")) {
                                onDeleteLead(lead.id);
                              }
                            }}
                            className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettingsSubmit} className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Cấu Hình Thông Tin Doanh Nghiệp & Hotline</h3>
                <p className="text-xs text-zinc-400">Các thông tin này sẽ cập nhật trực tiếp lên các nút bấm Gọi Nhanh, Zalo, và Footer.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">Tên Thương Hiệu</label>
                  <input
                    type="text"
                    value={settingsForm.brandName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">Hotline (Số bấm gọi điện)</label>
                  <input
                    type="text"
                    value={settingsForm.hotline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hotline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">Số Điện Thoại Hiển Thị (Format)</label>
                  <input
                    type="text"
                    value={settingsForm.phoneDisplay}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phoneDisplay: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">Link Trực Tiếp Zalo (VD: https://zalo.me/0987654321)</label>
                  <input
                    type="text"
                    value={settingsForm.zaloLink}
                    onChange={(e) => setSettingsForm({ ...settingsForm, zaloLink: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">Link Facebook Fanpage</label>
                  <input
                    type="text"
                    value={settingsForm.facebookUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">Email Hỗ Trợ Báo Giá</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">Địa Chỉ Kho & Khu Vực Phục Vụ</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">Thanh Thông Báo / Khuyến Mãi Đầu Trang</label>
                <input
                  type="text"
                  value={settingsForm.announcement}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? "Đang lưu..." : "Lưu Thay Đổi Cấu Hình"}</span>
              </button>
            </form>
          )}
        </div>

        {/* Modal: Edit or Add Service */}
        {editingService && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h3 className="text-base font-bold text-white">
                  {isNewService ? "Thêm Gói Dịch Vụ Mới" : `Chỉnh Sửa: ${editingService.title}`}
                </h3>
                <button
                  onClick={() => setEditingService(null)}
                  className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveServiceSubmit} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">Tên Gói Dịch Vụ</label>
                  <input
                    type="text"
                    required
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">Phân Loại</label>
                    <select
                      value={editingService.category}
                      onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                    >
                      <option value="karaoke">Dàn Karaoke Tiệc</option>
                      <option value="wedding">Âm Thanh & Tiệc Cưới</option>
                      <option value="lighting">Ánh Sáng Sân Khấu</option>
                      <option value="stage_effects">Hiệu Ứng Sân Khấu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">Đơn Vị Tính (VD: buổi, show, tiệc)</label>
                    <input
                      type="text"
                      value={editingService.unit}
                      onChange={(e) => setEditingService({ ...editingService, unit: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">Giá Thuê (VNĐ)</label>
                    <input
                      type="number"
                      required
                      value={editingService.price}
                      onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">Giá Gốc / Chưa Giảm (Nếu có)</label>
                    <input
                      type="number"
                      value={editingService.originalPrice || ""}
                      onChange={(e) => setEditingService({ ...editingService, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">Huy Hiệu (Badge: Bán chạy, Tiết kiệm...)</label>
                    <input
                      type="text"
                      value={editingService.badge || ""}
                      onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">Gói Nổi Bật (Hot)</label>
                    <label className="flex items-center gap-2 mt-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingService.isPopular}
                        onChange={(e) => setEditingService({ ...editingService, isPopular: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500"
                      />
                      <span>Đánh dấu là gói Bán Chạy Nhất</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">Link Ảnh Đại Diện (URL ảnh)</label>
                  <input
                    type="url"
                    required
                    value={editingService.image}
                    onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">Mô Tả Ngắn</label>
                  <textarea
                    rows={2}
                    value={editingService.shortDesc}
                    onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">Cấu Hình Thiết Bị (Mỗi dòng 1 món thiết bị)</label>
                  <textarea
                    rows={4}
                    value={specsText}
                    onChange={(e) => setSpecsText(e.target.value)}
                    placeholder="2 Loa Full Bass 30cm&#10;1 Cục đẩy công suất & Vang số&#10;2 Micro Shure cao cấp..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white font-mono text-xs"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={savingService}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold rounded-xl text-sm cursor-pointer"
                  >
                    {savingService ? "Đang lưu..." : "Lưu Dịch Vụ Vào Hệ Thống"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-4 py-3 bg-zinc-800 text-zinc-300 rounded-xl text-sm cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
