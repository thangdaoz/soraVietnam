/**
 * Payment Success Page
 * 
 * Displayed after successful payment completion.
 * Shows transaction details and redirects to dashboard.
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getTransaction } from "@/lib/actions/payment";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("transactionId");
  
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!transactionId) {
      router.push("/checkout");
      return;
    }

    // Fetch transaction details
    const fetchTransaction = async () => {
      const result = await getTransaction(transactionId);
      if (result.success && result.transaction) {
        setTransaction(result.transaction);
      }
      setLoading(false);
    };

    fetchTransaction();
  }, [transactionId, router]);

  // Auto-redirect countdown
  useEffect(() => {
    if (!loading && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      router.push("/dashboard");
    }
  }, [countdown, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="text-neutral-600">Đang tải thông tin giao dịch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <Card className="w-full max-w-md">
        <CardContent className="py-12 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="mb-2 text-2xl font-bold text-neutral-900">
            Thanh toán thành công!
          </h1>
          <p className="mb-6 text-neutral-600">
            Giao dịch của bạn đang được xử lý. Credits sẽ được cập nhật trong giây lát.
          </p>

          {/* Transaction Details */}
          {transaction && (
            <div className="mb-6 space-y-3 rounded-lg bg-neutral-50 p-4 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Mã giao dịch:</span>
                <span className="font-mono font-medium text-neutral-900">
                  {transaction.payment_id}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Số credits:</span>
                <span className="font-medium text-neutral-900">
                  {transaction.credits.toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Số tiền:</span>
                <span className="font-medium text-neutral-900">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(transaction.amount_vnd)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Trạng thái:</span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500"></span>
                  <span className="font-medium text-yellow-600">Đang xử lý</span>
                </span>
              </div>
            </div>
          )}

          {/* Info Message */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="mt-0.5">ℹ️</span>
              <div className="text-left">
                <p className="font-medium">Lưu ý quan trọng</p>
                <p className="mt-1 text-xs">
                  Hệ thống đang xác nhận thanh toán với ngân hàng. Credits sẽ được cập nhật
                  tự động trong vài giây. Bạn có thể kiểm tra số dư trong trang Dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Auto-redirect Notice */}
          <p className="mb-6 text-sm text-neutral-500">
            Tự động chuyển đến Dashboard trong {countdown} giây...
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/dashboard">
              <Button variant="primary" size="lg" className="w-full">
                Đi đến Dashboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="lg" className="w-full">
                Xem lịch sử giao dịch
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="text-neutral-600">Đang tải...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
