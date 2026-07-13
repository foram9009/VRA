'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Layers, 
  FileText, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Portfolio', href: '/dashboard/portfolio', icon: Layers },
  { name: 'Blog Posts', href: '/dashboard/blog', icon: FileText },
  { name: 'Careers', href: '/dashboard/careers', icon: Briefcase },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Media Library', href: '/dashboard/media', icon: ImageIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-white/5 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary block hover:opacity-80">LUXE<span className="font-light text-white">ADMIN</span></Link>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200",
                pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-white/5">
             <button 
               onClick={() => signOut()}
               className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
             >
               <LogOut size={18} />
               Logout
             </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-surface border-b border-white/5 p-4 flex items-center justify-between">
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-text-secondary">
             <Menu size={24} />
           </button>
           <span className="font-semibold text-primary">Dashboard</span>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-background scrollbar-thin scrollbar-thumb-white/10">
          {children}
        </div>
      </main>
    </div>
  );
}
