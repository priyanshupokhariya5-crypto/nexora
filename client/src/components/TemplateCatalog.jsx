import PremiumLockModal from './PremiumLockModal';
import { Lock } from 'lucide-react';

export default function TemplateCatalog({ templates = [], onSelectTemplate, user = null, onOpenAuth }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showLockModal, setShowLockModal] = useState(false);

  const activeTemplates = templates && templates.length > 0 ? templates : TEMPLATES_DATA;

  const handleCustomizeClick = (tpl) => {
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    const isPremium = tpl.isPremium || tpl.badge === 'Tech & SaaS' || tpl.price === 'Premium' || tpl.category === 'Tech & SaaS';
    if (isPremium && (!user?.premiumAccess && user?.plan !== 'pro' && user?.plan !== 'business')) {
      setShowLockModal(true);
      return;
    }
    if (onSelectTemplate) onSelectTemplate(tpl);
  };

  const filtered = activeTemplates.filter(tpl => {
    const titleStr = (tpl.name || tpl.title || '').toLowerCase();
    const descStr = (tpl.description || tpl.tagline || '').toLowerCase();
    const catStr = (tpl.category || '').toLowerCase();
    const authorStr = (tpl.author || '').toLowerCase();
    const tagStr = Array.isArray(tpl.tags) ? tpl.tags.join(' ').toLowerCase() : '';

    const matchesCategory = selectedCategory === 'All' || catStr === selectedCategory.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      titleStr.includes(searchQuery.toLowerCase()) ||
      descStr.includes(searchQuery.toLowerCase()) ||
      catStr.includes(searchQuery.toLowerCase()) ||
      authorStr.includes(searchQuery.toLowerCase()) ||
      tagStr.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen w-full min-w-0 max-w-full">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 w-full min-w-0 max-w-full">
        <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-brand-500/10 text-brand-600 border border-brand-500/20 inline-block mb-3">
          Custom & Database Themes ({activeTemplates.length})
        </span>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-display tracking-tight break-words">
          Website Theme & Template Catalog
        </h1>
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto break-words">
          Select any high-converting theme below to customize or preview live demos. Click <strong className="text-slate-900 font-bold">Customize</strong> to personalize content, layout, colors, and branding.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-soft-md w-full min-w-0 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 w-full min-w-0 max-w-full">
          
          <div className="relative w-full min-w-0 max-w-full sm:w-96 flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search themes, tags, author, or business type..."
              className="w-full min-w-0 max-w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 text-ellipsis"
            />
          </div>

          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 flex-shrink-0">
            Showing <strong className="text-slate-900 font-bold">{filtered.length}</strong> of {activeTemplates.length} Themes
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 sm:mt-6 w-full min-w-0 max-w-full overflow-x-auto pb-2 scrollbar-none flex items-center gap-2">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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
        <div className="mt-12 sm:mt-16 text-center py-12 sm:py-16 bg-slate-50 rounded-3xl border border-slate-200 w-full min-w-0 max-w-full px-4">
          <LayoutGrid className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">No Themes Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search query or choosing another category.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0 max-w-full">
          {filtered.map(tpl => {
            const titleText = tpl.name || tpl.title || 'Untitled Theme';
            const descText = tpl.description || tpl.tagline || 'High-converting business website theme.';
            const thumbUrl = tpl.thumbnail || tpl.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={tpl.id || tpl._id}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft-md hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between w-full min-w-0 max-w-full"
              >
                <div>
                  {/* Card Thumbnail Picture Header */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 w-full min-w-0 max-w-full">
                    <img 
                      src={thumbUrl} 
                      alt={titleText} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100 max-w-full"
                    />
                    
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20 p-4 sm:p-5 flex flex-col justify-between min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 truncate">
                          {tpl.category}
                        </span>

                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          {tpl.isPremium || tpl.badge === 'Tech & SaaS' || tpl.category === 'Tech & SaaS' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider shadow flex items-center space-x-1 font-display">
                              <Lock className="w-3 h-3 text-slate-950" />
                              <span>🔒 PREMIUM COMING SOON</span>
                            </span>
                          ) : (
                            <>
                              {tpl.featured && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider shadow flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-slate-950" />
                                  <span>Featured</span>
                                </span>
                              )}
                              {tpl.badge && !tpl.featured && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-slate-950 uppercase tracking-wider shadow">
                                  {tpl.badge}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-white/80">By {tpl.author || 'Nexora Studio'}</span>
                        <h3 className="text-lg sm:text-xl font-bold text-white font-display leading-tight drop-shadow-sm truncate">
                          {titleText}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-4 sm:p-5 w-full min-w-0 max-w-full">
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 break-words">
                      {descText}
                    </p>

                    {/* Tags */}
                    {Array.isArray(tpl.tags) && tpl.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1 text-[9px]">
                        {tpl.tags.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dynamic Action Buttons Grid */}
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 space-y-2 w-full min-w-0 max-w-full">
                  
                  {/* Optional External URLs (Demo / Live / Documentation) */}
                  {(tpl.demoUrl || tpl.liveUrl || tpl.previewUrl) && (
                    <div className="flex items-center gap-2 w-full">
                      {tpl.previewUrl ? (
                        <a
                          href={tpl.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] border border-slate-200 flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-3 h-3 flex-shrink-0" />
                          <span>Preview Link</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => setPreviewTemplate(tpl)}
                          className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] border border-slate-200 flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-3 h-3 flex-shrink-0" />
                          <span>Preview</span>
                        </button>
                      )}

                      {tpl.demoUrl && (
                        <a
                          href={tpl.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-[11px] border border-sky-200 flex items-center justify-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          <span>Demo</span>
                        </a>
                      )}

                      {tpl.liveUrl && (
                        <a
                          href={tpl.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200 flex items-center justify-center space-x-1"
                        >
                          <Globe className="w-3 h-3 flex-shrink-0" />
                          <span>Live Site</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Primary Customize Button */}
                  <button
                    onClick={() => handleCustomizeClick(tpl)}
                    className="w-full py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    <span>Use Template / Customize</span>
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full-Screen Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between w-full h-full">
          {/* Modal Header */}
          <div className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white flex-shrink-0 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <span className="font-extrabold text-xs sm:text-sm font-display truncate">{previewTemplate.name || previewTemplate.title}</span>
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-400 text-slate-950 uppercase flex-shrink-0">{previewTemplate.badge || 'Template'}</span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <button
                onClick={() => {
                  const tpl = previewTemplate;
                  setPreviewTemplate(null);
                  handleCustomizeClick(tpl);
                }}
                className="px-3 sm:px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
              >
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current flex-shrink-0" />
                <span className="hidden sm:inline">Use This Template</span>
                <span className="sm:hidden">Use</span>
              </button>

              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Canvas Body */}
          <div className="flex-1 overflow-y-auto bg-white text-slate-900 w-full min-w-0">
            <TemplateRenderer template={previewTemplate} viewportMode="desktop" />
          </div>
        </div>
      )}

      {/* Premium Lock Modal */}
      {showLockModal && (
        <PremiumLockModal
          title="Premium Template"
          description="This template is available with a Premium plan."
          onClose={() => setShowLockModal(false)}
        />
      )}
    </div>
  );
}
