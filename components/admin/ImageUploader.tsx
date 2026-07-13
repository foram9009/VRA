'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUploader({ value, onChange, label, className }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    
    // Validate size & type
    if (file.size > 50 * 1024 * 1024) {
      setError('File must be less than 50MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      onChange(data.url as string);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleUpload(e.target.files[0]);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-card"
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            {isUploading ? (
              <div className="animate-pulse w-8 h-8 rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <>
                <ImageIcon size={24} className="text-text-secondary/50 mb-2" />
                <span className="text-sm text-text-secondary/70">Click to upload image</span>
              </>
            )}
          </>
        )}
      </div>

      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
