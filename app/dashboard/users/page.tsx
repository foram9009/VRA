// app/dashboard/users/page.tsx
'use client';
import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { createUser, updateUserRole, deleteUser } from '@/actions/users';
import { Plus, X, ShieldCheck } from 'lucide-react';
import { Role } from '@prisma/client';

export default function UserManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetch('/api/users/list').then(res=>res.json()).then(setUsers); }, []);

  const handleRoleChange = (userId: string, newRole: Role) => {
    updateUserRole(userId, newRole).then(() => window.location.reload());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button onClick={()=>setIsModalOpen(true)} className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md hover:bg-white transition-colors"><Plus size={18} /> Add User</button>
      </div>

      <DataTable 
        data={users}
        columns={[
          {key:'name', header:'Name'},
          {key:'email', header:'Email'},
          {key:'role', header:'Role', render: (u) => <span className={`px-2 py-1 rounded text-xs font-medium ${u.role==='ADMIN'?'bg-purple-500/20 text-purple-300':u.role==='EDITOR'?'bg-blue-500/20 text-blue-300':'bg-gray-500/20 text-gray-300'}`}>{u.role}</span>}
        ]}
        onEdit={()=>{}} // Inline role dropdown instead
        onDelete={deleteUser}
      />
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-xl border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-white/5"><h2 className="text-lg font-semibold">Add User</h2><button onClick={()=>setIsModalOpen(false)}><X size={18}/></button></div>
            <form onSubmit={async (e)=>{e.preventDefault(); const fd=new FormData(e.target as HTMLFormElement); await createUser(fd); setIsModalOpen(false); window.location.reload();}} className="p-6 space-y-4">
              <input name="name" required placeholder="Full Name" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary"/>
              <input name="email" type="email" required placeholder="Email Address" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary"/>
              <select name="role" defaultValue="USER" className="w-full bg-background border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-primary">
                <option value="USER">User</option>
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button type="submit" className="w-full bg-primary text-background py-2 rounded font-medium hover:bg-white transition-colors">Create User</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
