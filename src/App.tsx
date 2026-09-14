import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HeroBanner } from "./components/HeroBanner";
import { ServiceCatalog } from "./components/ServiceCatalog";
import { StageGallery } from "./components/StageGallery";
import { PriceCalculator } from "./components/PriceCalculator";
import { BookingForm } from "./components/BookingForm";
import { ChatbotWidget } from "./components/ChatbotWidget";
import { FloatingContactBar } from "./components/FloatingContactBar";
import { AdminPanel } from "./components/AdminPanel";
import { Footer } from "./components/Footer";
import { ServiceItem, LeadItem, ContactSettings } from "./types";

const DEFAULT_SETTINGS: ContactSettings = {
  brandName: "Âm thanh & Ánh sáng Anh Tý",
  tagline: "Dịch Vụ Âm Thanh Ánh Sáng & Trang Trí Sự Kiện Chuyên Nghiệp",
  hotline: "0911491468",
  phoneDisplay: "0911.491.468",
  zaloPhone: "0911491468",
  zaloLink: "https://zalo.me/0911491468",
  facebookUrl: "https://www.facebook.com/dan.nhac.van.ty",
  messengerUrl: "https://www.facebook.com/messages/e2ee/t/8840816119366783",
  address: "Gần UBND xã Nghĩa Mỹ cũ, huyện Tư Nghĩa, tỉnh Quảng Ngãi",
  workingHours: "07:30 - 23:30 (Tất cả các ngày trong tuần & ngày lễ)",
  email: "anhsanganhty@gmail.com",
  announcement: "🔥 Ưu đãi giảm 15% cho khách hàng đặt lịch âm thanh ánh sáng & tiệc cưới trong tháng này!",
};

export default function App() {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_SETTINGS);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [estimateNote, setEstimateNote] = useState<string>("");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch all initial data from server
  const loadData = async () => {
    try {
      const [settingsRes, servicesRes, leadsRes] = await Promise.all([
        fetch("/api/settings").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/services").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/leads", { headers: getAuthHeaders() }).then((r) => (r.ok ? r.json() : null)),
      ]);

      if (settingsRes) setSettings(settingsRes);
      if (Array.isArray(servicesRes) && servicesRes.length > 0) setServices(servicesRes);
      if (Array.isArray(leadsRes)) setLeads(leadsRes);
    } catch (err) {
      console.warn("Could not load from server, using local defaults:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectServiceForBooking = (service: ServiceItem) => {
    setSelectedService(service);
    scrollToSection("booking");
  };

  const handleApplyEstimate = (summary: string, totalBudget: number) => {
    setEstimateNote(`${summary} - Tổng dự toán tạm tính: ${new Intl.NumberFormat("vi-VN").format(totalBudget)}đ`);
    scrollToSection("booking");
  };

  // Admin Actions
  const handleUpdateSettings = async (newSettings: ContactSettings) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        setSettings(newSettings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveService = async (service: ServiceItem, isNew: boolean) => {
    try {
      const url = isNew ? "/api/services" : `/api/services/${service.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(service),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== serviceId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: LeadItem["status"]) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Navigation */}
      <Navbar
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigate={scrollToSection}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroBanner
          settings={settings}
          onExploreServices={() => scrollToSection("services")}
          onBookNow={() => scrollToSection("booking")}
        />

        {/* 2. Service Catalog & Transparent Pricing */}
        <ServiceCatalog
          services={services}
          settings={settings}
          onSelectServiceForBooking={handleSelectServiceForBooking}
        />

        {/* 3. Real Event Photography Gallery */}
        <StageGallery onBookNow={() => scrollToSection("booking")} />

        {/* 4. Interactive Price Calculator */}
        <PriceCalculator onApplyEstimate={handleApplyEstimate} />

        {/* 5. Lead Capture & Booking Form */}
        <BookingForm
          services={services}
          settings={settings}
          selectedService={selectedService}
          estimateNote={estimateNote}
          onSuccessSubmit={loadData}
        />
      </main>

      {/* Floating Elements */}
      <FloatingContactBar
        settings={settings}
        onOpenBooking={() => scrollToSection("booking")}
        onOpenChat={() => {
          // Open chat widget or trigger
          const chatBtn = document.querySelector('button[title="Tư vấn trực tiếp 24/7"]') as HTMLButtonElement;
          if (chatBtn) chatBtn.click();
        }}
      />

      {/* 24/7 AI Chatbot */}
      <ChatbotWidget
        settings={settings}
        onOpenBooking={() => scrollToSection("booking")}
      />

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanel
          services={services}
          leads={leads}
          settings={settings}
          onClose={() => setIsAdminOpen(false)}
          onRefreshData={loadData}
          onUpdateSettings={handleUpdateSettings}
          onSaveService={handleSaveService}
          onDeleteService={handleDeleteService}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onDeleteLead={handleDeleteLead}
        />
      )}

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigate={scrollToSection}
      />
    </div>
  );
}
