# PayOS Integration Guide for Website Credit Purchases

## 1. Introduction

This document provides a step-by-step guide for developers to integrate the PayOS payment gateway into our web application. The primary goal is to allow users to purchase on-site credits. The integration involves creating payment links on the backend, redirecting users to the PayOS checkout page, and securely handling payment confirmation via webhooks.

This guide assumes a Node.js backend, but the principles can be applied to any server-side language.

## 2. Prerequisites

Before you begin, ensure you have the following from your PayOS dashboard:

- **Client ID**: Your unique client identifier.
- **API Key**: Your secret key for authenticating API requests.
- **Checksum Key**: Your secret key for verifying the integrity of webhook data.

> **Security Note**: Store these keys securely as environment variables. Do not hard-code them into your application's source code.

```bash
# Example .env file
PAYOS_CLIENT_ID="your_client_id"
PAYOS_API_KEY="your_api_key"
PAYOS_CHECKSUM_KEY="your_checksum_key"
```

## 3. Backend Integration

The backend is responsible for creating payment links and verifying payment status.

### Step 3.1: Install the PayOS Library

First, install the official PayOS Node.js library.

```bash
npm install @payos/node
```

### Step 3.2: Initialize PayOS Client

Create an instance of the PayOS client using your credentials.

```javascript
// /utils/payosClient.js
import PayOS from "@payos/node";

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

export default payOS;
```

### Step 3.3: Create an Endpoint for Payment Link Generation

Create a backend API endpoint that the frontend can call to initiate a payment. This endpoint will generate a unique order code and request a payment link from PayOS.

```javascript
// /routes/payment.js
import express from 'express';
import payOS from '../utils/payosClient.js';

const router = express.Router();

router.post('/create-payment-link', async (req, res) => {
  const { amount, description } = req.body; // e.g., amount = 50000, description = "Buy 500 credits"

  // Generate a unique order code for every transaction. 
  // You should save this in your database with a 'PENDING' status.
  const orderCode = parseInt(String(Date.now()).slice(-6));

  const paymentData = {
    orderCode,
    amount,
    description,
    cancelUrl: `https://your-domain.com/payment-cancelled`,
    returnUrl: `https://your-domain.com/payment-success`, // User is redirected here after payment
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(paymentData);
    
    // You should associate the 'paymentLinkResponse.paymentLinkId' with your order in the database
    // This allows you to query the transaction status later if needed.

    res.json({
      success: true,
      checkoutUrl: paymentLinkResponse.checkoutUrl,
    });
  } catch (error) {
    console.error('Failed to create payment link:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment link.' });
  }
});

export default router;
```

## 4. Frontend Integration

The frontend initiates the payment process and redirects the user.

### Step 4.1: Call the Backend to Get a Payment Link

When a user clicks a "Buy Credits" button, make a request to the `/create-payment-link` endpoint you created.

```javascript
// Example frontend code
async function handleBuyCredits(creditPackage) {
  try {
    const response = await fetch('/api/payment/create-payment-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: creditPackage.price, // e.g., 50000 (VND)
        description: `Buy ${creditPackage.name}`,
      }),
    });

    const data = await response.json();

    if (data.success && data.checkoutUrl) {
      // Redirect the user to the PayOS checkout page
      window.location.href = data.checkoutUrl;
    } else {
      alert('Error: Could not initiate payment.');
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    alert('An unexpected error occurred. Please try again.');
  }
}
```

## 5. Handling Payment Confirmation (Webhook)

This is the most critical step for securely confirming payments. PayOS will send a POST request to your webhook endpoint when a transaction's status changes.

### Step 5.1: Create a Webhook Endpoint

Create a new endpoint on your backend to receive data from PayOS.

```javascript
// /routes/webhook.js
import express from 'express';
import payOS from '../utils/payosClient.js';

const router = express.Router();

router.post('/payos-handler', async (req, res) => {
  const webhookBody = req.body;

  try {
    // 1. Verify the webhook signature to ensure it's from PayOS
    payOS.verifyPaymentWebhookData(webhookBody);

    // 2. Process the payment data
    const orderCode = webhookBody.data.orderCode;
    const transactionStatus = webhookBody.data.status;

    // IMPORTANT: Check your database for this orderCode
    // const order = await YourDatabase.findOrder(orderCode);

    // if (!order) {
    //   console.error(`Webhook Error: Order ${orderCode} not found.`);
    //   return res.status(404).json({ message: 'Order not found' });
    // }

    // if (order.status === 'PAID') {
    //   console.log(`Webhook Info: Order ${orderCode} already processed.`);
    //   return res.json({ message: 'Order already processed' });
    // }

    if (transactionStatus === 'PAID') {
      // SUCCESS! Payment is confirmed.
      // - Update the order status in your database to 'PAID'.
      // - Add the credits to the user's account.
      console.log(`Order ${orderCode} paid successfully.`);
      // await YourDatabase.updateOrderStatus(orderCode, 'PAID');
      // await YourDatabase.addUserCredits(order.userId, order.creditsAmount);
    } else {
      // Handle other statuses (CANCELLED, etc.) if necessary
      console.log(`Order ${orderCode} has status: ${transactionStatus}.`);
      // await YourDatabase.updateOrderStatus(orderCode, transactionStatus);
    }
    
    // 3. Respond to PayOS to acknowledge receipt
    res.status(200).json({
      success: true,
      message: 'Webhook received successfully.'
    });

  } catch (error) {
    console.error('Webhook verification failed:', error);
    // If verification fails, the request might be fraudulent.
    res.status(400).json({ success: false, message: 'Invalid signature.' });
  }
});

export default router;
```

### Step 5.2: Register Your Webhook URL

In your PayOS Dashboard, go to **Payment > Webhooks** and add the public URL for the endpoint you just created (e.g., `https://your-domain.com/api/webhook/payos-handler`).

## 6. Important Security Considerations

- **Trust the Webhook, Not the returnUrl**: The `returnUrl` is for user experience only. A user can visit this URL without completing a payment. Only grant credits to a user after a successful and verified webhook event for their `orderCode`.

- **Prevent Replay Attacks**: Ensure that your system checks if an `orderCode` has already been processed before granting credits. This prevents a webhook from being processed multiple times for the same order.

- **Idempotency**: Design your webhook handler to be idempotent. This means that if it receives the same webhook multiple times, the outcome will be the same (i.e., credits are only granted once).