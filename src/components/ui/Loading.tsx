import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const loadingVariants = cva('animate-spin rounded-full border-2 border-current border-t-transparent', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    },
    variant: {
      primary: 'text-blue-600',
      secondary: 'text-gray-600',
      white: 'text-white',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
});

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  label?: string;
  fullScreen?: boolean;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, size, variant, label, fullScreen, ...props }, ref) => {
    const spinner = (
      <div className="flex flex-col items-center justify-center gap-2">
        <div className={loadingVariants({ size, variant, className })} role="status" aria-label={label || 'Đang tải'} />
        {label && <p className="text-sm text-gray-600">{label}</p>}
      </div>
    );

    if (fullScreen) {
      return (
        <div
          ref={ref}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
          {...props}
        >
          {spinner}
        </div>
      );
    }

    return (
      <div ref={ref} className="flex items-center justify-center p-4" {...props}>
        {spinner}
      </div>
    );
  }
);

Loading.displayName = 'Loading';

export { Loading, loadingVariants };
