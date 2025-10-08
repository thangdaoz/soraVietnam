/**
 * Supabase Database Types
 * Auto-generated types for database tables
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================================================
// ENUMS
// ============================================================================

export type VideoType = 'text_to_video' | 'image_to_video';
export type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'deleted';
export type TransactionType = 'purchase' | 'video_deduction' | 'refund' | 'bonus';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'momo' | 'zalopay' | 'card';

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          credits: number;
          total_videos_generated: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          credits?: number;
          total_videos_generated?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          credits?: number;
          total_videos_generated?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          user_id: string;
          video_type: VideoType;
          status: VideoStatus;
          prompt: string;
          image_url: string | null;
          video_url: string | null;
          thumbnail_url: string | null;
          duration_seconds: number | null;
          credits_used: number;
          third_party_job_id: string | null;
          error_message: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_type: VideoType;
          status?: VideoStatus;
          prompt: string;
          image_url?: string | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          duration_seconds?: number | null;
          credits_used: number;
          third_party_job_id?: string | null;
          error_message?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          video_type?: VideoType;
          status?: VideoStatus;
          prompt?: string;
          image_url?: string | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          duration_seconds?: number | null;
          credits_used?: number;
          third_party_job_id?: string | null;
          error_message?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: TransactionType;
          status: TransactionStatus;
          credits: number;
          amount_vnd: number | null;
          payment_method: PaymentMethod | null;
          payment_reference: string | null;
          video_id: string | null;
          description: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: TransactionType;
          status?: TransactionStatus;
          credits: number;
          amount_vnd?: number | null;
          payment_method?: PaymentMethod | null;
          payment_reference?: string | null;
          video_id?: string | null;
          description?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: TransactionType;
          status?: TransactionStatus;
          credits?: number;
          amount_vnd?: number | null;
          payment_method?: PaymentMethod | null;
          payment_reference?: string | null;
          video_id?: string | null;
          description?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
      credit_packages: {
        Row: {
          id: string;
          name: string;
          name_en: string;
          description: string | null;
          credits: number;
          price_vnd: number;
          discount_percentage: number;
          is_popular: boolean;
          display_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_en: string;
          description?: string | null;
          credits: number;
          price_vnd: number;
          discount_percentage?: number;
          is_popular?: boolean;
          display_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_en?: string;
          description?: string | null;
          credits?: number;
          price_vnd?: number;
          discount_percentage?: number;
          is_popular?: boolean;
          display_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      video_pricing: {
        Row: {
          id: string;
          video_type: VideoType;
          duration_seconds: number;
          credits_required: number;
          is_default: boolean;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          video_type: VideoType;
          duration_seconds: number;
          credits_required: number;
          is_default?: boolean;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          video_type?: VideoType;
          duration_seconds?: number;
          credits_required?: number;
          is_default?: boolean;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      video_type: VideoType;
      video_status: VideoStatus;
      transaction_type: TransactionType;
      transaction_status: TransactionStatus;
      payment_method: PaymentMethod;
    };
  };
}
