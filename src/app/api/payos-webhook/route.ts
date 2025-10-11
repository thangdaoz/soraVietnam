/**
 * PayOS Webhook Handler
 * 
 * Receives payment confirmation webhooks from PayOS and updates user credits.
 * This is the most critical endpoint - it MUST be secure and idempotent.
 * 
 * Security:
 * - Verifies webhook signature using PayOS SDK
 * - Only processes webhooks from PayOS (signature check)
 * - Prevents replay attacks (checks if already processed)
 * 
 * Register this URL in your PayOS Dashboard:
 * https://your-domain.com/api/payos-webhook
 */

import { NextRequest, NextResponse } from "next/server";
import { payOS } from "@/lib/payos/client";
import { createClient } from "@supabase/supabase-js";

// Use service role for server-side operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    // 1. Parse webhook payload
    const webhookBody = await request.json();

    console.log("📨 Received PayOS webhook:", JSON.stringify(webhookBody, null, 2));

    // 2. Verify webhook signature
    // This throws an error if signature is invalid
    try {
      await payOS.webhooks.verify(webhookBody);
    } catch (verifyError) {
      console.error("❌ Webhook signature verification failed:", verifyError);
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    // 3. Extract payment data
    const { data } = webhookBody;
    const orderCode = data.orderCode;
    const paymentStatus = data.code; // "00" = success, others = failure
    const amount = data.amount;
    const paymentLinkId = data.paymentLinkId;

    console.log(`💳 Payment status for order ${orderCode}: ${paymentStatus}`);

    // 4. Find the transaction in our database
    const { data: transaction, error: fetchError } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("payment_id", orderCode.toString())
      .single();

    if (fetchError || !transaction) {
      console.error(`❌ Transaction not found for order code ${orderCode}:`, fetchError);
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    // 5. Check if already processed (idempotency)
    if (transaction.status === "completed") {
      console.log(`ℹ️ Transaction ${transaction.id} already processed. Ignoring duplicate webhook.`);
      return NextResponse.json(
        { success: true, message: "Transaction already processed" },
        { status: 200 }
      );
    }

    // 6. Process based on payment status
    if (paymentStatus === "00") {
      // ✅ PAYMENT SUCCESS
      console.log(`✅ Payment successful for transaction ${transaction.id}`);

      // Start a transaction to ensure atomicity
      // We need to:
      // 1. Add credits to user
      // 2. Update transaction status
      // 3. Record completion timestamp

      // Get user's current profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("credits")
        .eq("user_id", transaction.user_id)
        .single();

      if (profileError || !profile) {
        console.error(`❌ Profile not found for user ${transaction.user_id}:`, profileError);
        return NextResponse.json(
          { success: false, message: "User profile not found" },
          { status: 404 }
        );
      }

      const newCredits = profile.credits + transaction.credits;

      // Update user credits
      const { error: updateCreditsError } = await supabaseAdmin
        .from("profiles")
        .update({ credits: newCredits })
        .eq("user_id", transaction.user_id);

      if (updateCreditsError) {
        console.error(`❌ Failed to update credits for user ${transaction.user_id}:`, updateCreditsError);
        return NextResponse.json(
          { success: false, message: "Failed to update credits" },
          { status: 500 }
        );
      }

      // Update transaction status
      const { error: updateTransactionError } = await supabaseAdmin
        .from("transactions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          payment_metadata: {
            ...transaction.payment_metadata,
            payment_link_id: paymentLinkId,
            webhook_received_at: new Date().toISOString(),
            webhook_data: data,
          },
        })
        .eq("id", transaction.id);

      if (updateTransactionError) {
        console.error(`❌ Failed to update transaction ${transaction.id}:`, updateTransactionError);
        // Credits were added but transaction not updated - this is logged for manual review
      }

      console.log(`🎉 Successfully processed payment:
        - User: ${transaction.user_id}
        - Transaction: ${transaction.id}
        - Credits added: ${transaction.credits}
        - New balance: ${newCredits}
      `);

      return NextResponse.json(
        {
          success: true,
          message: "Payment processed successfully",
          transactionId: transaction.id,
        },
        { status: 200 }
      );
    } else {
      // ❌ PAYMENT FAILED/CANCELLED
      console.log(`❌ Payment failed for transaction ${transaction.id}. Status: ${paymentStatus}`);

      // Update transaction status to failed/cancelled
      const { error: updateError } = await supabaseAdmin
        .from("transactions")
        .update({
          status: paymentStatus === "02" ? "cancelled" : "failed",
          payment_metadata: {
            ...transaction.payment_metadata,
            payment_link_id: paymentLinkId,
            webhook_received_at: new Date().toISOString(),
            webhook_data: data,
            failure_reason: data.desc || "Payment failed",
          },
        })
        .eq("id", transaction.id);

      if (updateError) {
        console.error(`❌ Failed to update failed transaction ${transaction.id}:`, updateError);
      }

      return NextResponse.json(
        {
          success: true,
          message: "Payment failure recorded",
          transactionId: transaction.id,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Prevent caching
export const dynamic = "force-dynamic";
