import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Link from 'next/link';
import { AuthButtons } from '@/components/AuthButtons';

import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  weight: ['400', '500'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sora Vietnam Gateway - Tạo Video AI',
  description:
    'Nền tảng tạo video AI hàng đầu tại Việt Nam. Chuyển đổi văn bản và hình ảnh thành video chất lượng cao với công nghệ AI tiên tiến.',
  keywords: ['AI video', 'text to video', 'image to video', 'video generation', 'Vietnam', 'Sora'],
};

const navigation = [
  { href: '#how-it-works', label: 'Cách hoạt động' },
  { href: '#features', label: 'Tính năng' },
  { href: '#pricing', label: 'Bảng giá' },
];

const footerLinks = [
  { href: '/about', label: 'Về chúng tôi' },
  { href: '/terms', label: 'Điều khoản' },
  { href: '/privacy', label: 'Chính sách bảo mật' },
  { href: '/contact', label: 'Liên hệ' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
          >
            Bỏ qua điều hướng
          </a>

          <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
              <Link
                href="/"
                className="flex items-center gap-3 text-base font-semibold transition-opacity hover:opacity-80"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-lg text-white shadow-lg">
                  SV
                </span>
                <span className="text-neutral-900">Sora Vietnam</span>
              </Link>

              <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-600 md:flex">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition-colors hover:text-primary-600"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <AuthButtons />
            </div>
          </header>

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <footer className="border-t border-neutral-200 bg-neutral-50">
            <div className="mx-auto max-w-7xl px-6 py-12">
              <div className="grid gap-12 md:grid-cols-12">
                {/* Brand Section */}
                <div className="space-y-4 md:col-span-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-lg text-white shadow-lg">
                      SV
                    </span>
                    <span className="text-lg font-bold text-neutral-900">Sora Vietnam</span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Giải pháp tạo video AI toàn diện cho doanh nghiệp Việt Nam. 
                    Chuyển đổi ý tưởng thành video chuyên nghiệp chỉ trong vài phút.
                  </p>
                  <div className="flex items-center gap-4">
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-400 transition-colors hover:text-primary-600"
                      aria-label="Facebook"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://youtube.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-400 transition-colors hover:text-primary-600"
                      aria-label="YouTube"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-400 transition-colors hover:text-primary-600"
                      aria-label="LinkedIn"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="md:col-span-7">
                  <div className="grid gap-8 sm:grid-cols-3">
                    <div>
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-900">
                        Sản phẩm
                      </h3>
                      <ul className="space-y-3 text-sm text-neutral-600">
                        <li>
                          <Link href="#features" className="transition-colors hover:text-primary-600">
                            Tính năng
                          </Link>
                        </li>
                        <li>
                          <Link href="#pricing" className="transition-colors hover:text-primary-600">
                            Bảng giá
                          </Link>
                        </li>
                        <li>
                          <Link href="/api" className="transition-colors hover:text-primary-600">
                            API
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-900">
                        Công ty
                      </h3>
                      <ul className="space-y-3 text-sm text-neutral-600">
                        {footerLinks.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} className="transition-colors hover:text-primary-600">
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-900">
                        Hỗ trợ
                      </h3>
                      <ul className="space-y-3 text-sm text-neutral-600">
                        <li>
                          <Link href="/help" className="transition-colors hover:text-primary-600">
                            Trung tâm trợ giúp
                          </Link>
                        </li>
                        <li>
                          <Link href="/docs" className="transition-colors hover:text-primary-600">
                            Tài liệu
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact" className="transition-colors hover:text-primary-600">
                            Liên hệ
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 border-t border-neutral-200 pt-8">
                <p className="text-center text-sm text-neutral-600">
                  © {new Date().getFullYear()} Sora Vietnam Gateway. Tất cả quyền được bảo lưu.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
