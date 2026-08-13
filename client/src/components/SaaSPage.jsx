import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Zap, LayoutGrid, CheckCircle2, ArrowRight, Shield, 
  Smartphone, Monitor, Palette, Type, Code, Download, Globe, 
  ChevronRight, Star, Heart, Flame, Eye, Layers, Check, Rocket,
  HelpCircle, ChevronDown, MessageSquare, ShieldCheck, Clock, Award,
  Send, Twitter, Github, Linkedin, Disc as Discord, Lock, UserCheck,
  ExternalLink, X, RefreshCw
} from 'lucide-react';
import { TEMPLATE_CATEGORIES, TEMPLATES_DATA } from '../data/templatesData';
import TemplateRenderer from './TemplateRenderer';

export default function SaaSPage({ templates = [], onSelectTemplate, onExploreCatalog, user = null, onOpenAuth }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [previewModalTemplate, setPreviewModalTemplate] = useState(null);

  // Source of Truth: Use templates prop from GET /api/templates or fallback to TEMPLATES_DATA
  const rawTemplates = templates && templates.length > 0 ? templates : TEMPLATES_DATA;

  // Filter only published templates for public display
  const publishedTemplates = rawTemplates.filter(t => t.status === 'Published' || !t.status);

  // Featured templates spotlight priority
  const featuredTemplates = publishedTemplates.filter(t => t.featured);
  const spotlightList = featuredTemplates.length > 0 ? featuredTemplates : publishedTemplates;
  const safeSpotlightIndex = Math.min(spotlightIndex, spotlightList.length - 1);
  const activeSpotlight = spotlightList[safeSpotlightIndex] || spotlightList[0] || TEMPLATES_DATA[0];

  // Filtered list for category showcase grid
  const filteredTemplates = publishedTemplates.filter(t => 
    activeCategory === 'All' ? true : (t.category?.toLowerCase() === activeCategory.toLowerCase())
  );

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 4000);
    }
  };

  const handleUseTemplate = (tpl) => {
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (onSelectTemplate) onSelectTemplate(tpl);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-600 selection:text-white overflow-x-hidden w-full max-w-full min-w-0">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40 border-b border-slate-200/80 bg-grid-light w-full min-w-0 max-w-full">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] h-[500px] bg-gradient-to-tr from-brand-100/50 via-indigo-100/40 to-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none overflow-hidden" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full min-w-0 max-w-full">

          {/* Hero Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.08] font-display break-words"
          >
            Build & Customize High-Converting <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 bg-clip-text text-transparent">
              Business Websites In Minutes
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans break-words"
          >
            Choose from <strong className="text-slate-900 font-bold">{publishedTemplates.length} published templates</strong> spanning Local Retail, Restaurants, Real Estate, Law, SaaS, and Professional Services. Customize logo, colors, images, and content live.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full min-w-0 max-w-full"
          >
            <button
              onClick={onExploreCatalog}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 transition-all duration-200 flex items-center justify-center space-x-3 group"
            >
              <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Explore Template Catalog</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#demo-showcase"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300/80 shadow-soft-sm transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Eye className="w-5 h-5 text-brand-600" />
              <span>View Featured Live Preview</span>
            </a>
          </motion.div>

          {/* STATS COUNTERS */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-slate-200/70 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center w-full min-w-0 max-w-full"
          >
            <div className="p-4 sm:p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-soft-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">{publishedTemplates.length}+</p>
              <p className="text-xs font-semibold text-slate-600 mt-1.5">Live Database Themes</p>
            </div>

            <div className="p-4 sm:p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-soft-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">100%</p>
              <p className="text-xs font-semibold text-slate-600 mt-1.5">Mobile Responsive</p>
            </div>

            <div className="p-4 sm:p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-soft-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">&lt; 3 min</p>
              <p className="text-xs font-semibold text-slate-600 mt-1.5">Average Build Time</p>
            </div>

            <div className="p-4 sm:p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-soft-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">1-Click</p>
              <p className="text-xs font-semibold text-slate-600 mt-1.5">HTML Code Export</p>
            </div>
          </motion.div>

          {/* DYNAMIC LIVE PREVIEW SHOWCASE CARD (HERO SPOTLIGHT) */}
          <motion.div 
            id="demo-showcase" 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-14 sm:mt-20 relative max-w-5xl mx-auto w-full min-w-0 max-w-full"
          >
            <div className="rounded-3xl border border-slate-300/80 bg-white/95 backdrop-blur-xl shadow-2xl p-3 sm:p-6 relative w-full min-w-0 max-w-full overflow-hidden">
              
              {/* Browser Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-4 py-2.5 bg-slate-100/90 rounded-2xl mb-4 border border-slate-200/80 w-full min-w-0 max-w-full overflow-hidden">
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 font-mono hidden sm:inline">Nexora Live Template System</span>
                </div>

                <div className="px-3 py-1 rounded-xl bg-white text-[10px] sm:text-xs font-mono text-slate-700 border border-slate-300/80 flex items-center space-x-1.5 shadow-soft-sm max-w-full overflow-hidden min-w-0">
                  <Globe className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                  <span className="truncate min-w-0">
                    https://nexora.app/templates/{activeSpotlight.slug || activeSpotlight.id}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-semibold flex-shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
                    <span>MongoDB Database Sync</span>
                  </span>
                </div>
              </div>

              {/* Spotlight Selector Tabs */}
              {spotlightList.length > 1 && (
                <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full min-w-0 max-w-full">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex-shrink-0 font-display mr-1">Spotlight Themes:</span>
                  {spotlightList.slice(0, 5).map((t, idx) => (
                    <button
                      key={t.id || t._id || idx}
                      onClick={() => setSpotlightIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 flex-shrink-0 ${
                        safeSpotlightIndex === idx
                          ? 'bg-brand-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {t.featured && <Star className="w-3 h-3 fill-current text-amber-300" />}
                      <span className="truncate max-w-[120px] sm:max-w-[180px]">{t.name || t.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Dynamic Live Preview Spotlight Card */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-soft-md overflow-hidden flex flex-col md:flex-row items-stretch w-full min-w-0 max-w-full">
                
                {/* Preview Thumbnail Container */}
                <div className="relative md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden bg-slate-900 w-full min-w-0 max-w-full">
                  <img 
                    src={activeSpotlight.thumbnail || activeSpotlight.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'} 
                    alt={activeSpotlight.name || activeSpotlight.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-4 sm:p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 truncate">
                        {activeSpotlight.category || 'Local & Retail'}
                      </span>
                      {activeSpotlight.featured ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider shadow flex items-center space-x-1 flex-shrink-0">
                          <Star className="w-3 h-3 fill-slate-950" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white text-slate-950 uppercase tracking-wider shadow flex-shrink-0">
                          {activeSpotlight.badge || 'Popular'}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider block">By {activeSpotlight.author || 'Nexora Studio'}</span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display leading-tight drop-shadow-sm truncate">
                        {activeSpotlight.name || activeSpotlight.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Card Details & Action Buttons */}
                <div className="p-5 sm:p-8 md:w-1/2 flex flex-col justify-between space-y-4 w-full min-w-0 max-w-full bg-slate-50/50">
                  <div>
                    <div className="flex items-center space-x-2 text-[11px] font-semibold text-brand-600 uppercase tracking-widest font-display mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Current Active Template</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display tracking-tight leading-snug">
                      {activeSpotlight.name || activeSpotlight.title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {activeSpotlight.description || activeSpotlight.tagline || 'High-converting customizable business template.'}
                    </p>

                    {/* Metadata Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-600">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-soft-sm">
                        Font: {activeSpotlight.fontFamily || 'sans'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-soft-sm">
                        Theme: {activeSpotlight.bgTheme || 'light'} mode
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-soft-sm">
                        Hero: {activeSpotlight.themeType || activeSpotlight.heroStyle || 'split-arched'}
                      </span>
                    </div>
                  </div>

                  {/* Functional Action Buttons */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200/80 w-full min-w-0 max-w-full">
                    
                    {/* Optional URL Row */}
                    <div className="flex flex-wrap items-center gap-2 w-full min-w-0 max-w-full">
                      {activeSpotlight.previewUrl ? (
                        <a
                          href={activeSpotlight.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 shadow-soft-sm flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                          <span className="truncate">Live Preview Link</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => setPreviewModalTemplate(activeSpotlight)}
                          className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 shadow-soft-sm flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                          <span className="truncate">Live Fullscreen Preview</span>
                        </button>
                      )}

                      {activeSpotlight.demoUrl && (
                        <a
                          href={activeSpotlight.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200 flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">Demo Link</span>
                        </a>
                      )}

                      {activeSpotlight.liveUrl && (
                        <a
                          href={activeSpotlight.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">Live Site</span>
                        </a>
                      )}
                    </div>

                    {/* Primary Use Template / Customize Button */}
                    <button
                      onClick={() => handleUseTemplate(activeSpotlight)}
                      className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-4 h-4 text-amber-300 fill-current flex-shrink-0" />
                      <span>Use This Template ({activeSpotlight.name || activeSpotlight.title})</span>
                      <ArrowRight className="w-4 h-4 flex-shrink-0" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. TRUSTED BY SECTION */}
      <section className="py-14 bg-slate-50/70 border-b border-slate-200/80 w-full min-w-0 max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full min-w-0 max-w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-8 font-display">
            Trusted By 4,000+ Businesses Across Global Industries
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 items-center opacity-75 grayscale hover:grayscale-0 transition-all duration-500 text-slate-700 font-extrabold text-sm sm:text-base tracking-wider font-display w-full min-w-0 max-w-full">
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm hover:border-slate-300">STARTUPS</div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm hover:border-slate-300">AGENCIES</div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm hover:border-slate-300">RESTAURANTS</div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm hover:border-slate-300">LAW FIRMS</div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm hover:border-slate-300 col-span-2 md:col-span-1">FITNESS GYMS</div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0 max-w-full">
        <div className="text-center max-w-3xl mx-auto w-full min-w-0 max-w-full">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 font-display">
            3-Step Visual Process
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Launch your custom business website in three simple non-technical steps.
          </p>
        </div>

        <div className="mt-14 sm:mt-16 grid md:grid-cols-3 gap-6 sm:gap-8 relative w-full min-w-0 max-w-full">
          
          {/* Step 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-md hover:shadow-card-hover transition-all duration-300 relative">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 font-extrabold text-lg flex items-center justify-center mb-6 shadow-soft-sm font-display">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Choose Template</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Select from handcrafted published themes designed for E-Commerce, Gyms, Restaurants, Law Firms, Real Estate, and Services.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-md hover:shadow-card-hover transition-all duration-300 relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 font-extrabold text-lg flex items-center justify-center mb-6 shadow-soft-sm font-display">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Customize Content & Styling</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Edit headlines, brand logos, typography, colors, and upload distinct business images with direct canvas editing and section reordering.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-md hover:shadow-card-hover transition-all duration-300 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 font-extrabold text-lg flex items-center justify-center mb-6 shadow-soft-sm font-display">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Publish & Export</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Publish your website to a live URL instantly or download 1-click clean HTML/CSS code for self-hosting.
            </p>
          </div>

        </div>
      </section>

      {/* 4. TEMPLATES CATALOG SHOWCASE SECTION */}
      <section className="py-20 md:py-28 bg-slate-50/50 border-y border-slate-200/80 w-full min-w-0 max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0 max-w-full">

          <div className="text-center max-w-3xl mx-auto w-full min-w-0 max-w-full">
            <span className="text-xs uppercase tracking-widest font-extrabold text-brand-600 font-display">
              {publishedTemplates.length} Handcrafted Industry Presets
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
              Tailored For Every Business Industry & Purpose
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Select any theme below to preview live demos or customize branding, images, colors, and content in real-time.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 sm:mt-10 flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none w-full min-w-0 max-w-full">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid with Hover Effects */}
          {filteredTemplates.length === 0 ? (
            <div className="mt-10 text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No published templates found for this category.
            </div>
          ) : (
            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full min-w-0 max-w-full">
              {filteredTemplates.slice(0, 6).map((tpl) => {
                const titleText = tpl.name || tpl.title || 'Untitled Theme';
                const descText = tpl.description || tpl.tagline || 'High-converting business template.';
                const thumbUrl = tpl.thumbnail || tpl.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';

                return (
                  <motion.div 
                    key={tpl.id || tpl._id}
                    whileHover={{ y: -6 }}
                    className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-soft-md hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between w-full min-w-0 max-w-full"
                  >
                    <div>
                      {/* Header Preview Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 w-full min-w-0 max-w-full">
                        <img 
                          src={thumbUrl} 
                          alt={titleText} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100 max-w-full"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20 p-5 flex flex-col justify-between">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 truncate">
                              {tpl.category}
                            </span>
                            {tpl.featured ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider shadow flex items-center space-x-1 flex-shrink-0">
                                <Star className="w-3 h-3 fill-slate-950" />
                                <span>Featured</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-slate-950 uppercase tracking-wider shadow flex-shrink-0">
                                {tpl.badge || 'Popular'}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider block truncate">By {tpl.author || 'Nexora Studio'}</span>
                            <h3 className="text-xl font-bold text-white font-display leading-tight drop-shadow-sm truncate">
                              {titleText}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5 sm:p-6 w-full min-w-0 max-w-full">
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 break-words">
                          {descText}
                        </p>
                        
                        <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                            Font: {tpl.fontFamily || 'sans'}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                            Mode: {tpl.bgTheme || 'light'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Action Buttons Grid */}
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 space-y-2 w-full min-w-0 max-w-full">
                      
                      {/* Optional URL Row */}
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
                              <span>Preview</span>
                            </a>
                          ) : (
                            <button
                              onClick={() => setPreviewModalTemplate(tpl)}
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

                      {/* Primary Button */}
                      <button
                        onClick={() => handleUseTemplate(tpl)}
                        className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-md"
                      >
                        <span>Customize / Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* View All Button */}
          <div className="mt-12 text-center">
            <button
              onClick={onExploreCatalog}
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-300 shadow-soft-sm transition-all duration-200"
            >
              <LayoutGrid className="w-5 h-5 text-brand-600" />
              <span>Browse All {publishedTemplates.length} Business Templates</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. KEY FEATURES SECTION */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0 max-w-full">
        <div className="text-center max-w-3xl mx-auto w-full min-w-0 max-w-full">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 font-display">
            Why Business Owners Choose Nexora
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold text-slate-900 font-display">
            Complete Visual Freedom Without Code
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Designed specifically so non-technical users can customize websites effortlessly without fighting heavy page builders.
          </p>
        </div>

        <div className="mt-14 sm:mt-16 grid md:grid-cols-3 gap-6 sm:gap-8 w-full min-w-0 max-w-full">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-card-hover transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mb-6 shadow-sm">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Multi-Asset Image Customization
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Add and edit 3 distinct business images (Hero, Brand Story, Product Showcase) per website with 1-click stock presets or custom web URLs.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-card-hover transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-6 shadow-sm">
              <Type className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Tailored Typography & Branding
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Switch between Google Fonts (Plus Jakarta Sans, Outfit, Playfair Display, Inter UI) and color palettes tailored to your business identity.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-card-hover transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              1-Click Code Export & Hosting
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Publish to live Nexora subdomains instantly or download clean production-ready standalone HTML/CSS code bundles.
            </p>
          </div>

        </div>
      </section>

      {/* Full-Screen Template Preview Modal */}
      {previewModalTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between w-full h-full">
          <div className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white flex-shrink-0 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <span className="font-extrabold text-xs sm:text-sm font-display truncate">
                {previewModalTemplate.name || previewModalTemplate.title}
              </span>
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-400 text-slate-950 uppercase flex-shrink-0">
                {previewModalTemplate.badge || 'Template'}
              </span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <button
                onClick={() => {
                  const tpl = previewModalTemplate;
                  setPreviewModalTemplate(null);
                  handleUseTemplate(tpl);
                }}
                className="px-3 sm:px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
              >
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current flex-shrink-0 text-amber-300" />
                <span>Use This Template</span>
              </button>

              <button
                onClick={() => setPreviewModalTemplate(null)}
                className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white text-slate-900 w-full min-w-0">
            <TemplateRenderer template={previewModalTemplate} viewportMode="desktop" />
          </div>
        </div>
      )}

    </div>
  );
}
