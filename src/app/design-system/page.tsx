/**
 * Design System Showcase Page
 *
 * This page demonstrates all the configured Tailwind CSS components
 * and design tokens from the UI Design Kit.
 */
import { AlertCircle, Check, Image as ImageIcon, Settings, User, Video } from 'lucide-react';

export default function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="font-heading text-primary-600 text-[1.25rem] font-semibold">
            Sora Vietnam
          </div>
          <div className="flex items-center gap-6">
            <a href="#colors" className="hover:text-primary-600 text-neutral-600 transition-colors">
              Colors
            </a>
            <a
              href="#typography"
              className="hover:text-primary-600 text-neutral-600 transition-colors"
            >
              Typography
            </a>
            <a
              href="#components"
              className="hover:text-primary-600 text-neutral-600 transition-colors"
            >
              Components
            </a>
            <button className="btn-primary">Get Started</button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto space-y-16 px-4 py-12">
        {/* Hero Section */}
        <section className="py-16 text-center">
          <h1 className="mb-4">Design System Showcase</h1>
          <p className="mx-auto max-w-2xl text-[1.125rem] text-neutral-600">
            Explore the complete UI components and design tokens configured for Sora Vietnam
            Gateway.
          </p>
        </section>

        {/* Colors Section */}
        <section id="colors">
          <h2 className="mb-8">Color Palette</h2>

          <div className="space-y-8">
            {/* Primary Colors */}
            <div>
              <h3 className="mb-4">Primary (Indigo)</h3>
              <div className="grid grid-cols-11 gap-2">
                {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map(
                  (shade) => (
                    <div key={shade} className="space-y-2">
                      <div
                        className={`h-20 rounded-lg bg-primary-${shade} ${parseInt(shade) >= 600 ? 'border border-neutral-200' : ''}`}
                      />
                      <p className="text-small text-center text-neutral-600">{shade}</p>
                    </div>
                  )
                )}
              </div>
              <p className="text-small mt-2 text-neutral-500">Main brand color: 600</p>
            </div>

            {/* Secondary Colors */}
            <div>
              <h3 className="mb-4">Secondary (Emerald)</h3>
              <div className="grid grid-cols-11 gap-2">
                {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map(
                  (shade) => (
                    <div key={shade} className="space-y-2">
                      <div className={`h-20 rounded-lg bg-secondary-${shade}`} />
                      <p className="text-small text-center text-neutral-600">{shade}</p>
                    </div>
                  )
                )}
              </div>
              <p className="text-small mt-2 text-neutral-500">Accent color: 500</p>
            </div>

            {/* Feedback Colors */}
            <div>
              <h3 className="mb-4">Feedback Colors</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="bg-error flex h-20 items-center justify-center rounded-lg font-medium text-white">
                    Error
                  </div>
                  <p className="text-small text-neutral-600">Red: #EF4444</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-warning flex h-20 items-center justify-center rounded-lg font-medium text-white">
                    Warning
                  </div>
                  <p className="text-small text-neutral-600">Amber: #F59E0B</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-success flex h-20 items-center justify-center rounded-lg font-medium text-white">
                    Success
                  </div>
                  <p className="text-small text-neutral-600">Emerald: #10B981</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section id="typography">
          <h2 className="mb-8">Typography</h2>

          <div className="card space-y-6">
            <div>
              <h1>Heading 1 - Poppins Semi-Bold 36px</h1>
              <p className="text-small mt-2 text-neutral-500">font-heading, font-weight: 600</p>
            </div>

            <div>
              <h2>Heading 2 - Poppins Semi-Bold 24px</h2>
              <p className="text-small mt-2 text-neutral-500">font-heading, font-weight: 600</p>
            </div>

            <div>
              <h3>Heading 3 - Poppins Medium 20px</h3>
              <p className="text-small mt-2 text-neutral-500">font-heading, font-weight: 500</p>
            </div>

            <div>
              <p className="text-body">
                Body text - Inter Regular 16px. This is the standard paragraph text used throughout
                the application. It provides excellent readability on screens and works well for
                Vietnamese characters.
              </p>
              <p className="text-small mt-2 text-neutral-500">font-sans, font-weight: 400</p>
            </div>

            <div>
              <p className="text-small">
                Small text - Inter Regular 14px. Used for helper text and captions.
              </p>
              <p className="text-small mt-2 text-neutral-500">
                font-sans, font-weight: 400, size: 14px
              </p>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section id="components">
          <h2 className="mb-8">Buttons</h2>

          <div className="card space-y-6">
            <div className="space-y-3">
              <h3>Primary Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">Default</button>
                <button className="btn-primary">
                  <Video className="h-5 w-5" />
                  With Icon
                </button>
                <button className="btn-primary" disabled>
                  Disabled
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3>Secondary Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-secondary">Default</button>
                <button className="btn-secondary">
                  <ImageIcon className="h-5 w-5" />
                  With Icon
                </button>
                <button className="btn-secondary" disabled>
                  Disabled
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3>Text Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="text-primary-600 font-medium hover:underline">Default</button>
                <button className="text-primary-600 font-medium hover:underline">Learn More</button>
                <button className="cursor-not-allowed font-medium text-neutral-400">
                  Disabled
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Form Inputs Section */}
        <section>
          <h2 className="mb-8">Form Inputs</h2>

          <div className="card max-w-2xl space-y-6">
            <div className="space-y-2">
              <label className="block font-medium text-neutral-900">Default Input</label>
              <input type="text" className="input-field w-full" placeholder="Enter text..." />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-neutral-900">Focused Input</label>
              <input
                type="text"
                className="input-field w-full"
                placeholder="Click to see focus state"
              />
              <p className="text-small text-neutral-500">Focus to see the primary blue border</p>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-neutral-900">Error State</label>
              <input
                type="email"
                className="input-field error w-full"
                placeholder="invalid@email"
              />
              <p className="text-small text-error flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Please enter a valid email address
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-neutral-900">Text Area</label>
              <textarea
                className="input-field w-full resize-none"
                rows={4}
                placeholder="Enter your message..."
              />
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="mb-8">Cards</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Feature Card 1 */}
            <div className="card">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-primary-50 rounded-lg p-2">
                  <Video className="text-primary-600 h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-neutral-900">Text to Video</h3>
              </div>
              <p className="mb-4 text-neutral-600">
                Transform your text descriptions into stunning videos with AI technology.
              </p>
              <button className="btn-primary w-full">Get Started</button>
            </div>

            {/* Feature Card 2 */}
            <div className="card">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-secondary-50 rounded-lg p-2">
                  <ImageIcon className="text-secondary-500 h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-neutral-900">Image to Video</h3>
              </div>
              <p className="mb-4 text-neutral-600">
                Bring your static images to life with dynamic video animations.
              </p>
              <button className="btn-secondary w-full">Learn More</button>
            </div>

            {/* Bordered Card */}
            <div className="card-bordered">
              <div className="text-success mb-3 flex items-center gap-2">
                <Check className="h-5 w-5" />
                <h3 className="font-heading font-semibold">Success State</h3>
              </div>
              <p className="text-neutral-600">
                Your video has been generated successfully! Check your dashboard to view it.
              </p>
            </div>

            {/* Alert Card */}
            <div className="card-bordered">
              <div className="text-warning mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-heading font-semibold">Processing</h3>
              </div>
              <p className="text-neutral-600">
                Your video is being generated. This may take a few minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Icons Section */}
        <section>
          <h2 className="mb-8">Icons (Lucide React)</h2>

          <div className="card">
            <p className="mb-6 text-neutral-600">
              All icons from the Lucide React library. Clean, modern, and tree-shakeable.
            </p>

            <div className="grid grid-cols-6 gap-8">
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
