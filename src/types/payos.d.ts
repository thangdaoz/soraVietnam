/**
 * PayOS Checkout TypeScript Declarations
 * For the PayOS embedded checkout library
 */

interface PayOSConfig {
  /** URL to redirect after successful payment */
  RETURN_URL: string;
  /** ID of the HTML element where the checkout will be embedded */
  ELEMENT_ID: string;
  /** PayOS checkout URL returned from payment link creation */
  CHECKOUT_URL: string;
  /** Enable embedded mode (display within your page) */
  embedded: boolean;
  /** Callback function when payment is successful */
  onSuccess?: (event: PayOSSuccessEvent) => void;
  /** Callback function when payment is cancelled */
  onCancel?: (event: PayOSCancelEvent) => void;
  /** Callback function when payment fails */
  onExit?: (event: PayOSExitEvent) => void;
}

interface PayOSSuccessEvent {
  /** Order code of the successful payment */
  orderCode: number;
  /** Payment status */
  status: string;
}

interface PayOSCancelEvent {
  /** Order code of the cancelled payment */
  orderCode: number;
}

interface PayOSExitEvent {
  /** Order code when user exits */
  orderCode?: number;
}

interface PayOSCheckoutInstance {
  /** Opens the embedded checkout UI */
  open: () => void;
  /** Closes the embedded checkout UI */
  exit: () => void;
}

interface PayOSCheckout {
  /** Initialize PayOS checkout with configuration */
  usePayOS: (config: PayOSConfig) => PayOSCheckoutInstance;
}

declare global {
  interface Window {
    PayOSCheckout: PayOSCheckout;
  }
}

export {};
