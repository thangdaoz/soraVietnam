import Link from 'next/link';

const howItWorks = [
  {
    step: '01',
    title: 'Viết ý tưởng',
    description: 'Nhập văn bản mô tả hoặc tăng kỹ năng bằng cách tải lên hình ảnh tham khảo.',
    icon: '✍️',
  },
  {
    step: '02',
    title: 'Tạo video',
    description: 'Lựa chọn tỷ lệ khung hình, chạm một lần và để hệ thống AI xử lý trong vài phút.',
    icon: '🎬',
  },
  {
    step: '03',
    title: 'Tải về và chia sẻ',
    description: 'Xem trước trong thư viện, tải về hoặc chia sẻ trực tiếp với khách hàng.',
    icon: '📤',
  },
];

const features = [
  {
    title: 'Text-to-Video',
    description: 'Chuyển đổi nội dung dạng văn bản thành video thu hút chỉ sau vài phút.',
    icon: '📝',
  },
  {
    title: 'Image-to-Video',
    description: 'Sử dụng hình ảnh làm nguồn cảm hứng cho video động đầy cảm xúc.',
    icon: '🖼️',
  },
  {
    title: 'Chất lượng HD',
    description: 'Xuất bản video đạt chuẩn marketing với độ phân giải tới Full HD.',
    icon: '⚡',
  },
  {
    title: 'Thư viện cá nhân',
    description: 'Quản lý toàn bộ video đã tạo, theo dõi trạng thái và chia sẻ dễ dàng.',
    icon: '📚',
  },
];

const pricing = [
  {
    name: 'Gói Starter',
    price: '300.000',
    credits: '300.000',
    description: 'Phù hợp cho cá nhân bắt đầu với AI video.',
    perks: ['300.000 credits', 'Tạo ~60 video 5 giây', 'Hỗ trợ qua email', 'Tất cả tính năng cơ bản'],
    popular: false,
  },
  {
    name: 'Gói Basic',
    price: '900.000',
    credits: '900.000',
    description: 'Dành cho freelancer và nhóm nhỏ.',
    perks: ['900.000 credits', 'Tạo ~180 video 5 giây', 'Hỗ trợ ưu tiên', 'Lưu trữ không giới hạn'],
    popular: true,
  },
  {
    name: 'Gói Premium',
    price: '2.400.000',
    credits: '2.400.000',
    description: 'Giải pháp toàn diện cho doanh nghiệp.',
    perks: ['2.400.000 credits', 'Tạo ~480 video 5 giây', 'Hỗ trợ 24/7', 'Quản lý nhiều tài khoản'],
    popular: false,
  },
];

const stats = [
  { value: '10,000+', label: 'Video đã tạo' },
  { value: '2,000+', label: 'Người dùng' },
  { value: '99.5%', label: 'Độ hài lòng' },
  { value: '< 3 phút', label: 'Thời gian xử lý' },
];

export default function Home() {
  return (
    <main className="bg-neutral-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/20">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-6 py-20 lg:flex-row lg:py-32">
          <div className="w-full space-y-8 lg:w-1/2">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
                🚀 Nền tảng AI Video Việt Nam
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
                Biến hóa ý tưởng thành{' '}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  video chuyên nghiệp
                </span>{' '}
                trong vài phút
              </h1>
              <p className="text-lg text-neutral-600 md:text-xl">
                Sora Vietnam Gateway giúp các nhà sáng tạo, doanh nghiệp và agency tạo ra video 
                mang bản sắc Việt Nam với công nghệ AI tiên tiến và quy trình đơn giản.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link 
                href="/sign-up" 
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-4 text-base font-medium text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/40 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
              >
                Bắt đầu miễn phí
              </Link>
              <Link 
                href="#pricing" 
                className="inline-flex items-center justify-center rounded-lg border-2 border-neutral-300 bg-white px-8 py-4 text-base font-medium text-neutral-700 transition-all hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
              >
                Xem bảng giá
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-8 pt-8 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>Không cần thẻ tín dụng</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>Tạo ngay lập tức</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>Hỗ trợ tiếng Việt</span>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-2xl lg:w-1/2">
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl ring-1 ring-neutral-900/10">
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span className="text-3xl">▶️</span>
                  </div>
                  <p className="text-sm uppercase tracking-widest text-white/80">
                    Video Demo
                  </p>
                  <p className="mt-2 text-2xl font-semibold">Xem ví dụ thực tế</p>
                </div>
              </div>
            </div>
            
            {/* Floating status card */}
            <div className="absolute inset-x-8 bottom-[-2rem] hidden rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-xl lg:block">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                  <span className="font-medium text-neutral-900">Đang xử lý video...</span>
                </div>
                <span className="text-neutral-600">Còn lại: 02:43</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 text-center md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-sm text-neutral-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
              Quy trình
            </span>
            <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">
              3 bước đơn giản để tạo video
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Từ ý tưởng đến video hoàn thiện chỉ trong vài phút
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="absolute left-1/2 top-20 hidden h-0.5 w-full bg-neutral-200 md:block" />
                )}
                
                <div className="relative space-y-4 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg">
                  <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 text-3xl shadow-lg">
                    {item.icon}
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-sm font-semibold text-primary-600">Bước {item.step}</div>
                    <h3 className="text-xl font-bold text-neutral-900">{item.title}</h3>
                    <p className="text-neutral-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-secondary-100 px-4 py-1.5 text-sm font-medium text-secondary-700">
              Tính năng
            </span>
            <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">
              Công cụ mạnh mẽ cho nhà sáng tạo
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Tất cả những gì bạn cần để tạo video AI chuyên nghiệp
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="group rounded-2xl border border-neutral-200 bg-neutral-50 p-6 transition-all hover:border-primary-200 hover:bg-primary-50/50 hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-neutral-900 group-hover:text-primary-700">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Additional features list */}
          <div className="mt-16 rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-8">
            <h3 className="mb-6 text-center text-2xl font-bold text-neutral-900">
              Và còn nhiều tính năng khác...
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                'Nhiều tỷ lệ khung hình (16:9, 1:1, 9:16)',
                'Xuất video độ phân giải cao',
                'Lưu trữ không giới hạn',
                'Chia sẻ và download dễ dàng',
                'Giao diện tiếng Việt',
                'Hỗ trợ 24/7',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 text-primary-600">✓</span>
                  <span className="text-sm text-neutral-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
              Bảng giá
            </span>
            <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">
              Gói credits linh hoạt
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Chọn gói phù hợp với nhu cầu và quy mô của bạn
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              1 credit = 1 VND | Video 5 giây ≈ 5.000 credits
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {pricing.map((tier) => (
              <div 
                key={tier.name} 
                className={`relative overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all hover:shadow-2xl ${
                  tier.popular 
                    ? 'border-primary-600 ring-4 ring-primary-100' 
                    : 'border-neutral-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute right-6 top-0 bg-primary-600 px-4 py-1 text-xs font-semibold text-white">
                    Phổ biến nhất
                  </div>
                )}
                
                <div className="p-8">
                  <div className="mb-6 space-y-2">
                    <h3 className="text-2xl font-bold text-neutral-900">{tier.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary-600">{tier.price}</span>
                      <span className="text-neutral-600">VND</span>
                    </div>
                    <p className="text-sm text-neutral-600">{tier.description}</p>
                  </div>

                  <Link
                    href="/checkout"
                    className={`mb-6 inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      tier.popular
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700 focus:ring-primary-600'
                        : 'border-2 border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 focus:ring-neutral-400'
                    }`}
                  >
                    Chọn gói này
                  </Link>

                  <ul className="space-y-3">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs text-primary-600">
                          ✓
                        </span>
                        <span className="text-sm text-neutral-700">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-600">
              Có câu hỏi về giá cả?{' '}
              <Link href="/contact" className="font-medium text-primary-600 hover:text-primary-700">
                Liên hệ với chúng tôi
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-neutral-200 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Sẵn sàng tạo video AI đầu tiên?
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Tham gia cộng đồng 2,000+ nhà sáng tạo đang sử dụng Sora Vietnam Gateway
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-medium text-primary-600 shadow-xl transition-all hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              Bắt đầu ngay - Miễn phí
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              Xem cách hoạt động
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
