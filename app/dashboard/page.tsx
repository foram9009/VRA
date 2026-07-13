'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  FolderKanban, 
  MessageSquare, 
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Section from '@/components/ui/Section'; // Reusing section styling logic but adapting for dashboard grid

// Mock Data Component to visualize structure
const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <div className="bg-card p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-text-secondary text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-semibold text-white mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-white/5 rounded-lg">
        <Icon size={20} className="text-primary" />
      </div>
    </div>
    {trend && (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-green-400 flex items-center gap-1"><TrendingUp size={14}/> +{trend}%</span>
        <span className="text-text-secondary/60">vs last month</span>
      </div>
    )}
  </div>
);

const ActivityItem = ({ type, message, time }: { type: 'success' | 'warning' | 'info'; message: string; time: string }) => {
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const color = type === 'success' ? 'text-green-400' : 'text-yellow-400';
  
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors">
      <div className={`p-2 bg-white/5 rounded-full ${color}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{message}</p>
        <p className="text-xs text-text-secondary/60">{time}</p>
      </div>
    </div>
  );
};

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Overview</h1>
        <p className="text-text-secondary">Welcome back. Here&apos;s what&apos;s happening with your agency.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="1,284" icon={Users} trend={12} />
        <StatCard title="Published Projects" value="48" icon={FolderKanban} trend={5} />
        <StatCard title="New Inquiries" value="36" icon={MessageSquare} trend={-2} />
        <StatCard title="Revenue (Est.)" value="$124k" icon={TrendingUp} trend={8} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-1">
            <ActivityItem type="success" message="New contact form submission received" time="2 mins ago" />
            <ActivityItem type="info" message="Project 'Eclipse Brand' updated to Published" time="1 hour ago" />
            <ActivityItem type="warning" message="User password reset request (admin@luxe.com)" time="3 hours ago" />
            <ActivityItem type="success" message="Blog post 'Design Trends 2024' published" time="5 hours ago" />
            <ActivityItem type="success" message="New testimonial added by Client X" time="1 day ago" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-primary hover:bg-white text-background font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              + Add New Project
            </button>
            <button className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 px-4 rounded-lg transition-colors border border-white/5">
              Create Blog Post
            </button>
             <button className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 px-4 rounded-lg transition-colors border border-white/5">
              View Contact Logs
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
             <h3 className="text-sm font-medium text-text-secondary mb-2">System Status</h3>
             <div className="flex items-center gap-2 text-sm text-green-400">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
               All systems operational
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
