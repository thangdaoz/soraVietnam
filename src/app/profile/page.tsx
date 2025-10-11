'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { updateProfile, changePassword, deleteAccount, getCurrentUser } from '@/lib/actions/auth';
import { getTransactionHistory } from '@/lib/actions/payment';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'credits'>('profile');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  // Transaction state
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  
  // Profile form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load user data
  useEffect(() => {
    async function loadUserData() {
      try {
        const supabase = createClient();
        
        // Get authenticated user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          router.push('/login');
          return;
        }
        
        setUser(authUser);
        
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single();
        
        if (!profileError && profileData) {
          setProfile(profileData);
          setFullName(profileData.full_name || '');
          setPhone(profileData.phone || '');
          setCompany(profileData.company || '');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserData();
  }, [router]);

  // Load transactions when billing tab is active
  useEffect(() => {
    async function loadTransactions() {
      if (activeTab === 'billing' && transactions.length === 0) {
        setTransactionsLoading(true);
        const result = await getTransactionHistory(50);
        if (result.success && result.transactions) {
          setTransactions(result.transactions);
        }
        setTransactionsLoading(false);
      }
    }
    
    loadTransactions();
  }, [activeTab, transactions.length]);

  // Handle profile update
  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    
    const formData = new FormData();
    formData.append('fullName', fullName);
    if (phone) formData.append('phone', phone);
    if (company) formData.append('company', company);
    
    const result = await updateProfile(formData);
    
    setProfileLoading(false);
    
    if (result.success) {
      setProfileSuccess('Cập nhật thông tin thành công!');
      // Reload profile data
      const supabase = createClient();
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      if (data) {
        setProfile(data);
      }
    } else {
      setProfileError(result.error || 'Có lỗi xảy ra khi cập nhật thông tin');
    }
  }

  // Handle password change
  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      setPasswordLoading(false);
      return;
    }
    
    const formData = new FormData();
    formData.append('currentPassword', currentPassword);
    formData.append('newPassword', newPassword);
    formData.append('confirmPassword', confirmPassword);
    
    const result = await changePassword(formData);
    
    setPasswordLoading(false);
    
    if (result.success) {
      setPasswordSuccess('Đổi mật khẩu thành công!');
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(result.error || 'Có lỗi xảy ra khi đổi mật khẩu');
    }
  }

  // Handle account deletion
  async function handleDeleteAccount() {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    setDeleteLoading(true);
    
    const result = await deleteAccount();
    
    if (result.success) {
      router.push('/');
    } else {
      alert(result.error || 'Có lỗi xảy ra khi xóa tài khoản');
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="text-neutral-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Page Header */}
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
                {profileSuccess && (
                  <Alert variant="success">{profileSuccess}</Alert>
                )}
                {profileError && (
                  <Alert variant="danger">{profileError}</Alert>
                )}
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-3xl text-white shadow-lg">
                        {(fullName || 'NA').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-neutral-600">Ảnh đại diện</p>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" size="sm" disabled>
                            Tải lên ảnh mới
                          </Button>
                          <Button type="button" variant="outline" size="sm" disabled>
                            Xóa
                          </Button>
                        </div>
                        <p className="text-xs text-neutral-500">Tính năng sẽ sớm có</p>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Input
                        label="Họ và tên"
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        id="email"
                        value={user?.email || ''}
                        disabled
                      />
                      <Input
                        label="Số điện thoại"
                        type="tel"
                        id="phone"
                        placeholder="+84 xxx xxx xxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <Input
                        label="Công ty/Tổ chức"
                        type="text"
                        id="company"
                        placeholder="Tên công ty (tùy chọn)"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => {
                        setFullName(profile?.full_name || '');
                        setPhone(profile?.phone || '');
                        setCompany(profile?.company || '');
                      }}>
                        Hủy
                      </Button>
                      <Button type="submit" variant="primary" disabled={profileLoading}>
                        {profileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>Cập nhật mật khẩu để bảo mật tài khoản</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {passwordSuccess && (
                  <Alert variant="success">{passwordSuccess}</Alert>
                )}
                {passwordError && (
                  <Alert variant="danger">{passwordError}</Alert>
                )}
                
                <form onSubmit={handlePasswordChange}>
                  <div className="space-y-6">
                    <Input
                      label="Mật khẩu hiện tại"
                      type="password"
                      id="currentPassword"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <Input
                      label="Mật khẩu mới"
                      type="password"
                      id="newPassword"
                      placeholder="••••••••"
                      helperText="Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <Input
                      label="Xác nhận mật khẩu mới"
                      type="password"
                      id="confirmPassword"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => {
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}>
                        Hủy
                      </Button>
                      <Button type="submit" variant="primary" disabled={passwordLoading}>
                        {passwordLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                      </Button>
                    </div>
                  </div>
                </form>
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
                {!showDeleteConfirm ? (
                  <Button 
                    type="button"
                    variant="outline" 
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    onClick={handleDeleteAccount}
                  >
                    Xóa tài khoản
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Alert variant="danger">
                      Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!
                    </Alert>
                    <div className="flex gap-3">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Hủy
                      </Button>
                      <Button 
                        type="button"
                        variant="primary"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? 'Đang xóa...' : 'Xác nhận xóa tài khoản'}
                      </Button>
                    </div>
                  </div>
                )}
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
                {transactionsLoading ? (
                  <div className="py-12 text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
                    <p className="text-sm text-neutral-600">Đang tải lịch sử giao dịch...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mb-4 text-5xl">📋</div>
                    <h3 className="mb-2 text-lg font-medium text-neutral-900">Chưa có giao dịch</h3>
                    <p className="mb-6 text-sm text-neutral-600">
                      Bạn chưa có giao dịch nào. Mua credits để bắt đầu!
                    </p>
                    <Link href="/checkout">
                      <Button variant="primary" size="sm">
                        Mua credits ngay
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-neutral-200">
                            <th className="pb-3 text-left text-sm font-medium text-neutral-600">Ngày</th>
                            <th className="pb-3 text-left text-sm font-medium text-neutral-600">Mô tả</th>
                            <th className="pb-3 text-left text-sm font-medium text-neutral-600">Loại</th>
                            <th className="pb-3 text-right text-sm font-medium text-neutral-600">Số tiền</th>
                            <th className="pb-3 text-right text-sm font-medium text-neutral-600">Credits</th>
                            <th className="pb-3 text-right text-sm font-medium text-neutral-600">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          {transactions.map((transaction) => {
                            const createdAt = new Date(transaction.created_at);
                            const isCredit = transaction.credits > 0;
                            const typeLabels: Record<string, string> = {
                              purchase: 'Mua credits',
                              video_generation: 'Tạo video',
                              refund: 'Hoàn tiền',
                              bonus: 'Thưởng',
                            };
                            const statusLabels: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }> = {
                              completed: { label: 'Thành công', variant: 'success' },
                              pending: { label: 'Đang xử lý', variant: 'warning' },
                              failed: { label: 'Thất bại', variant: 'danger' },
                              cancelled: { label: 'Đã hủy', variant: 'danger' },
                            };

                            return (
                              <tr key={transaction.id} className="text-sm">
                                <td className="py-4 text-neutral-600">
                                  {createdAt.toLocaleDateString('vi-VN')}
                                  <br />
                                  <span className="text-xs text-neutral-500">
                                    {createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </td>
                                <td className="py-4 text-neutral-900">
                                  {transaction.description || typeLabels[transaction.type] || transaction.type}
                                  {transaction.payment_id && (
                                    <div className="text-xs text-neutral-500">
                                      Mã GD: {transaction.payment_id}
                                    </div>
                                  )}
                                </td>
                                <td className="py-4">
                                  <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
                                    {typeLabels[transaction.type] || transaction.type}
                                  </span>
                                </td>
                                <td className="py-4 text-right text-neutral-900">
                                  {transaction.amount_vnd ? (
                                    new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND',
                                    }).format(transaction.amount_vnd)
                                  ) : (
                                    '-'
                                  )}
                                </td>
                                <td className={`py-4 text-right font-medium ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                                  {isCredit ? '+' : ''}{transaction.credits.toLocaleString('vi-VN')}
                                </td>
                                <td className="py-4 text-right">
                                  <Badge variant={statusLabels[transaction.status]?.variant || 'info'}>
                                    {statusLabels[transaction.status]?.label || transaction.status}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {transactions.length >= 50 && (
                      <div className="mt-6 flex justify-center">
                        <Button variant="outline" size="sm">
                          Tải thêm giao dịch
                        </Button>
                      </div>
                    )}
                  </>
                )}
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
