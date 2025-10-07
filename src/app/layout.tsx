import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Link from 'next/link';

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
  title: 'Sora Vietnam Gateway - Tao Video AI',
  description:
    'Nen tang tao video AI hang dau tai Viet Nam. Chuyen doi van ban va hinh anh thanh video chat luong cao voi cong nghe AI tien tien.',
  keywords: ['AI video', 'text to video', 'image to video', 'video generation', 'Vietnam', 'Sora'],
};

const navigation = [
  { href: '#how-it-works', label: 'Cach hoat dong' },
  { href: '#features', label: 'Tinh nang' },
  { href: '#pricing', label: 'Bang gia' },
];

const footerLinks = [
  { href: '#about', label: 'Ve chung toi' },
  { href: '#terms', label: 'Dieu khoan' },
  { href: '#privacy', label: 'Chinh sach bao mat' },
  { href: '#contact', label: 'Lien he' },
  { href: '#social', label: 'Mang xa hoi' },
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
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow"
          >
            Bo qua dieu huong
          </a>

          <header className="border-b border-neutral-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
              <Link
                href="/"
                className="text-primary-600 flex items-center gap-3 text-base font-semibold"
              >
                <span className="bg-primary-600 inline-flex h-10 w-10 items-center justify-center rounded-full text-lg text-white">
                  SV
                </span>
                <span className="text-neutral-900">Sora Vietnam Gateway</span>
              </Link>

              <nav className="flex items-center gap-6 text-sm font-medium text-neutral-600">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3 text-sm font-medium">
                <Link
                  href="/login"
                  className="hover:text-primary-600 text-neutral-600 transition-colors"
                >
                  Dang nhap
                </Link>
                <Link href="/sign-up" className="btn-primary">
                  Bat dau ngay
                </Link>
              </div>
            </div>
          </header>

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <footer className="border-t border-neutral-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-neutral-900">Sora Vietnam Gateway</p>
                <p className="text-sm text-neutral-600">
                  Giai phap tao video AI toan dien cho doanh nghiep Viet Nam.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                {footerLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
