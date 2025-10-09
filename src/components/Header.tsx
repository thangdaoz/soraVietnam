'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AuthButtons } from '@/components/AuthButtons';

const navigation = [
  { href: '#how-it-works', label: 'Cách hoạt động' },
  { href: '#features', label: 'Tính năng' },
  { href: '#pricing', label: 'Bảng giá' },
];

export function Header() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
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

        {/* Only show these navigation links on landing page */}
        {isLandingPage && (
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
        )}

        <AuthButtons />
      </div>
    </header>
  );
}
