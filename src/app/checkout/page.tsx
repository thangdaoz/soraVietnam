'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [paymentMethod, setPaymentMethod] = useState('bank-transfer');

  const plans = {
    starter: { name: 'Gói Starter', price: 300000, credits: 300000 },
    basic: { name: 'Gói Basic', price: 900000, credits: 900000 },
    premium: { name: 'Gói Premium', price: 2400000, credits: 2400000 },
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-lg text-white shadow-lg">
              SV
            </span>
            <span className="text-lg font-bold text-neutral-900">Sora Vietnam</span>
          </Link>

          <div className="flex items-center gap-4">
            <Badge variant="info">Thanh toán an toàn</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-neutral-900">Thanh toán</h1>
          <p className="text-neutral-600">Hoàn tất thanh toán để nhận credits ngay lập tức</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Payment Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Select Plan */}
            <Card>
              <CardHeader>
                <CardTitle>1. Chọn gói credits</CardTitle>
                <CardDescription>Chọn gói phù hợp với nhu cầu của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {Object.entries(plans).map(([key, plan]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPlan(key)}
                      className={`rounded-lg border-2 p-4 text-left transition-all ${
                        selectedPlan === key
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-neutral-900">{plan.name}</span>
                        {selectedPlan === key && (
                          <span className="text-primary-600">✓</span>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-primary-600">
                        {plan.price.toLocaleString('vi-VN')} đ
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">
                        {plan.credits.toLocaleString('vi-VN')} credits
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>2. Phương thức thanh toán</CardTitle>
                <CardDescription>Chọn cách thức thanh toán phù hợp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bank Transfer */}
                <button
                  onClick={() => setPaymentMethod('bank-transfer')}
                  className={`flex w-full items-start gap-4 rounded-lg border-2 p-4 text-left transition-all ${
                    paymentMethod === 'bank-transfer'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
                    🏦
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-neutral-900">Chuyển khoản ngân hàng</h3>
                      {paymentMethod === 'bank-transfer' && (
                        <span className="text-primary-600">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600">
                      Chuyển khoản trực tiếp qua ngân hàng hoặc ví điện tử
                    </p>
                    {paymentMethod === 'bank-transfer' && (
                      <div className="mt-4 rounded-lg bg-neutral-50 p-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Ngân hàng:</span>
                            <span className="font-medium">Vietcombank</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Số tài khoản:</span>
                            <span className="font-medium">1234567890</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Chủ tài khoản:</span>
                            <span className="font-medium">SORA VIETNAM COMPANY</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Nội dung:</span>
                            <span className="font-medium text-primary-600">SV ORDER123456</span>
                          </div>
                        </div>
                        <div className="mt-3 rounded bg-yellow-50 p-3 text-xs text-yellow-800">
                          ⚠️ Vui lòng nhập đúng nội dung chuyển khoản để hệ thống tự động xác nhận
                        </div>
                      </div>
                    )}
                  </div>
                </button>

                {/* E-Wallet */}
                <button
                  onClick={() => setPaymentMethod('e-wallet')}
                  className={`flex w-full items-start gap-4 rounded-lg border-2 p-4 text-left transition-all ${
                    paymentMethod === 'e-wallet'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl">
                    💳
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-neutral-900">Ví điện tử</h3>
                      {paymentMethod === 'e-wallet' && (
                        <span className="text-primary-600">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600">
                      Thanh toán qua MoMo, ZaloPay, VNPay
                    </p>
                  </div>
                </button>

                {/* QR Code */}
                <button
                  onClick={() => setPaymentMethod('qr-code')}
                  className={`flex w-full items-start gap-4 rounded-lg border-2 p-4 text-left transition-all ${
                    paymentMethod === 'qr-code'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl">
                    📱
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-neutral-900">Quét mã QR</h3>
                      {paymentMethod === 'qr-code' && (
                        <span className="text-primary-600">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600">
                      Quét mã QR để thanh toán nhanh chóng
                    </p>
                    {paymentMethod === 'qr-code' && (
                      <div className="mt-4 flex justify-center">
                        <div className="rounded-lg bg-white p-4 shadow-lg">
                          <div className="flex h-48 w-48 items-center justify-center bg-neutral-100">
                            <span className="text-6xl">📷</span>
                          </div>
                          <p className="mt-2 text-center text-xs text-neutral-600">
                            Mã QR thanh toán
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle>3. Thông tin thanh toán</CardTitle>
                <CardDescription>Thông tin để xuất hóa đơn (tùy chọn)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Họ và tên / Công ty"
                  type="text"
                  id="billingName"
                  placeholder="Nguyễn Văn A"
                />
                <Input
                  label="Địa chỉ email"
                  type="email"
                  id="billingEmail"
                  placeholder="email@example.com"
                />
                <Input
                  label="Số điện thoại"
                  type="tel"
                  id="billingPhone"
                  placeholder="+84 xxx xxx xxx"
                />
                <Input
                  label="Mã số thuế (nếu có)"
                  type="text"
                  id="taxId"
                  placeholder="0123456789"
                />

                <Checkbox
                  id="invoice"
                  label="Tôi muốn xuất hóa đơn VAT"
                />
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardContent className="py-6">
                <Checkbox
                  id="terms"
                  label={
                    <span className="text-sm text-neutral-600">
                      Tôi đồng ý với{' '}
                      <Link href="/terms" className="font-medium text-primary-600 hover:text-primary-700">
                        Điều khoản dịch vụ
                      </Link>{' '}
                      và{' '}
                      <Link href="/privacy" className="font-medium text-primary-600 hover:text-primary-700">
                        Chính sách hoàn tiền
                      </Link>
                    </span>
                  }
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <Button variant="primary" size="lg" className="w-full">
              Xác nhận thanh toán
            </Button>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Gói credits:</span>
                      <span className="font-medium text-neutral-900">{currentPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Số credits:</span>
                      <span className="font-medium text-neutral-900">
                        {currentPlan.credits.toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Tạm tính:</span>
                      <span className="font-medium text-neutral-900">
                        {currentPlan.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-medium text-neutral-900">Tổng cộng:</span>
                      <span className="font-bold text-primary-600">
                        {currentPlan.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
                    <div className="mb-2 flex items-center gap-2 font-medium">
                      <span>🎁</span>
                      <span>Ưu đãi đặc biệt</span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      <li>✓ Nhận credits ngay lập tức</li>
                      <li>✓ Không giới hạn thời gian sử dụng</li>
                      <li>✓ Hỗ trợ 24/7</li>
                    </ul>
                  </div>

                  <div className="space-y-2 text-xs text-neutral-600">
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">🔒</span>
                      <span>Thanh toán an toàn & bảo mật</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-blue-600">⚡</span>
                      <span>Credits được cập nhật tự động</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-purple-600">💯</span>
                      <span>Chính sách hoàn tiền trong 7 ngày</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card className="mt-6" variant="outlined">
                <CardContent className="py-6 text-center">
                  <div className="mb-2 text-2xl">💬</div>
                  <h3 className="mb-1 font-medium text-neutral-900">Cần hỗ trợ?</h3>
                  <p className="mb-3 text-sm text-neutral-600">
                    Liên hệ với chúng tôi nếu bạn có thắc mắc
                  </p>
                  <Link href="/contact">
                    <Button variant="outline" size="sm">
                      Liên hệ hỗ trợ
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
