# Âm thanh & Ánh sáng Anh Tý 

Dịch Vụ Âm Thanh Ánh Sáng & Trang Trí Sự Kiện Chuyên Nghiệp.

**🌐 Xem Demo Trực Tuyến:** [https://thesoundandlightingweb.onrender.com/](https://thesoundandlightingweb.onrender.com/)

Đây là một ứng dụng web Full-stack được xây dựng để cung cấp giải pháp đặt lịch và quản lý dịch vụ âm thanh, ánh sáng chuyên nghiệp. Ứng dụng tích hợp nhiều tính năng hiện đại, giao diện bắt mắt và tối ưu hóa trải nghiệm người dùng, kèm theo hệ thống quản trị (Admin Panel) và Chatbot AI tự động 24/7.

## Tính năng nổi bật

- **Landing Page Năng Động:** Giao diện bắt mắt với các hiệu ứng chuyển động mượt mà (Framer Motion).
- **Danh Mục Dịch Vụ:** Trưng bày các gói dịch vụ âm thanh, ánh sáng với bảng giá minh bạch.
- **Thư Viện Ảnh (Gallery):** Hình ảnh thực tế từ các sự kiện đã tổ chức.
- **Công Cụ Tính Dự Toán:** Giúp khách hàng dễ dàng ước tính chi phí trước khi đặt lịch.
- **Đặt Lịch & Form Liên Hệ:** Nắm bắt thông tin khách hàng tiềm năng nhanh chóng (Leads).
- **Thanh Liên Hệ Nổi (Floating Contact):** Hỗ trợ khách hàng liên hệ nhanh qua Zalo, Messenger, và Điện thoại.
- **Chatbot AI 24/7:** Tư vấn khách hàng tự động, tích hợp AI thông minh.
- **Admin Panel:** Quản lý thông tin liên hệ, danh sách dịch vụ, và trạng thái đơn hàng (Leads) trực tiếp trên giao diện web.

## Công nghệ sử dụng

- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React.
- **Backend:** Node.js, Express (viết bằng TypeScript).
- **Tích hợp AI:** Groq SDK.
- **Build Tools:** Vite, esbuild, tsx.

## Hướng dẫn cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js (Khuyến nghị phiên bản 18+).

### Cài đặt

1. **Cài đặt các thư viện (dependencies):**
   ```bash
   npm install
   ```

2. **Cấu hình biến môi trường:**
   Mở hoặc tạo file `.env` ở thư mục gốc của dự án. Điền các thông tin API cần thiết (đặc biệt là API Key cho Chatbot nếu có sử dụng).
   ```env
   # Ví dụ:
   GROQ_API_KEY=your_api_key_here
   ```

3. **Chạy ứng dụng trong môi trường phát triển (Development):**
   ```bash
   npm run dev
   ```
   Lệnh này sẽ khởi động đồng thời giao diện React và Express Server backend. Mở trình duyệt và truy cập vào đường dẫn được cung cấp ở terminal (thường là `http://localhost:5173`).

### Các câu lệnh NPM (Scripts)

- `npm run dev`: Chạy dự án ở chế độ phát triển (watch mode).
- `npm run build`: Đóng gói (build) dự án cho môi trường Production (bao gồm frontend và backend).
- `npm run start`: Chạy ứng dụng từ bản build (Production).
- `npm run preview`: Xem trước bản build của frontend.
- `npm run clean`: Xóa các thư mục build cũ.

## Cấu trúc thư mục chính

```text
├── src/
│   ├── components/      # Chứa các React component (Navbar, Hero, ServiceCatalog, AdminPanel,...)
│   ├── types/           # Định nghĩa các TypeScript interfaces
│   ├── App.tsx          # Component gốc (Root component) của ứng dụng
│   └── main.tsx         # Entry point của React frontend
├── public/              # Chứa các tài nguyên tĩnh (hình ảnh, favicon,...)
├── server.ts            # Mã nguồn backend (Express server)
├── package.json         # Khai báo dependencies và scripts
├── vite.config.ts       # Cấu hình Vite
└── tsconfig.json        # Cấu hình TypeScript
```

## Thông tin liên hệ Doanh nghiệp

- **Thương hiệu:** Âm thanh & Ánh sáng Anh Tý
