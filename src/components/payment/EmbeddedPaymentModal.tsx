/**
 * PayOS Embedded Checkout Component
 * 
 * A modal component that embeds the PayOS payment interface directly
 * in your application without redirecting users to an external page.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface EmbeddedPaymentModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** PayOS checkout URL */
  checkoutUrl: string | null;
  /** Callback when payment is successful */
  onSuccess?: () => void;
  /** Callback when payment is cancelled */
  onCancel?: () => void;
  /** Order details to display */
  orderDetails?: {
    packageName: string;
    amount: number;
    credits: number;
  };
}

export function EmbeddedPaymentModal({
  isOpen,
  onClose,
  checkoutUrl,
  onSuccess,
  onCancel,
  orderDetails,
}: EmbeddedPaymentModalProps) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const paymentInstanceRef = useRef<{ open: () => void; exit: () => void } | null>(null);
  const containerIdRef = useRef(`payos-container-${Date.now()}`);

  useEffect(() => {
    if (!isOpen || !checkoutUrl || typeof window === "undefined" || !window.PayOSCheckout) {
      return;
    }

    console.log("Initializing PayOS embedded checkout with URL:", checkoutUrl);

    // Initialize PayOS checkout
    const config = {
      RETURN_URL: `${window.location.origin}/payment-success`, // Match the returnUrl from server
      ELEMENT_ID: containerIdRef.current,
      CHECKOUT_URL: checkoutUrl,
      embedded: true,
      onSuccess: (event: { orderCode: number; status: string }) => {
        console.log("Payment successful:", event);
        setIsPaymentOpen(false);
        onSuccess?.();
        onClose();
      },
      onCancel: (event: { orderCode: number }) => {
        console.log("Payment cancelled:", event);
        setIsPaymentOpen(false);
        onCancel?.();
      },
      onExit: (event: { orderCode?: number }) => {
        console.log("Payment exited:", event);
        setIsPaymentOpen(false);
      },
    };

    console.log("PayOS config:", config);

    try {
      const paymentInstance = window.PayOSCheckout.usePayOS(config);
      paymentInstanceRef.current = paymentInstance;
      
      // Auto-open the payment interface
      paymentInstance.open();
      setIsPaymentOpen(true);
      console.log("PayOS checkout opened successfully");
    } catch (error) {
      console.error("Failed to initialize PayOS checkout:", error);
    }

    return () => {
      // Cleanup: exit payment if modal is closed
      if (paymentInstanceRef.current && isPaymentOpen) {
        try {
          paymentInstanceRef.current.exit();
        } catch (error) {
          console.error("Failed to exit PayOS checkout:", error);
        }
      }
    };
  }, [isOpen, checkoutUrl, onSuccess, onCancel, onClose]);

  const handleClose = () => {
    if (paymentInstanceRef.current && isPaymentOpen) {
      try {
        paymentInstanceRef.current.exit();
      } catch (error) {
        console.error("Failed to exit PayOS checkout:", error);
      }
    }
    setIsPaymentOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="relative w-full max-w-4xl">
        <Card className="max-h-[95vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Thanh toán</CardTitle>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Đóng"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </CardHeader>
          <CardContent>
            {orderDetails && (
              <div className="mb-4 rounded-lg bg-blue-50 p-4">
                <h3 className="mb-2 font-semibold text-blue-900">Chi tiết đơn hàng</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>
                    <strong>Gói:</strong> {orderDetails.packageName}
                  </p>
                  <p>
                    <strong>Số credits:</strong> {orderDetails.credits.toLocaleString("vi-VN")}
                  </p>
                  <p>
                    <strong>Số tiền:</strong> {orderDetails.amount.toLocaleString("vi-VN")} VND
                  </p>
                </div>
              </div>
            )}

            {/* PayOS Checkout Container */}
            <div 
              id={containerIdRef.current} 
              className="h-[400px] w-full rounded-lg border border-neutral-200"
              style={{ minHeight: '400px' }}
            />

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
              <span className="mt-0.5">⚠️</span>
              <p>
                Vui lòng không đóng cửa sổ này trong quá trình thanh toán. 
                Credits sẽ được cập nhật tự động sau khi thanh toán thành công.
              </p>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Đóng
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
