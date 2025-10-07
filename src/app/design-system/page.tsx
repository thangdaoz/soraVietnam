'use client';'use client';'use client';



import React, { useState } from 'react';

import {

  Button,/**/**

  Input,

  Textarea, * Design System Showcase Page * Design System Showcase Page

  Select,

  Checkbox, *  *

  Card,

  CardHeader, * Demonstrates all UI components in the component library * This page demonstrates all the UI components in our component library.

  CardTitle,

  CardDescription, */ */

  CardContent,

  Container,import React, { useState } from 'react';import React from 'react';

  Badge,

  Alert,import {import {

  AlertTitle,

  AlertDescription,  Button,  Button,

  Loading,

} from '@/components/ui';  Input,  Input,



export default function DesignSystemPage() {  Textarea,  Textarea,

  const [inputValue, setInputValue] = useState('');

  const [textareaValue, setTextareaValue] = useState('');  Select,  Select,



  return (  Checkbox,  Checkbox,

    <div className="min-h-screen bg-gray-50 py-12">

      <Container maxWidth="2xl">  Card,  Card,

        <div className="mb-12 text-center">

          <h1 className="text-4xl font-bold text-gray-900">Hệ Thống Thiết Kế</h1>  CardHeader,  CardHeader,

          <p className="mt-2 text-lg text-gray-600">

            Thư viện component UI cho Sora Vietnam Gateway  CardTitle,  CardTitle,

          </p>

        </div>  CardDescription,  CardDescription,



        <Card className="mb-8">  CardContent,  CardContent,

          <CardHeader>

            <CardTitle>Buttons (Nút Bấm)</CardTitle>  Container,  Container,

            <CardDescription>Các biến thể của nút bấm với nhiều kích thước và kiểu dáng</CardDescription>

          </CardHeader>  Badge,  Badge,

          <CardContent className="space-y-6">

            <div>  Alert,  Alert,

              <h3 className="mb-3 text-sm font-semibold text-gray-700">Variants</h3>

              <div className="flex flex-wrap gap-3">  AlertTitle,  AlertTitle,

                <Button variant="primary">Primary</Button>

                <Button variant="secondary">Secondary</Button>  AlertDescription,  AlertDescription,

                <Button variant="outline">Outline</Button>

                <Button variant="ghost">Ghost</Button>  Loading,  Loading,

                <Button variant="danger">Danger</Button>

                <Button variant="success">Success</Button>} from '@/components/ui';} from '@/components/ui';

              </div>

            </div>



            <div>export default function DesignSystemPage() {export default function DesignSystemPage() {

              <h3 className="mb-3 text-sm font-semibold text-gray-700">Sizes</h3>

              <div className="flex flex-wrap items-center gap-3">  const [inputValue, setInputValue] = useState('');  return (

                <Button size="sm">Small</Button>

                <Button size="md">Medium</Button>  const [textareaValue, setTextareaValue] = useState('');    <div className="min-h-screen bg-neutral-50">

                <Button size="lg">Large</Button>

                <Button size="xl">Extra Large</Button>      {/* Navigation */}

              </div>

            </div>  return (      <nav className="border-b border-neutral-200 bg-white">



            <div>    <div className="min-h-screen bg-gray-50 py-12">        <div className="container mx-auto flex items-center justify-between px-4 py-4">

              <h3 className="mb-3 text-sm font-semibold text-gray-700">States</h3>

              <div className="space-y-3">      <Container maxWidth="2xl">          <div className="font-heading text-primary-600 text-[1.25rem] font-semibold">

                <div className="flex flex-wrap gap-3">

                  <Button isLoading>Loading</Button>        {/* Header */}            Sora Vietnam

                  <Button disabled>Disabled</Button>

                </div>        <div className="mb-12 text-center">          </div>

                <Button fullWidth>Full Width</Button>

              </div>          <h1 className="text-4xl font-bold text-gray-900">Hệ Thống Thiết Kế</h1>          <div className="flex items-center gap-6">

            </div>

          </CardContent>          <p className="mt-2 text-lg text-gray-600">            <a href="#colors" className="hover:text-primary-600 text-neutral-600 transition-colors">

        </Card>

            Thư viện component UI cho Sora Vietnam Gateway              Colors

        <Card className="mb-8">

          <CardHeader>          </p>            </a>

            <CardTitle>Form Inputs (Ô Nhập Liệu)</CardTitle>

            <CardDescription>Các component form với validation và trạng thái lỗi</CardDescription>        </div>            <a

          </CardHeader>

          <CardContent className="space-y-6">              href="#typography"

            <div className="grid gap-6 md:grid-cols-2">

              <Input        {/* Buttons */}              className="hover:text-primary-600 text-neutral-600 transition-colors"

                label="Tên của bạn"

                placeholder="Nhập tên..."        <Card className="mb-8">            >

                helperText="Tên sẽ hiển thị công khai"

                value={inputValue}          <CardHeader>              Typography

                onChange={(e) => setInputValue(e.target.value)}

              />            <CardTitle>Buttons (Nút Bấm)</CardTitle>            </a>

              <Input

                label="Email"            <CardDescription>Các biến thể của nút bấm với nhiều kích thước và kiểu dáng</CardDescription>            <a

                type="email"

                placeholder="email@example.com"          </CardHeader>              href="#components"

                required

                error="Email không hợp lệ"          <CardContent className="space-y-6">              className="hover:text-primary-600 text-neutral-600 transition-colors"

              />

            </div>            <div>            >



            <Textarea              <h3 className="mb-3 text-sm font-semibold text-gray-700">Variants</h3>              Components

              label="Mô tả video"

              placeholder="Nhập mô tả chi tiết về video bạn muốn tạo..."              <div className="flex flex-wrap gap-3">            </a>

              helperText="Mô tả càng chi tiết, video càng chính xác"

              maxLength={500}                <Button variant="primary">Primary</Button>            <button className="btn-primary">Get Started</button>

              showCount

              rows={4}                <Button variant="secondary">Secondary</Button>          </div>

              value={textareaValue}

              onChange={(e) => setTextareaValue(e.target.value)}                <Button variant="outline">Outline</Button>        </div>

            />

                <Button variant="ghost">Ghost</Button>      </nav>

            <div className="grid gap-6 md:grid-cols-2">

              <Select                <Button variant="danger">Danger</Button>

                label="Loại video"

                placeholder="Chọn loại video..."                <Button variant="success">Success</Button>      <main className="container mx-auto space-y-16 px-4 py-12">

                options={[

                  { value: 'text-to-video', label: 'Text to Video' },              </div>        {/* Hero Section */}

                  { value: 'image-to-video', label: 'Image to Video' },

                ]}            </div>        <section className="py-16 text-center">

                helperText="Chọn phương thức tạo video"

              />          <h1 className="mb-4">Design System Showcase</h1>



              <div>            <div>          <p className="mx-auto max-w-2xl text-[1.125rem] text-neutral-600">

                <label className="mb-2 block text-sm font-medium text-gray-700">Tùy chọn</label>

                <Checkbox label="Tôi đồng ý với điều khoản sử dụng" />              <h3 className="mb-3 text-sm font-semibold text-gray-700">Sizes</h3>            Explore the complete UI components and design tokens configured for Sora Vietnam

                <Checkbox label="Nhận thông báo qua email" className="mt-2" />

              </div>              <div className="flex flex-wrap items-center gap-3">            Gateway.

            </div>

          </CardContent>                <Button size="sm">Small</Button>          </p>

        </Card>

                <Button size="md">Medium</Button>        </section>

        <Card className="mb-8">

          <CardHeader>                <Button size="lg">Large</Button>

            <CardTitle>Cards (Thẻ)</CardTitle>

            <CardDescription>Các biến thể của card component</CardDescription>                <Button size="xl">Extra Large</Button>        {/* Colors Section */}

          </CardHeader>

          <CardContent>              </div>        <section id="colors">

            <div className="grid gap-4 md:grid-cols-3">

              <Card variant="default" padding="sm">            </div>          <h2 className="mb-8">Color Palette</h2>

                <CardTitle className="text-lg">Default Card</CardTitle>

                <CardDescription>Card mặc định với border và shadow nhẹ</CardDescription>

              </Card>

            <div>          <div className="space-y-8">

              <Card variant="elevated" padding="sm">

                <CardTitle className="text-lg">Elevated Card</CardTitle>              <h3 className="mb-3 text-sm font-semibold text-gray-700">States</h3>            {/* Primary Colors */}

                <CardDescription>Card với shadow nổi bật hơn</CardDescription>

              </Card>              <div className="flex flex-wrap gap-3">            <div>



              <Card variant="outlined" padding="sm">                <Button isLoading>Loading</Button>              <h3 className="mb-4">Primary (Indigo)</h3>

                <CardTitle className="text-lg">Outlined Card</CardTitle>

                <CardDescription>Card với border dày hơn</CardDescription>                <Button disabled>Disabled</Button>              <div className="grid grid-cols-11 gap-2">

              </Card>

            </div>                <div className="w-full">                {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map(

          </CardContent>

        </Card>                  <Button fullWidth>Full Width</Button>                  (shade) => (



        <Card className="mb-8">                </div>                    <div key={shade} className="space-y-2">

          <CardHeader>

            <CardTitle>Badges (Nhãn)</CardTitle>              </div>                      <div

            <CardDescription>Các nhãn trạng thái và thông tin</CardDescription>

          </CardHeader>            </div>                        className={`h-20 rounded-lg bg-primary-${shade} ${parseInt(shade) >= 600 ? 'border border-neutral-200' : ''}`}

          <CardContent>

            <div className="flex flex-wrap gap-3">          </CardContent>                      />

              <Badge variant="default">Default</Badge>

              <Badge variant="secondary">Secondary</Badge>        </Card>                      <p className="text-small text-center text-neutral-600">{shade}</p>

              <Badge variant="success">Success</Badge>

              <Badge variant="warning">Warning</Badge>                    </div>

              <Badge variant="danger">Danger</Badge>

              <Badge variant="info">Info</Badge>        {/* Form Inputs */}                  )

              <Badge variant="outline">Outline</Badge>

            </div>        <Card className="mb-8">                )}

          </CardContent>

        </Card>          <CardHeader>              </div>



        <Card className="mb-8">            <CardTitle>Form Inputs (Ô Nhập Liệu)</CardTitle>              <p className="text-small mt-2 text-neutral-500">Main brand color: 600</p>

          <CardHeader>

            <CardTitle>Alerts (Thông Báo)</CardTitle>            <CardDescription>Các component form với validation và trạng thái lỗi</CardDescription>            </div>

            <CardDescription>Các thông báo với nhiều mức độ quan trọng</CardDescription>

          </CardHeader>          </CardHeader>

          <CardContent className="space-y-4">

            <Alert variant="default">          <CardContent className="space-y-6">            {/* Secondary Colors */}

              <AlertTitle>Thông tin</AlertTitle>

              <AlertDescription>Đây là thông báo mặc định với nội dung quan trọng.</AlertDescription>            <div className="grid gap-6 md:grid-cols-2">            <div>

            </Alert>

              <Input              <h3 className="mb-4">Secondary (Emerald)</h3>

            <Alert variant="success">

              <AlertTitle>Thành công</AlertTitle>                label="Tên của bạn"              <div className="grid grid-cols-11 gap-2">

              <AlertDescription>Video của bạn đã được tạo thành công!</AlertDescription>

            </Alert>                placeholder="Nhập tên..."                {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map(



            <Alert variant="warning">                helperText="Tên sẽ hiển thị công khai"                  (shade) => (

              <AlertTitle>Cảnh báo</AlertTitle>

              <AlertDescription>Tài khoản của bạn sắp hết credits.</AlertDescription>                value={inputValue}                    <div key={shade} className="space-y-2">

            </Alert>

                onChange={(e) => setInputValue(e.target.value)}                      <div className={`h-20 rounded-lg bg-secondary-${shade}`} />

            <Alert variant="danger">

              <AlertTitle>Lỗi</AlertTitle>              />                      <p className="text-small text-center text-neutral-600">{shade}</p>

              <AlertDescription>Không thể tạo video. Vui lòng thử lại sau.</AlertDescription>

            </Alert>              <Input                    </div>



            <Alert variant="info" onClose={() => alert('Alert closed!')}>                label="Email"                  )

              <AlertTitle>Thông tin hữu ích</AlertTitle>

              <AlertDescription>Bạn có thể đóng thông báo này bằng cách nhấn vào nút X.</AlertDescription>                type="email"                )}

            </Alert>

          </CardContent>                placeholder="email@example.com"              </div>

        </Card>

                required              <p className="text-small mt-2 text-neutral-500">Accent color: 500</p>

        <Card className="mb-8">

          <CardHeader>                error="Email không hợp lệ"            </div>

            <CardTitle>Loading (Đang Tải)</CardTitle>

            <CardDescription>Các trạng thái loading với nhiều kích thước</CardDescription>              />

          </CardHeader>

          <CardContent>            </div>            {/* Feedback Colors */}

            <div className="space-y-6">

              <div>            <div>

                <h3 className="mb-3 text-sm font-semibold text-gray-700">Sizes</h3>

                <div className="flex flex-wrap items-center gap-6">            <Textarea              <h3 className="mb-4">Feedback Colors</h3>

                  <Loading size="sm" />

                  <Loading size="md" />              label="Mô tả video"              <div className="grid grid-cols-3 gap-4">

                  <Loading size="lg" />

                  <Loading size="xl" />              placeholder="Nhập mô tả chi tiết về video bạn muốn tạo..."                <div className="space-y-2">

                </div>

              </div>              helperText="Mô tả càng chi tiết, video càng chính xác"                  <div className="bg-error flex h-20 items-center justify-center rounded-lg font-medium text-white">



              <div>              maxLength={500}                    Error

                <h3 className="mb-3 text-sm font-semibold text-gray-700">Variants</h3>

                <div className="flex flex-wrap items-center gap-6">              showCount                  </div>

                  <Loading variant="primary" label="Đang tải..." />

                  <Loading variant="secondary" label="Xin chờ..." />              rows={4}                  <p className="text-small text-neutral-600">Red: #EF4444</p>

                </div>

              </div>              value={textareaValue}                </div>

            </div>

          </CardContent>              onChange={(e) => setTextareaValue(e.target.value)}                <div className="space-y-2">

        </Card>

            />                  <div className="bg-warning flex h-20 items-center justify-center rounded-lg font-medium text-white">

        <Card className="mb-8">

          <CardHeader>                    Warning

            <CardTitle>Typography (Kiểu Chữ)</CardTitle>

            <CardDescription>Các kiểu chữ cơ bản trong hệ thống</CardDescription>            <div className="grid gap-6 md:grid-cols-2">                  </div>

          </CardHeader>

          <CardContent className="space-y-4">              <Select                  <p className="text-small text-neutral-600">Amber: #F59E0B</p>

            <div>

              <h1 className="text-4xl font-bold">Heading 1 - 4xl Bold</h1>                label="Loại video"                </div>

              <h2 className="text-3xl font-bold">Heading 2 - 3xl Bold</h2>

              <h3 className="text-2xl font-semibold">Heading 3 - 2xl Semibold</h3>                placeholder="Chọn loại video..."                <div className="space-y-2">

              <h4 className="text-xl font-semibold">Heading 4 - xl Semibold</h4>

            </div>                options={[                  <div className="bg-success flex h-20 items-center justify-center rounded-lg font-medium text-white">

            <div className="space-y-2">

              <p className="text-base">Body text - Base size (16px)</p>                  { value: 'text-to-video', label: 'Text to Video' },                    Success

              <p className="text-sm text-gray-600">Small text - Small size (14px)</p>

              <p className="text-xs text-gray-500">Extra small text - XS size (12px)</p>                  { value: 'image-to-video', label: 'Image to Video' },                  </div>

            </div>

          </CardContent>                ]}                  <p className="text-small text-neutral-600">Emerald: #10B981</p>

        </Card>

                helperText="Chọn phương thức tạo video"                </div>

        <Card className="mb-8">

          <CardHeader>              />              </div>

            <CardTitle>Color Palette (Bảng Màu)</CardTitle>

            <CardDescription>Các màu chính trong hệ thống thiết kế</CardDescription>            </div>

          </CardHeader>

          <CardContent>              <div>          </div>

            <div className="grid gap-4 md:grid-cols-4">

              <div>                <label className="mb-2 block text-sm font-medium text-gray-700">Tùy chọn</label>        </section>

                <div className="mb-2 h-20 rounded-lg bg-blue-600"></div>

                <p className="text-sm font-medium">Primary Blue</p>                <Checkbox label="Tôi đồng ý với điều khoản sử dụng" />

                <p className="text-xs text-gray-500">#2563eb</p>

              </div>                <Checkbox label="Nhận thông báo qua email" className="mt-2" />        {/* Typography Section */}

              <div>

                <div className="mb-2 h-20 rounded-lg bg-gray-600"></div>              </div>        <section id="typography">

                <p className="text-sm font-medium">Gray</p>

                <p className="text-xs text-gray-500">#4b5563</p>            </div>          <h2 className="mb-8">Typography</h2>

              </div>

              <div>          </CardContent>

                <div className="mb-2 h-20 rounded-lg bg-green-600"></div>

                <p className="text-sm font-medium">Success Green</p>        </Card>          <div className="card space-y-6">

                <p className="text-xs text-gray-500">#16a34a</p>

              </div>            <div>

              <div>

                <div className="mb-2 h-20 rounded-lg bg-red-600"></div>        {/* Cards */}              <h1>Heading 1 - Poppins Semi-Bold 36px</h1>

                <p className="text-sm font-medium">Danger Red</p>

                <p className="text-xs text-gray-500">#dc2626</p>        <Card className="mb-8">              <p className="text-small mt-2 text-neutral-500">font-heading, font-weight: 600</p>

              </div>

            </div>          <CardHeader>            </div>

          </CardContent>

        </Card>            <CardTitle>Cards (Thẻ)</CardTitle>



        <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">            <CardDescription>Các biến thể của card component</CardDescription>            <div>

          <h3 className="mb-2 text-xl font-semibold text-blue-900">🎨 Component Library Ready!</h3>

          <p className="text-blue-700">          </CardHeader>              <h2>Heading 2 - Poppins Semi-Bold 24px</h2>

            Tất cả các component đã sẵn sàng để sử dụng. Import từ{' '}

            <code className="rounded bg-blue-100 px-2 py-1 font-mono text-sm">@/components/ui</code>          <CardContent>              <p className="text-small mt-2 text-neutral-500">font-heading, font-weight: 600</p>

          </p>

        </div>            <div className="grid gap-4 md:grid-cols-3">            </div>

      </Container>

    </div>              <Card variant="default" padding="sm">

  );

}                <CardTitle className="text-lg">Default Card</CardTitle>            <div>


                <CardDescription>Card mặc định với border và shadow nhẹ</CardDescription>              <h3>Heading 3 - Poppins Medium 20px</h3>

              </Card>              <p className="text-small mt-2 text-neutral-500">font-heading, font-weight: 500</p>

            </div>

              <Card variant="elevated" padding="sm">

                <CardTitle className="text-lg">Elevated Card</CardTitle>            <div>

                <CardDescription>Card với shadow nổi bật hơn</CardDescription>              <p className="text-body">

              </Card>                Body text - Inter Regular 16px. This is the standard paragraph text used throughout

                the application. It provides excellent readability on screens and works well for

              <Card variant="outlined" padding="sm">                Vietnamese characters.

                <CardTitle className="text-lg">Outlined Card</CardTitle>              </p>

                <CardDescription>Card với border dày hơn</CardDescription>              <p className="text-small mt-2 text-neutral-500">font-sans, font-weight: 400</p>

              </Card>            </div>

            </div>

          </CardContent>            <div>

        </Card>              <p className="text-small">

                Small text - Inter Regular 14px. Used for helper text and captions.

        {/* Badges */}              </p>

        <Card className="mb-8">              <p className="text-small mt-2 text-neutral-500">

          <CardHeader>                font-sans, font-weight: 400, size: 14px

            <CardTitle>Badges (Nhãn)</CardTitle>              </p>

            <CardDescription>Các nhãn trạng thái và thông tin</CardDescription>            </div>

          </CardHeader>          </div>

          <CardContent>        </section>

            <div className="flex flex-wrap gap-3">

              <Badge variant="default">Default</Badge>        {/* Buttons Section */}

              <Badge variant="secondary">Secondary</Badge>        <section id="components">

              <Badge variant="success">Success</Badge>          <h2 className="mb-8">Buttons</h2>

              <Badge variant="warning">Warning</Badge>

              <Badge variant="danger">Danger</Badge>          <div className="card space-y-6">

              <Badge variant="info">Info</Badge>            <div className="space-y-3">

              <Badge variant="outline">Outline</Badge>              <h3>Primary Buttons</h3>

            </div>              <div className="flex flex-wrap gap-4">

          </CardContent>                <button className="btn-primary">Default</button>

        </Card>                <button className="btn-primary">

                  <Video className="h-5 w-5" />

        {/* Alerts */}                  With Icon

        <Card className="mb-8">                </button>

          <CardHeader>                <button className="btn-primary" disabled>

            <CardTitle>Alerts (Thông Báo)</CardTitle>                  Disabled

            <CardDescription>Các thông báo với nhiều mức độ quan trọng</CardDescription>                </button>

          </CardHeader>              </div>

          <CardContent className="space-y-4">            </div>

            <Alert variant="default">

              <AlertTitle>Thông tin</AlertTitle>            <div className="space-y-3">

              <AlertDescription>Đây là thông báo mặc định với nội dung quan trọng.</AlertDescription>              <h3>Secondary Buttons</h3>

            </Alert>              <div className="flex flex-wrap gap-4">

                <button className="btn-secondary">Default</button>

            <Alert variant="success">                <button className="btn-secondary">

              <AlertTitle>Thành công</AlertTitle>                  <ImageIcon className="h-5 w-5" />

              <AlertDescription>Video của bạn đã được tạo thành công!</AlertDescription>                  With Icon

            </Alert>                </button>

                <button className="btn-secondary" disabled>

            <Alert variant="warning">                  Disabled

              <AlertTitle>Cảnh báo</AlertTitle>                </button>

              <AlertDescription>Tài khoản của bạn sắp hết credits.</AlertDescription>              </div>

            </Alert>            </div>



            <Alert variant="danger">            <div className="space-y-3">

              <AlertTitle>Lỗi</AlertTitle>              <h3>Text Buttons</h3>

              <AlertDescription>Không thể tạo video. Vui lòng thử lại sau.</AlertDescription>              <div className="flex flex-wrap gap-4">

            </Alert>                <button className="text-primary-600 font-medium hover:underline">Default</button>

                <button className="text-primary-600 font-medium hover:underline">Learn More</button>

            <Alert variant="info" onClose={() => alert('Alert closed!')}>                <button className="cursor-not-allowed font-medium text-neutral-400">

              <AlertTitle>Thông tin hữu ích</AlertTitle>                  Disabled

              <AlertDescription>Bạn có thể đóng thông báo này bằng cách nhấn vào nút X.</AlertDescription>                </button>

            </Alert>              </div>

          </CardContent>            </div>

        </Card>          </div>

        </section>

        {/* Loading */}

        <Card className="mb-8">        {/* Form Inputs Section */}

          <CardHeader>        <section>

            <CardTitle>Loading (Đang Tải)</CardTitle>          <h2 className="mb-8">Form Inputs</h2>

            <CardDescription>Các trạng thái loading với nhiều kích thước</CardDescription>

          </CardHeader>          <div className="card max-w-2xl space-y-6">

          <CardContent>            <div className="space-y-2">

            <div className="space-y-6">              <label className="block font-medium text-neutral-900">Default Input</label>

              <div>              <input type="text" className="input-field w-full" placeholder="Enter text..." />

                <h3 className="mb-3 text-sm font-semibold text-gray-700">Sizes</h3>            </div>

                <div className="flex flex-wrap items-center gap-6">

                  <Loading size="sm" />            <div className="space-y-2">

                  <Loading size="md" />              <label className="block font-medium text-neutral-900">Focused Input</label>

                  <Loading size="lg" />              <input

                  <Loading size="xl" />                type="text"

                </div>                className="input-field w-full"

              </div>                placeholder="Click to see focus state"

              />

              <div>              <p className="text-small text-neutral-500">Focus to see the primary blue border</p>

                <h3 className="mb-3 text-sm font-semibold text-gray-700">Variants</h3>            </div>

                <div className="flex flex-wrap items-center gap-6">

                  <Loading variant="primary" label="Đang tải..." />            <div className="space-y-2">

                  <Loading variant="secondary" label="Xin chờ..." />              <label className="block font-medium text-neutral-900">Error State</label>

                </div>              <input

              </div>                type="email"

            </div>                className="input-field error w-full"

          </CardContent>                placeholder="invalid@email"

        </Card>              />

              <p className="text-small text-error flex items-center gap-1">

        {/* Container */}                <AlertCircle className="h-4 w-4" />

        <Card className="mb-8">                Please enter a valid email address

          <CardHeader>              </p>

            <CardTitle>Container (Khung Bao)</CardTitle>            </div>

            <CardDescription>Container responsive với các max-width khác nhau</CardDescription>

          </CardHeader>            <div className="space-y-2">

          <CardContent className="space-y-4">              <label className="block font-medium text-neutral-900">Text Area</label>

            <Container maxWidth="sm" padding="sm" className="bg-blue-50 py-4">              <textarea

              <p className="text-center text-sm">Container Small (max-w-screen-sm)</p>                className="input-field w-full resize-none"

            </Container>                rows={4}

            <Container maxWidth="md" padding="sm" className="bg-green-50 py-4">                placeholder="Enter your message..."

              <p className="text-center text-sm">Container Medium (max-w-screen-md)</p>              />

            </Container>            </div>

            <Container maxWidth="lg" padding="sm" className="bg-yellow-50 py-4">          </div>

              <p className="text-center text-sm">Container Large (max-w-screen-lg)</p>        </section>

            </Container>

          </CardContent>        {/* Cards Section */}

        </Card>        <section>

          <h2 className="mb-8">Cards</h2>

        {/* Typography Examples */}

        <Card className="mb-8">          <div className="grid gap-6 md:grid-cols-2">

          <CardHeader>            {/* Feature Card 1 */}

            <CardTitle>Typography (Kiểu Chữ)</CardTitle>            <div className="card">

            <CardDescription>Các kiểu chữ cơ bản trong hệ thống</CardDescription>              <div className="mb-4 flex items-center gap-3">

          </CardHeader>                <div className="bg-primary-50 rounded-lg p-2">

          <CardContent className="space-y-4">                  <Video className="text-primary-600 h-6 w-6" />

            <div>                </div>

              <h1 className="text-4xl font-bold">Heading 1 - 4xl Bold</h1>                <h3 className="font-heading font-semibold text-neutral-900">Text to Video</h3>

              <h2 className="text-3xl font-bold">Heading 2 - 3xl Bold</h2>              </div>

              <h3 className="text-2xl font-semibold">Heading 3 - 2xl Semibold</h3>              <p className="mb-4 text-neutral-600">

              <h4 className="text-xl font-semibold">Heading 4 - xl Semibold</h4>                Transform your text descriptions into stunning videos with AI technology.

            </div>              </p>

            <div className="space-y-2">              <button className="btn-primary w-full">Get Started</button>

              <p className="text-base">Body text - Base size (16px)</p>            </div>

              <p className="text-sm text-gray-600">Small text - Small size (14px)</p>

              <p className="text-xs text-gray-500">Extra small text - XS size (12px)</p>            {/* Feature Card 2 */}

            </div>            <div className="card">

          </CardContent>              <div className="mb-4 flex items-center gap-3">

        </Card>                <div className="bg-secondary-50 rounded-lg p-2">

                  <ImageIcon className="text-secondary-500 h-6 w-6" />

        {/* Color Palette */}                </div>

        <Card>                <h3 className="font-heading font-semibold text-neutral-900">Image to Video</h3>

          <CardHeader>              </div>

            <CardTitle>Color Palette (Bảng Màu)</CardTitle>              <p className="mb-4 text-neutral-600">

            <CardDescription>Các màu chính trong hệ thống thiết kế</CardDescription>                Bring your static images to life with dynamic video animations.

          </CardHeader>              </p>

          <CardContent>              <button className="btn-secondary w-full">Learn More</button>

            <div className="grid gap-4 md:grid-cols-4">            </div>

              <div>

                <div className="mb-2 h-20 rounded-lg bg-blue-600"></div>            {/* Bordered Card */}

                <p className="text-sm font-medium">Primary Blue</p>            <div className="card-bordered">

                <p className="text-xs text-gray-500">#2563eb</p>              <div className="text-success mb-3 flex items-center gap-2">

              </div>                <Check className="h-5 w-5" />

              <div>                <h3 className="font-heading font-semibold">Success State</h3>

                <div className="mb-2 h-20 rounded-lg bg-gray-600"></div>              </div>

                <p className="text-sm font-medium">Gray</p>              <p className="text-neutral-600">

                <p className="text-xs text-gray-500">#4b5563</p>                Your video has been generated successfully! Check your dashboard to view it.

              </div>              </p>

              <div>            </div>

                <div className="mb-2 h-20 rounded-lg bg-green-600"></div>

                <p className="text-sm font-medium">Success Green</p>            {/* Alert Card */}

                <p className="text-xs text-gray-500">#16a34a</p>            <div className="card-bordered">

              </div>              <div className="text-warning mb-3 flex items-center gap-2">

              <div>                <AlertCircle className="h-5 w-5" />

                <div className="mb-2 h-20 rounded-lg bg-red-600"></div>                <h3 className="font-heading font-semibold">Processing</h3>

                <p className="text-sm font-medium">Danger Red</p>              </div>

                <p className="text-xs text-gray-500">#dc2626</p>              <p className="text-neutral-600">

              </div>                Your video is being generated. This may take a few minutes.

            </div>              </p>

          </CardContent>            </div>

        </Card>          </div>

        </section>

        <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">

          <h3 className="mb-2 text-xl font-semibold text-blue-900">🎨 Component Library Ready!</h3>        {/* Icons Section */}

          <p className="text-blue-700">        <section>

            Tất cả các component đã sẵn sàng để sử dụng. Import từ{' '}          <h2 className="mb-8">Icons (Lucide React)</h2>

            <code className="rounded bg-blue-100 px-2 py-1 font-mono text-sm">@/components/ui</code>

          </p>          <div className="card">

        </div>            <p className="mb-6 text-neutral-600">

      </Container>              All icons from the Lucide React library. Clean, modern, and tree-shakeable.

    </div>            </p>

  );

}            <div className="grid grid-cols-6 gap-8">

              <div className="flex flex-col items-center gap-2">
                <Video className="text-primary-600 h-8 w-8" />
                <p className="text-small text-neutral-600">Video</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="text-primary-600 h-8 w-8" />
                <p className="text-small text-neutral-600">Image</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Settings className="text-primary-600 h-8 w-8" />
                <p className="text-small text-neutral-600">Settings</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <User className="text-primary-600 h-8 w-8" />
                <p className="text-small text-neutral-600">User</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Check className="text-success h-8 w-8" />
                <p className="text-small text-neutral-600">Check</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AlertCircle className="text-error h-8 w-8" />
                <p className="text-small text-neutral-600">Alert</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-neutral-600">
            Sora Vietnam Gateway Design System - Powered by Tailwind CSS v4
          </p>
        </div>
      </footer>
    </div>
  );
}
