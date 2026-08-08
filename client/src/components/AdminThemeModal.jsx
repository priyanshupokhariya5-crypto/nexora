import React, { useState, useEffect } from 'react';
import { X, Plus, Palette, Sparkles, Trash2, Check, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { TEMPLATE_CATEGORIES } from '../data/templatesData';
import { apiFetch } from '../api';

export default function AdminThemeModal({ isOpen, onClose, onThemeAdded }) {
  const [themes, setThemes] = useState([]);
  const [name, setName] = useState('');
  const [accentColor, setAccentColor] = useState('#2551e8');
  const [bgTheme, setBgTheme] = useState('light');
  const [fontFamily, setFontFamily] = useState('sans');
  const [category, setCategory] = useState('E-Commerce');
  const [badge, setBadge] = useState('Admin Theme');

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
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddTheme = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const payload = {
        name,
        accentColor,
        bgTheme,
        fontFamily,
        category,
        badge
      };

      const res = await apiFetch('/api/admin/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`Theme "${name}" created successfully!`);
        setName('');
        fetchAdminThemes();
        if (onThemeAdded) onThemeAdded(data.theme);
      } else {
        setErrorMsg(data.message || 'Failed to add theme.');
      }
    } catch (err) {
      setErrorMsg('Network error. Make sure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTheme = async (themeId) => {
    if (!window.confirm('Delete this admin theme preset?')) return;
    try {
      const res = await apiFetch(`/api/admin/themes/${themeId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setThemes(prev => prev.filter(t => t.themeId !== themeId && t._id !== themeId));
      }
    } catch (err) {
      console.error('Delete theme error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-xl w-full mx-2 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-soft-sm">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              Admin Theme Manager
            </h2>
            <p className="text-xs text-slate-500">
              Create and add custom template themes to MongoDB for users to customize.
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

        {/* Add Theme Form */}
        <form onSubmit={handleAddTheme} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 font-display">
            Add New Template Theme Preset
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Theme Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nordic Minimalist"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Tag</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Admin Pick"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Accent Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-700">{accentColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Background Mode</label>
              <select
                value={bgTheme}
                onChange={(e) => setBgTheme(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
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
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
              >
                <option value="sans">Plus Jakarta Sans</option>
                <option value="display">Outfit</option>
                <option value="serif">Playfair Display</option>
                <option value="inter">Inter UI</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Business Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900"
            >
              {TEMPLATE_CATEGORIES.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Add Theme To Database</span>
          </button>
        </form>

        {/* Existing Custom Admin Themes List */}
        <div className="mt-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 font-display">
            Active Admin Themes ({themes.length})
          </h3>

          {themes.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No custom admin themes added yet.</p>
          ) : (
            <div className="space-y-2">
              {themes.map(t => (
                <div key={t.themeId || t._id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border shadow" style={{ backgroundColor: t.accentColor }} />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{t.name}</p>
                      <p className="text-[10px] text-slate-500">{t.category} • {t.bgTheme} mode • {t.fontFamily} font</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTheme(t.themeId || t._id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    title="Delete Admin Theme"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
