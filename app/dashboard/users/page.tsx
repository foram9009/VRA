'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '@/components/admin/DataTable';
import { createUser, deleteUser } from '@/actions/users';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2 } from 'lucide-react';

type UserItem = { id: string; name: string | null; email: string; role: string };

export default function UserManager() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users/list');
      if (res.ok) setUsers(await res.json());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    const res = await deleteUser(id);
    if (res && typeof res === 'object' && 'success' in res && res.success) {
      setUsers(prev => prev.filter(u => u.id !== id));
      router.refresh();
    } else {
      alert('Failed to delete user.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.target as HTMLFormElement);
    const res = await createUser(fd);
    setIsSubmitting(false);

    if (res && typeof res === 'object' && 'success' in res && res.success) {
      setIsModalOpen(false);
      router.refresh();
      await fetchUsers();
    } else {
      const msg = res && typeof res === 'object' && 'error' in res ? String(res.error) : 'Failed to create user';
      alert(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md hover:bg-white transition-colors"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-text-secondary gap-3">
          <Loader2 size={20} className="animate-spin" /> Loading users...
        </div>
      ) : (
        <DataTable
          data={users}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            {
              key: 'role', header: 'Role',
              render: (u) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' : u.role === 'EDITOR' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}`}>
                  {u.role}
                </span>
              )
            },
          ]}
          onEdit={() => {}}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-xl border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-white/5">
              <h2 className="text-lg font-semibold">Add User</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <input name="name" required placeholder="Full Name" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary" />
              <input name="email" type="email" required placeholder="Email Address" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary" />
              <select name="role" defaultValue="USER" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary">
                <option value="USER">User</option>
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-background py-2 rounded font-medium hover:bg-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Create User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
