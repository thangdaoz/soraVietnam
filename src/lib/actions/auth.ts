'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

const signInSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  rememberMe: z.boolean().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  avatarUrl: z.string().url('URL không hợp lệ').optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

// ============================================================================
// TYPES
// ============================================================================

type ActionResponse<T = void> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: string; errors?: Record<string, string[]> };

// ============================================================================
// SIGN UP
// ============================================================================

export async function signUp(
  formData: FormData
): Promise<ActionResponse<{ needsVerification: boolean }>> {
  try {
    // Parse and validate form data
    const rawData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const result = signUpSchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        error: 'Vui lòng kiểm tra lại thông tin',
        errors: result.error.flatten().fieldErrors,
      };
    }

    const { fullName, email, password } = result.data;

    // Create Supabase client
    const supabase = await createClient();

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (authError) {
      console.error('Sign up error:', authError);
      
      // Handle specific errors
      if (authError.message.includes('already registered')) {
        return {
          success: false,
          error: 'Email này đã được đăng ký. Vui lòng đăng nhập.',
        };
      }

      return {
        success: false,
        error: authError.message || 'Đăng ký thất bại. Vui lòng thử lại.',
      };
    }

    // Check if email confirmation is required
    const needsVerification = authData.user?.identities?.length === 0;

    return {
      success: true,
      data: { needsVerification },
      message: needsVerification
        ? 'Vui lòng kiểm tra email để xác thực tài khoản'
        : 'Đăng ký thành công!',
    };
  } catch (error) {
    console.error('Unexpected error during sign up:', error);
    return {
      success: false,
      error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    };
  }
}

// ============================================================================
// SIGN IN
// ============================================================================

export async function signIn(
  formData: FormData
): Promise<ActionResponse> {
  try {
    // Parse and validate form data
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      rememberMe: formData.get('rememberMe') === 'true',
    };

    const result = signInSchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        error: 'Vui lòng kiểm tra lại thông tin',
        errors: result.error.flatten().fieldErrors,
      };
    }

    const { email, password } = result.data;

    // Create Supabase client
    const supabase = await createClient();

    // Sign in with Supabase Auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Sign in error:', signInError);

      // Handle specific errors
      if (signInError.message.includes('Invalid login credentials')) {
        return {
          success: false,
          error: 'Email hoặc mật khẩu không đúng',
        };
      }

      if (signInError.message.includes('Email not confirmed')) {
        return {
          success: false,
          error: 'Vui lòng xác thực email trước khi đăng nhập',
        };
      }

      return {
        success: false,
        error: signInError.message || 'Đăng nhập thất bại. Vui lòng thử lại.',
      };
    }

    // Revalidate the layout to update the UI
    revalidatePath('/', 'layout');

    return {
      success: true,
      data: undefined,
      message: 'Đăng nhập thành công!',
    };
  } catch (error) {
    console.error('Unexpected error during sign in:', error);
    return {
      success: false,
      error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    };
  }
}

// ============================================================================
// SIGN OUT
// ============================================================================

export async function signOut(): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: 'Đăng xuất thất bại. Vui lòng thử lại.',
      };
    }

    // Revalidate the layout to update the UI
    revalidatePath('/', 'layout');

    return {
      success: true,
      data: undefined,
      message: 'Đăng xuất thành công',
    };
  } catch (error) {
    console.error('Unexpected error during sign out:', error);
    return {
      success: false,
      error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    };
  }
}

// ============================================================================
// SIGN IN WITH OAUTH (GOOGLE)
// ============================================================================

export async function signInWithGoogle(): Promise<ActionResponse<{ url: string }>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('OAuth sign in error:', error);
      return {
        success: false,
        error: 'Đăng nhập với Google thất bại. Vui lòng thử lại.',
      };
    }

    if (!data.url) {
      return {
        success: false,
        error: 'Không thể tạo link đăng nhập. Vui lòng thử lại.',
      };
    }

    return {
      success: true,
      data: { url: data.url },
    };
  } catch (error) {
    console.error('Unexpected error during OAuth sign in:', error);
    return {
      success: false,
      error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    };
  }
}

// ============================================================================
// SIGN IN WITH OAUTH (FLEXIBLE - MULTIPLE PROVIDERS)
// ============================================================================

export async function signInWithOAuth(
  provider: 'google' | 'facebook'
): Promise<ActionResponse<{ url: string }>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        queryParams: provider === 'google' ? {
          access_type: 'offline',
          prompt: 'consent',
        } : undefined,
      },
    });

    if (error) {
      console.error('OAuth sign in error:', error);
      const providerName = provider === 'google' ? 'Google' : 'Facebook';
      return {
        success: false,
        error: `Đăng nhập với ${providerName} thất bại. Vui lòng thử lại.`,
      };
    }

    if (!data.url) {
      return {
        success: false,
        error: 'Không thể tạo link đăng nhập. Vui lòng thử lại.',
      };
    }

    return {
      success: true,
      data: { url: data.url },
    };
  } catch (error) {
    console.error('Unexpected error during OAuth sign in:', error);
    return {
      success: false,
      error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    };
  }
}

// ============================================================================
// FORGOT PASSWORD
// ============================================================================

export async function forgotPassword(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData = {
      email: formData.get('email') as string,
    };

    const result = forgotPasswordSchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        error: 'Email không hợp lệ',
        errors: result.error.flatten().fieldErrors,
      };
    }

    const { email } = result.data;

    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: 'Không thể gửi email. Vui lòng thử lại.',
      };
    }

    return {
      success: true,
      data: undefined,
      message: 'Vui lòng kiểm tra email để đặt lại mật khẩu',
    };
  } catch (error) {
    console.error('Unexpected error during forgot password:', error);
    return {
      success: false,
      error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    };
  }
}

// ============================================================================
// RESET PASSWORD
// ============================================================================

export async function resetPassword(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData = {
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const result = resetPasswordSchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        error: 'Vui lòng kiểm tra lại mật khẩu',
        errors: result.error.flatten().fieldErrors,
      };
    }

    const { password } = result.data;

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: 'Không thể đặt lại mật khẩu. Vui lòng thử lại.',
      };
    }

    // Revalidate the layout
    revalidatePath('/', 'layout');

    return {
      success: true,
      data: undefined,
      message: 'Đặt lại mật khẩu thành công!',
    };
  } catch (error) {
    console.error('Unexpected error during reset password:', error);
    return {
      success: false,
      error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    };
  }
}

// ============================================================================
// UPDATE PROFILE
// ============================================================================

export async function updateProfile(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData = {
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      avatarUrl: formData.get('avatarUrl') as string,
    };

    const result = updateProfileSchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        error: 'Vui lòng kiểm tra lại thông tin',
        errors: result.error.flatten().fieldErrors,
      };
    }

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: 'Bạn cần đăng nhập để cập nhật thông tin',
      };
    }

    // Update profile in database
    const updateData = {
      full_name: result.data.fullName,
      phone: result.data.phone,
      company: result.data.company,
      avatar_url: result.data.avatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await (supabase as any)
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      console.error('Update profile error:', updateError);
      return {
        success: false,
        error: 'Không thể cập nhật thông tin. Vui lòng thử lại.',
      };
    }

    // Revalidate profile page
    revalidatePath('/profile');

    return {
      success: true,
      data: undefined,
      message: 'Cập nhật thông tin thành công!',
    };
  } catch (error) {
    console.error('Unexpected error during profile update:', error);
    return {
      success: false,
      error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    };
  }
}

// ============================================================================
// CHANGE PASSWORD
// ============================================================================

export async function changePassword(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const result = changePasswordSchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        error: 'Vui lòng kiểm tra lại mật khẩu',
        errors: result.error.flatten().fieldErrors,
      };
    }

    const supabase = await createClient();

    // Verify current password by trying to sign in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return {
        success: false,
        error: 'Bạn cần đăng nhập để đổi mật khẩu',
      };
    }

    // Try to sign in with current password to verify it
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: result.data.currentPassword,
    });

    if (verifyError) {
      return {
        success: false,
        error: 'Mật khẩu hiện tại không đúng',
      };
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: result.data.newPassword,
    });

    if (updateError) {
      console.error('Change password error:', updateError);
      return {
        success: false,
        error: 'Không thể đổi mật khẩu. Vui lòng thử lại.',
      };
    }

    return {
      success: true,
      data: undefined,
      message: 'Đổi mật khẩu thành công!',
    };
  } catch (error) {
    console.error('Unexpected error during password change:', error);
    return {
      success: false,
      error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    };
  }
}

// ============================================================================
// DELETE ACCOUNT
// ============================================================================

export async function deleteAccount(): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: 'Bạn cần đăng nhập để xóa tài khoản',
      };
    }

    // Soft delete profile (mark as deleted)
    const { error: deleteError } = await (supabase as any)
      .from('profiles')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (deleteError) {
      console.error('Delete account error:', deleteError);
      return {
        success: false,
        error: 'Không thể xóa tài khoản. Vui lòng thử lại.',
      };
    }

    // Sign out the user
    await supabase.auth.signOut();

    // Revalidate the layout
    revalidatePath('/', 'layout');

    return {
      success: true,
      data: undefined,
      message: 'Tài khoản đã được xóa thành công',
    };
  } catch (error) {
    console.error('Unexpected error during account deletion:', error);
    return {
      success: false,
      error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    };
  }
}

// ============================================================================
// GET CURRENT USER
// ============================================================================

export async function getCurrentUser() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Get profile data
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const profileData = profile as any;
    const creditBalance =
      typeof profileData?.credits === 'number'
        ? profileData.credits
        : typeof profileData?.credit_balance === 'number'
          ? profileData.credit_balance
          : 0;

    return {
      id: user.id,
      email: user.email,
      fullName: (profile as any)?.full_name || user.user_metadata?.full_name || '',
      phone: (profile as any)?.phone || '',
      company: (profile as any)?.company || '',
      avatarUrl: (profile as any)?.avatar_url || '',
      creditBalance,
      createdAt: user.created_at,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
