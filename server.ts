import express from "express";
import path from "path";
import Groq from "groq-sdk";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Authentication ---
const ADMIN_PASSWORD = "admin123";
const ADMIN_TOKEN = "admin-secret-token-" + Date.now();

app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: "Mật khẩu không chính xác" });
  }
});

const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: "Không có quyền truy cập" });
  }
};
// ----------------------

// In-memory / server-persisted storage with robust defaults
interface ServiceItem {
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

interface LeadItem {
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

interface ContactSettings {
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

let contactSettings: ContactSettings = {
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

let servicesList: ServiceItem[] = [
  {
    id: "srv-1",
    title: "Gói Karaoke Gia Đình B-52 Active Matrix",
    category: "karaoke",
    price: 1500000,
    originalPrice: 2000000,
    unit: "buổi (4 - 5 tiếng)",
    badge: "Tiết kiệm",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Dải mid sáng, bass đầm, chống hú 100%. Phù hợp tiệc gia đình, sinh nhật nhỏ, thôi nôi tại gia.",
    specs: [
      "2 Loa Full B-52 Bass 30cm công suất thực 800W - 1000W",
      "1 Cục đẩy B-52 & Vang số chống hú 100%",
      "Bộ 2 Micro không dây Shure chuyên nghiệp, nhẹ giọng",
      "Chọn bài qua iPad / Máy tính bảng & Màn hình TV",
      "Kỹ thuật viên giao lắp tận nhà & hướng dẫn chi tiết",
    ],
    recommendedFor: "Phù hợp tiệc từ 10 - 30 người, không gian phòng khách hoặc sân vườn nhỏ.",
    isPopular: false,
  },
  {
    id: "srv-2",
    title: "Gói B-52 Kèm Sub Hầm B-52 Uy Lực",
    category: "karaoke",
    price: 2500000,
    originalPrice: 3200000,
    unit: "buổi (4 - 6 tiếng)",
    badge: "Bán chạy nhất",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Sub hầm B-52 50cm rung chuyển không gian, tiếng bass sâu chắc nịch, kèm đèn Led rực rỡ.",
    specs: [
      "2 Loa Full B-52 cao cấp + 1 Loa Sub hầm B-52 50cm",
      "Bàn Mixer Digital thế hệ mới lọc âm chuẩn phòng thu",
      "2 Cặp micro không dây Shure bắt sóng xa, hát nhẹ",
      "2 Đèn Par Led 54 bóng đổi màu theo điệu nhạc",
      "1 Kỹ thuật viên túc trực điều chỉnh suốt bữa tiệc",
      "Hệ thống nguồn ổn định & dây dẫn chống nhiễu",
    ],
    recommendedFor: "Phù hợp tiệc 30 - 80 người tại gia đình, biệt thự, nhà hàng sân vườn.",
    isPopular: true,
  },
  {
    id: "srv-3",
    title: "Gói Âm Thanh Ánh Sáng Tiệc Cưới B-52 Tiêu Chuẩn",
    category: "wedding",
    price: 5500000,
    originalPrice: 6800000,
    unit: "tiệc (trọn gói)",
    badge: "Khuyên dùng tiệc cưới",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Hệ thống 4 Full B-52 + 2 Sub Hầm Kép B-52, đảm bảo âm thanh uy lực cho nghi thức lễ cưới.",
    specs: [
      "4 Loa Full B-52 chuyên dụng + 2 Loa Subwoofer kép B-52",
      "Bàn Mixer 12 Line hỗ trợ ban nhạc, MC & ca sĩ",
      "Bộ 4 Micro Shure cao cấp chống hú, giọng ấm áp",
      "Hệ thống 8 Đèn Par Led đánh nền sân khấu ấm cúng",
      "2 Đèn Moving Head Beam 230 quét luồng sáng đám cưới",
      "Kỹ thuật viên chuyên nghiệp chỉnh âm thanh theo kịch bản cưới",
    ],
    recommendedFor: "Phù hợp tiệc cưới 100 - 300 khách tại tư gia hoặc hội trường.",
    isPopular: true,
  },
  {
    id: "srv-4",
    title: "Gói B-52 Line Array & Sub Kép Sân Khấu Tiệc Cưới VIP",
    category: "wedding",
    price: 9500000,
    originalPrice: 12000000,
    unit: "tiệc (trọn gói)",
    badge: "Đẳng cấp VIP",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Dàn B-52 Line Array cao cấp kết hợp ánh sáng sân khấu biểu diễn mãn nhãn, chuẩn 5 sao.",
    specs: [
      "Hệ thống Loa Line Array B-52 (4 cặp treo) + 2 Sub kép khủng",
      "Mixer Kỹ thuật số Allen & Heath / Midas chuẩn show",
      "Trọn bộ 6 Micro không dây Shure ULXD cao cấp",
      "12 Đèn Par Led sân khấu + 4 Đèn Beam 260/350W sắc nét",
      "Hỗ trợ máy khói nặng và hiệu ứng ánh sáng hoàng gia",
      "2 Kỹ sư âm thanh & ánh sáng phụ trách theo timeline sự kiện",
    ],
    recommendedFor: "Phù hợp tiệc cưới 300 - 600 khách, không gian sảnh tiệc lớn, resort.",
    isPopular: false,
  },
  {
    id: "srv-5",
    title: "Gói Trang Trí Sân Khấu Tiệc Cưới Hiện Đại",
    category: "wedding",
    price: 6800000,
    originalPrice: 8500000,
    unit: "gói trang trí",
    badge: "Mới nhất",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Trang trí backdrop cưới lãng mạn, màn sao huyền ảo, bục catwalk và hoa nghệ thuật cao cấp.",
    specs: [
      "Backdrop cưới hiện đại theo tone màu chủ đạo của cô dâu chú rể",
      "Màn sao led lung linh kích thước 4m x 3m hoặc 6m x 3m",
      "Bục sân khấu trải thảm nhung đỏ/trắng và lối đi catwalk hoa",
      "Đèn rọi chiếu sáng nghệ thuật tôn vinh nhân vật chính",
      "Bàn Gallery đón khách đồng bộ chủ đề cưới",
      "Đội ngũ thi công hoàn thiện sớm trước giờ đón khách 3 tiếng",
    ],
    recommendedFor: "Dành cho cô dâu chú rể muốn không gian cưới ấn tượng, chụp hình cực đẹp.",
    isPopular: false,
  },
  {
    id: "srv-6",
    title: "Gói Hiệu Ứng Sân Khấu Đặc Biệt (Khói Lạnh & Pháo Sáng)",
    category: "stage_effects",
    price: 3200000,
    originalPrice: 4000000,
    unit: "show (nghi thức lễ)",
    badge: "Tạo khoảnh khắc",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Tạo khoảnh khắc bước vào lễ đường bồng bềnh như mây bồng và pháo sáng bùng nổ khi cắt bánh.",
    specs: [
      "2 Máy khói lạnh CO2 tạo biển mây bồng bềnh cho cô dâu chú rể",
      "6 - 8 Trụ pháo sáng điện tử an toàn không mùi, không gây cháy",
      "1 Máy tạo bong bóng xà phòng lãng mạn",
      "Đèn Follow Spot rọi theo bước chân nhân vật chính",
      "Kỹ thuật viên canh đúng nhạc cao trào để kích hoạt hiệu ứng",
    ],
    recommendedFor: "Phù hợp tiệc cưới, lễ đính hôn, khai mạc sự kiện, tiệc tất niên.",
    isPopular: false,
  },
  {
    id: "srv-7",
    title: "Gói Âm Thanh Ánh Sáng Sự Kiện Doanh Nghiệp & Tất Niên",
    category: "lighting",
    price: 12000000,
    originalPrice: 15000000,
    unit: "ngày / sự kiện",
    badge: "Doanh nghiệp",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Đáp ứng tiêu chuẩn hội nghị, gala dinner, lễ kỷ niệm và biểu diễn nghệ thuật hoành tráng.",
    specs: [
      "Hệ thống 6 - 8 Loa Line Array + 4 Sub kép công suất lớn",
      "Bàn Digital Mixer 32 kênh hỗ trợ Band nhạc sống & Ca sĩ nổi tiếng",
      "Hệ thống 16 Đèn Par Led 54 bóng + 8 Moving Head Beam 350",
      "Giàn khung Truss nhôm chịu lực chuyên nghiệp",
      "2 Máy khói công nghiệp + Đèn Follow Spot",
      "Ekip 3 kỹ thuật viên âm thanh, ánh sáng kinh nghiệm lâu năm",
    ],
    recommendedFor: "Phù hợp sự kiện 400 - 1500 khách: Year End Party, Hội nghị khách hàng, Lễ ra mắt.",
    isPopular: true,
  },
  {
    id: "srv-8",
    title: "Gói Cho Thuê Đèn Ánh Sáng & Laser Sân Khấu Riêng Lẻ",
    category: "lighting",
    price: 2800000,
    originalPrice: 3500000,
    unit: "buổi",
    badge: "Linh hoạt",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Dành cho khách hàng đã có âm thanh muốn bổ sung ánh sáng nghệ thuật chuyên nghiệp.",
    specs: [
      "8 Đèn Par Led 54 bóng 3W đổi màu nhuộm nền",
      "2 Đèn Moving Head Beam quét luồng sân khấu",
      "1 Bàn điều khiển DMX 512 lập trình ánh sáng",
      "1 Máy khói 1500W làm nổi bật tia sáng",
      "Hỗ trợ chân đèn chữ T và dây tín hiệu đầy đủ",
    ],
    recommendedFor: "Sự kiện nhỏ, acoustic bar, tiệc sinh nhật, party ngoài trời.",
    isPopular: false,
  },
];

let leadsList: LeadItem[] = [
  {
    id: "lead-1",
    fullName: "Anh Hoàng Minh",
    phone: "0912345678",
    email: "hoangminh.event@gmail.com",
    eventType: "Tiệc Cưới & Đính Hôn",
    eventDate: "2026-09-20",
    location: "Nhà hàng Đông Phương, Tân Bình, TP.HCM",
    guestCount: 250,
    serviceId: "srv-3",
    notes: "Cần gói âm thanh tiệc cưới và hiệu ứng khói lạnh lúc làm lễ, có ban nhạc acoustic.",
    status: "new",
    createdAt: "2026-09-06T10:15:00Z",
  },
  {
    id: "lead-2",
    fullName: "Chị Ngọc Trâm",
    phone: "0988112233",
    email: "ngoctram93@yahoo.com",
    eventType: "Tiệc Sinh Nhật Gia Đình",
    eventDate: "2026-09-12",
    location: "Khu biệt thự Thảo Điền, TP. Thủ Đức",
    guestCount: 40,
    serviceId: "srv-2",
    notes: "Tổ chức tiệc sinh nhật ngoài trời, cần hát karaoke hay và có đèn led tạo không khí.",
    status: "contacted",
    createdAt: "2026-09-05T14:30:00Z",
  },
  {
    id: "lead-3",
    fullName: "Cty Bất Động Sản An Gia",
    phone: "0909667788",
    email: "contact@angialand.vn",
    eventType: "Gala Dinner & Tất Niên",
    eventDate: "2026-10-15",
    location: "Trung tâm Hội nghị White Palace, TP.HCM",
    guestCount: 500,
    serviceId: "srv-7",
    notes: "Cần báo giá chi tiết gồm màn hình Led 30m2, line array và ánh sáng lập trình.",
    status: "confirmed",
    createdAt: "2026-09-04T09:00:00Z",
  },
];

// Lazy Groq API initialization
let groqClient: Groq | null = null;
function getGroqClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

// 1. API: Settings
app.get("/api/settings", (req, res) => {
  res.json(contactSettings);
});

app.put("/api/settings", requireAuth, (req, res) => {
  contactSettings = { ...contactSettings, ...req.body };
  res.json({ success: true, settings: contactSettings });
});

// 2. API: Services
app.get("/api/services", (req, res) => {
  res.json(servicesList);
});

app.post("/api/services", requireAuth, (req, res) => {
  const newService: ServiceItem = {
    id: `srv-${Date.now()}`,
    title: req.body.title || "Dịch vụ mới",
    category: req.body.category || "karaoke",
    price: Number(req.body.price) || 2000000,
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
    unit: req.body.unit || "buổi",
    badge: req.body.badge || "",
    image: req.body.image || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    shortDesc: req.body.shortDesc || "",
    specs: Array.isArray(req.body.specs) ? req.body.specs : ["Thiết bị cao cấp", "Kỹ thuật viên hỗ trợ"],
    recommendedFor: req.body.recommendedFor || "Phù hợp mọi loại tiệc",
    isPopular: Boolean(req.body.isPopular),
  };
  servicesList.unshift(newService);
  res.json({ success: true, service: newService });
});

app.put("/api/services/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const index = servicesList.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Không tìm thấy dịch vụ" });
  }
  servicesList[index] = { ...servicesList[index], ...req.body, id };
  res.json({ success: true, service: servicesList[index] });
});

app.delete("/api/services/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  servicesList = servicesList.filter((s) => s.id !== id);
  res.json({ success: true, message: "Đã xóa dịch vụ thành công" });
});

// 3. API: Leads
app.get("/api/leads", requireAuth, (req, res) => {
  res.json(leadsList);
});

app.post("/api/leads", (req, res) => {
  const { fullName, phone, email, eventType, eventDate, location, guestCount, serviceId, notes } = req.body;
  if (!fullName || !phone) {
    return res.status(400).json({ error: "Vui lòng nhập họ tên và số điện thoại liên hệ" });
  }
  const newLead: LeadItem = {
    id: `lead-${Date.now()}`,
    fullName,
    phone,
    email: email || "",
    eventType: eventType || "Chưa xác định",
    eventDate: eventDate || new Date().toISOString().split("T")[0],
    location: location || "Chưa có địa chỉ",
    guestCount: guestCount ? Number(guestCount) : undefined,
    serviceId: serviceId || "",
    notes: notes || "",
    status: "new",
    createdAt: new Date().toISOString(),
  };
  leadsList.unshift(newLead);
  res.json({ success: true, message: "Đăng ký tư vấn thành công! Chúng tôi sẽ gọi lại ngay.", lead: newLead });
});

app.patch("/api/leads/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const index = leadsList.findIndex((l) => l.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Không tìm thấy thông tin khách hàng" });
  }
  leadsList[index] = { ...leadsList[index], ...req.body, id };
  res.json({ success: true, lead: leadsList[index] });
});

app.delete("/api/leads/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  leadsList = leadsList.filter((l) => l.id !== id);
  res.json({ success: true, message: "Đã xóa thông tin thành công" });
});

// 4. API: AI Chatbot (Gemini with smart context)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "Xin vui lòng nhập câu hỏi của bạn." });
    }

    const ai = getGroqClient();

    // Summary of services for prompt context
    const servicesSummary = servicesList
      .map(
        (s) =>
          `- ${s.title}: ${s.price.toLocaleString("vi-VN")}đ/${s.unit} (Mô tả: ${s.shortDesc}. Phù hợp: ${s.recommendedFor})`
      )
      .join("\n");

    const systemPrompt = `Bạn là Trợ Lý Tư Vấn Âm Thanh Ánh Sáng Chuyên Nghiệp của "${contactSettings.brandName}".
Thông tin liên hệ:
- Hotline/Zalo: ${contactSettings.phoneDisplay} (${contactSettings.zaloLink})
- Địa chỉ phục vụ: ${contactSettings.address}
- Giờ làm việc: ${contactSettings.workingHours}

Danh sách các gói dịch vụ dàn loa B-52 hiện tại của chúng tôi:
${servicesSummary}

Kiến thức chuyên sâu về công nghệ âm thanh B-52:
- Dàn B-52 Pro Audio là dòng loa chuẩn sân khấu, sử dụng củ loa bass hầm công nghệ Mỹ (đánh cực kỳ đầm và chắc, không tức ngực hay ù tai như loa thường).
- Dải trung (mid) rất sáng, tôn giọng ca giúp khách hát nhẹ hơi, không mệt mỏi.
- Sử dụng Vang số Digital căn chỉnh riêng và Micro không dây Shure cao cấp chống hú rít 100%.
- Luôn có kỹ thuật viên túc trực suốt tiệc để chỉnh âm thanh.

Nhiệm vụ của bạn (Kịch bản tư vấn chốt đơn):
1. Phản hồi lịch sự, thân thiện. Tư vấn các gói B-52 (gói Active Matrix 1.5tr cho 10-30 khách, gói Sub hầm B-52 2.5tr cho 30-80 khách là gói ĐƯỢC CHỌN NHIỀU NHẤT, cưới 5.5tr/9.5tr).
2. Khi báo giá, luôn nhấn mạnh đặc quyền trọn gói: Vận chuyển, lắp đặt trước 1 tiếng, kỹ thuật viên trực suốt tiệc.
3. Xử lý từ chối về giá: "Dàn B-52 bên em là cấu hình sân khấu chuyên nghiệp, có sub hầm riêng và quan trọng nhất là có kỹ thuật viên trực chỉnh từng bài. Đảm bảo âm thanh hay, không hú rít, không giống như loa kéo hay dàn nhỏ tự phát giá rẻ."
4. Xử lý từ chối về hú rít: "Dạ anh/chị yên tâm 100%. Vang số Digital bên em cắt hú rít tự động, cam kết dí sát mic vào loa cũng không hú. Bị hú rè xin hoàn tiền."
5. Lời kêu gọi hành động (Call to action): "Tiệc mình dự kiến đãi lúc mấy giờ và ở khu vực nào vậy anh/chị? Để em kiểm tra lịch xe và kỹ thuật viên giữ gói ưu đãi cho mình nhé!"`;

    if (ai) {
      try {
        const response = await ai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: message,
            }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
        });

        const reply = response.choices[0]?.message?.content || "Dạ chào anh/chị, em có thể tư vấn gói âm thanh ánh sáng phù hợp cho sự kiện của mình ạ. Anh/chị cần tổ chức tiệc cho bao nhiêu khách?";
        return res.json({ reply });
      } catch (groqError) {
        console.error("Groq call error, falling back to smart rules:", groqError);
      }
    }

    // Smart fallback if API key is not yet configured or quota issue
    const lower = message.toLowerCase();
    let fallbackReply = `Dạ chào anh/chị! Bên em chuyên cho thuê Dàn Loa B-52 chính hãng – chất âm chuẩn sân khấu, bass đánh sâu chắc nịch và micro Shure chống hú 100%. Anh/chị dự kiến tổ chức tiệc cho khoảng bao nhiêu khách để em tư vấn gói B-52 phù hợp nhất ạ? (Hotline tư vấn nhanh: ${contactSettings.phoneDisplay})`;

    if (lower.includes("giá") || lower.includes("bao nhiêu") || lower.includes("báo giá")) {
      fallbackReply = `Dạ hiện tại bên em có 2 gói Dàn B-52 tiệc gia đình chuộng nhất:
🔹 Gói B-52 Active (1.500.000đ): Tiệc 10-30 người, chất âm mượt mà, chống hú.
🔹 Gói B-52 Kèm Sub Hầm (2.500.000đ): Tiệc 30-80 người, sub hầm 50cm đánh cực đã, có đèn Led.
Đặc quyền trọn gói: Đã bao gồm vận chuyển, lắp đặt trước giờ tiệc 1 tiếng và Kỹ thuật viên trực chỉnh âm thanh suốt tiệc!`;
    } else if (lower.includes("cưới") || lower.includes("đám cưới") || lower.includes("hôn lễ")) {
      fallbackReply = `Dạ tiệc cưới bên em có gói B-52 Tiêu Chuẩn (5.500.000đ) và Gói B-52 Line Array VIP (9.500.000đ). Dòng B-52 cho tiếng ca rất sáng và tiếng bass cực kỳ uy lực, phù hợp cho lễ cưới lãng mạn lẫn giao lưu nhạc trẻ. Anh/chị tổ chức ở tư gia hay nhà hàng ạ?`;
    } else if (lower.includes("karaoke") || lower.includes("hát") || lower.includes("hú")) {
      fallbackReply = `Dạ dàn B-52 bên em cam kết chống hú 100% nhờ vang số Digital và micro Shure cao cấp nhẹ giọng. Củ loa bass hầm Mỹ đánh đầm không tức ngực. Gói gia đình từ 1.500.000đ, gói kèm Sub hầm uy lực 2.500.000đ. Đội kỹ thuật bên em sẽ ngồi trực chỉnh từng bài suốt tiệc cho gia đình mình ạ!`;
    } else if (lower.includes("liên hệ") || lower.includes("sđt") || lower.includes("zalo") || lower.includes("ở đâu")) {
      fallbackReply = `Dạ anh/chị có thể liên hệ trực tiếp hotline/Zalo: ${contactSettings.phoneDisplay} (Zalo: ${contactSettings.zaloLink}). Đội ngũ kỹ thuật phục vụ 24/7 tận nơi tại khu vực của mình ạ!`;
    }

    return res.json({ reply: fallbackReply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      reply: "Dạ xin lỗi quý khách, hệ thống đang bận một chút. Quý khách vui lòng gọi ngay hotline để được tư vấn nhanh nhất!",
    });
  }
});

// 5. Vite dev or static prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
