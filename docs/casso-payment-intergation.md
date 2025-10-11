# PayOS Embedded Integration Guide for Website Credit Purchases

## 1. Introduction

This document provides a step-by-step guide for developers to integrate the PayOS Embedded payment gateway into a web application. The primary goal is to allow users to purchase on-site credits without ever leaving the website, providing a seamless checkout experience within a modal or iframe.

The integration involves creating payment links on the backend, displaying the PayOS checkout UI in an iframe on the frontend, and securely handling payment confirmation via webhooks. This guide assumes a Node.js backend, but the principles can be applied to any server-side language.

## 2. Prerequisites

Before you begin, ensure you have the following from your PayOS dashboard:

- **Client ID**: Your unique client identifier.
- **API Key**: Your secret key for authenticating API requests.
- **Checksum Key**: Your secret key for verifying the integrity of webhook data.

**Security Note**: Store these keys securely as environment variables. Do not hard-code them into your application's source code.

```env
# Example .env file
PAYOS_CLIENT_ID="your_client_id"
PAYOS_API_KEY="your_api_key"
PAYOS_CHECKSUM_KEY="your_checksum_key"
```

## ## 3. Backend Integration

The backend is responsible for creating payment links and, most importantly, verifying payment status via webhooks.

### Step 3.1: Install the PayOS Library

First, install the official PayOS Node.js library.

```bash
npm install @payos/node
```

### Step 3.2: Initialize PayOS Client

Create a reusable instance of the PayOS client using your credentials.

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

### ### Step 3.3: Create an Endpoint for Payment Link Generation

Create a backend API endpoint that the frontend calls to initiate a payment. This endpoint generates a unique order code and requests a payment link from PayOS. The `checkoutUrl` returned will be used as the source for the frontend iframe.

```javascript
// /routes/payment.js
import express from 'express';
import payOS from '../utils/payosClient.js';

const router = express.Router();

router.post('/create-payment-link', async (req, res) => {
  const { amount, description } = req.body; // e.g., amount = 50000, description = "Buy 500 credits"

  // Generate a unique order code for every transaction.
  // You MUST save this in your database with a 'PENDING' status.
  const orderCode = parseInt(String(Date.now()).slice(-6));

  const paymentData = {
    orderCode,
    amount,
    description,
    // The user is redirected to these URLs within the iframe after payment.
    // The frontend will listen for these URL changes to close the payment modal.
    cancelUrl: `https://your-domain.com/payment-cancelled`,
    returnUrl: `https://your-domain.com/payment-success`,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(paymentData);

    // You should associate the 'paymentLinkResponse.paymentLinkId' with your order in the database.
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

## ## 4. Frontend Integration (Embedded Flow)

The frontend will now create a modal and an iframe to display the PayOS checkout page, listening for events to manage the UI flow.

### Step 4.1: Create the Payment Modal

Add a modal structure to your HTML. It can be hidden by default and shown when payment is initiated.

```html
<!-- Payment Modal -->
<div id="payment-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center;">
  <div style="background:white; padding:20px; border-radius:8px; width:90%; max-width:500px; height: 80%; max-height: 700px;">
    <button id="close-modal-btn" style="float:right;">X</button>
    <h3>Complete Your Payment</h3>
    <iframe id="payment-iframe" style="width:100%; height:90%; border:none;"></iframe>
  </div>
</div>
```

### ### Step 4.2: Initiate Payment and Display Iframe

When a user clicks "Buy Credits," call your backend to get the `checkoutUrl` and then load it into the iframe. Listen for messages from the iframe to handle success or cancellation.

```javascript
// Example frontend JavaScript
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
      // Show the modal and set iframe source
      const modal = document.getElementById('payment-modal');
      const iframe = document.getElementById('payment-iframe');
      iframe.src = data.checkoutUrl;
      modal.style.display = 'flex';
    } else {
      alert('Error: Could not initiate payment.');
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    alert('An unexpected error occurred. Please try again.');
  }
}

// --- Event Listener to close the modal ---
function setupModalControls() {
    const modal = document.getElementById('payment-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    const closeModal = () => {
        modal.style.display = 'none';
        document.getElementById('payment-iframe').src = 'about:blank'; // Clear iframe
    };

    closeModalBtn.addEventListener('click', closeModal);

    // Listen for events from the PayOS iframe
    window.addEventListener('message', (event) => {
        // IMPORTANT: Check the event origin to ensure it's from PayOS for security
        if (event.origin !== '[https://my.payos.vn](https://my.payos.vn)') { // Adjust domain if necessary
            return;
        }

        if (event.data === 'payment_success' || event.data === 'payment_cancelled') {
            closeModal();
            // You can show a message like "Your payment is being processed..."
            // DO NOT grant credits here. Wait for the webhook.
            alert('Thank you! Your transaction is being processed. You will be notified shortly.');
        }
    });
}

// Call this function when your page loads
setupModalControls();
```

## ## 5. Handling Payment Confirmation (Webhook)

This step is identical to the hosted page flow and remains the most critical part for securely confirming payments and preventing fraud. This is your single source of truth.

### Step 5.1: Create a Webhook Endpoint

Create a new endpoint on your backend to receive real-time transaction status updates from PayOS.

```javascript
// /routes/webhook.js
import express from 'express';
import payOS from '../utils/payosClient.js';

const router = express.Router();

router.post('/payos-handler', express.json(), async (req, res) => {
  const webhookBody = req.body;

  try {
    // 1. Verify the webhook signature to ensure it's authentic
    const verifiedData = payOS.verifyPaymentWebhookData(webhookBody);

    const orderCode = verifiedData.orderCode;
    const transactionStatus = verifiedData.status;

    // 2. Check your database for this orderCode
    // const order = await YourDatabase.findOrder(orderCode);
    // if (!order) {
    //   console.error(`Webhook Error: Order ${orderCode} not found.`);
    //   return res.status(404).json({ message: 'Order not found' });
    // }
    // if (order.status === 'PAID') {
    //   console.log(`Webhook Info: Order ${orderCode} has already been processed.`);
    //   return res.status(200).json({ message: 'Order already processed' });
    // }

    // 3. Process the payment status
    if (transactionStatus === 'PAID') {
      // SUCCESS! Payment is confirmed.
      // - Update the order status in your database to 'PAID'.
      // - Securely add the credits to the user's account.
      console.log(`Order ${orderCode} paid successfully.`);
      // await YourDatabase.updateOrderStatus(orderCode, 'PAID');
      // await YourDatabase.addUserCredits(order.userId, order.creditsAmount);
    } else {
      // Handle other statuses (CANCELLED, FAILED) if necessary
      console.log(`Order ${orderCode} has status: ${transactionStatus}.`);
      // await YourDatabase.updateOrderStatus(orderCode, transactionStatus);
    }
    
    // 4. Respond to PayOS to acknowledge receipt
    res.status(200).json({ success: true, message: 'Webhook received' });

  } catch (error) {
    console.error('Webhook verification failed:', error);
    // If verification fails, the request is likely fraudulent or misconfigured.
    res.status(400).json({ success: false, message: 'Invalid signature.' });
  }
});

export default router;
```

### Step 5.2: Register Your Webhook URL

In your PayOS Dashboard, go to **Payment > Webhooks** and add the public URL for the endpoint you just created (e.g., `https://your-domain.com/api/webhook/payos-handler`).

## 6. Important Security Considerations

### Trust the Webhook, Not Frontend Events

The `message` event from the iframe is for user experience only (e.g., closing the modal). A malicious user could fake this event. Only grant credits to a user after receiving a successful and verified webhook event for their `orderCode`.

### Prevent Replay Attacks

Ensure your system checks if an `orderCode` has already been processed (`status === 'PAID'`) before granting credits. This prevents a webhook from being processed multiple times for the same order.

### Idempotency

Design your webhook handler to be idempotent. This means that if it receives the same "PAID" webhook multiple times, the outcome will be the same (i.e., credits are only granted once). The check in the previous point helps achieve this.