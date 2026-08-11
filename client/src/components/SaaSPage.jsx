import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Zap, LayoutGrid, CheckCircle2, ArrowRight, Shield, 
  Smartphone, Monitor, Palette, Type, Code, Download, Globe, 
  ChevronRight, Star, Heart, Flame, Eye, Layers, Check, Rocket,
  HelpCircle, ChevronDown, MessageSquare, ShieldCheck, Clock, Award,
  Send, Twitter, Github, Linkedin, Disc as Discord, Lock, UserCheck
} from 'lucide-react';
import { TEMPLATE_CATEGORIES } from '../data/templatesData';

export default function SaaSPage({ templates = [], onSelectTemplate, onExploreCatalog, user = null, onOpenAuth }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const filteredTemplates = templates.filter(t => 
    activeCategory === 'All' ? true : t.category.toLowerCase() === activeCategory.toLowerCase()
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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-600 selection:text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40 border-b border-slate-200/80 bg-grid-light">
        
        {/* Ambient Radial Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] h-[500px] bg-gradient-to-tr from-brand-100/50 via-indigo-100/40 to-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none overflow-hidden" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Hero Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.08] font-display"
          >
            Build & Customize High-Converting <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 bg-clip-text text-transparent animate-pulse">
              Business websites In Minutes
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans"
          >
            Choose from <strong className="text-slate-900 font-bold">30 tailored templates</strong> spanning E-Commerce, Gyms, Law Firms, Restaurants, Real Estate, SaaS, and Services. Edit logos, 3 business images, fonts, colors, and content live.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onExploreCatalog}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 transition-all duration-200 flex items-center justify-center space-x-3 group"
            >
              <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Explore 30 Templates</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#demo-showcase"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300/80 shadow-soft-sm transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Eye className="w-5 h-5 text-brand-600" />
              <span>Watch Live Demo</span>
            </motion.a>
          </motion.div>

          {/* STATS SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-20 pt-10 border-t border-slate-200/70 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            <motion.div 
              whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
              className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-soft-sm transition-all duration-300"
            >
              <p className="text-4xl font-extrabold text-slate-900 font-display tracking-tight">30+</p>
              <p className="text-xs font-semibold text-slate-600 mt-2">Pre-built Presets</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
              className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-soft-sm transition-all duration-300"
            >
              <p className="text-4xl font-extrabold text-slate-900 font-display tracking-tight">3 Images</p>
              <p className="text-xs font-semibold text-slate-600 mt-2">Per Template</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
              className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-soft-sm transition-all duration-300"
            >
              <p className="text-4xl font-extrabold text-slate-900 font-display tracking-tight">&lt; 3 min</p>
              <p className="text-xs font-semibold text-slate-600 mt-2">Average Build Time</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
              className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-soft-sm transition-all duration-300"
            >
              <p className="text-4xl font-extrabold text-slate-900 font-display tracking-tight">1-Click</p>
              <p className="text-xs font-semibold text-slate-600 mt-2">HTML Code Export</p>
            </motion.div>
          </motion.div>

          {/* LIVE PREVIEW SECTION (HERO PRODUCT SHOWCASE) */}
          <motion.div 
            id="demo-showcase" 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="rounded-3xl border border-slate-300/80 bg-white/90 backdrop-blur-xl shadow-2xl p-3 sm:p-4 relative">
              
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between gap-2 px-2.5 sm:px-4 py-2 sm:py-3 bg-slate-100/90 rounded-2xl mb-3 border border-slate-200/80 max-w-full overflow-hidden">
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl bg-white text-[10px] sm:text-xs font-mono text-slate-600 border border-slate-300/80 flex items-center space-x-1.5 shadow-soft-sm max-w-[60%] sm:max-w-none overflow-hidden min-w-0">
                  <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-600 flex-shrink-0" />
                  <span className="truncate min-w-0 block">https://nexora.app/editor/live-preview</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs font-semibold flex-shrink-0">
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center space-x-1 sm:space-x-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
                    <span className="hidden xs:inline">Live Editor Sync</span>
                    <span className="xs:hidden">Sync</span>
                  </span>
                </div>
              </div>

              {/* Demo Hero Content */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 text-white p-8 md:p-12 text-left relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center font-extrabold text-sm font-display shadow-md">V</div>
                    <span className="font-extrabold text-lg tracking-tight font-display">VoltTech Store</span>
                  </div>
                  <div className="hidden sm:flex space-x-6 text-xs font-semibold text-slate-300">
                    <span>Products</span>
                    <span>Reviews</span>
                    <span>About Us</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-widest">
                      Live Customizer Active
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold mt-4 leading-tight font-display">
                      Next-Gen Wireless Essentials Built For Tomorrow
                    </h2>
                    <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
                      Edit headlines, swap 3 business images, pick brand colors, and add product tiers instantly in real time.
                    </p>
                    <div className="mt-6 flex items-center space-x-3">
                      <button className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md">
                        Shop Wireless Hub
                      </button>
                      <button className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700">
                        View Specs
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold pb-2 border-b border-slate-700">
                      <span>Multi-Image Controls</span>
                      <span className="text-emerald-400 font-bold">● Active Sync</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-xl text-xs">
                        <span className="text-slate-300 font-medium">Image 1: Hero Banner</span>
                        <span className="text-brand-400 font-bold">Active</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-xl text-xs">
                        <span className="text-slate-300 font-medium">Image 2: Brand Story</span>
                        <span className="text-brand-400 font-bold">Active</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-xl text-xs">
                        <span className="text-slate-300 font-medium">Image 3: Gallery Feature</span>
                        <span className="text-brand-400 font-bold">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. TRUSTED BY SECTION (NEW) */}
      <section className="py-14 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-8 font-display">
            Trusted By 4,000+ Businesses Across Global Industries
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-75 grayscale hover:grayscale-0 transition-all duration-500 text-slate-700 font-extrabold text-sm sm:text-base tracking-wider font-display">
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm hover:border-slate-300">STARTUPS</div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm hover:border-slate-300">AGENCIES</div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm hover:border-slate-300">RESTAURANTS</div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm hover:border-slate-300">LAW FIRMS</div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm hover:border-slate-300 col-span-2 md:col-span-1">FITNESS GYMS</div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION (NEW) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
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

        <div className="mt-16 grid md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-md hover:shadow-card-hover transition-all duration-300 relative"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 font-extrabold text-lg flex items-center justify-center mb-6 shadow-soft-sm font-display">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Choose Template</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Select from 30 handcrafted presets designed for E-Commerce, Gyms, Restaurants, Law Firms, Real Estate, and Services.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-md hover:shadow-card-hover transition-all duration-300 relative"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 font-extrabold text-lg flex items-center justify-center mb-6 shadow-soft-sm font-display">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Customize 3 Images & Text</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Edit headlines, brand logos, typography, colors, and upload 3 distinct business images for Hero, Story, and Product features.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-md hover:shadow-card-hover transition-all duration-300 relative"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 font-extrabold text-lg flex items-center justify-center mb-6 shadow-soft-sm font-display">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Publish & Export</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Publish your website to a live URL instantly or download 1-click clean HTML/CSS code for self-hosting.
            </p>
          </motion.div>

        </div>
      </section>

      {/* 4. TEMPLATES CATALOG SHOWCASE SECTION */}
      <section className="py-20 md:py-28 bg-slate-50/50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {!user ? (
            /* LOGGED-OUT AUTHENTICATION CTA CARD */
            <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl border border-slate-800">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[600px] h-[300px] bg-gradient-to-r from-brand-600/30 to-amber-500/20 blur-3xl pointer-events-none overflow-hidden" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <Lock className="w-7 h-7" />
                </div>
                
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-widest font-display">
                  Authentication Required
                </span>
                
                <h2 className="text-2xl sm:text-4xl font-extrabold mt-5 font-display text-white tracking-tight">
                  Sign In to Explore Nexora Templates
                </h2>
                
                <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Create a free account or sign in to unlock our catalog of 30+ responsive industry templates, live visual studio editor, and instant website publishing.
                </p>
                
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={onOpenAuth}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-600/30 transition-transform active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Sign In / Create Free Account</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* LOGGED-IN TEMPLATES CATALOG SHOWCASE */
            <>
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-xs uppercase tracking-widest font-extrabold text-brand-600 font-display">
                  30 Handcrafted Industry Presets
                </span>
                <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
                  Tailored For Every Business Industry & Purpose
                </h2>
                <p className="mt-4 text-base sm:text-lg text-slate-600">
                  Pick from 30 tailored business templates and customize text, 3 business images, typography, colors, logos, and layout in real-time.
                </p>
              </div>

              {/* Category Tabs */}
              <div className="mt-10 flex items-center justify-center gap-2 overflow-x-auto pb-4 scrollbar-none">
                {TEMPLATE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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
              <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredTemplates.slice(0, 6).map((tpl) => (
                  <motion.div 
                    key={tpl.id}
                    whileHover={{ y: -6 }}
                    className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-soft-md hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Header Preview Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                        <img 
                          src={tpl.image} 
                          alt={tpl.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        />
                        
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
                            <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Preset #{tpl.id}</span>
                            <h3 className="text-xl font-bold text-white font-display leading-tight drop-shadow-sm">
                              {tpl.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-6">
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {tpl.tagline}
                        </p>
                        
                        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                            Font: {tpl.fontFamily}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                            3 Image Slots
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="px-6 pb-6 pt-2">
                      <button
                        onClick={() => onSelectTemplate(tpl)}
                        className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs shadow transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-md"
                      >
                        <span>Edit This Preset</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* View All Button */}
              <div className="mt-12 text-center">
                <button
                  onClick={onExploreCatalog}
                  className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-300 shadow-soft-sm transition-all duration-200"
                >
                  <LayoutGrid className="w-5 h-5 text-brand-600" />
                  <span>Browse All 30 Business Presets</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

        </div>
      </section>

      {/* 5. KEY FEATURES SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
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

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-card-hover transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mb-6 shadow-sm">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              3 Business Image Customization
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Add and edit 3 distinct business images (Hero, Brand Story, Product Showcase) per website with 1-click stock presets or custom web URLs.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-card-hover transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-6 shadow-sm">
              <Type className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Typography Control
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Switch font pairings between Plus Jakarta Sans, Outfit, Editorial Playfair Display Serif, and Inter.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-card-hover transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Responsive Viewport Switching
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Preview how your customized website looks on Desktop monitors, Tablet screens, and Mobile smartphones as you edit.
            </p>
          </motion.div>

        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION (NEW) */}
      <section className="py-24 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 font-display">
              Real Customer Stories
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold text-slate-900 font-display">
              Loved By Founders & Business Owners
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Here is what founders say after building their business websites with Nexora.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans italic">
                  "Nexora allowed us to launch our boutique gym landing page in under 20 minutes. Being able to customize 3 separate images for our floor, coaches, and pricing was seamless."
                </p>
              </div>

              <div className="mt-6 flex items-center space-x-3 pt-4 border-t border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" 
                  alt="Sarah Jenkins" 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-display">Sarah Jenkins</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Founder • PulseFit Gym</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans italic">
                  "The clean white UI and Google Font pairings make every template look human-crafted. Exporting clean HTML code took just one click for our developer."
                </p>
              </div>

              <div className="mt-6 flex items-center space-x-3 pt-4 border-t border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" 
                  alt="Marcus Vance" 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-display">Marcus Vance</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Managing Director • VoltTech</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans italic">
                  "As a law firm partner, I needed a sophisticated website that projected trust. The legal template surpassed our expectations in every single way."
                </p>
              </div>

              <div className="mt-6 flex items-center space-x-3 pt-4 border-t border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" 
                  alt="Elena Rostova" 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-display">Elena Rostova</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Partner • Vanguard Counsel</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION (NEW) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 font-display">
            Transparent Pricing Plans
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold text-slate-900 font-display">
            Simple Plans For Growing Businesses
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Start completely free or unlock unlimited websites and custom domain publishing.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-8 inline-flex items-center space-x-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 items-stretch">
          
          {/* Starter Plan */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Starter</h3>
              <p className="text-xs text-slate-500 mt-1">Perfect for trying out Nexora builder.</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900 font-display">$0</span>
                <span className="text-xs text-slate-500 font-semibold ml-1">/ forever free</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-slate-600">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>1 Custom Website Project</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Access to All 30 Presets</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>3 Image Customization Slots</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>1-Click Clean HTML Code Export</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onExploreCatalog}
              className="mt-8 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-colors"
            >
              Start Building Free
            </button>
          </motion.div>

          {/* Pro Plan (HIGHLIGHTED) */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="p-8 rounded-3xl bg-slate-900 text-white border-2 border-brand-500 shadow-2xl relative flex flex-col justify-between transform md:-translate-y-2"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-600 to-amber-500 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md">
              Most Popular Choice
            </div>

            <div>
              <h3 className="text-xl font-bold font-display">Pro Plan</h3>
              <p className="text-xs text-slate-400 mt-1">For growing businesses & agencies.</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white font-display">
                  {billingCycle === 'yearly' ? '$23' : '$29'}
                </span>
                <span className="text-xs text-slate-400 font-semibold ml-1">/ month</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Unlimited Website Projects</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>All 30 Industry Presets</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>3 Image Customization Engine</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Custom Domain Publishing</span>
                </li>
                {user?.role === 'admin' && (
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-brand-400" />
                    <span>Admin Theme Manager Access</span>
                  </li>
                )}
              </ul>
            </div>

            <button
              onClick={onExploreCatalog}
              className="mt-8 w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg transition-colors"
            >
              Get Started With Pro
            </button>
          </motion.div>

          {/* Business Plan */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Business</h3>
              <p className="text-xs text-slate-500 mt-1">For scale teams & high volume.</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900 font-display">
                  {billingCycle === 'yearly' ? '$63' : '$79'}
                </span>
                <span className="text-xs text-slate-500 font-semibold ml-1">/ month</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-slate-600">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Everything in Pro Plan</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Team Member Seats (5 Users)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Priority 24/7 SLA Support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>White-Label Branding Option</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onExploreCatalog}
              className="mt-8 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-colors"
            >
              Contact Sales
            </button>
          </motion.div>

        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION (NEW) */}
      <section className="py-24 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 font-display">
              Frequently Asked Questions
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold text-slate-900 font-display">
              Got Questions? We Have Answers.
            </h2>
          </div>

          <div className="mt-14 space-y-4">
            {[
              { q: "Can I customize the 3 images in every template?", a: "Yes! Every single template features dedicated controls to swap 3 separate business images (Hero Banner, Brand Story, Product Showcase) using custom web image URLs or 1-click stock presets." },
              { q: "Do I need coding knowledge to build a website?", a: "Zero code required. Nexora's live visual editor allows you to edit text, brand logos, color themes, font pairings, and images effortlessly." },
              { q: "Can I export the clean HTML & CSS code?", a: "Absolutely. With 1 click, you can download the clean production HTML & Tailwind CSS code to host anywhere." },
              { q: "How many business templates are included?", a: "Nexora features 30 handcrafted templates across 9 major industries including E-Commerce, Gyms, Law Firms, Restaurants, Real Estate, SaaS, and Services." },
              { q: "Is MongoDB database synchronization supported?", a: "Yes. Nexora is fully integrated with a Node.js Express backend and MongoDB database to safely store user accounts, customized website projects, and admin themes." }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-slate-200/90 shadow-soft-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base font-display focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    openFaq === idx ? 'rotate-180 text-brand-600' : ''
                  }`} />
                </button>

                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION HERO SECTION (NEW) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl border border-slate-800">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[600px] h-[300px] bg-gradient-to-r from-brand-600/30 to-amber-500/20 blur-3xl pointer-events-none overflow-hidden" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-3xl mx-auto"
          >
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-widest">
              Instant Website Builder
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold mt-6 leading-tight font-display">
              Ready to Build Your Website in Minutes?
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of business owners creating stunning, high-converting landing pages with zero code.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={onExploreCatalog}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/40 transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Start Free Now</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
              >
                Watch 2-Min Demo
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 10. FOOTER SECTION */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <span className="text-2xl font-bold font-display tracking-tight">Nexora</span>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                The human-crafted SaaS website builder. Build, edit, and publish business websites using 30 tailored templates with 3 image slots.
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

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© 2026 Nexora Platform Inc. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms</span>
              <span className="hover:text-slate-400 cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
