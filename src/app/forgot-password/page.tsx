'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { forgotPassword } from '@/lib/actions/auth';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const emailValue = formData.get('email') as string;
    setEmail(emailValue);

    const result = await forgotPassword(formData);

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  }

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
          <h1 className="text-3xl font-bold text-neutral-900">Quên mật khẩu</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Nhập email của bạn để nhận link đặt lại mật khẩu
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          {success ? (
            /* Success State */
            <div className="space-y-6">
              <Alert variant="success">
                <AlertTitle>Email đã được gửi!</AlertTitle>
                <AlertDescription>
                  Chúng tôi đã gửi link đặt lại mật khẩu đến email <strong>{email}</strong>. 
                  Vui lòng kiểm tra hộp thư của bạn.
                </AlertDescription>
              </Alert>

              {/* Email Icon */}
              <div className="flex justify-center">
                <svg
                  className="h-20 w-20 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Instructions */}
              <div className="rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600">
                <p className="font-medium text-neutral-900 mb-2">Các bước tiếp theo:</p>
                <ol className="list-inside list-decimal space-y-1 pl-2">
                  <li>Mở email từ Sora Vietnam Gateway</li>
                  <li>Nhấp vào link "Đặt lại mật khẩu"</li>
                  <li>Nhập mật khẩu mới của bạn</li>
                  <li>Đăng nhập với mật khẩu mới</li>
                </ol>
              </div>

              {/* Troubleshooting */}
              <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
                <p className="font-medium text-neutral-900 mb-2">Không nhận được email?</p>
                <ul className="space-y-1 text-neutral-600">
                  <li>• Kiểm tra thư mục spam/junk mail</li>
                  <li>• Đảm bảo email chính xác</li>
                  <li>• Đợi vài phút và kiểm tra lại</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setSuccess(false)}
                >
                  Gửi lại email
                </Button>
                <Link href="/login">
                  <Button variant="ghost" size="lg" className="w-full">
                    Quay lại đăng nhập
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="mb-6" onClose={() => setError(null)}>
                  <AlertTitle>Không thể gửi email</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <Input
                  label="Email"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@gmail.com"
                  required
                  disabled={isLoading}
                  helperText="Nhập email bạn đã đăng ký tài khoản"
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  {isLoading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
                </Button>

                {/* Back to Login */}
                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    ← Quay lại đăng nhập
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Help Link */}
        {!success && (
          <p className="mt-6 text-center text-sm text-neutral-600">
            Chưa có tài khoản?{' '}
            <Link href="/sign-up" className="font-medium text-primary-600 hover:text-primary-700">
              Đăng ký ngay
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
