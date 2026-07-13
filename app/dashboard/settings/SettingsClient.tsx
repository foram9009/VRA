// app/dashboard/settings/SettingsClient.tsx
'use client';

import { useState } from 'react';
import { updateSettings } from '@/actions/settings';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

interface SettingsClientProps {
  initialSettings: Record<string, string>;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const res = await updateSettings(settings);
    setIsSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Site settings updated successfully!' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update settings.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold uppercase tracking-tighter">Global Site Settings</h1>
          <p className="text-[11px] text-text-secondary uppercase tracking-widest mt-1">Configure branding, contact details, and social channels</p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-white/5 p-6 rounded-xl">
        {/* Branding Section */}
        <div className="space-y-6">
          <h2 className="text-sm font-heading font-bold uppercase text-primary border-b border-white/5 pb-2">Branding</h2>
          
          <div className="space-y-2">
            <label className="text-[10px] text-text-secondary uppercase tracking-widest">Agency Name</label>
            <input
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              required
              placeholder="e.g. Luxe Digital Agency"
              className="w-full max-w-lg bg-surface border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary text-white transition-colors"
            />
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-6 pt-6">
          <h2 className="text-sm font-heading font-bold uppercase text-primary border-b border-white/5 pb-2">Contact Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-text-secondary uppercase tracking-widest">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                required
                placeholder="hello@luxeagency.com"
                className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary text-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-text-secondary uppercase tracking-widest">Phone Number</label>
              <input
                value={settings.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+886 2 1234 5678"
                className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary text-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-text-secondary uppercase tracking-widest">Office Address</label>
            <input
              value={settings.officeAddress}
              onChange={(e) => handleChange('officeAddress', e.target.value)}
              placeholder="e.g. 5F, No. 100, Dunhua S. Rd., Taipei, Taiwan"
              className="w-full max-w-lg bg-surface border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary text-white transition-colors"
            />
          </div>
        </div>

        {/* Social Channels Section */}
        <div className="space-y-6 pt-6">
          <h2 className="text-sm font-heading font-bold uppercase text-primary border-b border-white/5 pb-2">Social Channels</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-text-secondary uppercase tracking-widest">Twitter / X URL</label>
              <input
                type="url"
                value={settings.socialTwitter}
                onChange={(e) => handleChange('socialTwitter', e.target.value)}
                placeholder="https://twitter.com/..."
                className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary text-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-text-secondary uppercase tracking-widest">Instagram URL</label>
              <input
                type="url"
                value={settings.socialInstagram}
                onChange={(e) => handleChange('socialInstagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary text-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-text-secondary uppercase tracking-widest">LinkedIn URL</label>
              <input
                type="url"
                value={settings.socialLinkedin}
                onChange={(e) => handleChange('socialLinkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary text-white transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8 border-t border-white/5">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-background px-8 py-3 rounded-sm font-medium hover:bg-white transition-colors disabled:opacity-50 text-sm"
          >
            <Save size={18} />
            {isSaving ? 'Saving Settings...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
