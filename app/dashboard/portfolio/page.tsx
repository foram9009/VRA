'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import ImageUploader from '@/components/admin/ImageUploader';
import { createPortfolio, updatePortfolio, deletePortfolio } from '@/actions/portfolio';
import { Plus, X } from 'lucide-react';

type Portfolio = { id: string; title: string; slug: string; description: string; coverImage: string; categoryId: string; tags: string[] };
type Category = { id: string; name: string };

type PortfolioActionResult =
  | { success: true }
  | { success: false; error: string; details?: unknown };

export default function PortfolioManager() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Portfolio | null>(null);
  const [formData, setFormData] = useState<Partial<Portfolio>>({});

  useEffect(() => {
    // Fetch data in production via getServerSideProps or server component
    fetch('/api/portfolio/list').then(res => res.json()).then(data => setItems(data.items));
    fetch('/api/portfolio/categories').then(res => res.json()).then(data => setCategories(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    
    if (editingItem) form.append('id', editingItem.id);
    form.set('tags', JSON.stringify(formData.tags || []));

    const res = editingItem ? await updatePortfolio(editingItem.id, form) : await createPortfolio(form);
    if (res && typeof res === 'object' && 'success' in res && res.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      window.location.reload();
    } else {
      const errorMessage = res && typeof res === 'object' && 'error' in res && typeof res.error === 'string' ? res.error : 'Operation failed';
      alert(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This action cannot be undone.')) {
      await deletePortfolio(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portfolio Management</h1>
        <button 
          onClick={() => { setEditingItem(null); setFormData({}); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md hover:bg-white transition-colors"
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      <DataTable
        data={items}
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'slug', header: 'Slug' },
          { 
            key: 'coverImage', header: 'Cover',
            render: (item) => <img src={item.coverImage} alt="" className="w-12 h-12 object-cover rounded" />
          },
          { key: 'categoryId', header: 'Category', render: (item) => categories.find(c => c.id === item.categoryId)?.name || 'Uncategorized' },
        ]}
        onEdit={(item) => { setEditingItem(item); setFormData(item); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="text-xl font-semibold">{editingItem ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="title" defaultValue={formData.title} required placeholder="Project Title" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary" />
                <input name="slug" defaultValue={formData.slug} required placeholder="URL Slug" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary" />
              </div>
              
              <select name="categoryId" defaultValue={formData.categoryId} required className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <ImageUploader 
                label="Cover Image"
                value={formData.coverImage}
                onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
              />

              <textarea name="description" defaultValue={formData.description} required rows={3} placeholder="Project Description" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary resize-none" />
              
              <div className="flex gap-4 pt-2">
                <button type="submit" className="flex-1 bg-primary text-background py-2 rounded font-medium hover:bg-white transition-colors">
                  {editingItem ? 'Update Project' : 'Create Project'}
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
