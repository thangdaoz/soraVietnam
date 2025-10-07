/**
 * Example Button Components - Demonstrates UI Design Kit Implementation
 *
 * This file shows how to use the configured Tailwind CSS with our design system.
 * These components follow the button specifications from ui-design-kit.md
 */
import { ButtonHTMLAttributes, ReactNode } from 'react';

import { Image, Loader2, Video } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  icon?: ReactNode;
  loading?: boolean;
}

/**
 * Button component implementing UI Design Kit specifications
 *
 * @example
 * ```tsx
 * <Button variant="primary">Click Me</Button>
 * <Button variant="secondary" icon={<Video />}>Create Video</Button>
 * <Button variant="tertiary">Learn More</Button>
 * ```
 */
export function Button({
  children,
  variant = 'primary',
  icon,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[0.375rem] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-neutral-200 disabled:text-neutral-500',
    secondary:
      'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 disabled:border-neutral-200 disabled:text-neutral-400',
    tertiary: 'text-primary-600 hover:underline disabled:text-neutral-400 disabled:no-underline',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
      {children}
    </button>
  );
}

/**
 * Example usage of the Button component with different variants
 */
export function ButtonExamples() {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h2 className="mb-4">Primary Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Create Video</Button>
          <Button variant="primary" icon={<Video className="h-5 w-5" />}>
            Text to Video
          </Button>
          <Button variant="primary" icon={<Image className="h-5 w-5" />}>
            Image to Video
          </Button>
          <Button variant="primary" loading>
            Processing...
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section>
        <h2 className="mb-4">Secondary Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary">Learn More</Button>
          <Button variant="secondary" icon={<Video className="h-5 w-5" />}>
            Watch Demo
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section>
        <h2 className="mb-4">Tertiary/Text Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="tertiary">Cancel</Button>
          <Button variant="tertiary">Skip</Button>
          <Button variant="tertiary" disabled>
            Disabled
          </Button>
        </div>
      </section>
    </div>
  );
}

/**
 * Example Card Component using design system
 */
export function ExampleCard() {
  return (
    <div className="card max-w-md">
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-primary-50 rounded-lg p-2">
          <Video className="text-primary-600 h-6 w-6" />
        </div>
        <h3 className="font-heading font-semibold text-neutral-900">Text to Video Generation</h3>
      </div>
      <p className="mb-4 text-neutral-600">
        Transform your creative ideas into stunning videos with just a text description. Our AI
        understands context and creates professional results.
      </p>
      <Button variant="primary" icon={<Video className="h-5 w-5" />}>
        Get Started
      </Button>
    </div>
  );
}

/**
 * Example Form with Input Fields using design system
 */
export function ExampleForm() {
  return (
    <form className="card max-w-md space-y-4">
      <h3 className="font-heading mb-4 font-semibold text-neutral-900">Create Your Account</h3>

      <div className="space-y-2">
        <label className="block font-medium text-neutral-900">Email Address</label>
        <input type="email" className="input-field w-full" placeholder="name@example.com" />
      </div>

      <div className="space-y-2">
        <label className="block font-medium text-neutral-900">Password</label>
        <input type="password" className="input-field w-full" placeholder="••••••••" />
        <p className="text-small text-neutral-500">Must be at least 8 characters</p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="primary" className="flex-1">
          Sign Up
        </Button>
        <Button variant="secondary" className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
