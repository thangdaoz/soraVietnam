/**
 * PayOS Client Configuration
 * 
 * Initializes the PayOS SDK with credentials from environment variables.
 * Used for creating payment links and verifying webhook data.
 * 
 * @see https://payos.vn/docs/api-reference
 */

import { PayOS } from "@payos/node";

// Validate required environment variables
const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
const PAYOS_API_KEY = process.env.PAYOS_API_KEY;
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;

if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
  throw new Error(
    "Missing PayOS credentials. Please set PAYOS_CLIENT_ID, PAYOS_API_KEY, and PAYOS_CHECKSUM_KEY in your environment variables."
  );
}

// Initialize PayOS client (v2.0.3+ uses object format)
export const payOS = new PayOS({
  clientId: PAYOS_CLIENT_ID,
  apiKey: PAYOS_API_KEY,
  checksumKey: PAYOS_CHECKSUM_KEY,
});

/**
 * Type definitions for PayOS API
 */
export interface PaymentLinkData {
  orderCode: number;
  amount: number;
  description: string;
  cancelUrl: string;
  returnUrl: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface PaymentLinkResponse {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  paymentLinkId: string;
  status: string;
  checkoutUrl: string;
  qrCode: string;
}

export interface WebhookData {
  code: string;
  desc: string;
  data: {
    orderCode: number;
    amount: number;
    description: string;
    accountNumber: string;
    reference: string;
    transactionDateTime: string;
    currency: string;
    paymentLinkId: string;
    code: string;
    desc: string;
    counterAccountBankId: string | null;
    counterAccountBankName: string | null;
    counterAccountName: string | null;
    counterAccountNumber: string | null;
    virtualAccountName: string | null;
    virtualAccountNumber: string | null;
  };
  signature: string;
}

export default payOS;
