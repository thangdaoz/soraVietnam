'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Đã xảy ra lỗi trong quá trình xác thực';

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="mx-auto mb-6 inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-xl text-white shadow-lg">
              SV
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900">Xác thực thất bại</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Có lỗi xảy ra trong quá trình xác thực
          </p>
        </div>

        {/* Error Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          <Alert variant="danger" className="mb-6">
            <AlertTitle>Lỗi xác thực</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="mb-6 rounded-lg bg-neutral-50 p-4 text-sm">
            <p className="font-medium text-neutral-900 mb-2">Các bước khắc phục:</p>
            <ul className="space-y-1 text-neutral-600">
              <li>• Kiểm tra link xác thực có còn hiệu lực</li>
              <li>• Link xác thực chỉ có thể sử dụng một lần</li>
              <li>• Đảm bảo bạn đã nhấp đúng link từ email</li>
              <li>• Thử đăng ký hoặc đặt lại mật khẩu lại</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link href="/sign-up">
              <Button variant="primary" size="lg" className="w-full">
                Đăng ký lại
              </Button>
            </Link>
            
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full">
                Quay lại đăng nhập
              </Button>
            </Link>

            <Link href="/forgot-password">
              <Button variant="ghost" size="lg" className="w-full">
                Đặt lại mật khẩu
              </Button>
            </Link>
          </div>
        </div>

        {/* Help Link */}
        <p className="mt-6 text-center text-sm text-neutral-600">
          Vẫn gặp vấn đề?{' '}
          <Link href="/contact" className="font-medium text-primary-600 hover:text-primary-700">
            Liên hệ hỗ trợ
          </Link>
        </p>
      </div>
    </div>
  );
}
