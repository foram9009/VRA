// app/dashboard/blog/page.tsx
'use client';
import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import ImageUploader from '@/components/admin/ImageUploader';
import { createBlog, updateBlog, deleteBlog } from '@/actions/blog';
import { Plus, X } from 'lucide-react';

export default function BlogManager() {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetch('/api/blog/list').then(res => res.json()).then(setItems);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <button onClick={() => { setEditingItem(null); setFormData({}); setIsModalOpen(true); }} className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md hover:bg-white transition-colors"><Plus size={18} /> New Post</button>
      </div>
      
      <DataTable data={items} columns={[{key:'title', header:'Title'}, {key:'status', header:'Status'}, {key:'createdAt', header:'Published', render: (i) => new Date(i.createdAt).toLocaleDateString()}]} onEdit={(i)=>{setEditingItem(i); setFormData(i); setIsModalOpen(true);}} onDelete={deleteBlog} />

      {/* Modal structure identical to Portfolio. Form fields: title, slug, categoryId, coverImage (Uploader), content (textarea), tags */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-3xl rounded-xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header same as portfolio */}
            <form onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.target as HTMLFormElement); if(editingItem) fd.append('id', editingItem.id); await (editingItem ? updateBlog(fd) : createBlog(fd)); setIsModalOpen(false); window.location.reload(); }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="title" defaultValue={formData.title} required placeholder="Post Title" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary"/>
                <input name="slug" defaultValue={formData.slug} required placeholder="URL Slug" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary"/>
              </div>
              <ImageUploader label="Cover Image" value={formData.coverImage} onChange={(u)=>setFormData(p=>({...p, coverImage:u}))}/>
              <textarea name="content" defaultValue={formData.content} required rows={8} placeholder="Article Content (Markdown supported)" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary resize-none font-mono text-sm"/>
              <div className="flex gap-4 pt-2">
                <button type="submit" className="flex-1 bg-primary text-background py-2 rounded font-medium hover:bg-white transition-colors">{editingItem ? 'Update Post' : 'Publish Post'}</button>
                <button type="button" onClick={()=>setIsModalOpen(false)} className="px-6 py-2 border border-white/10 rounded hover:bg-white/5 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
