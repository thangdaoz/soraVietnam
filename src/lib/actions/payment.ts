/**
 * Payment Server Actions
 * 
 * Server-side actions for handling PayOS payment integration.
 * Includes creating payment links and retrieving transaction history.
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { payOS } from "@/lib/payos/client";
import { getPackageById } from "@/lib/payos/packages";
import { revalidatePath } from "next/cache";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Create a PayOS payment link for credit purchase
 * 
 * @param packageId - ID of the credit package to purchase (optional if customAmount is provided)
 * @param customAmount - Custom amount in VND (optional, min 30,000, max 20,000,000)
 * @returns Payment checkout URL or error
 */
export async function createPaymentLink(packageId?: string | null, customAmount?: number) {
  try {
    const supabase = await createClient();

    // 1. Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để mua credits",
      };
    }

    // 2. Get credit package details or use custom amount
    let credits: number;
    let priceVnd: number;
    let description: string;
    let packageName: string;

    if (customAmount) {
      // Custom amount: 1 VND = 1 credit
      if (customAmount < 30000 || customAmount > 20000000) {
        return {
          success: false,
          error: "Số tiền phải từ 30,000 VND đến 20,000,000 VND",
        };
      }
      credits = customAmount;
      priceVnd = customAmount;
      packageName = "Goi Tuy Chinh"; // No special chars for PayOS
      description = "Nap credits"; // Keep it short (max 25 chars)
    } else if (packageId) {
      const creditPackage = await getPackageById(packageId);

      if (!creditPackage) {
        return {
          success: false,
          error: "Gói credits không tồn tại",
        };
      }

      credits = creditPackage.credits;
      priceVnd = creditPackage.priceVnd;
      packageName = creditPackage.name;
      description = "Mua goi credits"; // Keep it short (max 25 chars)
    } else {
      return {
        success: false,
        error: "Vui lòng chọn gói credits hoặc nhập số tiền",
      };
    }

    // 3. Generate unique order code (6 digits from timestamp)
    const orderCode = parseInt(String(Date.now()).slice(-6));

    // 4. Create transaction record in database (status: pending)
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type: "purchase",
        status: "pending",
        amount_vnd: priceVnd,
        credits: credits,
        payment_method: "bank_transfer", // PayOS uses bank transfer
        payment_id: orderCode.toString(),
        payment_metadata: {
          package_id: packageId || "custom",
          package_name: packageName,
          order_code: orderCode,
          is_custom: !!customAmount,
        },
        description: description,
      })
      .select()
      .single();

    if (transactionError) {
      console.error("Failed to create transaction:", transactionError);
      return {
        success: false,
        error: "Không thể tạo giao dịch. Vui lòng thử lại.",
      };
    }

    // 5. Create PayOS payment link
    // PayOS validation requirements:
    // - description: Simple text, no special chars, keep under 25 chars
    // - amount: Must be integer, no decimals
    // - URLs: Must be valid HTTPS in production (localhost might fail in embedded mode)
    // - orderCode: 6-digit integer
    
    // For embedded checkout, use simpler URLs without query params
    // We'll track the transaction via orderCode instead
    const paymentData = {
      orderCode,
      amount: Math.floor(priceVnd), // Ensure integer
      description: `DH${orderCode}`, // Simple format: DH{orderCode}
      returnUrl: `${APP_URL}/payment-success`,
      cancelUrl: `${APP_URL}/payment-cancelled`,
    };

    console.log("Creating PayOS payment link with data:", paymentData);

    const paymentLinkResponse = await payOS.paymentRequests.create(paymentData);
    
    console.log("PayOS response:", {
      paymentLinkId: paymentLinkResponse.paymentLinkId,
      checkoutUrl: paymentLinkResponse.checkoutUrl,
      status: paymentLinkResponse.status,
    });

    // 6. Update transaction with payment link ID
    await supabase
      .from("transactions")
      .update({
        payment_metadata: {
          ...transaction.payment_metadata,
          payment_link_id: paymentLinkResponse.paymentLinkId,
          checkout_url: paymentLinkResponse.checkoutUrl,
        },
      })
      .eq("id", transaction.id);

    return {
      success: true,
      checkoutUrl: paymentLinkResponse.checkoutUrl,
      transactionId: transaction.id,
      orderCode,
    };
  } catch (error) {
    console.error("Failed to create payment link:", error);
    
    // Enhanced error logging for debugging
    if (error && typeof error === 'object') {
      console.error("Error details:", JSON.stringify(error, null, 2));
    }
    
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Không thể tạo liên kết thanh toán. Vui lòng thử lại.",
    };
  }
}

/**
 * Get user's transaction history
 * 
 * @param limit - Maximum number of transactions to retrieve
 * @returns List of transactions or error
 */
export async function getTransactionHistory(limit = 50) {
  try {
    const supabase = await createClient();

    // 1. Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để xem lịch sử giao dịch",
      };
    }

    // 2. Fetch transactions for the user
    const { data: transactions, error: fetchError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (fetchError) {
      console.error("Failed to fetch transactions:", fetchError);
      return {
        success: false,
        error: "Không thể tải lịch sử giao dịch",
      };
    }

    return {
      success: true,
      transactions: transactions || [],
    };
  } catch (error) {
    console.error("Failed to get transaction history:", error);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi tải lịch sử giao dịch",
    };
  }
}

/**
 * Get a single transaction by ID
 * 
 * @param transactionId - UUID of the transaction
 * @returns Transaction details or error
 */
export async function getTransaction(transactionId: string) {
  try {
    const supabase = await createClient();

    // 1. Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập",
      };
    }

    // 2. Fetch transaction (RLS will ensure user owns it)
    const { data: transaction, error: fetchError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      console.error("Failed to fetch transaction:", fetchError);
      return {
        success: false,
        error: "Không thể tải thông tin giao dịch",
      };
    }

    return {
      success: true,
      transaction,
    };
  } catch (error) {
    console.error("Failed to get transaction:", error);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi tải thông tin giao dịch",
    };
  }
}

/**
 * Cancel a pending transaction
 * 
 * @param transactionId - UUID of the transaction to cancel
 * @returns Success or error
 */
export async function cancelTransaction(transactionId: string) {
  try {
    const supabase = await createClient();

    // 1. Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập",
      };
    }

    // 2. Update transaction status to cancelled
    const { error: updateError } = await supabase
      .from("transactions")
      .update({ status: "cancelled" })
      .eq("id", transactionId)
      .eq("user_id", user.id)
      .eq("status", "pending"); // Only cancel pending transactions

    if (updateError) {
      console.error("Failed to cancel transaction:", updateError);
      return {
        success: false,
        error: "Không thể hủy giao dịch",
      };
    }

    revalidatePath("/profile");

    return {
      success: true,
      message: "Đã hủy giao dịch",
    };
  } catch (error) {
    console.error("Failed to cancel transaction:", error);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi hủy giao dịch",
    };
  }
}
