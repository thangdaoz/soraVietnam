# Sora Vietnam Gateway

Nền tảng cổng kết nối AI Video Generation cho thị trường Việt Nam, cung cấp dịch vụ tạo video từ văn bản (text-to-video) và hình ảnh (image-to-video) sử dụng công nghệ AI tiên tiến.

## 🚀 Công nghệ sử dụng

- **Next.js 15.1+** - React Framework với App Router
- **React 19** - UI Library (quản lý bởi Next.js)
- **Tailwind CSS 4.x** - CSS Framework với Oxide engine
- **Supabase** - Backend as a Service (Database, Auth, Storage)
- **TypeScript** - Type safety
- **Node.js 18.17+** - Runtime environment

## 📋 Yêu cầu hệ thống

- Node.js 18.17.0 hoặc cao hơn
- npm hoặc yarn
- Tài khoản Supabase (tạo tại [supabase.com](https://supabase.com))

## 🛠️ Cài đặt

1. **Clone repository**

```bash
git clone <repository-url>
cd soraVietnam
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Cấu hình môi trường**

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Cập nhật các biến môi trường trong `.env.local` với thông tin dự án của bạn:

- `NEXT_PUBLIC_SUPABASE_URL`: URL dự án Supabase của bạn
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Anon/Public key từ Supabase
- Các biến khác theo yêu cầu

4. **Chạy development server**

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Cấu trúc thư mục

```
soraVietnam/
├── docs/                       # Tài liệu dự án
│   ├── coding-standards.md
│   ├── project-charter.md
│   ├── technical-documentation.md
│   └── ...
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   ├── lib/                   # Utilities & helpers
│   │   └── supabase/         # Supabase clients
│   │       ├── client.ts     # Browser client
│   │       └── server.ts     # Server client
│   └── middleware.ts          # Next.js middleware
├── .env.example               # Environment variables template
├── .env.local                 # Local environment (gitignored)
├── next.config.ts             # Next.js configuration
├── postcss.config.mjs         # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies & scripts
```

## 🎯 Tính năng chính (Roadmap)

- [ ] **Authentication** - Đăng ký/Đăng nhập người dùng
- [ ] **Text-to-Video** - Tạo video từ mô tả văn bản
- [ ] **Image-to-Video** - Tạo video từ hình ảnh
- [ ] **Credit System** - Hệ thống tín dụng và thanh toán
- [ ] **Video Gallery** - Quản lý video đã tạo
- [ ] **Payment Integration** - Tích hợp Casso payment gateway
- [ ] **Vietnamese Localization** - Giao diện hoàn toàn tiếng Việt

## 📚 Scripts có sẵn

```bash
npm run dev          # Chạy development server với Turbopack
npm run build        # Build production
npm run start        # Chạy production server
npm run lint         # Chạy ESLint
npm run type-check   # Kiểm tra TypeScript types
```

## 🔒 Bảo mật

- Không commit file `.env.local` vào git
- Sử dụng Row Level Security (RLS) trong Supabase
- Xác thực JWT với Supabase Auth
- HTTPS required cho production

## 📖 Tài liệu thêm

Xem thư mục `docs/` để biết thêm chi tiết về:

- [Project Charter](./docs/project-charter.md)
- [Technical Documentation](./docs/technical-documentation.md)
- [Technology Stack](./docs/technology-stack.md)
- [Coding Standards](./docs/coding-standards.md)

## 🤝 Đóng góp

Dự án đang trong giai đoạn phát triển. Vui lòng liên hệ team để biết thêm chi tiết.

## 📄 License

Proprietary - All rights reserved

---

**Sora Vietnam Gateway** - Democratizing AI Video Creation for Vietnam 🇻🇳
