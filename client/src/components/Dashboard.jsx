import React, { useState, useEffect } from 'react';
import { 
  Plus, ExternalLink, Edit3, Trash2, Globe, Eye, Sparkles, 
  Layout, BarChart2, CheckCircle2, Clock, Layers, LogIn, Mail, RefreshCw, Link as LinkIcon,
  Users, Search, X, Shield, Lock, ChevronRight, UserCheck
} from 'lucide-react';
import { apiFetch } from '../api';
import DomainSettingsModal from './DomainSettingsModal';
import PremiumLockModal from './PremiumLockModal';

export default function Dashboard({ 
  user = null,
  onOpenAuth,
  onEditSite, 
  onCreateNew 
}) {
  const [savedSites, setSavedSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('websites'); // 'websites', 'subscribers', 'users'
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [selectedDomainSite, setSelectedDomainSite] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Admin User Management State
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminStats, setAdminStats] = useState({ totalUsers: 0, totalWebsites: 0, freeUsers: 0, premiumUsers: 0 });
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedAdminUser, setSelectedAdminUser] = useState(null);
  const [userWebsitesModal, setUserWebsitesModal] = useState([]);
  const [userWebsitesLoading, setUserWebsitesLoading] = useState(false);

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

  const handleCreateWebsiteClick = () => {
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    const isFree = !user.premiumAccess && user.plan !== 'pro' && user.plan !== 'business';
    if (isFree && savedSites.length >= 1) {
      setShowLimitModal(true);
      return;
    }
    if (onCreateNew) onCreateNew();
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

  const fetchAdminUsers = async (query = userSearchQuery) => {
    setAdminUsersLoading(true);
    try {
      const q = query ? `?q=${encodeURIComponent(query)}` : '';
      const res = await apiFetch(`/api/admin/users${q}`);
      const data = await res.json();
      if (data.success) {
        setAdminUsers(data.users || []);
        if (data.stats) setAdminStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setAdminUsersLoading(false);
    }
  };

  const handleOpenUserDetails = async (targetUser) => {
    setSelectedAdminUser(targetUser);
    setUserWebsitesLoading(true);
    try {
      const res = await apiFetch(`/api/admin/users/${targetUser.id}/websites`);
      const data = await res.json();
      if (data.success) {
        setUserWebsitesModal(data.websites || []);
      }
    } catch (err) {
      console.error('Failed to load user websites details:', err);
    } finally {
      setUserWebsitesLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'subscribers') {
      fetchSubscribers();
    } else if (activeTab === 'users') {
      fetchAdminUsers();
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
              Manage your saved landing pages, page view stats, custom domain routing, and user subscriptions.
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
              onClick={handleCreateWebsiteClick}
              className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center space-x-2 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Website</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center space-x-2 border-b border-slate-200 mb-8">
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

          {(user?.role === 'admin' || user?.email === 'admin@nexora.com' || user?.email === 'priyanshupokhariya5@gmail.com') && (
            <>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors flex items-center space-x-2 ${
                  activeTab === 'users'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>User Management ({adminUsers.length || adminStats.totalUsers})</span>
              </button>

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
            </>
          )}
        </div>

        {/* TAB 1: SAVED WEBSITES */}
        {activeTab === 'websites' && (
          <>
            {/* Analytics Stats & Plan Status */}
            <div className="grid sm:grid-cols-4 gap-6 mb-10">
              
              {/* CURRENT PLAN CARD */}
              <div className="p-6 rounded-3xl bg-white border-2 border-brand-500 shadow-soft-sm relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-display">CURRENT PLAN</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Active
                    </span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 font-display">FREE</h3>
                  <p className="text-sm font-bold text-slate-600 mt-0.5">₹0/month</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Premium features:</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Coming Soon</span>
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-soft-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Sites</span>
                  <Layers className="w-5 h-5 text-brand-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-display">{savedSites.length}</div>
                <p className="text-xs text-slate-500 mt-1">Saved website projects</p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-soft-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Published</span>
                  <Globe className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-display">
                  {savedSites.filter(s => s.isPublished).length}
                </div>
                <p className="text-xs text-slate-500 mt-1">Active published URLs</p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-soft-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Page Views</span>
                  <BarChart2 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-display">{totalViews}</div>
                <p className="text-xs text-slate-500 mt-1">Across all active websites</p>
              </div>
            </div>

            {/* Saved Websites Grid */}
            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs font-bold text-slate-500">Loading website projects...</p>
              </div>
            ) : savedSites.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 p-8">
                <Layout className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 font-display">No Saved Websites Yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Select a template to customize, build, and publish your business website in seconds.
                </p>
                <button
                  onClick={handleCreateWebsiteClick}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md"
                >
                  Create Your First Website
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedSites.map(site => {
                  const siteTitle = site.brandName || site.title || 'Untitled Website';
                  const publicUrl = `/site/${site.slug}`;

                  return (
                    <div
                      key={site.siteId}
                      className="bg-white rounded-3xl border border-slate-200 shadow-soft-md hover:shadow-card-hover transition-all duration-300 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            site.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {site.isPublished ? '✓ Published' : 'Draft'}
                          </span>

                          <button
                            onClick={() => setSelectedDomainSite(site)}
                            className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 flex items-center space-x-1"
                          >
                            <Globe className="w-3 h-3" />
                            <span>Domain Settings</span>
                          </button>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 font-display truncate mb-1">
                          {siteTitle}
                        </h3>

                        <div className="text-xs text-slate-500 font-mono flex items-center space-x-1 truncate mb-4">
                          <LinkIcon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{publicUrl}</span>
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-bold text-slate-700">{site.views || 0}</span> views
                          </div>

                          <div className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{new Date(site.updatedAt || site.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center flex items-center justify-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Live</span>
                        </a>

                        <button
                          onClick={() => onEditSite && onEditSite(site)}
                          className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-sm"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Site</span>
                        </button>

                        <button
                          onClick={() => handleDelete(site.siteId)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* TAB 2: ADMIN USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div>
            {/* System Statistics Overview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
              
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider font-display">TOTAL USERS</span>
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  {adminStats.totalUsers}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">Registered accounts</p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider font-display">TOTAL SITES</span>
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  {adminStats.totalWebsites}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">MongoDB website docs</p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider font-display">FREE USERS</span>
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  {adminStats.freeUsers}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">Active Free Plan</p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider font-display">PREMIUM USERS</span>
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  {adminStats.premiumUsers}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">Pro & Business Plan</p>
              </div>

            </div>

            {/* Search Bar & Refresh Controls */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-soft-md mb-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      fetchAdminUsers(e.target.value);
                    }}
                    placeholder="Search registered users by name or email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3">
                  <span className="text-xs text-slate-500 font-semibold">
                    Showing <strong className="text-slate-900 font-bold">{adminUsers.length}</strong> Users
                  </span>
                  <button
                    onClick={() => fetchAdminUsers()}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1 border border-slate-200"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${adminUsersLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Users Table / Responsive Cards */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-display">
                    USER MANAGEMENT
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Full catalog of registered Nexora accounts and database website counts.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-50 text-brand-700 border border-brand-200">
                  Admin Access Verified
                </span>
              </div>

              {adminUsersLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-500">Querying users from MongoDB...</p>
                </div>
              ) : adminUsers.length === 0 ? (
                <div className="text-center py-12 bg-slate-50">
                  <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">No matching users found</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Try adjusting your search query filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs text-slate-600 border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200 font-display">
                        <th className="py-3.5 px-6">User Name</th>
                        <th className="py-3.5 px-4">Email</th>
                        <th className="py-3.5 px-4">Created Date</th>
                        <th className="py-3.5 px-4 text-center">Websites</th>
                        <th className="py-3.5 px-4">Plan</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {adminUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900 font-display">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-extrabold text-xs flex-shrink-0">
                                {(u.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <span className="truncate max-w-[150px]">{u.name}</span>
                              {u.role === 'admin' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                                  ADMIN
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4 font-medium text-slate-700 font-mono">
                            {u.email}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                            {new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                              u.websiteCount > 0
                                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              {u.websiteCount}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                              {u.plan || 'Free'}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {u.status || 'Active'}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleOpenUserDetails(u)}
                              className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs border border-brand-200 transition-colors inline-flex items-center space-x-1"
                            >
                              <span>View Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: NEWSLETTER SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">
                  Newsletter Subscribers
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Subscribers who signed up via the website footer form.
                </p>
              </div>

              <button
                onClick={fetchSubscribers}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1 border border-slate-200"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${subscribersLoading ? 'animate-spin' : ''}`} />
                <span>Refresh List</span>
              </button>
            </div>

            {subscribersLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-500">Loading subscribers...</p>
              </div>
            ) : subscribers.length === 0 ? (
              <div className="text-center py-12 bg-slate-50">
                <Mail className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900">No subscribers yet</h4>
                <p className="text-xs text-slate-500 mt-0.5">Subscribers will appear here after subscribing on the footer.</p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200 font-display">
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

        {/* USER DETAILS MODAL */}
        {selectedAdminUser && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              
              {/* Modal Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-extrabold text-base">
                    {(selectedAdminUser.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold font-display leading-tight">
                      USER DETAILS
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      ID: {selectedAdminUser.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedAdminUser(null); setUserWebsitesModal([]); }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                
                {/* User Attributes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 font-display">Name</span>
                    <p className="text-sm font-bold text-slate-900 truncate">{selectedAdminUser.name}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 font-display">Email</span>
                    <p className="text-xs font-bold text-slate-900 font-mono truncate">{selectedAdminUser.email}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 font-display">Account Created</span>
                    <p className="text-xs font-bold text-slate-900">
                      {new Date(selectedAdminUser.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 font-display">Current Plan</span>
                    <p className="mt-0.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-800 uppercase">
                        {selectedAdminUser.plan || 'Free'}
                      </span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 font-display">Account Status</span>
                    <p className="mt-0.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
                        {selectedAdminUser.status || 'Active'}
                      </span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 font-display">Total Websites</span>
                    <p className="text-sm font-extrabold text-brand-600">{userWebsitesModal.length}</p>
                  </div>
                </div>

                {/* User Websites Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-extrabold text-slate-900 font-display uppercase tracking-wider">
                      WEBSITES OWNED ({userWebsitesModal.length})
                    </h4>
                  </div>

                  {userWebsitesLoading ? (
                    <div className="text-center py-8">
                      <div className="w-6 h-6 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-bold">Fetching user website records...</p>
                    </div>
                  ) : userWebsitesModal.length === 0 ? (
                    <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
                      No websites created yet by this user.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userWebsitesModal.map((w, idx) => (
                        <div
                          key={w.siteId || idx}
                          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft-sm flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="text-sm font-bold text-slate-900 font-display truncate">
                                {w.brandName || w.title || 'Untitled Website'}
                              </h5>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                w.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {w.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 font-mono truncate mt-0.5">
                              /site/{w.slug}
                            </p>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <a
                              href={`/site/${w.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center space-x-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>View Site</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => { setSelectedAdminUser(null); setUserWebsitesModal([]); }}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  Close Details
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Domain Settings Modal */}
        {selectedDomainSite && (
          <DomainSettingsModal
            website={selectedDomainSite}
            onClose={() => setSelectedDomainSite(null)}
          />
        )}

        {/* Free Plan Limit Upgrade Modal */}
        {showLimitModal && (
          <PremiumLockModal
            title="Free Plan Limit Reached"
            description="The Free plan includes 1 website slot. Upgrade to Premium plans for unlimited websites."
            onClose={() => setShowLimitModal(false)}
          />
        )}

      </div>
    </div>
  );
}
