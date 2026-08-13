import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Zap, LayoutGrid, CheckCircle2, ArrowRight, Shield, 
  Smartphone, Monitor, Palette, Type, Code, Download, Globe, 
  ChevronRight, ChevronLeft, Star, Heart, Flame, Eye, Layers, Check, Rocket,
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
  const [isHovered, setIsHovered] = useState(false);
  const [slideDirection, setSlideDirection] = useState('right');

  // Source of Truth: Use templates prop from GET /api/templates or fallback to TEMPLATES_DATA
  const rawTemplates = templates && templates.length > 0 ? templates : TEMPLATES_DATA;

  // Filter only published templates for public display
  const publishedTemplates = rawTemplates.filter(t => t.status === 'Published' || !t.status);

  // Featured templates spotlight priority
  const featuredTemplates = publishedTemplates.filter(t => t.featured);
  const spotlightList = featuredTemplates.length > 0 ? featuredTemplates : publishedTemplates;
  const safeSpotlightIndex = Math.min(spotlightIndex, spotlightList.length - 1);
  const activeSpotlight = spotlightList[safeSpotlightIndex] || spotlightList[0] || TEMPLATES_DATA[0];

  // Auto-rotation timer (3.5 seconds interval) with pause on hover
  useEffect(() => {
    if (spotlightList.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setSlideDirection('right');
      setSpotlightIndex((prevIndex) => (prevIndex + 1) % spotlightList.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [spotlightList.length, isHovered]);

  const handleManualSelect = (idx) => {
    if (idx === safeSpotlightIndex) return;
    setSlideDirection(idx > safeSpotlightIndex ? 'right' : 'left');
    setSpotlightIndex(idx);
  };

  const handlePrevSpotlight = () => {
    setSlideDirection('left');
    setSpotlightIndex((prevIndex) => (prevIndex - 1 + spotlightList.length) % spotlightList.length);
  };

  const handleNextSpotlight = () => {
    setSlideDirection('right');
    setSpotlightIndex((prevIndex) => (prevIndex + 1) % spotlightList.length);
  };

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

          {/* DYNAMIC LIVE PREVIEW SHOWCASE CARD (AUTO-ROTATING CAROUSEL) */}
          <motion.div 
            id="demo-showcase" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-10 sm:mt-14 relative max-w-3xl mx-auto w-full min-w-0 max-w-full px-2 sm:px-4"
          >
            <div 
              className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xl p-3 sm:p-5 relative w-full min-w-0 max-w-full overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              
              {/* Browser Header Bar - Compact */}
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 px-3 py-2 bg-slate-100/90 rounded-xl mb-3 border border-slate-200/80 w-full min-w-0 max-w-full overflow-hidden text-[10px] sm:text-xs">
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <span className="font-bold text-slate-500 font-mono hidden sm:inline">Nexora Auto Preview</span>
                </div>

                <div className="px-2.5 py-0.5 rounded-lg bg-white font-mono text-slate-600 border border-slate-200 flex items-center space-x-1 shadow-soft-sm truncate min-w-0">
                  <Globe className="w-3 h-3 text-brand-600 flex-shrink-0" />
                  <span className="truncate min-w-0">
                    https://nexora.app/templates/{activeSpotlight.slug || activeSpotlight.id}
                  </span>
                </div>

                <div className="flex items-center space-x-1 font-semibold flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
                    <span>{isHovered ? 'Paused' : 'Auto 3.5s Sync'}</span>
                  </span>
                </div>
              </div>

              {/* Spotlight Selector Tabs */}
              {spotlightList.length > 1 && (
                <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full min-w-0 max-w-full">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 flex-shrink-0 font-display mr-1">Spotlight:</span>
                  {spotlightList.slice(0, 5).map((t, idx) => (
                    <button
                      key={t.id || t._id || idx}
                      onClick={() => handleManualSelect(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap flex items-center space-x-1 flex-shrink-0 ${
                        safeSpotlightIndex === idx
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {t.featured && <Star className="w-2.5 h-2.5 fill-current text-amber-300" />}
                      <span className="truncate max-w-[100px] sm:max-w-[140px]">{t.name || t.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Slide Container with Height Stability & Framer Motion Slide Animation */}
              <div className="relative rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-soft-sm overflow-hidden w-full min-w-0 max-w-full">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeSpotlight.id || activeSpotlight._id || safeSpotlightIndex}
                    initial={{ opacity: 0, x: slideDirection === 'right' ? 40 : -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: slideDirection === 'right' ? -40 : 40 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row items-stretch w-full min-w-0 max-w-full"
                  >
                    {/* Compact Preview Image */}
                    <div className="relative sm:w-1/2 aspect-[16/10] overflow-hidden bg-slate-900 w-full min-w-0 max-w-full flex-shrink-0">
                      <img 
                        src={activeSpotlight.thumbnail || activeSpotlight.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'} 
                        alt={activeSpotlight.name || activeSpotlight.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-3 sm:p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 truncate">
                            {activeSpotlight.category || 'Local & Retail'}
                          </span>
                          {activeSpotlight.featured ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider shadow flex items-center space-x-1 flex-shrink-0">
                              <Star className="w-2.5 h-2.5 fill-slate-950" />
                              <span>Featured</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-white text-slate-950 uppercase tracking-wider shadow flex-shrink-0">
                              {activeSpotlight.badge || 'Popular'}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-[9px] font-semibold text-white/80 uppercase tracking-wider block">By {activeSpotlight.author || 'Nexora Studio'}</span>
                          <h3 className="text-base sm:text-lg font-bold text-white font-display leading-tight drop-shadow-sm truncate">
                            {activeSpotlight.name || activeSpotlight.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Compact Details & Action Buttons */}
                    <div className="p-4 sm:p-5 sm:w-1/2 flex flex-col justify-between space-y-3 w-full min-w-0 max-w-full bg-slate-50/50 min-h-[220px]">
                      <div>
                        <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-brand-600 uppercase tracking-widest font-display mb-0.5">
                          <Sparkles className="w-3 h-3" />
                          <span>Active Live Preview ({safeSpotlightIndex + 1}/{spotlightList.length})</span>
                        </div>

                        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 font-display tracking-tight leading-snug truncate">
                          {activeSpotlight.name || activeSpotlight.title}
                        </h4>

                        <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2 min-h-[32px]">
                          {activeSpotlight.description || activeSpotlight.tagline || 'High-converting customizable business template.'}
                        </p>

                        {/* Compact Metadata Badges */}
                        <div className="mt-2.5 flex flex-wrap gap-1 text-[9px] font-semibold text-slate-600">
                          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 shadow-soft-sm">
                            {activeSpotlight.fontFamily || 'sans'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 shadow-soft-sm">
                            {activeSpotlight.bgTheme || 'light'}
                          </span>
                        </div>
                      </div>

                      {/* Compact Functional Action Buttons */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/80 w-full min-w-0 max-w-full">
                        
                        {/* Optional URLs */}
                        <div className="flex flex-wrap items-center gap-1.5 w-full min-w-0 max-w-full">
                          {activeSpotlight.previewUrl ? (
                            <a
                              href={activeSpotlight.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold text-[11px] border border-slate-200 shadow-soft-sm flex items-center justify-center space-x-1 transition-colors"
                            >
                              <Eye className="w-3 h-3 text-brand-600 flex-shrink-0" />
                              <span className="truncate">Preview Link</span>
                            </a>
                          ) : (
                            <button
                              onClick={() => setPreviewModalTemplate(activeSpotlight)}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold text-[11px] border border-slate-200 shadow-soft-sm flex items-center justify-center space-x-1 transition-colors"
                            >
                              <Eye className="w-3 h-3 text-brand-600 flex-shrink-0" />
                              <span className="truncate">Preview</span>
                            </button>
                          )}

                          {activeSpotlight.demoUrl && (
                            <a
                              href={activeSpotlight.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-[11px] border border-sky-200 flex items-center justify-center space-x-1 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">Demo</span>
                            </a>
                          )}

                          {activeSpotlight.liveUrl && (
                            <a
                              href={activeSpotlight.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200 flex items-center justify-center space-x-1 transition-colors"
                            >
                              <Globe className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">Live Site</span>
                            </a>
                          )}
                        </div>

                        {/* Primary Use Template / Customize Button */}
                        <button
                          onClick={() => handleUseTemplate(activeSpotlight)}
                          className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300 fill-current flex-shrink-0" />
                          <span className="truncate">Use Template ({activeSpotlight.name || activeSpotlight.title})</span>
                          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls Bar: Chevrons & Pagination Indicators */}
              {spotlightList.length > 1 && (
                <div className="mt-3 flex items-center justify-between px-1 text-slate-500">
                  <button
                    onClick={handlePrevSpotlight}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                    title="Previous Template"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Pagination Dots */}
                  <div className="flex items-center space-x-1.5">
                    {spotlightList.map((t, idx) => (
                      <button
                        key={t.id || t._id || idx}
                        onClick={() => handleManualSelect(idx)}
                        className={`transition-all duration-300 rounded-full ${
                          safeSpotlightIndex === idx
                            ? 'w-5 h-1.5 bg-brand-600'
                            : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                        }`}
                        title={`Go to template: ${t.name || t.title}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextSpotlight}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                    title="Next Template"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

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

      {/* 9. READY TO BUILD CTA SECTION */}
      <section className="py-20 md:py-28 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800 w-full min-w-0 max-w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[600px] h-[300px] bg-gradient-to-r from-brand-600/30 to-amber-500/20 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full min-w-0 max-w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-3xl mx-auto w-full min-w-0 max-w-full"
          >
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-widest font-display">
              Instant Website Builder
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold mt-6 leading-tight font-display">
              Ready to Build Your Website in Minutes?
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of business owners creating stunning, high-converting landing pages with zero code.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full min-w-0 max-w-full">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/40 transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Start Free Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. FOOTER SECTION */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12 w-full min-w-0 max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0 max-w-full">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 w-full min-w-0 max-w-full">
            
            {/* Brand Column */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <span className="text-2xl font-bold font-display tracking-tight">Nexora</span>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                The human-crafted SaaS website builder. Build, edit, and publish business websites using tailored templates with multi-image slots.
              </p>

              {/* Newsletter Form */}
              <form onSubmit={handleNewsletterSubmit} className="mt-6 max-w-sm">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-display">
                  Subscribe to Product Updates
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your work email"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow flex-shrink-0 flex items-center space-x-1"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {newsletterSuccess && (
                  <p className="mt-2 text-xs text-emerald-400 font-semibold">Thank you for subscribing!</p>
                )}
              </form>

              {/* Social Icons */}
              <div className="mt-6 flex items-center space-x-4 text-slate-400">
                <a href="#twitter" className="hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
                <a href="#github" className="hover:text-white transition-colors" aria-label="GitHub"><Github className="w-4 h-4" /></a>
                <a href="#linkedin" className="hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>
                <a href="#discord" className="hover:text-white transition-colors" aria-label="Discord"><Discord className="w-4 h-4" /></a>
              </div>
            </div>

            {/* Column 2: Templates */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-display">Templates</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={onExploreCatalog} className="hover:text-white transition-colors">E-Commerce Store</button></li>
                <li><button onClick={onExploreCatalog} className="hover:text-white transition-colors">Gym & Fitness</button></li>
                <li><button onClick={onExploreCatalog} className="hover:text-white transition-colors">Restaurant & Cafe</button></li>
                <li><button onClick={onExploreCatalog} className="hover:text-white transition-colors">Law & Legal Counsel</button></li>
                <li><button onClick={onExploreCatalog} className="hover:text-white transition-colors">Real Estate & Villas</button></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-display">Resources</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><a href="#documentation" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#help" className="hover:text-white transition-colors">Support Center</a></li>
                <li><a href="#api" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#status" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>

            {/* Column 4: Legal & Tech */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-display">Company</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security Overview</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 w-full min-w-0 max-w-full">
            <p>© 2026 Nexora Platform Inc. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms</span>
              <span className="hover:text-slate-400 cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </footer>

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
