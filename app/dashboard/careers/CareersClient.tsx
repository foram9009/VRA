// app/dashboard/careers/CareersClient.tsx
'use client';

import { useState } from 'react';
import { createCareer, updateCareer, deleteCareer } from '@/actions/careers';
import DataTable from '@/components/admin/DataTable';
import { Plus, X, Pencil } from 'lucide-react';
import { Status } from '@prisma/client';

interface CareerItem {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  status: Status;
  createdAt: string;
}

export default function CareersClient({ initialCareers }: { initialCareers: CareerItem[] }) {
  const [careersList, setCareersList] = useState<CareerItem[]>(initialCareers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<CareerItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [status, setStatus] = useState<Status>(Status.DRAFT);

  const openCreateModal = () => {
    setEditingCareer(null);
    setTitle('');
    setLocation('');
    setType('Full-time');
    setDescription('');
    setRequirements('');
    setStatus(Status.DRAFT);
    setIsModalOpen(true);
  };

  const openEditModal = (career: CareerItem) => {
    setEditingCareer(career);
    setTitle(career.title);
    setLocation(career.location);
    setType(career.type);
    setDescription(career.description);
    setRequirements(career.requirements);
    setStatus(career.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('title', title);
    form.append('location', location);
    form.append('type', type);
    form.append('description', description);
    form.append('requirements', requirements);
    form.append('status', status);

    const res = editingCareer
      ? await updateCareer(editingCareer.id, form)
      : await createCareer(form);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      alert(res.error || 'Failed to save career opening.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting? All submitted applications for this job will also be deleted.')) return;

    const res = await deleteCareer(id);
    if (res.success) {
      setCareersList((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(res.error || 'Failed to delete career opening.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Careers Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md hover:bg-white transition-colors"
        >
          <Plus size={18} /> Add Job Opening
        </button>
      </div>

      <DataTable
        data={careersList}
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'location', header: 'Location' },
          { key: 'type', header: 'Type' },
          {
            key: 'status',
            header: 'Status',
            render: (item) => (
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === Status.PUBLISHED
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}
              >
                {item.status}
              </span>
            ),
          },
        ]}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="text-xl font-semibold">
                {editingCareer ? 'Edit Job Opening' : 'Add Job Opening'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary uppercase tracking-wider">Job Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Senior Visual Designer"
                    className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary uppercase tracking-wider">Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    placeholder="e.g. Taipei, Taiwan (Hybrid)"
                    className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary uppercase tracking-wider">Job Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary uppercase tracking-wider">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white"
                  >
                    <option value={Status.DRAFT}>Draft (Internal Only)</option>
                    <option value={Status.PUBLISHED}>Published (Public Listing)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary uppercase tracking-wider">Job Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  placeholder="Describe the job role, responsibilities, and team..."
                  className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-text-secondary uppercase tracking-wider">Requirements (One per line)</label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={4}
                  placeholder="e.g. 3+ years of experience in 3D Motion Graphics&#10;Proficiency in Figma, Cinema 4D, or Blender&#10;Strong communication skills"
                  className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary text-white resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-background py-2.5 rounded font-medium hover:bg-white transition-colors"
                >
                  {editingCareer ? 'Update Posting' : 'Publish Opening'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-2.5 border border-white/10 rounded hover:bg-white/5 transition-colors"
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
