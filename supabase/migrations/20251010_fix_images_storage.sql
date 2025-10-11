-- Fix storage policies for images bucket to allow public read
-- This migration allows authenticated users to upload images in any folder structure
-- and allows public read access to all images

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Add new policy to allow public read access to images
CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Update upload policy to be more flexible
DROP POLICY IF EXISTS "Users can upload images" ON storage.objects;

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

-- Add delete policy so users can delete their own images
-- This allows cleanup of reference images after video generation
CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
