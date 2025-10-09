'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Mock gallery videos
const mockGalleryVideos = [
  { id: 1, prompt: 'Two young women taking a selfie', status: 'complete', aspectRatio: '16:9', duration: '5s' },
  { id: 2, prompt: 'Child running joyfully through grass field', status: 'complete', aspectRatio: '16:9', duration: '5s' },
  { id: 3, prompt: 'People walking dogs in a sunny park', status: 'processing', aspectRatio: '16:9', duration: '5s' },
  { id: 4, prompt: 'Figure skater performing on ice rink', status: 'complete', aspectRatio: '16:9', duration: '10s' },
];

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState('5');

  const calculateCredits = () => {
    return duration === '5' ? 5000 : 10000;
  };

  return (
    <div className="flex h-screen flex-col bg-neutral-50">
      {/* Main Content - Video Gallery */}
      <main className="flex-1 overflow-y-auto bg-neutral-50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-600">Quản lý video và dự án của bạn</p>
          </div>
          
          {/* Video Gallery Grid */}
          <div className="grid grid-cols-1 gap-6 pb-40 sm:grid-cols-2 lg:grid-cols-4">
            {mockGalleryVideos.map((video) => (
              <div
                key={video.id}
                className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-lg"
              >
                {/* Video Thumbnail */}
                <div className="aspect-video w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                  <div className="flex h-full items-center justify-center">
                    {video.status === 'processing' ? (
                      <svg className="h-8 w-8 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <p className="mb-2 line-clamp-2 text-sm text-neutral-700">{video.prompt}</p>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{video.aspectRatio}</span>
                    <span>{video.duration}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute right-3 top-3">
                  <Badge variant={video.status === 'complete' ? 'success' : 'warning'} className="text-xs">
                    {video.status === 'complete' ? '✓' : '⏳'}
                  </Badge>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-600 shadow-lg transition-all hover:scale-110">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-lg transition-all hover:scale-110">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (show when no videos) */}
          {mockGalleryVideos.length === 0 && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                  <svg className="h-10 w-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-neutral-900">No videos yet</h2>
                <p className="text-neutral-500">Start by describing your first video below</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Chat Input - Fixed at Bottom */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-6">
        <div className="pointer-events-auto w-full max-w-3xl">
          {/* Settings Bar */}
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-lg">
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  aspectRatio === '16:9'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                16:9
              </button>
              <button
                onClick={() => setAspectRatio('1:1')}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  aspectRatio === '1:1'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                1:1
              </button>
              <button
                onClick={() => setAspectRatio('9:16')}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  aspectRatio === '9:16'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                9:16
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-lg">
              <button
                onClick={() => setDuration('5')}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  duration === '5'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                5s
              </button>
              <button
                onClick={() => setDuration('10')}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  duration === '10'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                10s
              </button>
            </div>

            <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-600 shadow-lg">
              {calculateCredits().toLocaleString()} credits
            </div>
          </div>

          {/* Input Area */}
          <div className="flex items-end gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-2xl">
            <button className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-primary-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your video..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-base text-neutral-900 placeholder-neutral-500 focus:outline-none"
              style={{ maxHeight: '120px' }}
              onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = `${Math.min(e.currentTarget.scrollHeight, 120)}px`;
              }}
            />

            <button className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-primary-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>

            <button
              disabled={!prompt.trim()}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white transition-all hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
