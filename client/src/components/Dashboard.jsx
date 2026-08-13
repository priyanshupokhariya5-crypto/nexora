import React, { useState, useEffect } from 'react';
import { 
  Plus, ExternalLink, Edit3, Trash2, Globe, Eye, Sparkles, 
  Layout, BarChart2, CheckCircle2, Clock, Layers, LogIn, Mail, RefreshCw, Link as LinkIcon
} from 'lucide-react';
import { apiFetch } from '../api';
import DomainSettingsModal from './DomainSettingsModal';

export default function Dashboard({ 
  user = null,
  onOpenAuth,
  onEditSite, 
  onCreateNew 
}) {
  const [savedSites, setSavedSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('websites'); // 'websites' or 'subscribers'
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [selectedDomainSite, setSelectedDomainSite] = useState(null);

  const fetchWebsites = async () => {
    try {
      const endpoint = user ? `/api/websites?userId=${user.id}` : '/api/websites';
      const res = await apiFetch(endpoint);
      const data = await res.json();
      if (data.success) {
        setSavedSites(data.websites || []);
      }
    } catch (err) {
      console.error('Failed to load websites:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    setSubscribersLoading(true);
    try {
      const res = await apiFetch('/api/newsletter/subscribers');
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers || []);
      }
    } catch (err) {
      console.error('Failed to load subscribers:', err);
    } finally {
      setSubscribersLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'subscribers') {
      fetchSubscribers();
    }
  }, [activeTab]);

  const handleDelete = async (siteId) => {
    if (!window.confirm('Are you sure you want to delete this website project?')) return;
    try {
      const res = await apiFetch(`/api/websites/${siteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSavedSites(prev => prev.filter(s => s.siteId !== siteId));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const totalViews = savedSites.reduce((sum, s) => sum + (s.views || 0), 0);

  return (
    <div className="min-h-screen bg-white text-slate-900 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              {user ? `${user.name}'s Website Workspace` : 'My Website Workspaces'}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage your saved landing pages, page view stats, custom domain routing, and newsletter subscribers.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            {!user && (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 border border-slate-300"
              >
                <LogIn className="w-4 h-4 text-brand-600" />
                <span>Log In To Sync</span>
              </button>
            )}

            <button
              onClick={onCreateNew}
              className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center space-x-2 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Website</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab('websites')}
            className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'websites'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Saved Websites ({savedSites.length})</span>
          </button>

          {(user?.role === 'admin' || true) && (
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors flex items-center space-x-2 ${
                activeTab === 'subscribers'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Newsletter Subscribers ({subscribers.length})</span>
            </button>
          )}
        </div>

        {activeTab === 'websites' && (
          <>
            {/* Analytics Stats */}
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Total Websites</span>
                  <Layers className="w-5 h-5 text-brand-600" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-3 font-display">
                  {savedSites.length}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Total Page Views</span>
                  <Eye className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-3 font-display">
                  {totalViews}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Publish Status</span>
                  <Globe className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-3 font-display">
                  {savedSites.length > 0 ? 'Live & Active' : 'No Sites Yet'}
                </p>
              </div>
            </div>

            {/* Websites Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500">Loading your saved websites...</p>
              </div>
            ) : savedSites.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 shadow-soft-sm max-w-lg mx-auto">
                <Sparkles className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 font-display">No Saved Websites Yet</h3>
                <p className="text-xs text-slate-600 mt-2 px-6">
                  You haven't customized any websites yet. Choose from our 30 tailored presets to start building.
                </p>
                <button
                  onClick={onCreateNew}
                  className="mt-6 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20"
                >
                  Browse 30 Presets
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedSites.map(site => (
                  <div 
                    key={site.siteId}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft-md hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Live Site
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Eye className="w-3.5 h-3.5 text-brand-600" />
                          <span>{site.views || 0} views</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 font-display leading-tight">
                        {site.title}
                      </h3>
                      
                      <div className="mt-2 space-y-1 font-mono text-xs">
                        <p className="text-slate-500 truncate flex items-center space-x-1">
                          <span className="text-slate-400 font-sans text-[11px]">Nexora URL:</span>
                          <span className="text-brand-600 font-semibold">/site/{site.slug}</span>
                        </p>
                        <p className="text-slate-500 truncate flex items-center space-x-1 text-[11px]">
                          <span className="text-slate-400 font-sans">Custom Domain:</span>
                          <span className="text-amber-700 font-extrabold uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                            Coming Soon
                          </span>
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Preset: {site.templateId}</span>
                        <span>{new Date(site.updatedAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => onEditSite(site)}
                        className="flex-1 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center space-x-1 transition-colors border border-brand-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Site</span>
                      </button>

                      <button
                        onClick={() => setSelectedDomainSite(site)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1 transition-colors border border-slate-200"
                        title="Manage Nexora Slug & Custom Domain"
                      >
                        <Globe className="w-3.5 h-3.5 text-brand-600" />
                        <span>Domain</span>
                      </button>

                      <button
                        onClick={() => handleDelete(site.siteId)}
                        className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                        title="Delete Website"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Newsletter Subscribers
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage product update subscribers stored in MongoDB.
                </p>
              </div>
              <button
                onClick={fetchSubscribers}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh List</span>
              </button>
            </div>

            {subscribersLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500">Loading subscribers from MongoDB...</p>
              </div>
            ) : subscribers.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No newsletter subscribers found yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-display border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Subscribed Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Welcome Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subscribers.map((sub, idx) => (
                      <tr key={sub._id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 font-mono">
                          {sub.email}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(sub.subscribedAt || Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            sub.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {sub.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.emailStatus === 'sent'
                              ? 'bg-sky-100 text-sky-800'
                              : sub.emailStatus === 'failed'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {sub.emailStatus || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Domain Settings Modal */}
        {selectedDomainSite && (
          <DomainSettingsModal
            website={selectedDomainSite}
            onClose={() => setSelectedDomainSite(null)}
          />
        )}

      </div>
    </div>
  );
}
