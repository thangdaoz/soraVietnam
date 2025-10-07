# Component Library Documentation

**Created:** October 7, 2025  
**Status:** ✅ Production Ready  
**Location:** `src/components/ui`  
**Total Components:** 10

---

## 📦 Installation

The component library uses `class-variance-authority` for variant management:

```bash
npm install class-variance-authority
```

---

## 🎯 Usage

Import components from the barrel export:

```tsx
import { Button, Input, Card, Badge, Alert, Loading } from '@/components/ui';
```

---

## 🧩 Component List

### 1. Button

A flexible button component with multiple variants, sizes, and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `fullWidth`: boolean
- `isLoading`: boolean
- All standard button HTML attributes

**Example:**
```tsx
<Button variant="primary" size="md" isLoading={false}>
  Tạo Video
</Button>

<Button variant="danger" onClick={() => console.log('Delete')}>
  Xóa
</Button>
```

---

### 2. Input

Text input component with label, error handling, and helper text.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `variant`: 'default' | 'error' | 'success'
- `inputSize`: 'sm' | 'md' | 'lg'
- `required`: boolean
- All standard input HTML attributes

**Example:**
```tsx
<Input
  label="Email của bạn"
  type="email"
  placeholder="email@example.com"
  required
  error="Email không hợp lệ"
  helperText="Chúng tôi sẽ không chia sẻ email của bạn"
/>
```

---

### 3. Textarea

Multi-line text input with character counting.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `maxLength`: number
- `showCount`: boolean
- `variant`: 'default' | 'error' | 'success'
- All standard textarea HTML attributes

**Example:**
```tsx
<Textarea
  label="Mô tả video"
  placeholder="Nhập mô tả chi tiết..."
  maxLength={500}
  showCount
  rows={4}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

---

### 4. Select

Dropdown select component with options.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `options`: SelectOption[]
- `placeholder`: string
- `variant`: 'default' | 'error' | 'success'
- `selectSize`: 'sm' | 'md' | 'lg'
- All standard select HTML attributes

**Example:**
```tsx
<Select
  label="Loại video"
  placeholder="Chọn loại..."
  options={[
    { value: 'text-to-video', label: 'Text to Video' },
    { value: 'image-to-video', label: 'Image to Video' },
  ]}
  value={videoType}
  onChange={(e) => setVideoType(e.target.value)}
/>
```

---

### 5. Checkbox

Checkbox input with label and error states.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- All standard checkbox HTML attributes (except `type`)

**Example:**
```tsx
<Checkbox
  label="Tôi đồng ý với điều khoản sử dụng"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
```

---

### 6. Card

Flexible card container with multiple variants and padding options.

**Components:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title heading
- `CardDescription` - Description text
- `CardContent` - Main content area
- `CardFooter` - Footer section

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'ghost'
- `padding`: 'none' | 'sm' | 'md' | 'lg'

**Example:**
```tsx
<Card variant="elevated" padding="md">
  <CardHeader>
    <CardTitle>Tạo Video Mới</CardTitle>
    <CardDescription>Tạo video từ văn bản hoặc hình ảnh</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Nội dung chính của card...</p>
  </CardContent>
  <CardFooter>
    <Button>Xác nhận</Button>
  </CardFooter>
</Card>
```

---

### 7. Container

Responsive container with max-width constraints.

**Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
- `padding`: 'none' | 'sm' | 'md' | 'lg'

**Example:**
```tsx
<Container maxWidth="xl" padding="md">
  <h1>Nội dung trang</h1>
</Container>
```

---

### 8. Badge

Small status indicator badge.

**Props:**
- `variant`: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline'

**Example:**
```tsx
<Badge variant="success">Hoàn thành</Badge>
<Badge variant="warning">Đang xử lý</Badge>
<Badge variant="danger">Lỗi</Badge>
```

---

### 9. Alert

Alert messages with different severity levels.

**Components:**
- `Alert` - Main container
- `AlertTitle` - Alert title
- `AlertDescription` - Alert description

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'danger' | 'info'
- `onClose`: () => void (optional, adds close button)

**Example:**
```tsx
<Alert variant="success" onClose={() => setShowAlert(false)}>
  <AlertTitle>Thành công!</AlertTitle>
  <AlertDescription>Video của bạn đã được tạo.</AlertDescription>
</Alert>

<Alert variant="danger">
  <AlertTitle>Lỗi</AlertTitle>
  <AlertDescription>Không thể tạo video. Vui lòng thử lại.</AlertDescription>
</Alert>
```

---

### 10. Loading

Loading spinner with multiple sizes and variants.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'primary' | 'secondary' | 'white'
- `label`: string (optional text below spinner)
- `fullScreen`: boolean (covers entire screen)

**Example:**
```tsx
<Loading size="md" variant="primary" label="Đang tải..." />

<Loading size="lg" fullScreen label="Đang tạo video..." />
```

---

## 🎨 Design Principles

### 1. **Consistency**
- All components follow the same naming conventions
- Consistent prop patterns across similar components
- Unified color palette and spacing system

### 2. **Accessibility**
- ARIA labels and descriptions
- Keyboard navigation support
- Focus states on all interactive elements
- Screen reader friendly
- Error messages associated with form fields

### 3. **Responsiveness**
- Mobile-first approach
- Flexible layouts with Tailwind CSS
- Container components for consistent spacing

### 4. **TypeScript Support**
- Full type definitions for all components
- IntelliSense support in IDEs
- Compile-time type checking

### 5. **Vietnamese Language**
- Loading states use Vietnamese text
- Form validation messages in Vietnamese
- Placeholder text in Vietnamese

---

## 🔧 Customization

All components use Tailwind CSS classes and can be customized via:

1. **className prop** - Add custom Tailwind classes
2. **Tailwind config** - Modify colors, spacing, fonts globally
3. **Component variants** - Extend variants using CVA

**Example:**
```tsx
<Button 
  variant="primary" 
  className="shadow-xl hover:scale-105 transition-transform"
>
  Custom Button
</Button>
```

---

## 📊 Component Coverage

| Category | Components | Status |
|----------|-----------|---------|
| **Forms** | Input, Textarea, Select, Checkbox | ✅ Complete |
| **Actions** | Button | ✅ Complete |
| **Layout** | Container, Card | ✅ Complete |
| **Feedback** | Alert, Badge, Loading | ✅ Complete |
| **Navigation** | - | ⏳ Future |
| **Overlay** | Modal, Dialog | ⏳ Future |
| **Data Display** | Table, List | ⏳ Future |

---

## 🚀 Next Steps

### Recommended Additions (Future)
1. **Modal/Dialog** - For confirmations and forms
2. **Toast/Notification** - For temporary messages
3. **Tabs** - For content organization
4. **Table** - For data display
5. **Pagination** - For video gallery
6. **Avatar** - For user profiles
7. **Dropdown Menu** - For navigation
8. **Radio Button** - For mutually exclusive options
9. **Switch/Toggle** - For settings
10. **Progress Bar** - For video upload/generation

---

## 📱 View Components

Visit `/components-showcase` to see all components in action with interactive examples.

---

## 🎓 Best Practices

### 1. **Use Semantic HTML**
```tsx
// Good
<Button type="submit">Gửi</Button>

// Avoid
<div onClick={handleClick}>Gửi</div>
```

### 2. **Provide Labels**
```tsx
// Good
<Input label="Email" type="email" />

// Avoid
<Input placeholder="Email" /> // No label for screen readers
```

### 3. **Handle Errors Properly**
```tsx
// Good
<Input 
  label="Email" 
  error={errors.email} 
  aria-invalid={!!errors.email}
/>
```

### 4. **Use Loading States**
```tsx
// Good
<Button isLoading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? 'Đang gửi...' : 'Gửi'}
</Button>
```

---

## 📄 License

Part of Sora Vietnam Gateway project.

---

**Questions or issues?** Check the showcase page at `/components-showcase` or refer to individual component source code in `src/components/ui/`.
