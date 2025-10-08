'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { resetPassword } from '@/lib/actions/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    
    const result = await resetPassword(formData);

    if (!result.success) {
      setError(result.error);
      if (result.errors) {
        setFieldErrors(result.errors);
      }
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login');
    }, 2000);
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
          <h1 className="text-3xl font-bold text-neutral-900">Đặt lại mật khẩu</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          {success ? (
            /* Success State */
            <div className="space-y-6 text-center">
              <Alert variant="success">
                <AlertTitle>Đặt lại mật khẩu thành công!</AlertTitle>
                <AlertDescription>
                  Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển hướng đến trang đăng nhập.
                </AlertDescription>
              </Alert>

              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-sm text-neutral-600">
                Đang chuyển hướng đến trang đăng nhập...
              </p>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="mb-6" onClose={() => setError(null)}>
                  <AlertTitle>Đặt lại mật khẩu thất bại</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Info Alert */}
              <Alert variant="info" className="mb-6">
                <AlertDescription>
                  Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <Input
                  label="Mật khẩu mới"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  error={fieldErrors.password?.[0]}
                  helperText="Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                />

                {/* Confirm Password */}
                <Input
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  error={fieldErrors.confirmPassword?.[0]}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  {isLoading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
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

        {/* Security Note */}
        {!success && (
          <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-neutral-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div className="text-sm text-neutral-600">
                <p className="font-medium text-neutral-900 mb-1">Lưu ý bảo mật:</p>
                <ul className="space-y-1">
                  <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
                  <li>• Sử dụng mật khẩu khác nhau cho mỗi dịch vụ</li>
                  <li>• Cập nhật mật khẩu định kỳ</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
