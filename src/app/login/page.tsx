import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';

export default function LoginPage() {
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
          <h1 className="text-3xl font-bold text-neutral-900">Đăng nhập</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Chào mừng trở lại! Đăng nhập để tiếp tục sáng tạo.
          </p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          <form className="space-y-6">
            {/* Email */}
            <Input
              label="Email"
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              required
            />

            {/* Password */}
            <Input
              label="Mật khẩu"
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
            />

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <Checkbox
                id="remember"
                label="Ghi nhớ đăng nhập"
              />
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
            >
              Đăng nhập
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-neutral-500">Hoặc đăng nhập với</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Đăng nhập với Google
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
            >
              <svg className="mr-2 h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Đăng nhập với Facebook
            </Button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-neutral-600">
          Chưa có tài khoản?{' '}
          <Link href="/sign-up" className="font-medium text-primary-600 hover:text-primary-700">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
