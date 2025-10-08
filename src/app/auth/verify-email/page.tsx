import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

export default function VerifyEmailPage() {
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
          <h1 className="text-3xl font-bold text-neutral-900">Xác thực email</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Vui lòng kiểm tra hộp thư của bạn
          </p>
        </div>

        {/* Verification Info */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          <Alert variant="info" className="mb-6">
            <AlertTitle>Email xác thực đã được gửi</AlertTitle>
            <AlertDescription>
              Chúng tôi đã gửi một email xác thực đến địa chỉ email của bạn. 
              Vui lòng kiểm tra hộp thư và nhấp vào link xác thực để kích hoạt tài khoản.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {/* Email icon */}
            <div className="flex justify-center">
              <svg
                className="h-24 w-24 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
            <div className="space-y-3 text-sm text-neutral-600">
              <p className="font-medium text-neutral-900">Các bước tiếp theo:</p>
              <ol className="list-inside list-decimal space-y-2 pl-2">
                <li>Mở email từ Sora Vietnam Gateway</li>
                <li>Nhấp vào nút "Xác thực email"</li>
                <li>Bạn sẽ được chuyển hướng đến trang đăng nhập</li>
                <li>Đăng nhập và bắt đầu tạo video AI</li>
              </ol>
            </div>

            {/* Troubleshooting */}
            <div className="rounded-lg bg-neutral-50 p-4">
              <p className="text-sm font-medium text-neutral-900">Không nhận được email?</p>
              <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                <li>• Kiểm tra thư mục spam hoặc junk mail</li>
                <li>• Đảm bảo địa chỉ email chính xác</li>
                <li>• Đợi vài phút và kiểm tra lại</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Gửi lại email xác thực
              </Button>

              <Link href="/login">
                <Button variant="ghost" size="lg" className="w-full">
                  Quay lại đăng nhập
                </Button>
              </Link>
            </div>
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
