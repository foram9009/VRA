'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '@/components/admin/DataTable';
import ImageUploader from '@/components/admin/ImageUploader';
import { createBlog, updateBlog, deleteBlog } from '@/actions/blog';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2 } from 'lucide-react';

type BlogItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  status: string;
  createdAt: string;
};

export default function BlogManager() {
  const router = useRouter();
  const [items, setItems] = useState<BlogItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogItem | null>(null);
  const [formData, setFormData] = useState<Partial<BlogItem>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/blog/list');
      if (res.ok) setItems(await res.json());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.target as HTMLFormElement);
    if (editingItem) fd.append('id', editingItem.id);
    if (formData.coverImage) fd.set('coverImage', formData.coverImage);

    const res = editingItem ? await updateBlog(fd) : await createBlog(fd);
    setIsSubmitting(false);

    if (res && typeof res === 'object' && 'success' in res && res.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({});
      router.refresh();
      await fetchData();
    } else {
      const msg = res && typeof res === 'object' && 'error' in res ? String(res.error) : 'Operation failed';
      alert(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    const res = await deleteBlog(id);
    if (res && typeof res === 'object' && 'success' in res && res.success) {
      setItems(prev => prev.filter(i => i.id !== id));
      router.refresh();
    } else {
      alert('Failed to delete post.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <button
          onClick={() => { setEditingItem(null); setFormData({}); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md hover:bg-white transition-colors"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-text-secondary gap-3">
          <Loader2 size={20} className="animate-spin" /> Loading posts...
        </div>
      ) : (
        <DataTable
          data={items}
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'status', header: 'Status' },
            { key: 'createdAt', header: 'Published', render: (item) => new Date(item.createdAt).toLocaleDateString() },
          ]}
          onEdit={(item) => { setEditingItem(item); setFormData(item); setIsModalOpen(true); }}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-3xl rounded-xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="text-xl font-semibold">{editingItem ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="title" defaultValue={formData.title} required placeholder="Post Title" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary" />
                <input name="slug" defaultValue={formData.slug} required placeholder="URL Slug" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              <ImageUploader label="Cover Image" value={formData.coverImage} onChange={(u) => setFormData(p => ({ ...p, coverImage: u }))} />
              <textarea name="content" defaultValue={formData.content} required rows={8} placeholder="Article Content (Markdown supported)" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary resize-none font-mono text-sm" />
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-background py-2 rounded font-medium hover:bg-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {editingItem ? 'Update Post' : 'Publish Post'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-white/10 rounded hover:bg-white/5 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
