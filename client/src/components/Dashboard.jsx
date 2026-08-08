import React, { useState, useEffect } from 'react';
import { 
  Plus, ExternalLink, Edit3, Trash2, Globe, Eye, Sparkles, 
  Layout, BarChart2, CheckCircle2, Clock, Layers, LogIn
} from 'lucide-react';
import { apiFetch } from '../api';

export default function Dashboard({ 
  user = null,
  onOpenAuth,
  onEditSite, 
  onCreateNew 
}) {
  const [savedSites, setSavedSites] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchWebsites();
  }, [user]);

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
    <div className="min-h-screen bg-white text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              {user ? `${user.name}'s Website Workspace` : 'My Website Workspaces'}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage your saved landing pages, check page view stats, and edit custom presets.
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
                  <p className="text-xs text-slate-500 font-mono mt-1 truncate">
                    /{site.slug}
                  </p>

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

      </div>
    </div>
  );
}
