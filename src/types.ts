export interface ServiceItem {
  id: string;
  title: string;
  category: "karaoke" | "wedding" | "lighting" | "stage_effects";
  price: number;
  originalPrice?: number;
  unit: string;
  badge?: string;
  image: string;
  shortDesc: string;
  specs: string[];
  recommendedFor: string;
  isPopular?: boolean;
}

export interface LeadItem {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate: string;
  location: string;
  guestCount?: number;
  serviceId?: string;
  notes?: string;
  status: "new" | "contacted" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface ContactSettings {
  brandName: string;
  tagline: string;
  hotline: string;
  phoneDisplay: string;
  zaloPhone: string;
  zaloLink: string;
  facebookUrl: string;
  messengerUrl: string;
  address: string;
  workingHours: string;
  email: string;
  announcement: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  suggestions?: string[];
}
