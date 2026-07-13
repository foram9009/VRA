'use client';

import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export default function DataTable<T extends { id: string }>({ 
  data, columns, onEdit, onDelete, className 
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/5">
      <table className={cn("w-full text-left text-sm", className)}>
        <thead className="bg-surface text-text-secondary uppercase tracking-wider text-xs">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-6 py-4 font-medium">{col.header}</th>
            ))}
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="px-6 py-8 text-center text-text-secondary/60">No data found</td></tr>
          ) : (
            data.map((item, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 text-text-primary">
                    {col.render ? col.render(item) : String((item as any)[col.key] || '')}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(item)}
                        className="p-2 text-text-secondary hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-red-400/70 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
