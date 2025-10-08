'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { signOut, getCurrentUser } from '@/lib/actions/auth';

interface UserData {
  id: string;
  email: string | undefined;
  fullName: string;
  creditBalance: number;
}

export function AuthButtons() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const userData = await getCurrentUser();
      setUser(userData);
      setIsLoading(false);
    }
    loadUser();
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-20 animate-pulse rounded-lg bg-neutral-200"></div>
        <div className="h-10 w-28 animate-pulse rounded-lg bg-neutral-200"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm font-medium">
        {/* Credits Display */}
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-50 to-secondary-50 px-4 py-2 text-primary-700 transition-all hover:from-primary-100 hover:to-secondary-100"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-semibold">{user.creditBalance.toLocaleString('vi-VN')} credits</span>
        </Link>

        {/* User Menu */}
        <Link
          href="/dashboard"
          className="text-neutral-600 transition-colors hover:text-primary-600"
        >
          Dashboard
        </Link>

        {/* Sign Out Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          isLoading={isSigningOut}
          className="border-neutral-300"
        >
          {isSigningOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm font-medium">
      <Link
        href="/login"
        className="text-neutral-600 transition-colors hover:text-primary-600"
      >
        Đăng nhập
      </Link>
      <Link
        href="/sign-up"
        className="rounded-lg bg-primary-600 px-6 py-2.5 text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
      >
        Bắt đầu ngay
      </Link>
    </div>
  );
}
