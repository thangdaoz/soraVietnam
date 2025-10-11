/**
 * Payment Cancelled Page
 * 
 * Displayed when user cancels payment or payment fails.
 * Provides options to retry or contact support.
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getTransaction, cancelTransaction } from "@/lib/actions/payment";

function PaymentCancelledContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("transactionId");
  
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    if (!transactionId) {
      router.push("/checkout");
      return;
    }

    // Fetch transaction details and cancel it
    const fetchAndCancelTransaction = async () => {
      const result = await getTransaction(transactionId);
      if (result.success && result.transaction) {
        setTransaction(result.transaction);
        
        // Cancel the transaction if still pending
        if (result.transaction.status === "pending") {
          await cancelTransaction(transactionId);
        }
      }
      setLoading(false);
    };

    fetchAndCancelTransaction();
  }, [transactionId, router]);

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <Card className="w-full max-w-md">
        <CardContent className="py-12 text-center">
          {/* Cancel Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-12 w-12 text-red-600"
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

          {/* Cancel Message */}
          <h1 className="mb-2 text-2xl font-bold text-neutral-900">
            Thanh toán đã bị hủy
          </h1>
          <p className="mb-6 text-neutral-600">
            Giao dịch của bạn đã bị hủy hoặc không thành công. Không có khoản tiền nào bị trừ từ tài khoản của bạn.
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
                <span className="font-medium text-red-600">Đã hủy</span>
              </div>
            </div>
          )}

          {/* Possible Reasons */}
          <div className="mb-6 rounded-lg bg-yellow-50 p-4 text-left text-sm text-yellow-800">
            <p className="mb-2 font-medium">Có thể do các lý do sau:</p>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Bạn đã nhấn nút hủy trong quá trình thanh toán</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Phiên thanh toán đã hết hạn</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Thông tin thanh toán không chính xác</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Ngân hàng từ chối giao dịch</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/checkout">
              <Button variant="primary" size="lg" className="w-full">
                Thử lại thanh toán
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full">
                Quay về Dashboard
              </Button>
            </Link>
          </div>

          {/* Support Section */}
          <div className="mt-6 border-t border-neutral-200 pt-6">
            <p className="mb-3 text-sm text-neutral-600">
              Gặp vấn đề với thanh toán?
            </p>
            <Link href="/contact">
              <Button variant="ghost" size="sm">
                💬 Liên hệ hỗ trợ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="text-neutral-600">Đang tải...</p>
        </div>
      </div>
    }>
      <PaymentCancelledContent />
    </Suspense>
  );
}
