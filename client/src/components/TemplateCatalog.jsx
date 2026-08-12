import React, { useState } from 'react';
import { Search, LayoutGrid, Sparkles, ArrowRight, Check, Eye, Lock, UserCheck, X, Zap } from 'lucide-react';
import { TEMPLATE_CATEGORIES, TEMPLATES_DATA } from '../data/templatesData';
import TemplateRenderer from './TemplateRenderer';

export default function TemplateCatalog({ templates = [], onSelectTemplate, user = null, onOpenAuth }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const activeTemplates = templates && templates.length > 0 ? templates : TEMPLATES_DATA;

  const handleCustomizeClick = (tpl) => {
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (onSelectTemplate) onSelectTemplate(tpl);
  };

  const filtered = activeTemplates.filter(tpl => {
    const matchesCategory = selectedCategory === 'All' || tpl.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-brand-500/10 text-brand-600 border border-brand-500/20 inline-block mb-3">
          30 Unique Business Presets
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight">
          Website Template Catalog
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Choose any high-converting business landing page template below. Click <strong className="text-slate-900 font-bold">Customize</strong> to personalize text, colors, images, cards, and section layouts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-soft-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, category, or business type..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Showing <strong className="text-slate-900 font-bold">{filtered.length}</strong> of {activeTemplates.length} Presets
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-16 text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
          <LayoutGrid className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 font-display">No Presets Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search query or choosing another category.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(tpl => (
            <div
              key={tpl.id}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft-md hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Card Thumbnail Picture Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img 
                    src={tpl.image} 
                    alt={tpl.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30">
                        {tpl.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider shadow">
                        {tpl.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-white/80">Preset #{tpl.id}</span>
                      <h3 className="text-xl font-bold text-white font-display leading-tight drop-shadow-sm">
                        {tpl.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-6">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {tpl.tagline}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                      Font: {tpl.fontFamily}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                      Mode: {tpl.bgTheme}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Preview & Customize */}
              <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPreviewTemplate(tpl)}
                  className="py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleCustomizeClick(tpl)}
                  className="py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-1.5"
                >
                  <span>Customize</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-Screen Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between">
          {/* Modal Header */}
          <div className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between text-white flex-shrink-0">
            <div className="flex items-center space-x-3">
              <span className="font-extrabold text-sm font-display">{previewTemplate.title}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">{previewTemplate.badge}</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  const tpl = previewTemplate;
                  setPreviewTemplate(null);
                  handleCustomizeClick(tpl);
                }}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Edit This Template</span>
              </button>

              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Canvas Body */}
          <div className="flex-1 overflow-y-auto bg-white text-slate-900">
            <TemplateRenderer template={previewTemplate} viewportMode="desktop" />
          </div>
        </div>
      )}
    </div>
  );
}
