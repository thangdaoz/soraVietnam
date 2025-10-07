'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'credits'>('profile');

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-lg text-white shadow-lg">
              SV
            </span>
            <span className="text-lg font-bold text-neutral-900">Sora Vietnam</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/dashboard" className="text-sm font-medium text-neutral-600 hover:text-primary-600">
              Dashboard
            </Link>
            <Link href="/profile" className="text-sm font-medium text-primary-600">
              Tài khoản
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2">
              <span className="text-2xl">💎</span>
              <div className="text-left">
                <p className="text-xs text-neutral-500">Credits</p>
                <p className="text-sm font-bold text-neutral-900">250,000</p>
              </div>
            </div>
            <Button variant="primary" size="sm">
              <span className="mr-1">+</span> Nạp credits
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-neutral-900">Cài đặt tài khoản</h1>
          <p className="text-neutral-600">Quản lý thông tin cá nhân và lịch sử giao dịch</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            👤 Hồ sơ
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'billing'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            📊 Lịch sử giao dịch
          </button>
          <button
            onClick={() => setActiveTab('credits')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'credits'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            💎 Mua credits
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-3xl text-white shadow-lg">
                    NA
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-600">Ảnh đại diện</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Tải lên ảnh mới
                      </Button>
                      <Button variant="outline" size="sm">
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Họ và tên"
                    type="text"
                    id="fullName"
                    defaultValue="Nguyễn Văn A"
                  />
                  <Input
                    label="Email"
                    type="email"
                    id="email"
                    defaultValue="nguyen@example.com"
                    disabled
                  />
                  <Input
                    label="Số điện thoại"
                    type="tel"
                    id="phone"
                    placeholder="+84 xxx xxx xxx"
                  />
                  <Input
                    label="Công ty/Tổ chức"
                    type="text"
                    id="company"
                    placeholder="Tên công ty (tùy chọn)"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Hủy</Button>
                  <Button variant="primary">Lưu thay đổi</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>Cập nhật mật khẩu để bảo mật tài khoản</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Mật khẩu hiện tại"
                  type="password"
                  id="currentPassword"
                  placeholder="••••••••"
                />
                <Input
                  label="Mật khẩu mới"
                  type="password"
                  id="newPassword"
                  placeholder="••••••••"
                  helperText="Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                />
                <Input
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                />

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Hủy</Button>
                  <Button variant="primary">Đổi mật khẩu</Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <CardTitle className="text-red-600">Xóa tài khoản</CardTitle>
                <CardDescription>
                  Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị xóa vĩnh viễn.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                  Xóa tài khoản
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Billing History Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử giao dịch</CardTitle>
                <CardDescription>Xem tất cả các giao dịch credits và video</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="pb-3 text-left text-sm font-medium text-neutral-600">Ngày</th>
                        <th className="pb-3 text-left text-sm font-medium text-neutral-600">Mô tả</th>
                        <th className="pb-3 text-right text-sm font-medium text-neutral-600">Số lượng</th>
                        <th className="pb-3 text-right text-sm font-medium text-neutral-600">Số dư</th>
                        <th className="pb-3 text-right text-sm font-medium text-neutral-600">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr className="text-sm">
                        <td className="py-4 text-neutral-600">07/10/2025</td>
                        <td className="py-4 text-neutral-900">Nạp credits - Gói Basic</td>
                        <td className="py-4 text-right font-medium text-green-600">+900,000</td>
                        <td className="py-4 text-right text-neutral-900">1,150,000</td>
                        <td className="py-4 text-right">
                          <Badge variant="success">Thành công</Badge>
                        </td>
                      </tr>
                      <tr className="text-sm">
                        <td className="py-4 text-neutral-600">07/10/2025</td>
                        <td className="py-4 text-neutral-900">Tạo video - Bãi biển hoàng hôn</td>
                        <td className="py-4 text-right font-medium text-red-600">-5,000</td>
                        <td className="py-4 text-right text-neutral-900">250,000</td>
                        <td className="py-4 text-right">
                          <Badge variant="info">Đã xử lý</Badge>
                        </td>
                      </tr>
                      <tr className="text-sm">
                        <td className="py-4 text-neutral-600">06/10/2025</td>
                        <td className="py-4 text-neutral-900">Tạo video - Rừng nhiệt đới</td>
                        <td className="py-4 text-right font-medium text-red-600">-5,000</td>
                        <td className="py-4 text-right text-neutral-900">255,000</td>
                        <td className="py-4 text-right">
                          <Badge variant="info">Đã xử lý</Badge>
                        </td>
                      </tr>
                      <tr className="text-sm">
                        <td className="py-4 text-neutral-600">05/10/2025</td>
                        <td className="py-4 text-neutral-900">Tạo video - Phố cổ Hà Nội</td>
                        <td className="py-4 text-right font-medium text-red-600">-10,000</td>
                        <td className="py-4 text-right text-neutral-900">260,000</td>
                        <td className="py-4 text-right">
                          <Badge variant="info">Đã xử lý</Badge>
                        </td>
                      </tr>
                      <tr className="text-sm">
                        <td className="py-4 text-neutral-600">03/10/2025</td>
                        <td className="py-4 text-neutral-900">Nạp credits - Gói Starter</td>
                        <td className="py-4 text-right font-medium text-green-600">+300,000</td>
                        <td className="py-4 text-right text-neutral-900">270,000</td>
                        <td className="py-4 text-right">
                          <Badge variant="success">Thành công</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button variant="outline" size="sm">
                    Tải thêm giao dịch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Purchase Credits Tab */}
        {activeTab === 'credits' && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: 'Gói Starter',
                  price: '300,000',
                  credits: '300,000',
                  videos: '~60 video 5s',
                  popular: false,
                },
                {
                  name: 'Gói Basic',
                  price: '900,000',
                  credits: '900,000',
                  videos: '~180 video 5s',
                  popular: true,
                },
                {
                  name: 'Gói Premium',
                  price: '2,400,000',
                  credits: '2,400,000',
                  videos: '~480 video 5s',
                  popular: false,
                },
              ].map((tier) => (
                <Card
                  key={tier.name}
                  variant={tier.popular ? 'elevated' : 'default'}
                  className={tier.popular ? 'ring-2 ring-primary-600' : ''}
                >
                  {tier.popular && (
                    <div className="absolute right-4 top-0 -translate-y-1/2 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                      Phổ biến nhất
                    </div>
                  )}
                  <CardContent className="space-y-6 pt-8">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">{tier.name}</h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary-600">{tier.price}</span>
                        <span className="text-neutral-600">VND</span>
                      </div>
                    </div>

                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-neutral-700">{tier.credits} credits</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-neutral-700">Tạo {tier.videos}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-neutral-700">Hỗ trợ ưu tiên</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-neutral-700">Lưu trữ không giới hạn</span>
                      </li>
                    </ul>

                    <Link href="/checkout">
                      <Button
                        variant={tier.popular ? 'primary' : 'outline'}
                        size="lg"
                        className="w-full"
                      >
                        Mua ngay
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card variant="outlined" className="bg-gradient-to-br from-primary-50 to-secondary-50">
              <CardContent className="py-8 text-center">
                <h3 className="mb-2 text-xl font-bold text-neutral-900">
                  🎁 Ưu đãi đặc biệt cho khách hàng doanh nghiệp
                </h3>
                <p className="mb-4 text-neutral-600">
                  Liên hệ với chúng tôi để nhận gói credits tùy chỉnh và giá ưu đãi
                </p>
                <Button variant="primary">
                  Liên hệ ngay
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
