import React, { useState } from 'react';
import { Search, LayoutGrid, Sparkles, ArrowRight, Check, Eye, Lock, UserCheck } from 'lucide-react';
import { TEMPLATE_CATEGORIES, TEMPLATES_DATA } from '../data/templatesData';

export default function TemplateCatalog({ templates = [], onSelectTemplate, user = null, onOpenAuth }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTemplates = templates && templates.length > 0 ? templates : TEMPLATES_DATA;

  if (!user) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-brand-100 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto mb-5 shadow-soft-sm">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            Please sign in or create a free Nexora account to access the complete 30+ template catalog and Visual Studio Editor.
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-600/25 transition-transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Sign In To Access Templates</span>
          </button>
        </div>
      </div>
    );
  }

  const filtered = activeTemplates.filter(tpl => {
    const matchesCategory = selectedCategory === 'All' || tpl.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-4 shadow-soft-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{activeTemplates.length || 30} Professional Industry Presets</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display">
            Select Your Business Template
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Choose a starting layout tailored for your business industry. You can fully customize logos, text, typography, colors, and layout.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. gym, restaurant, store...)"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 shadow-soft-sm"
            />
          </div>

          {/* Count */}
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

                {/* Edit Button */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => onSelectTemplate(tpl)}
                    className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs shadow transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Customize Preset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
