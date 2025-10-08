import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

export default function AuthSuccessPage() {
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
          <h1 className="text-3xl font-bold text-neutral-900">Xác thực thành công!</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Tài khoản của bạn đã được kích hoạt
          </p>
        </div>

        {/* Success Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          <Alert variant="success" className="mb-6">
            <AlertTitle>Email đã được xác thực</AlertTitle>
            <AlertDescription>
              Tài khoản của bạn đã được kích hoạt thành công. Bạn có thể đăng nhập và bắt đầu tạo video AI ngay bây giờ.
            </AlertDescription>
          </Alert>

          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-6 rounded-lg bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
            <p className="font-medium text-neutral-900 mb-3">🎉 Bước tiếp theo:</p>
            <div className="space-y-2 text-sm text-neutral-700">
              <div className="flex items-start gap-2">
                <span className="text-primary-600 font-semibold">1.</span>
                <span>Đăng nhập vào tài khoản của bạn</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary-600 font-semibold">2.</span>
                <span>Mua credits để bắt đầu tạo video</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary-600 font-semibold">3.</span>
                <span>Khám phá dashboard và tạo video AI đầu tiên</span>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <div className="mb-1 text-2xl">✨</div>
              <p className="font-medium text-neutral-900">Text-to-Video</p>
              <p className="text-xs text-neutral-600">Tạo video từ văn bản</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <div className="mb-1 text-2xl">🖼️</div>
              <p className="font-medium text-neutral-900">Image-to-Video</p>
              <p className="text-xs text-neutral-600">Biến ảnh thành video</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/login">
              <Button variant="primary" size="lg" className="w-full">
                Đăng nhập ngay
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" size="lg" className="w-full">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>

        {/* Help Link */}
        <p className="mt-6 text-center text-sm text-neutral-600">
          Cần hỗ trợ?{' '}
          <Link href="/contact" className="font-medium text-primary-600 hover:text-primary-700">
            Liên hệ chúng tôi
          </Link>
        </p>
      </div>
    </div>
  );
}
