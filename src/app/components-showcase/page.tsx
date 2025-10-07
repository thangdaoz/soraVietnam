'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Container,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Loading,
} from '@/components/ui';

export default function ComponentsShowcasePage() {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container maxWidth="2xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Hệ Thống Thiết Kế</h1>
          <p className="mt-2 text-lg text-gray-600">
            Thư viện component UI cho Sora Vietnam Gateway
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buttons (Nút Bấm)</CardTitle>
            <CardDescription>Các biến thể của nút bấm với nhiều kích thước và kiểu dáng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">States</h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <Button isLoading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
                <Button fullWidth>Full Width</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Form Inputs</CardTitle>
            <CardDescription>Các component form với validation và trạng thái lỗi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Tên của bạn"
                placeholder="Nhập tên..."
                helperText="Tên sẽ hiển thị công khai"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="email@example.com"
                required
                error="Email không hợp lệ"
              />
            </div>

            <Textarea
              label="Mô tả video"
              placeholder="Nhập mô tả chi tiết về video bạn muốn tạo..."
              helperText="Mô tả càng chi tiết, video càng chính xác"
              maxLength={500}
              showCount
              rows={4}
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <Select
                label="Loại video"
                placeholder="Chọn loại video..."
                options={[
                  { value: 'text-to-video', label: 'Text to Video' },
                  { value: 'image-to-video', label: 'Image to Video' },
                ]}
                helperText="Chọn phương thức tạo video"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Tùy chọn</label>
                <Checkbox label="Tôi đồng ý với điều khoản sử dụng" />
                <Checkbox label="Nhận thông báo qua email" className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Badges (Nhãn)</CardTitle>
            <CardDescription>Các nhãn trạng thái và thông tin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Alerts (Thông Báo)</CardTitle>
            <CardDescription>Các thông báo với nhiều mức độ quan trọng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="success">
              <AlertTitle>Thành công</AlertTitle>
              <AlertDescription>Video của bạn đã được tạo thành công!</AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTitle>Cảnh báo</AlertTitle>
              <AlertDescription>Tài khoản của bạn sắp hết credits.</AlertDescription>
            </Alert>

            <Alert variant="danger">
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>Không thể tạo video. Vui lòng thử lại sau.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Loading (Đang Tải)</CardTitle>
            <CardDescription>Các trạng thái loading với nhiều kích thước</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Sizes</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <Loading size="sm" />
                  <Loading size="md" />
                  <Loading size="lg" />
                  <Loading size="xl" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
          <h3 className="mb-2 text-xl font-semibold text-blue-900">🎨 Component Library Ready!</h3>
          <p className="text-blue-700">
            Tất cả các component đã sẵn sàng. Import từ{' '}
            <code className="rounded bg-blue-100 px-2 py-1 font-mono text-sm">@/components/ui</code>
          </p>
        </div>
      </Container>
    </div>
  );
}
