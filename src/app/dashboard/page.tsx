'use client';
import { useState, useEffect, useCallback, useMemo, useRef, type ChangeEvent } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import {
  createVideoTask,
  getUserVideos,
  queryVideoStatus,
  deleteVideo,
  getUserCredits,
  getVideoPrice,
} from '@/lib/actions/video';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';

interface Video {
  id: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  video_url: string | null;
  progress_percentage: number;
  created_at: string;
  error_message: string | null;
  credits_used: number;
}

const MAX_IMAGE_SIZE_MB = 8;

export default function DashboardPage() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'landscape' | 'portrait'>('landscape');
  const [videos, setVideos] = useState<Video[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [creditsNeeded, setCreditsNeeded] = useState<number>(7000); // Dynamic pricing

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const updatePrice = useCallback(
    async (options?: {
      type?: 'text_to_video' | 'image_to_video';
      aspect?: 'landscape' | 'portrait';
    }) => {
      try {
        const priceResult = await getVideoPrice({
          aspectRatio: options?.aspect ?? aspectRatio,
          type: options?.type ?? (referenceImage ? 'image_to_video' : 'text_to_video'),
        });
        if (priceResult.success && priceResult.data) {
          setCreditsNeeded(priceResult.data.credits);
        }
      } catch (error) {
        console.error('Error fetching price:', error);
        // Keep existing fallback
      }
    },
    [aspectRatio, referenceImage]
  );

  // Update price when dependencies change
  useEffect(() => {
    updatePrice();
  }, [updatePrice]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showAlert('danger', 'Vui lòng chọn tập tin ảnh hợp lệ');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      showAlert('danger', `Ảnh không được lớn hơn ${MAX_IMAGE_SIZE_MB}MB`);
      event.target.value = '';
      return;
    }

    setReferenceImage(file);
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    updatePrice({ type: 'image_to_video' });
  };

  const handleRemoveImage = () => {
    setReferenceImage(null);
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    updatePrice({ type: 'text_to_video' });
  };

  const uploadReferenceImage = useCallback(async (): Promise<string | null> => {
    if (!referenceImage) {
      return null;
    }

    setIsUploadingImage(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Không thể xác thực người dùng hiện tại.');
      }

      const extension =
        referenceImage.name.split('.').pop()?.toLowerCase().split('?')[0] || 'png';
      const filePath = `${user.id}/reference-images/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, referenceImage, {
          cacheControl: '3600',
          contentType: referenceImage.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Không thể lấy đường dẫn ảnh vừa tải lên.');
      }

      return publicUrlData.publicUrl;
    } finally {
      setIsUploadingImage(false);
    }
  }, [referenceImage, supabase]);

  const handleSelectImage = () => {
    if (submitting || isUploadingImage) {
      return;
    }
    fileInputRef.current?.click();
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [videosResult, creditsResult] = await Promise.all([
        getUserVideos(),
        getUserCredits(),
      ]);

      if (videosResult.success && videosResult.data) {
        setVideos(videosResult.data as Video[]);
      }

      if (creditsResult.success && creditsResult.data) {
        setCredits(creditsResult.data.credits);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showAlert('danger', 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Poll status for pending/processing videos
  useEffect(() => {
    const pendingVideos = videos.filter(
      (v) => v.status === 'pending' || v.status === 'processing'
    );

    if (pendingVideos.length === 0) return;

    const interval = setInterval(async () => {
      for (const video of pendingVideos) {
        try {
          const result = await queryVideoStatus(video.id);
          if (result.success && result.data) {
            setVideos((prev) =>
              prev.map((v) =>
                v.id === video.id
                  ? {
                      ...v,
                      status: result.data!.status,
                      progress_percentage: result.data!.progress || 0,
                      video_url: result.data!.videoUrl || v.video_url,
                    }
                  : v
              )
            );

            if (result.data.status === 'completed' || result.data.status === 'failed') {
              const creditsResult = await getUserCredits();
              if (creditsResult.success && creditsResult.data) {
                setCredits(creditsResult.data.credits);
              }
            }
          }
        } catch (error) {
          console.error('Error polling video status:', error);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [videos]);

  const showAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      showAlert('danger', 'Vui lòng nhập mô tả video');
      return;
    }

    const videoType: 'text_to_video' | 'image_to_video' =
      referenceImage ? 'image_to_video' : 'text_to_video';

    if (credits < creditsNeeded) {
      showAlert('danger', `Bạn cần ít nhất ${creditsNeeded} credits để tạo video`);
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl: string | undefined;

      if (referenceImage) {
        try {
          const uploadedUrl = await uploadReferenceImage();
          if (!uploadedUrl) {
            throw new Error('Missing uploaded image URL');
          }
          imageUrl = uploadedUrl;
        } catch (error) {
          console.error('Error uploading reference image:', error);
          showAlert('danger', 'Không thể tải ảnh tham chiếu. Vui lòng thử lại.');
          return;
        }
      }

      const result = await createVideoTask({
        prompt: prompt.trim(),
        aspect_ratio: aspectRatio,
        type: videoType,
        image_url: imageUrl,
      });

      if (result.success) {
        showAlert('success', 'Video đang được tạo! Vui lòng đợi...');
        setPrompt('');
        await loadData();
      } else {
        showAlert('danger', result.error || 'Không thể tạo video');
      }
    } catch (error) {
      console.error('Error creating video:', error);
      showAlert('danger', 'Có lỗi xảy ra khi tạo video');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Bạn có chắc muốn xóa video này?')) return;

    try {
      const result = await deleteVideo(videoId);
      if (result.success) {
        setVideos((prev) => prev.filter((v) => v.id !== videoId));
        showAlert('success', 'Đã xóa video');
      } else {
        showAlert('danger', 'Không thể xóa video');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      showAlert('danger', 'Có lỗi xảy ra khi xóa video');
    }
  };

  const handleDownload = (videoUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `${prompt.substring(0, 30)}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" className="text-xs">✓ Hoàn thành</Badge>;
      case 'processing':
        return <Badge variant="warning" className="text-xs">⏳ Đang xử lý</Badge>;
      case 'pending':
        return <Badge variant="warning" className="text-xs">⏳ Chờ xử lý</Badge>;
      case 'failed':
        return <Badge variant="danger" className="text-xs">✗ Thất bại</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {/* Alert Messages */}
      {alert && (
        <div className="fixed left-1/2 top-4 z-50 w-full max-w-md -translate-x-1/2">
          <Alert variant={alert.type}>{alert.message}</Alert>
        </div>
      )}

    

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-neutral-50 px-6 py-8 pb-40">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 animate-spin text-primary-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="mt-4 text-neutral-600">Đang tải...</p>
              </div>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                  <svg className="h-10 w-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-neutral-900">Chưa có video nào</h2>
                <p className="text-neutral-500">Bắt đầu bằng cách mô tả video đầu tiên của bạn bên dưới</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  {/* Video Content */}
                  <div className="relative aspect-video w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                    {video.status === 'completed' && video.video_url ? (
                      <video
                        src={video.video_url}
                        controls
                        className="h-full w-full object-cover"
                        preload="metadata"
                      />
                    ) : video.status === 'processing' || video.status === 'pending' ? (
                      <div className="flex h-full flex-col items-center justify-center">
                        <svg className="h-8 w-8 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="mt-2 text-sm text-white">{video.progress_percentage}%</p>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg className="h-12 w-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <p className="mb-2 line-clamp-2 text-sm text-neutral-700">{video.prompt}</p>
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{formatDate(video.created_at)}</span>
                      <span>{video.credits_used} credits</span>
                    </div>
                    {video.error_message && (
                      <p className="mt-2 text-xs text-red-600">{video.error_message}</p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute right-3 top-3">
                    {getStatusBadge(video.status)}
                  </div>

                  {/* Hover Actions */}
                  {video.status === 'completed' && video.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleDownload(video.video_url!, video.prompt)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-600 shadow-lg transition-all hover:scale-110"
                        title="Tải xuống"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-lg transition-all hover:scale-110"
                        title="Xóa"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Input */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-6">
        <div className="pointer-events-auto w-full max-w-3xl">
          {/* Settings Bar */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-lg">
              <button
                onClick={() => setAspectRatio('landscape')}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  aspectRatio === 'landscape'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                Ngang (16:9)
              </button>
              <button
                onClick={() => setAspectRatio('portrait')}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  aspectRatio === 'portrait'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                Dọc (9:16)
              </button>
            </div>

            <div className="flex min-h-[48px] items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-lg">
              <button
                type="button"
                onClick={handleSelectImage}
                className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 disabled:opacity-50 disabled:hover:bg-primary-50"
                disabled={submitting || isUploadingImage}
              >
                {referenceImage ? 'Đổi ảnh' : 'Thêm ảnh'}
              </button>

              {imagePreview ? (
                <div className="flex items-center gap-2">
                  <img
                    src={imagePreview}
                    alt="Ảnh tham chiếu"
                    className="h-8 w-8 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-neutral-500 underline transition-colors hover:text-neutral-800"
                  >
                    Xóa
                  </button>
                </div>
              ) : (
                <span className="text-xs text-neutral-500">
                  Tùy chọn: thêm ảnh để dùng image-to-video
                </span>
              )}
            </div>

            <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-600 shadow-lg">
              <span className="font-semibold text-neutral-900">
                {creditsNeeded.toLocaleString()} credits
              </span>
              <span className="ml-2 text-neutral-500">
                {referenceImage ? 'Image-to-video' : 'Text-to-video'}
              </span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          {/* Input Area */}
          <div className="flex items-end gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-2xl">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Mô tả video bạn muốn tạo..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-base text-neutral-900 placeholder-neutral-500 focus:outline-none"
              style={{ maxHeight: '120px' }}
              onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = `${Math.min(e.currentTarget.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={submitting}
            />

            <button
              onClick={handleSubmit}
              disabled={
                !prompt.trim() || submitting || isUploadingImage || credits < creditsNeeded
              }
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary-600"
              title={
                credits < creditsNeeded
                  ? `Cần ${creditsNeeded} credits`
                  : referenceImage
                    ? 'Tạo video từ ảnh tham chiếu'
                    : 'Tạo video'
              }
            >
              {submitting ? (
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
