// app/dashboard/media/MediaClient.tsx
'use client';

import { useState, useRef } from 'react';
import { deleteMedia } from '@/actions/media';
import { Upload, Trash2, Copy, Check, FileText } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  url: string;
  cloudinaryId: string;
  type: string;
  folder: string | null;
  size: number | null;
  createdAt: string;
}

export default function MediaClient({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();

      const newItem: MediaItem = {
        id: data.id,
        url: data.url,
        cloudinaryId: '', // not needed on client list
        type: file.type.startsWith('video/') ? 'video' : 'image',
        folder: 'luxe-agency',
        size: file.size,
        createdAt: new Date().toISOString(),
      };

      setMediaList((prev) => [newItem, ...prev]);
    } catch (error) {
      console.error(error);
      alert('Failed to upload file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset? This cannot be undone.')) return;

    const res = await deleteMedia(id);
    if (res.success) {
      setMediaList((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert(res.error || 'Failed to delete asset.');
    }
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Media Library</h1>
        
        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md hover:bg-white transition-colors disabled:opacity-50"
          >
            <Upload size={18} />
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {mediaList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 border border-dashed border-white/10 rounded-xl bg-card">
          <Upload size={40} className="text-text-secondary/30 mb-4 animate-bounce" />
          <p className="text-text-secondary text-lg">No media files uploaded yet</p>
          <p className="text-text-secondary/50 text-sm mt-1">Upload images or videos to use them in your portfolios or blog posts</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {mediaList.map((item) => (
            <div key={item.id} className="group relative bg-card border border-white/5 rounded-xl overflow-hidden shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between">
              
              {/* Media preview */}
              <div className="relative aspect-square w-full bg-background flex items-center justify-center">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt="Media thumbnail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-primary gap-2">
                    <FileText size={40} className="opacity-80" />
                    <span className="text-[10px] uppercase font-semibold text-text-secondary">Video Asset</span>
                  </div>
                )}

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleCopy(item.id, item.url)}
                    className="p-2.5 bg-primary text-background rounded-full hover:scale-110 transition-transform"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                    title="Delete Asset"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Media info footer */}
              <div className="p-3 border-t border-white/5 space-y-1">
                <p className="text-xs text-text-secondary truncate" title={item.url.split('/').pop()}>
                  {item.url.split('/').pop()}
                </p>
                <p className="text-[10px] text-text-secondary/60">
                  {formatSize(item.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
