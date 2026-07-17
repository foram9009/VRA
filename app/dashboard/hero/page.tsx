'use client';

import { useEffect, useState, useCallback } from 'react';
import { saveHeroSlides } from '@/actions/heroSlides';
import ImageUploader from '@/components/admin/ImageUploader';
import { Plus, Trash2, GripVertical, Loader2, Save, Image as ImageIcon, Video, ArrowUp, ArrowDown } from 'lucide-react';

type Slide = {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  label?: string;
};

const emptySlide = (): Slide => ({ type: 'image', src: '', label: '' });

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* ── Load from API ── */
  const fetchSlides = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/hero-slides');
      if (res.ok) {
        const data = await res.json();
        setSlides(data.slides ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlides(); }, [fetchSlides]);

  /* ── Mutators ── */
  const addSlide = () => setSlides(prev => [...prev, emptySlide()]);

  const removeSlide = (i: number) =>
    setSlides(prev => prev.filter((_, idx) => idx !== i));

  const updateSlide = (i: number, patch: Partial<Slide>) =>
    setSlides(prev => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s));

  const moveUp = (i: number) => {
    if (i === 0) return;
    setSlides(prev => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };

  const moveDown = (i: number) => {
    setSlides(prev => {
      if (i === prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  /* ── Save ── */
  const handleSave = async () => {
    // Basic validation: every slide must have a src
    const invalid = slides.some(s => !s.src.trim());
    if (invalid) {
      alert('Every slide must have an image/video URL before saving.');
      return;
    }
    setIsSaving(true);
    const res = await saveHeroSlides(slides);
    setIsSaving(false);
    if (res?.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert(res?.error ?? 'Failed to save slides.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hero Slides</h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage the full-screen images and videos shown in the homepage hero section.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-background px-5 py-2.5 rounded-md font-semibold hover:bg-white transition-colors disabled:opacity-60"
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <span className="text-green-800">✓ Saved!</span>
          ) : (
            <Save size={16} />
          )}
          {!saved && 'Save Changes'}
        </button>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center gap-3 py-20 text-text-secondary">
          <Loader2 size={20} className="animate-spin" /> Loading slides…
        </div>
      ) : (
        <>
          {/* Slide list */}
          <div className="space-y-4">
            {slides.length === 0 && (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-xl text-text-secondary/50 text-sm">
                No slides yet. Click "Add Slide" to get started.
              </div>
            )}

            {slides.map((slide, i) => (
              <div
                key={i}
                className="bg-card border border-white/10 rounded-xl overflow-hidden"
              >
                {/* Slide header bar */}
                <div className="flex items-center gap-3 px-4 py-3 bg-black/30 border-b border-white/5">
                  <GripVertical size={16} className="text-white/20 flex-shrink-0" />

                  {/* Type badge */}
                  <div className="flex rounded-md overflow-hidden border border-white/10 text-xs font-medium">
                    <button
                      onClick={() => updateSlide(i, { type: 'image', src: '' })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                        slide.type === 'image'
                          ? 'bg-primary text-background'
                          : 'text-text-secondary hover:bg-white/5'
                      }`}
                    >
                      <ImageIcon size={12} /> Image
                    </button>
                    <button
                      onClick={() => updateSlide(i, { type: 'video', src: '' })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                        slide.type === 'video'
                          ? 'bg-primary text-background'
                          : 'text-text-secondary hover:bg-white/5'
                      }`}
                    >
                      <Video size={12} /> Video
                    </button>
                  </div>

                  <span className="text-white/30 text-xs ml-auto">Slide {i + 1} of {slides.length}</span>

                  {/* Reorder buttons */}
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    title="Move up"
                    className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === slides.length - 1}
                    title="Move down"
                    className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ArrowDown size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => removeSlide(i)}
                    title="Remove slide"
                    className="p-1.5 rounded hover:bg-red-500/15 text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Slide body */}
                <div className="p-5 space-y-4">
                  {slide.type === 'image' ? (
                    /* ── Image uploader ── */
                    <div>
                      <ImageUploader
                        label="Slide Image"
                        value={slide.src}
                        onChange={(url) => updateSlide(i, { src: url })}
                      />
                      {/* Or paste URL */}
                      <input
                        type="url"
                        value={slide.src}
                        onChange={(e) => updateSlide(i, { src: e.target.value })}
                        placeholder="…or paste an image URL"
                        className="mt-2 w-full bg-background border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  ) : (
                    /* ── Video fields ── */
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-text-secondary uppercase tracking-widest block mb-1">
                          Video URL (.mp4 / .webm or Cloudinary)
                        </label>
                        <input
                          type="url"
                          value={slide.src}
                          onChange={(e) => updateSlide(i, { src: e.target.value })}
                          placeholder="https://res.cloudinary.com/…/video.mp4"
                          className="w-full bg-background border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-secondary uppercase tracking-widest block mb-1">
                          Poster / Thumbnail (optional)
                        </label>
                        <ImageUploader
                          value={slide.poster}
                          onChange={(url) => updateSlide(i, { poster: url })}
                        />
                        <input
                          type="url"
                          value={slide.poster ?? ''}
                          onChange={(e) => updateSlide(i, { poster: e.target.value })}
                          placeholder="…or paste thumbnail URL"
                          className="mt-2 w-full bg-background border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  )}

                  {/* Label */}
                  <div>
                    <label className="text-xs text-text-secondary uppercase tracking-widest block mb-1">
                      Label (shown bottom-left on hero)
                    </label>
                    <input
                      type="text"
                      value={slide.label ?? ''}
                      onChange={(e) => updateSlide(i, { label: e.target.value })}
                      placeholder="e.g. Branding & Identity"
                      maxLength={60}
                      className="w-full bg-background border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Live preview strip */}
                  {slide.src && slide.type === 'image' && (
                    <div className="relative h-28 rounded-lg overflow-hidden border border-white/5">
                      <img src={slide.src} alt="" className="w-full h-full object-cover" />
                      {slide.label && (
                        <span className="absolute bottom-2 left-3 text-[10px] uppercase tracking-widest text-white/60">
                          {slide.label}
                        </span>
                      )}
                    </div>
                  )}
                  {slide.src && slide.type === 'video' && (
                    <div className="relative h-28 rounded-lg overflow-hidden border border-white/5 bg-black flex items-center justify-center">
                      <video
                        src={slide.src}
                        poster={slide.poster}
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2 right-2 bg-black/60 text-white/60 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded">
                        Video
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add slide button */}
          <button
            onClick={addSlide}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-white/10 hover:border-primary/40 rounded-xl py-4 text-text-secondary hover:text-primary transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Add Slide
          </button>

          {/* Tip */}
          <p className="text-text-secondary/50 text-xs text-center">
            Changes are saved to the database. The homepage hero updates immediately after saving.
          </p>
        </>
      )}
    </div>
  );
}
