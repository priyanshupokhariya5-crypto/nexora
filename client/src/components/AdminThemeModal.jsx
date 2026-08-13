import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Palette, Sparkles, Trash2, Check, RefreshCw, AlertCircle, 
  ShieldCheck, UploadCloud, Edit3, Globe, Link as LinkIcon, FileText, Image as ImageIcon
} from 'lucide-react';
import { TEMPLATE_CATEGORIES } from '../data/templatesData';
import { apiFetch, getApiUrl } from '../api';

export default function AdminThemeModal({ isOpen, onClose, onThemeAdded, user = null }) {
  const [themes, setThemes] = useState([]);
  const [editingThemeId, setEditingThemeId] = useState(null);

  // Basic Information
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Local & Retail');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('Nexora Studio');
  const [tags, setTags] = useState('modern, business, responsive');
  const [badge, setBadge] = useState('Featured Theme');

  // Theme URLs
  const [previewUrl, setPreviewUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [documentationUrl, setDocumentationUrl] = useState('');

  // Assets (Thumbnail / Hero / Logo)
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80');
  const [heroImage, setHeroImage] = useState('');
  const [logo, setLogo] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Configuration
  const [accentColor, setAccentColor] = useState('#2551e8');
  const [bgTheme, setBgTheme] = useState('light');
  const [fontFamily, setFontFamily] = useState('sans');
  const [themeType, setThemeType] = useState('split-arched');
  const [status, setStatus] = useState('Published');
  const [featured, setFeatured] = useState(true);
  const [price, setPrice] = useState('Free');
  const [sortOrder, setSortOrder] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAdminThemes = async () => {
    try {
      const res = await apiFetch('/api/admin/themes');
      const data = await res.json();
      if (data.success) {
        setThemes(data.themes || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin themes:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminThemes();
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setEditingThemeId(null);
    setName('');
    setSlug('');
    setCategory('Local & Retail');
    setDescription('');
    setAuthor('Nexora Studio');
    setTags('modern, business, responsive');
    setBadge('Featured Theme');
    setPreviewUrl('');
    setDemoUrl('');
    setLiveUrl('');
    setDocumentationUrl('');
    setThumbnail('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80');
    setHeroImage('');
    setLogo('');
    setAccentColor('#2551e8');
    setBgTheme('light');
    setFontFamily('sans');
    setThemeType('split-arched');
    setStatus('Published');
    setFeatured(true);
    setPrice('Free');
    setSortOrder(0);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleEditClick = (theme) => {
    setEditingThemeId(theme.id || theme._id);
    setName(theme.name || theme.title || '');
    setSlug(theme.slug || '');
    setCategory(theme.category || 'Local & Retail');
    setDescription(theme.description || theme.tagline || '');
    setAuthor(theme.author || 'Nexora Studio');
    setTags(Array.isArray(theme.tags) ? theme.tags.join(', ') : (theme.tags || ''));
    setBadge(theme.badge || 'Featured Theme');
    setPreviewUrl(theme.previewUrl || '');
    setDemoUrl(theme.demoUrl || '');
    setLiveUrl(theme.liveUrl || '');
    setDocumentationUrl(theme.documentationUrl || '');
    setThumbnail(theme.thumbnail || theme.image || '');
    setHeroImage(theme.heroImage || '');
    setLogo(theme.logo || '');
    setAccentColor(theme.accentColor || '#2551e8');
    setBgTheme(theme.bgTheme || 'light');
    setFontFamily(theme.fontFamily || 'sans');
    setThemeType(theme.themeType || theme.heroStyle || 'split-arched');
    setStatus(theme.status || 'Published');
    setFeatured(theme.featured !== undefined ? Boolean(theme.featured) : true);
    setPrice(theme.price || 'Free');
    setSortOrder(theme.sortOrder || 0);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiFetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success && (data.url || data.imageUrl)) {
        const finalUrl = getApiUrl(data.url || data.imageUrl);
        setThumbnail(finalUrl);
        setSuccessMsg('Thumbnail uploaded successfully!');
      } else {
        setErrorMsg(data.message || 'Image upload failed.');
      }
    } catch (err) {
      setErrorMsg('Image upload network error.');
    } finally {
      setUploadingImage(false);
    }
  };

  const validateUrls = () => {
    const urls = [
      { name: 'Preview URL', val: previewUrl },
      { name: 'Demo URL', val: demoUrl },
      { name: 'Live Website URL', val: liveUrl },
      { name: 'Documentation URL', val: documentationUrl }
    ];

    for (const item of urls) {
      if (item.val && item.val.trim() !== '') {
        const clean = item.val.trim();
        if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
          setErrorMsg(`${item.name} must start with http:// or https://`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !name.trim()) {
      setErrorMsg('Please enter a theme name.');
      return;
    }

    if (!validateUrls()) return;

    setLoading(true);

    try {
      const payload = {
        name,
        title: name,
        slug,
        category,
        description,
        tagline: description,
        author,
        tags,
        badge,
        previewUrl,
        demoUrl,
        liveUrl,
        documentationUrl,
        thumbnail,
        image: thumbnail,
        heroImage,
        logo,
        accentColor,
        bgTheme,
        fontFamily,
        themeType,
        heroStyle: themeType,
        status,
        featured,
        price,
        sortOrder: parseInt(sortOrder, 10) || 0
      };

      const endpoint = editingThemeId ? `/api/templates/${editingThemeId}` : '/api/templates';
      const method = editingThemeId ? 'PUT' : 'POST';

      const res = await apiFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg(editingThemeId ? `Theme "${name}" updated successfully in MongoDB!` : `Theme "${name}" added successfully to MongoDB!`);
        resetForm();
        fetchAdminThemes();
        if (onThemeAdded) onThemeAdded(data.template);
      } else {
        setErrorMsg(data.message || 'Failed to save theme.');
      }
    } catch (err) {
      setErrorMsg('Network error saving theme. Verify backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTheme = async (themeId) => {
    if (!window.confirm('Are you sure you want to delete this theme from MongoDB? It will be removed from the public catalog.')) return;

    try {
      const res = await apiFetch(`/api/templates/${themeId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Theme deleted successfully.');
        fetchAdminThemes();
        if (onThemeAdded) onThemeAdded(null);
      } else {
        setErrorMsg(data.message || 'Failed to delete theme.');
      }
    } catch (err) {
      setErrorMsg('Delete network error.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-3xl w-full mx-2 border border-slate-200 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shadow-soft-sm">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              Admin Theme & Template Manager
            </h2>
            <p className="text-xs text-slate-500">
              Create, edit, and publish custom website themes to MongoDB for the public Templates catalog.
            </p>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Add / Edit Theme Form */}
        <form onSubmit={handleSubmit} className="space-y-5 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 font-display flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>{editingThemeId ? 'Edit Existing Theme' : 'Add New Theme to MongoDB'}</span>
            </h3>
            {editingThemeId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-brand-600 hover:underline font-bold"
              >
                + Cancel Edit / New Theme
              </button>
            )}
          </div>

          {/* Section 1: Basic Information */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-display block">1. Basic Information</span>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Theme Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Modern Business Elite"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Theme Slug (Optional)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. modern-business-elite"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-medium"
                >
                  {TEMPLATE_CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Author / Brand</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nexora Studio"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Featured Theme"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Theme Description / Tagline</label>
              <textarea
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High-converting professional landing page built for business growth..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="modern, corporate, responsive, sleek"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
              />
            </div>
          </div>

          {/* Section 2: Theme URLs */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-display block">2. External & Demo URLs</span>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preview URL (http:// or https://)</label>
                <input
                  type="url"
                  value={previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  placeholder="https://example.com/preview"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Demo URL (http:// or https://)</label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://example.com/demo"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Live Website URL</label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Documentation URL</label>
                <input
                  type="url"
                  value={documentationUrl}
                  onChange={(e) => setDocumentationUrl(e.target.value)}
                  placeholder="https://example.com/docs"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Thumbnail & Image Assets */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-display block">3. Assets & Media</span>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Thumbnail / Preview Image URL</label>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                />
                <label className="px-3 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer hover:bg-slate-700 flex items-center space-x-1.5 flex-shrink-0">
                  {uploadingImage ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {thumbnail && (
                <div className="mt-2 w-32 aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
                  <img src={thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Configuration & Status */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-display block">4. Styling & Publishing Settings</span>
            <div className="grid sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Accent Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-700">{accentColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bg Mode</label>
                <select
                  value={bgTheme}
                  onChange={(e) => setBgTheme(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                >
                  <option value="light">White Theme</option>
                  <option value="dark">Dark Theme</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                >
                  <option value="sans">Plus Jakarta Sans</option>
                  <option value="display">Outfit</option>
                  <option value="serif">Playfair Display</option>
                  <option value="inter">Inter UI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Layout</label>
                <select
                  value={themeType}
                  onChange={(e) => setThemeType(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                >
                  <option value="split-arched">Split Arched</option>
                  <option value="bento-hero">Bento Hero</option>
                  <option value="cinematic-full">Cinematic Full</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                >
                  <option value="Published">Published (Public)</option>
                  <option value="Draft">Draft (Admin Only)</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Featured</label>
                <select
                  value={featured ? 'true' : 'false'}
                  onChange={(e) => setFeatured(e.target.value === 'true')}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                >
                  <option value="true">Yes (Featured)</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Price / Plan</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Free / Pro"
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-95"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{editingThemeId ? 'Save Theme Changes to MongoDB' : 'Create & Save Theme to MongoDB'}</span>
          </button>
        </form>

        {/* Existing Custom Admin Themes List */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-display">
              Active Admin Themes in MongoDB ({themes.length})
            </h3>
            <button onClick={fetchAdminThemes} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {themes.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">No admin themes created in database yet.</p>
          ) : (
            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {themes.map(t => (
                <div key={t.id || t._id} className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-soft-sm">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-8 rounded-lg bg-slate-900 overflow-hidden flex-shrink-0">
                      <img src={t.thumbnail || t.image} alt={t.name || t.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{t.name || t.title}</p>
                        <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold ${t.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {t.status}
                        </span>
                        {t.featured && <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-400 text-slate-950">Featured</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{t.category} • Author: {t.author} • URLs: {t.previewUrl ? 'Preview' : 'Internal'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleEditClick(t)}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                      title="Edit Theme"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteTheme(t.id || t._id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      title="Delete Admin Theme"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
