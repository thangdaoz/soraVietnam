import Link from 'next/link';

const howItWorks = [
  {
    step: '01',
    title: 'Viết ý tưởng',
    description: 'Nhập văn bản mô tả hoặc tăng kỹ năng bằng cách tải lên hình ảnh tham khảo.',
  },
  {
    step: '02',
    title: 'Tạo video',
    description: 'Lựa chọn tỷ lệ khung hình, chạm một lần và để hệ thống AI xử lý trong vài phút.',
  },
  {
    step: '03',
    title: 'Tải về và chia sẻ',
    description: 'Xem trước trong thư viện, tải về hoặc chia sẻ trực tiếp với khách hàng.',
  },
];

const features = [
  {
    title: 'Text-to-Video',
    description: 'Chuyển đổi nội dung dạng văn bản thành video thu hút chỉ sau vài phút.',
  },
  {
    title: 'Image-to-Video',
    description: 'Sử dụng hình ảnh làm nguồn cảm hứng cho video động đầy cảm xúc.',
  },
  {
    title: 'HD Chất lượng',
    description: 'Xuất bản video đạt chuẩn marketing với độ phân giải tới 4K.',
  },
  {
    title: 'Thư viện cá nhân',
    description: 'Quản lý toàn bộ video đã tạo, theo dõi trạng thái và chia sẻ dễ dàng.',
  },
];

const pricing = [
  {
    name: 'Gói Start',
    price: '300K',
    description: 'Hợp cho nhóm nhỏ bắt đầu với AI.',
    perks: ['5.000 credits', 'Hỗ trợ email', '1 dự án đang hoạt động'],
  },
  {
    name: 'Gói Growth',
    price: '900K',
    description: 'Dành cho doanh nghiệp đang mở rộng danh mục video.',
    perks: ['20.000 credits', 'Hỗ trợ chat', 'Ưu tiên hàng đợi'],
  },
  {
    name: 'Gói Pro',
    price: '2.400K',
    description: 'Giải pháp toàn diện với nhiều quyền truy cập.',
    perks: ['60.000 credits', 'Hỗ trợ 24/7', 'Tài khoản nhóm'],
  },
];

export default function Home() {
  return (
    <main className="bg-neutral-50">
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 px-6 py-20 lg:flex-row lg:py-28">
          <div className="w-full space-y-6 lg:w-1/2">
            <span className="bg-primary-50 text-primary-600 inline-flex items-center rounded-full px-4 py-1 text-sm font-medium">
              Tạo video AI cho Việt Nam
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
              Biến hóa ý tưởng thành video chuyên nghiệp trong vài phút.
            </h1>
            <p className="text-lg text-neutral-600">
              Sora Vietnam Gateway giúp các nhà sáng tạo, doanh nghiệp và agency tạo ra video mang
              bản sắc Việt Nam với quy trình đơn giản, rõ ràng.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/sign-up" className="btn-primary">
                Bắt đầu tạo video
              </Link>
              <Link href="/pricing" className="btn-secondary">
                Xem bảng giá chi tiết
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-xl lg:w-1/2">
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-lg">
              <div className="from-primary-600 to-secondary-500 flex h-full items-center justify-center bg-gradient-to-br text-white">
                <div className="text-center">
                  <p className="text-sm tracking-widest text-neutral-100/80 uppercase">
                    Video Preview
                  </p>
                  <p className="mt-2 text-2xl font-semibold">AI Demo đang được tải...</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-8 bottom-[-2.5rem] hidden rounded-xl bg-white px-6 py-4 shadow-lg lg:block">
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <span>Trạng thái: Đang xử lý</span>
                <span>Thời gian còn lại: 02:43</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold text-neutral-900">Quy trình 3 bước rõ ràng</h2>
            <p className="mt-3 text-base text-neutral-600">
              Đây là hành trình thông suốt từ ý tưởng đến video hoàn chỉnh.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="card space-y-4">
                <span className="bg-primary-600 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white">
                  {item.step}
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-neutral-900">{item.title}</h3>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold text-neutral-900">Tính năng nổi bật</h2>
            <p className="mt-3 text-base text-neutral-600">
              Công cụ cần thiết để bạn ra mắt video thu hút khán giả Việt Nam.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="card space-y-3">
                <h3 className="text-xl font-semibold text-neutral-900">{feature.title}</h3>
                <p className="text-sm text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold text-neutral-900">Bảng giá credits</h2>
            <p className="mt-3 text-base text-neutral-600">
              Chọn gói phù hợp với nhu cầu sử dụng và quy mô dự án của bạn.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricing.map((tier) => (
              <div key={tier.name} className="card border-primary-100 space-y-4 border">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-neutral-900">{tier.name}</h3>
                  <p className="text-primary-600 text-3xl font-semibold">{tier.price}</p>
                  <p className="text-sm text-neutral-600">{tier.description}</p>
                </div>
                <ul className="space-y-2 text-sm text-neutral-600">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <span className="bg-secondary-500 mt-1 inline-block h-2 w-2 rounded-full" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/checkout" className="btn-secondary inline-flex justify-center">
                  Chọn gói này
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
