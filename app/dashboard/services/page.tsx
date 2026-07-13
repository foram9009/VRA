'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '@/components/admin/DataTable';
import { createService, updateService, deleteService } from '@/actions/services';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2 } from 'lucide-react';
import { Status } from '@prisma/client';

type ServiceItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  features: string[] | any;
  priceRange?: string | null;
  status: Status;
  createdAt: string;
};

export default function ServicesManager() {
  const router = useRouter();
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [status, setStatus] = useState<Status>(Status.DRAFT);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/services/list');
      if (res.ok) {
        const data = await res.json();
        setItems(data ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setFeatures('');
    setPriceRange('');
    setStatus(Status.DRAFT);
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingItem(service);
    setTitle(service.title);
    setSlug(service.slug);
    setDescription(service.description);
    
    // Parse features to string format for textarea
    let featureText = '';
    if (Array.isArray(service.features)) {
      featureText = service.features.join('\n');
    } else if (typeof service.features === 'string') {
      try {
        const parsed = JSON.parse(service.features);
        featureText = Array.isArray(parsed) ? parsed.join('\n') : service.features;
      } catch {
        featureText = service.features;
      }
    }
    
    setFeatures(featureText);
    setPriceRange(service.priceRange ?? '');
    setStatus(service.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append('title', title);
    form.append('slug', slug);
    form.append('description', description);
    form.append('features', features);
    form.append('priceRange', priceRange);
    form.append('status', status);

    const res = editingItem
      ? await updateService(editingItem.id, form)
      : await createService(form);

    setIsSubmitting(false);

    if (res && typeof res === 'object' && 'success' in res && res.success) {
      setIsModalOpen(false);
      setEditingItem(null);
      router.refresh();
      await fetchData();
    } else {
      const msg = res && typeof res === 'object' && 'error' in res ? String(res.error) : 'Operation failed';
      alert(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    const res = await deleteService(id);
    if (res && typeof res === 'object' && 'success' in res && res.success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    } else {
      alert('Failed to delete service.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Services Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md hover:bg-white transition-colors"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-text-secondary gap-3">
          <Loader2 size={20} className="animate-spin" /> Loading services...
        </div>
      ) : (
        <DataTable
          data={items}
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'slug', header: 'Slug' },
            { key: 'priceRange', header: 'Price Range', render: (item) => item.priceRange || 'N/A' },
            {
              key: 'status',
              header: 'Status',
              render: (item) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                  {item.status}
                </span>
              ),
            },
          ]}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="text-xl font-semibold">{editingItem ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-text-secondary uppercase tracking-widest">Service Title</label>
                  <input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingItem) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }
                    }}
                    required
                    placeholder="e.g. UX/UI Design"
                    className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-text-secondary uppercase tracking-widest">URL Slug</label>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="e.g. ux-ui-design"
                    className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-text-secondary uppercase tracking-widest">Price Range (Optional)</label>
                  <input
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    placeholder="e.g. $5k - $10k"
                    className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-text-secondary uppercase tracking-widest">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white"
                  >
                    <option value={Status.DRAFT}>Draft</option>
                    <option value={Status.PUBLISHED}>Published</option>
                    <option value={Status.ARCHIVED}>Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-text-secondary uppercase tracking-widest">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  placeholder="Describe the service offering..."
                  className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary resize-none text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-text-secondary uppercase tracking-widest">Features (One per line)</label>
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  required
                  rows={4}
                  placeholder="e.g. Interactive Prototypes&#10;User Personas&#10;Figma Source Files"
                  className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary resize-none text-white"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-background py-2 rounded font-medium hover:bg-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {editingItem ? 'Update Service' : 'Add Service'}
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
