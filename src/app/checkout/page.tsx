"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { fetchCreditPackages, formatVND } from "@/lib/payos/packages";
import { createPaymentLink } from "@/lib/actions/payment";
import { EmbeddedPaymentModal } from "@/components/payment/EmbeddedPaymentModal";
import type { CreditPackage } from "@/lib/payos/packages";

export default function CheckoutPage() {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Embedded payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<{
    packageName: string;
    amount: number;
    credits: number;
  } | null>(null);

  const MIN_AMOUNT = 30000;
  const MAX_AMOUNT = 20000000;

  // Fetch credit packages from database on mount
  useEffect(() => {
    async function loadPackages() {
      try {
        const fetchedPackages = await fetchCreditPackages();
        setPackages(fetchedPackages);
        
        // Set default selected package (first one or the popular one)
        if (fetchedPackages.length > 0) {
          const popularPackage = fetchedPackages.find((pkg) => pkg.isPopular);
          setSelectedPackageId(popularPackage?.id || fetchedPackages[0].id);
        }
      } catch (err) {
        console.error("Error loading packages:", err);
        setError("Không thể tải danh sách gói credits. Vui lòng thử lại.");
      } finally {
        setLoadingPackages(false);
      }
    }

    loadPackages();
  }, []);

  const selectedPackage = packages.find((pkg) => pkg.id === selectedPackageId);

  const handleCustomAmountChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    setCustomAmount(numericValue);
  };

  const getCustomAmountError = (): string | null => {
    if (!customAmount) return null;
    const amount = parseInt(customAmount);
    if (amount < MIN_AMOUNT) {
      return `Số tiền tối thiểu là ${formatVND(MIN_AMOUNT)}`;
    }
    if (amount > MAX_AMOUNT) {
      return `Số tiền tối đa là ${formatVND(MAX_AMOUNT)}`;
    }
    return null;
  };

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);

    try {
      let result;
      let packageName: string;
      let amount: number;
      let credits: number;
      
      if (useCustomAmount) {
        const customAmountValue = parseInt(customAmount);
        const amountError = getCustomAmountError();
        
        if (amountError) {
          setError(amountError);
          setLoading(false);
          return;
        }
        
        packageName = "Gói Tùy Chỉnh";
        amount = customAmountValue;
        credits = customAmountValue;
        result = await createPaymentLink(null, customAmountValue);
      } else {
        if (!selectedPackage) {
          setError("Vui lòng chọn gói credits");
          setLoading(false);
          return;
        }
        
        packageName = selectedPackage.name;
        amount = selectedPackage.priceVnd;
        credits = selectedPackage.credits;
        result = await createPaymentLink(selectedPackage.id);
      }

      if (result.success && result.checkoutUrl) {
        // Set order details and open embedded payment modal
        setOrderDetails({
          packageName,
          amount,
          credits,
        });
        setCheckoutUrl(result.checkoutUrl);
        setIsPaymentModalOpen(true);
      } else {
        setError(result.error || "Không thể tạo liên kết thanh toán");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Redirect to profile page with success message
    window.location.href = "/profile?payment=success";
  };

  const handlePaymentCancel = () => {
    // Reset state
    setCheckoutUrl(null);
    setOrderDetails(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-neutral-900">Mua Credits</h1>
          <p className="text-neutral-600">Chọn gói credits phù hợp với nhu cầu của bạn</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg"></span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Chọn gói credits</CardTitle>
                <CardDescription>Tất cả các gói đều không giới hạn thời gian sử dụng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {loadingPackages ? (
                    <div className="col-span-3 py-8 text-center text-neutral-600">
                      Đang tải gói credits...
                    </div>
                  ) : packages.length === 0 ? (
                    <div className="col-span-3 py-8 text-center text-neutral-600">
                      Không có gói credits nào khả dụng
                    </div>
                  ) : (
                    packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackageId(pkg.id);
                        setUseCustomAmount(false);
                      }}
                      disabled={useCustomAmount}
                      className={`relative rounded-lg border-2 p-6 text-left transition-all ${
                        selectedPackageId === pkg.id && !useCustomAmount
                          ? "border-primary-600 bg-primary-50 shadow-md"
                          : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                      } ${useCustomAmount ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {pkg.isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-1 text-xs font-medium text-white shadow-md">
                            Phổ biến nhất
                          </span>
                        </div>
                      )}

                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-lg font-semibold text-neutral-900">{pkg.name}</span>
                        {selectedPackageId === pkg.id && !useCustomAmount && (
                          <span className="text-xl text-primary-600">✓</span>
                        )}
                      </div>

                      <div className="mb-2">
                        <div className="text-3xl font-bold text-primary-600">
                          {formatVND(pkg.priceVnd)}
                        </div>
                        {pkg.discountPercentage > 0 && (
                          <div className="mt-1 flex items-center gap-2">
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                              Tiết kiệm {pkg.discountPercentage}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mb-4 text-sm text-neutral-600">
                        {pkg.credits.toLocaleString("vi-VN")} credits
                      </div>

                      <ul className="space-y-2 text-sm">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-0.5 text-green-600">✓</span>
                            <span className="text-neutral-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hoặc nhập số tiền tùy chỉnh</CardTitle>
                <CardDescription>Nạp credits với số tiền bạn mong muốn (1 VND = 1 credit)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      Số tiền (VND)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customAmount ? parseInt(customAmount).toLocaleString("vi-VN") : ""}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        onFocus={() => setUseCustomAmount(true)}
                        placeholder="Nhập số tiền từ 30,000 đến 20,000,000"
                        className={`w-full rounded-lg border-2 px-4 py-3 text-lg font-medium transition-all ${
                          useCustomAmount
                            ? "border-primary-600 bg-primary-50 ring-2 ring-primary-200"
                            : "border-neutral-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
                        } ${getCustomAmountError() ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                      />
                      {customAmount && (
                        <button
                          onClick={() => {
                            setCustomAmount("");
                            setUseCustomAmount(false);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {getCustomAmountError() && (
                      <p className="mt-2 text-sm text-red-600">{getCustomAmountError()}</p>
                    )}
                    {customAmount && !getCustomAmountError() && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ Bạn sẽ nhận được {parseInt(customAmount).toLocaleString("vi-VN")} credits
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                    <div className="flex gap-2">
                      <span className="mt-0.5">ℹ️</span>
                      <div>
                        <p className="font-medium">Quy đổi đơn giản</p>
                        <p className="mt-1 text-xs">
                          1 VND = 1 credit. Ví dụ: nạp 100,000 VND = nhận 100,000 credits
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCustomAmountChange("50000")}
                      className="flex-1 rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:border-primary-600 hover:bg-primary-50 hover:text-primary-700"
                    >
                      50,000
                    </button>
                    <button
                      onClick={() => handleCustomAmountChange("100000")}
                      className="flex-1 rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:border-primary-600 hover:bg-primary-50 hover:text-primary-700"
                    >
                      100,000
                    </button>
                    <button
                      onClick={() => handleCustomAmountChange("500000")}
                      className="flex-1 rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:border-primary-600 hover:bg-primary-50 hover:text-primary-700"
                    >
                      500,000
                    </button>
                    <button
                      onClick={() => handleCustomAmountChange("1000000")}
                      className="flex-1 rounded-lg border-2 border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:border-primary-600 hover:bg-primary-50 hover:text-primary-700"
                    >
                      1,000,000
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
                <CardDescription>Hỗ trợ đa dạng phương thức thanh toán</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-4 rounded-lg border border-neutral-200 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
                      
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900">Chuyển khoản ngân hàng</h3>
                      <p className="text-sm text-neutral-600">
                        Tất cả các ngân hàng tại Việt Nam
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border border-neutral-200 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl">
                      
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900">Quét mã QR</h3>
                      <p className="text-sm text-neutral-600">
                        Thanh toán nhanh qua QR Code
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">ℹ️</span>
                    <div>
                      <p className="font-medium">Credits được cập nhật tự động</p>
                      <p className="mt-1 text-xs">
                        Sau khi thanh toán thành công, credits sẽ được thêm vào tài khoản của bạn ngay lập tức.
                        Hệ thống PayOS đảm bảo an toàn và bảo mật tuyệt đối.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-lg bg-neutral-100 p-4 text-sm text-neutral-700">
              <p>
                Bằng việc nhấn "Tiếp tục thanh toán", bạn đồng ý với{" "}
                <Link href="/terms" className="font-medium text-primary-600 hover:text-primary-700">
                  Điều khoản dịch vụ
                </Link>{" "}
                và{" "}
                <Link href="/privacy" className="font-medium text-primary-600 hover:text-primary-700">
                  Chính sách bảo mật
                </Link>{" "}
                của chúng tôi.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handlePurchase}
              disabled={loading || (!selectedPackage && !useCustomAmount) || (useCustomAmount && !customAmount)}
            >
              {loading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Đang xử lý...
                </>
              ) : (
                <>Tiếp tục thanh toán</>
              )}
            </Button>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {useCustomAmount && customAmount ? (
                    <>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Loại:</span>
                          <span className="font-medium text-neutral-900">Gói Tùy Chỉnh</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Số tiền:</span>
                          <span className="font-medium text-neutral-900">
                            {formatVND(parseInt(customAmount))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Số credits:</span>
                          <span className="font-medium text-neutral-900">
                            {parseInt(customAmount).toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-neutral-200 pt-4">
                        <div className="flex justify-between text-lg">
                          <span className="font-semibold text-neutral-900">Tổng cộng:</span>
                          <span className="font-bold text-primary-600">
                            {formatVND(parseInt(customAmount))}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : selectedPackage ? (
                    <>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Gói credits:</span>
                          <span className="font-medium text-neutral-900">{selectedPackage.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Số credits:</span>
                          <span className="font-medium text-neutral-900">
                            {selectedPackage.credits.toLocaleString("vi-VN")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Giá gốc:</span>
                          <span className={selectedPackage.discountPercentage > 0 ? "text-neutral-500 line-through" : "font-medium text-neutral-900"}>
                            {formatVND(selectedPackage.priceVnd)}
                          </span>
                        </div>
                        {selectedPackage.discountPercentage > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Giảm giá ({selectedPackage.discountPercentage}%):</span>
                            <span className="font-medium">
                              -{formatVND((selectedPackage.priceVnd * selectedPackage.discountPercentage) / 100)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-neutral-200 pt-4">
                        <div className="flex justify-between text-lg">
                          <span className="font-semibold text-neutral-900">Tổng cộng:</span>
                          <span className="font-bold text-primary-600">
                            {formatVND(selectedPackage.priceVnd)}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-neutral-500">
                      <p>Chọn gói credits hoặc nhập số tiền tùy chỉnh</p>
                    </div>
                  )}

                  <div className="rounded-lg bg-gradient-to-r from-primary-50 to-primary-100 p-4 text-sm">
                    <div className="mb-2 flex items-center gap-2 font-semibold text-primary-900">
                      <span>⭐</span>
                      <span>Ưu đãi đặc biệt</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-primary-800">
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Nhận credits ngay lập tức</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Không giới hạn thời gian sử dụng</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Hỗ trợ 24/7</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Bảo mật thanh toán tuyệt đối</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent className="py-6 text-center">
                  <div className="mb-2 text-3xl">💬</div>
                  <h3 className="mb-2 text-lg font-semibold text-neutral-900">Cần hỗ trợ?</h3>
                  <p className="mb-4 text-sm text-neutral-600">
                    Liên hệ với chúng tôi nếu bạn có thắc mắc về thanh toán
                  </p>
                  <Link href="/contact">
                    <Button variant="outline" size="sm">
                      Liên hệ hỗ trợ
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <div className="space-y-2 text-xs text-neutral-600">
                <p className="flex items-center gap-2">
                  <span className="text-green-600">🔒</span>
                  <span>Thanh toán an toàn & bảo mật</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-blue-600">⚡</span>
                  <span>Credits cập nhật tự động</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">💯</span>
                  <span>Đảm bảo hoàn tiền nếu có vấn đề</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Payment Modal */}
      <EmbeddedPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        checkoutUrl={checkoutUrl}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
        orderDetails={orderDetails || undefined}
      />
    </div>
  );
}
