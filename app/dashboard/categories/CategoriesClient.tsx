// app/dashboard/categories/CategoriesClient.tsx
'use client';

import { useState } from 'react';
import {
  createPortfolioCategory,
  deletePortfolioCategory,
  createBlogCategory,
  deleteBlogCategory,
} from '@/actions/categories';
import DataTable from '@/components/admin/DataTable';
import { Plus, X, FolderOpen } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export default function CategoriesClient({
  initialPortfolioCategories,
  initialBlogCategories,
}: {
  initialPortfolioCategories: CategoryItem[];
  initialBlogCategories: CategoryItem[];
}) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'blog'>('portfolio');
  const [portfolioList, setPortfolioList] = useState<CategoryItem[]>(initialPortfolioCategories);
  const [blogList, setBlogList] = useState<CategoryItem[]>(initialBlogCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setSlug(generateSlug(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', name);
    form.append('slug', slug);
    if (activeTab === 'portfolio') {
      form.append('description', description);
    }

    const res =
      activeTab === 'portfolio'
        ? await createPortfolioCategory(form)
        : await createBlogCategory(form);

    if (res.success) {
      setIsModalOpen(false);
      setName('');
      setSlug('');
      setDescription('');
      window.location.reload();
    } else {
      alert(res.error || 'Failed to create category.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    const res =
      activeTab === 'portfolio'
        ? await deletePortfolioCategory(id)
        : await deleteBlogCategory(id);

    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error || 'Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Category Management</h1>

        <button
          onClick={() => {
            setName('');
            setSlug('');
            setDescription('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md hover:bg-white transition-colors animate-fade-in"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 space-x-6">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`pb-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'portfolio'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-white'
          }`}
        >
          Portfolio Categories
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`pb-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'blog'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-white'
          }`}
        >
          Blog Categories
        </button>
      </div>

      {activeTab === 'portfolio' ? (
        <DataTable
          data={portfolioList}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'slug', header: 'Slug' },
            { key: 'description', header: 'Description', render: (item) => item.description || 'N/A' },
          ]}
          onDelete={handleDelete}
        />
      ) : (
        <DataTable
          data={blogList}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'slug', header: 'Slug' },
          ]}
          onDelete={handleDelete}
        />
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="text-xl font-semibold">
                Add {activeTab === 'portfolio' ? 'Portfolio' : 'Blog'} Category
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary uppercase tracking-wider">Name</label>
                <input
                  value={name}
                  onChange={handleNameChange}
                  required
                  placeholder="e.g. Interactive Design"
                  className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary uppercase tracking-wider">URL Slug</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  required
                  placeholder="e.g. interactive-design"
                  className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white"
                />
              </div>

              {activeTab === 'portfolio' && (
                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary uppercase tracking-wider">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe this category..."
                    className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white resize-none"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-background py-2 rounded font-medium hover:bg-white transition-colors"
                >
                  Create Category
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-white/10 rounded hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
