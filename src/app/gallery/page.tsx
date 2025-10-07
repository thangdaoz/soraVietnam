import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function GalleryPage() {
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
              Tạo video
            </Link>
            <Link href="/gallery" className="text-sm font-medium text-primary-600">
              Thư viện
            </Link>
            <Link href="/profile" className="text-sm font-medium text-neutral-600 hover:text-primary-600">
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
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-neutral-900">Thư viện video</h1>
          <p className="text-neutral-600">Quản lý và chia sẻ tất cả video đã tạo</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 md:flex-row md:items-end">
          <div className="flex-1">
            <Input
              label="Tìm kiếm video"
              type="search"
              id="search"
              placeholder="Nhập tên video..."
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              label="Trạng thái"
              id="status"
              options={[
                { value: 'all', label: 'Tất cả' },
                { value: 'processing', label: 'Đang xử lý' },
                { value: 'completed', label: 'Hoàn thành' },
                { value: 'failed', label: 'Thất bại' },
              ]}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              label="Tỷ lệ"
              id="aspectRatio"
              options={[
                { value: 'all', label: 'Tất cả' },
                { value: '16:9', label: '16:9' },
                { value: '1:1', label: '1:1' },
                { value: '9:16', label: '9:16' },
              ]}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              label="Sắp xếp"
              id="sort"
              options={[
                { value: 'newest', label: 'Mới nhất' },
                { value: 'oldest', label: 'Cũ nhất' },
                { value: 'name', label: 'Tên A-Z' },
              ]}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-sm text-neutral-600">Tổng video</p>
            <p className="text-2xl font-bold text-neutral-900">24</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-sm text-neutral-600">Đang xử lý</p>
            <p className="text-2xl font-bold text-orange-600">2</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-sm text-neutral-600">Hoàn thành</p>
            <p className="text-2xl font-bold text-green-600">21</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-sm text-neutral-600">Thất bại</p>
            <p className="text-2xl font-bold text-red-600">1</p>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Processing Video */}
          <Card>
            <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-neutral-900">
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                <div className="text-center text-white">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mx-auto">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <p className="text-sm font-medium">Đang xử lý...</p>
                  <p className="text-xs text-white/80">Còn lại 2:15</p>
                  <div className="mx-auto mt-3 h-1.5 w-32 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-2/3 bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="space-y-3 pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900">Bãi biển hoàng hôn</h3>
                  <p className="text-xs text-neutral-500">5 giây • 16:9 • Hôm nay 14:30</p>
                </div>
                <Badge variant="warning">Đang xử lý</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Chờ xử lý...
              </Button>
            </CardContent>
          </Card>

          {/* Completed Videos */}
          {[
            { title: 'Rừng nhiệt đới', time: '5 giây • 1:1 • Hôm qua', color: 'from-green-600 to-teal-600' },
            { title: 'Phố cổ Hà Nội', time: '10 giây • 9:16 • 2 ngày trước', color: 'from-orange-600 to-red-600' },
            { title: 'Vịnh Hạ Long', time: '5 giây • 16:9 • 3 ngày trước', color: 'from-cyan-600 to-blue-600' },
            { title: 'Núi rừng Sapa', time: '10 giây • 1:1 • 4 ngày trước', color: 'from-purple-600 to-pink-600' },
            { title: 'Hội An đêm', time: '5 giây • 9:16 • 5 ngày trước', color: 'from-yellow-600 to-orange-600' },
            { title: 'Mekong Delta', time: '10 giây • 16:9 • 1 tuần trước', color: 'from-emerald-600 to-green-600' },
            { title: 'Phú Quốc beach', time: '5 giây • 1:1 • 1 tuần trước', color: 'from-blue-600 to-indigo-600' },
            { title: 'Đà Lạt', time: '5 giây • 16:9 • 2 tuần trước', color: 'from-pink-600 to-rose-600' },
          ].map((video, index) => (
            <Card key={index}>
              <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-neutral-900">
                <div className={`group relative flex h-full items-center justify-center bg-gradient-to-br ${video.color}`}>
                  <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/20"></div>
                  <button className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-3xl shadow-lg transition-transform group-hover:scale-110">
                    ▶️
                  </button>
                </div>
              </div>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900">{video.title}</h3>
                    <p className="text-xs text-neutral-500">{video.time}</p>
                  </div>
                  <Badge variant="success">Hoàn thành</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    📥 Tải về
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    🔗 Chia sẻ
                  </Button>
                  <Button variant="outline" size="sm">
                    🗑️
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Failed Video */}
          <Card>
            <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-neutral-900">
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-red-600 to-red-800">
                <div className="text-center text-white">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mx-auto">
                    <span className="text-2xl">❌</span>
                  </div>
                  <p className="text-sm font-medium">Tạo video thất bại</p>
                  <p className="text-xs text-white/80">Vui lòng thử lại</p>
                </div>
              </div>
            </div>
            <CardContent className="space-y-3 pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900">Video lỗi</h3>
                  <p className="text-xs text-neutral-500">5 giây • 16:9 • Hôm qua</p>
                </div>
                <Badge variant="danger">Thất bại</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="flex-1">
                  🔄 Thử lại
                </Button>
                <Button variant="outline" size="sm">
                  🗑️ Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled>
            ← Trước
          </Button>
          <Button variant="primary" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">
            Sau →
          </Button>
        </div>
      </div>
    </div>
  );
}
