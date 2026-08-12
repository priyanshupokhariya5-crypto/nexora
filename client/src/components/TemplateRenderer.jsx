import React, { useState, useEffect } from 'react';
import { 
  Zap, ShieldCheck, Leaf, Clock, Award, Flame, TrendingUp, Briefcase, 
  Cpu, Sprout, GlassWater, Key, Eye, Shield, Palette, Sparkles, Globe, 
  GitBranch, Lock, Layers, Grid, Code, Heart, Cookie, Sun, Smile, 
  CreditCard, Scale, FileText, Camera, Film, Mic, Trophy, CheckCircle, 
  Wrench, DollarSign, Volume2, Coffee, Check, Mail, Phone, MapPin, ArrowRight,
  Star, MessageSquare, Send, Quote, Sparkle
} from 'lucide-react';
import { getApiUrl } from '../api';

  // Defensive helper function to safely extract & resolve string image URL from strings or objects
  const getImageUrl = (imgData, fallback = '') => {
    if (!imgData) return fallback;
    let rawUrl = fallback;
    if (typeof imgData === 'string') rawUrl = imgData;
    else if (typeof imgData === 'object') {
      rawUrl = imgData.src || imgData.url || imgData.imageUrl || fallback;
    }
    if (!rawUrl) return fallback;

    if (typeof rawUrl === 'string' && rawUrl.startsWith('/uploads/')) {
      return getApiUrl(rawUrl);
    }
    return rawUrl;
  };

const ICON_MAP = {
  Zap, ShieldCheck, Leaf, Clock, Award, Flame, TrendingUp, Briefcase, 
  Cpu, Sprout, GlassWater, Key, Eye, Shield, Palette, Sparkles, Globe, 
  GitBranch, Lock, Layers, Grid, Code, Heart, Cookie, Sun, Smile, 
  CreditCard, Scale, FileText, Camera, Film, Mic, Trophy, CheckCircle, 
  Wrench, DollarSign, Volume2, Coffee, Check, Mail, Phone, MapPin
};

export default function TemplateRenderer({ 
  template, 
  customData = {}, 
  accentColor: customAccent, 
  fontFamily: customFont, 
  bgTheme: customBg, 
  viewportMode = 'desktop',
  activePath = '/',
  onNavigate = null,
  baseRoute = '',
  isEditMode = false,
  onUpdateContent = null,
  onTriggerImageUpload = null,
  onSectionMove = null,
  onSectionDuplicate = null,
  onSectionDelete = null
}) {
  const [formSent, setFormSent] = useState(false);
  const [internalPath, setInternalPath] = useState(activePath || '/');

  useEffect(() => {
    if (activePath) {
      setInternalPath(activePath);
    }
  }, [activePath]);

  // Sync internalPath with browser Back & Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const fullPath = window.location.pathname;
      if (baseRoute && fullPath.startsWith(baseRoute)) {
        const sub = fullPath.replace(baseRoute, '') || '/';
        setInternalPath(sub);
      } else {
        setInternalPath(fullPath || '/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [baseRoute]);

  if (!template) return null;

  // Merge template defaultData with custom user edits
  const data = {
    ...template.defaultData,
    ...customData
  };

  const accentColor = customData.accentColor || customAccent || template.accentColor || '#2551e8';
  const fontFamily = customData.fontFamily || customFont || template.fontFamily || 'sans';
  const bgTheme = customData.bgTheme || customBg || template.bgTheme || 'light';
  const sectionsOrder = customData.sectionsOrder || data.sectionsOrder || template.sectionsOrder || ['hero', 'features', 'about', 'services', 'pricing', 'testimonials', 'contact'];

  // Multi-Layout Variants System
  const heroStyle = customData.heroStyle || data.heroStyle || template.heroStyle || 'split-arched';
  const featuresStyle = customData.featuresStyle || data.featuresStyle || template.featuresStyle || 'card-grid';
  const aboutStyle = customData.aboutStyle || data.aboutStyle || template.aboutStyle || 'split-image-left';
  const servicesStyle = customData.servicesStyle || data.servicesStyle || template.servicesStyle || 'grid-cards';

  // 3 Distinct Business Images
  const heroImage = customData.heroImageUrl || data.heroImageUrl || template.image;
  const aboutImage = customData.aboutImageUrl || data.aboutImageUrl || template.image;
  const galleryImage = customData.galleryImageUrl || data.galleryImageUrl || template.image;
  const logoImage = customData.logoImageUrl || data.logoImageUrl || data.logoUrl;

  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    display: 'font-display',
    mono: 'font-mono'
  }[fontFamily] || 'font-sans';

  const isDark = bgTheme === 'dark';

  const defaultNavLinks = data.navLinks || [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: data.servicesTitle ? data.servicesTitle.split(' ')[0] : 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' }
  ];

  const renderIcon = (iconName) => {
    const IconComp = ICON_MAP[iconName] || Sparkles;
    return <IconComp className="w-5 h-5" />;
  };

  // Helper Component: Inline Canvas Text Editor
  const EditableText = ({ 
    fieldKey, 
    value, 
    tagName: Tag = 'span', 
    className = '', 
    style = {}, 
    multiline = false,
    placeholder = 'Click to edit text...'
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value || '');

    useEffect(() => {
      setLocalValue(value || '');
    }, [value]);

    if (!isEditMode) {
      return <Tag className={className} style={style}>{value}</Tag>;
    }

    const handleBlur = () => {
      setIsEditing(false);
      if (onUpdateContent && localValue !== value) {
        onUpdateContent(fieldKey, localValue);
      }
    };

    const handleKeyDown = (e) => {
      if (!multiline && e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
      }
    };

    if (isEditing) {
      if (multiline) {
        return (
          <textarea
            autoFocus
            rows={3}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            className={`w-full p-2 bg-slate-900/90 text-white rounded-xl border-2 border-brand-500 font-inherit text-inherit leading-inherit focus:outline-none shadow-xl ${className}`}
            style={style}
          />
        );
      }
      return (
        <input
          autoFocus
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full p-1 bg-slate-900/90 text-white rounded-lg border-2 border-brand-500 font-inherit text-inherit leading-inherit focus:outline-none shadow-xl ${className}`}
          style={style}
        />
      );
    }

    return (
      <Tag
        onClick={() => setIsEditing(true)}
        className={`relative group/txt inline-block hover:ring-2 hover:ring-brand-500/80 hover:bg-brand-500/10 rounded-lg px-1 -mx-1 transition-all cursor-pointer ${className}`}
        style={style}
        title="Click to edit text directly on canvas"
      >
        <span>{value || placeholder}</span>
        <span className="opacity-0 group-hover/txt:opacity-100 absolute -top-3 -right-2 bg-brand-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-lg pointer-events-none z-30 transition-opacity flex items-center space-x-0.5">
          <span>✎ Edit</span>
        </span>
      </Tag>
    );
  };

  // Defensive helper function to safely extract & resolve string image URL from strings or objects
  const getImageUrl = (imgData, fallback = '') => {
    if (!imgData) return fallback;
    let rawUrl = fallback;
    if (typeof imgData === 'string') rawUrl = imgData;
    else if (typeof imgData === 'object') {
      rawUrl = imgData.src || imgData.url || imgData.imageUrl || fallback;
    }
    if (!rawUrl) return fallback;

    if (typeof rawUrl === 'string' && rawUrl.startsWith('/uploads/')) {
      return getApiUrl(rawUrl);
    }
    return rawUrl;
  };

  // Helper Component: Inline Canvas Image Editor with Role-Based Responsive Sizing & Position Controls
  const EditableImage = ({ 
    slotKey = '', 
    src, 
    alt = '', 
    className = '', 
    style = {},
    fitMode = 'auto'
  }) => {
    const safeSlotKey = typeof slotKey === 'string' ? slotKey : '';
    const rawSrc = (safeSlotKey && customData?.[safeSlotKey]) || src || template?.image || '';
    const currentSrc = getImageUrl(rawSrc, template?.image || '');
    const userFitMode = (safeSlotKey && customData?.[`${safeSlotKey}_fitMode`]) || fitMode;
    const userPosition = (safeSlotKey && customData?.[`${safeSlotKey}_position`]) || 'center';
    const userAlt = (safeSlotKey && customData?.[`${safeSlotKey}_alt`]) || (typeof alt === 'string' ? alt : '');
    const userWidth = (safeSlotKey && customData?.[`${safeSlotKey}_width`]);
    const userHeight = (safeSlotKey && customData?.[`${safeSlotKey}_height`]);
    const userAlign = (safeSlotKey && customData?.[`${safeSlotKey}_align`]) || 'center';

    let fitClass = 'object-contain';
    if (userFitMode === 'cover') {
      fitClass = 'object-cover';
    } else if (userFitMode === 'fill') {
      fitClass = 'object-fill';
    } else if (userFitMode === 'contain') {
      fitClass = 'object-contain';
    } else {
      if (safeSlotKey && (safeSlotKey.includes('logo') || safeSlotKey.includes('about') || safeSlotKey.includes('gallery'))) {
        fitClass = 'object-contain';
      } else {
        fitClass = 'object-cover sm:object-contain';
      }
    }

    let positionClass = 'object-center';
    if (userPosition === 'top') positionClass = 'object-top';
    else if (userPosition === 'bottom') positionClass = 'object-bottom';
    else if (userPosition === 'left') positionClass = 'object-left';
    else if (userPosition === 'right') positionClass = 'object-right';

    let alignClass = 'justify-center text-center';
    if (userAlign === 'left') alignClass = 'justify-start text-left';
    else if (userAlign === 'right') alignClass = 'justify-end text-right';

    const customDimensionStyle = {
      ...style,
      width: userWidth ? `${userWidth}px` : (style.width || undefined),
      height: userHeight ? `${userHeight}px` : (style.height || undefined),
      maxWidth: '100%'
    };

    const responsiveImgClass = `max-w-full ${userWidth ? '' : 'w-full'} ${userHeight ? '' : 'h-auto'} min-w-0 ${fitClass} ${positionClass} ${className}`;

    if (!isEditMode) {
      return (
        <div className={`w-full flex items-center ${alignClass}`}>
          <img src={currentSrc} alt={userAlt} className={responsiveImgClass} style={customDimensionStyle} loading="lazy" />
        </div>
      );
    }

    const handleClick = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (onTriggerImageUpload && safeSlotKey) {
        onTriggerImageUpload(safeSlotKey);
      }
    };

    return (
      <div className={`w-full flex items-center ${alignClass}`}>
        <div 
          onClick={handleClick}
          className="relative group/img cursor-pointer max-w-full min-w-0 flex items-center justify-center overflow-hidden rounded-inherit"
          style={customDimensionStyle}
          title="Click to edit/replace image"
        >
          <img src={currentSrc} alt={userAlt} className={`${responsiveImgClass} transition-opacity group-hover/img:opacity-85`} style={customDimensionStyle} />
          <div className="opacity-0 group-hover/img:opacity-100 absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center transition-opacity z-20 rounded-inherit">
            <span className="px-3 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-lg flex items-center space-x-1.5 pointer-events-none">
              <span>📷 Edit / Replace Image</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Helper Component: Section Hover Toolbar
  const SectionToolbar = ({ index, title }) => {
    if (!isEditMode) return null;
    return (
      <div className="opacity-0 group-hover/sec:opacity-100 absolute top-2 right-4 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1 text-white flex items-center space-x-1 shadow-2xl transition-opacity">
        <span className="text-[10px] font-extrabold uppercase text-slate-400 px-2 truncate max-w-[100px]">{title}</span>
        <button onClick={() => onSectionMove && onSectionMove(index, 'up')} disabled={index === 0} className="p-1 hover:bg-slate-800 rounded text-slate-300 disabled:opacity-30" title="Move Up">
          ↑
        </button>
        <button onClick={() => onSectionMove && onSectionMove(index, 'down')} className="p-1 hover:bg-slate-800 rounded text-slate-300" title="Move Down">
          ↓
        </button>
        <button onClick={() => onSectionDuplicate && onSectionDuplicate(index)} className="p-1 hover:bg-slate-800 rounded text-slate-300" title="Duplicate Section">
          📋
        </button>
        <button onClick={() => onSectionDelete && onSectionDelete(index)} className="p-1 hover:bg-red-500/20 rounded text-red-400" title="Delete Section">
          🗑
        </button>
      </div>
    );
  };

  const viewportStyles = {
    desktop: 'w-full max-w-full',
    tablet: 'max-w-[768px] mx-auto border-x border-slate-300 shadow-2xl rounded-2xl overflow-hidden my-4',
    mobile: 'w-full max-w-full sm:max-w-[390px] mx-auto overflow-hidden',
    full: 'w-full max-w-full'
  }[viewportMode] || 'w-full max-w-full';

  // Path Navigation Handler
  const handleLinkClick = (e, targetHref) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!targetHref) return;

    let cleanSubPath = targetHref;
    if (cleanSubPath.startsWith('#')) {
      cleanSubPath = '/' + cleanSubPath.replace('#', '');
    }
    if (!cleanSubPath.startsWith('/')) {
      cleanSubPath = '/' + cleanSubPath;
    }

    setInternalPath(cleanSubPath);

    const fullUrl = baseRoute ? `${baseRoute}${cleanSubPath === '/' ? '' : cleanSubPath}` : cleanSubPath;
    if (window.location.pathname !== fullUrl) {
      window.history.pushState(null, '', fullUrl);
    }

    if (onNavigate) {
      onNavigate(cleanSubPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine current active page view
  const rawSub = internalPath.replace(/^\/+/, '').toLowerCase();
  let currentRoute = 'home';
  if (rawSub === '' || rawSub === 'home') {
    currentRoute = 'home';
  } else if (['about', 'story', 'firm', 'sanctuary', 'studio', 'philosophy'].includes(rawSub)) {
    currentRoute = 'about';
  } else if (['services', 'menu', 'products', 'properties', 'portfolio', 'expeditions', 'suites', 'treatments', 'bakes', 'rituals', 'collection', 'cases', 'essentials', 'shoots'].includes(rawSub)) {
    currentRoute = 'services';
  } else if (['features', 'why-us', 'process', 'trainers', 'results', 'capabilities', 'standards', 'craft', 'ethos', 'tech', 'amenities'].includes(rawSub)) {
    currentRoute = 'features';
  } else if (['testimonials', 'reviews', 'stories', 'feedback'].includes(rawSub)) {
    currentRoute = 'testimonials';
  } else if (['gallery', 'lookbook', 'atmosphere', 'photos'].includes(rawSub)) {
    currentRoute = 'gallery';
  } else if (['contact', 'reservations', 'book', 'inquire', 'audit', 'consultation', 'location', 'reserve'].includes(rawSub)) {
    currentRoute = 'contact';
  } else if (['pricing', 'packages', 'tiers', 'membership'].includes(rawSub)) {
    currentRoute = 'pricing';
  } else {
    currentRoute = 'home';
  }

  return (
    <div className={`transition-all duration-300 ${viewportStyles}`}>
      <div className={`${fontClass} ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'} min-h-screen selection:bg-brand-600 selection:text-white flex flex-col justify-between`}>
        
        <div>
          {/* NAVBAR */}
          <header className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200/80 bg-white/90'} sticky top-0 z-40 backdrop-blur-md`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <a href="#" onClick={(e) => handleLinkClick(e, '/')} className="flex items-center space-x-3 cursor-pointer">
                {logoImage ? (
                  <EditableImage slotKey="logoImageUrl" src={logoImage} alt="Brand Logo" className="h-8 max-w-[150px] object-contain rounded-md" />
                ) : isEditMode ? (
                  <div 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onTriggerImageUpload) onTriggerImageUpload('logoImageUrl');
                    }}
                    className="relative group/logo cursor-pointer flex items-center space-x-2"
                    title="Click to edit or upload Brand Logo"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm font-display text-sm relative overflow-hidden" style={{ backgroundColor: accentColor }}>
                      {(data.logoText || template.title || 'N').charAt(0).toUpperCase()}
                      <div className="opacity-0 group-hover/logo:opacity-100 absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center transition-opacity z-20">
                        <span className="text-[9px] font-extrabold text-white">📷</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-brand-400 opacity-0 group-hover/logo:opacity-100 transition-opacity whitespace-nowrap bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded-md shadow-md">
                      + Upload Logo
                    </span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm font-display text-sm" style={{ backgroundColor: accentColor }}>
                    {(data.logoText || template.title || 'N').charAt(0).toUpperCase()}
                  </div>
                )}
                <EditableText fieldKey="logoText" value={data.logoText || template.title} tagName="span" className="font-extrabold text-lg tracking-tight font-display" />
              </a>

              <nav className="hidden md:flex space-x-6 text-xs font-semibold opacity-90">
                {defaultNavLinks.map((link, idx) => {
                  const isLinkActive = (link.href === '/' && currentRoute === 'home') || (link.href !== '/' && internalPath.toLowerCase().includes(link.href.toLowerCase()));
                  return (
                    <a 
                      key={idx} 
                      href={link.href} 
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={`hover:opacity-100 transition-all ${isLinkActive ? 'font-extrabold border-b-2' : 'opacity-70'}`}
                      style={isLinkActive ? { borderColor: accentColor } : {}}
                    >
                      <EditableText fieldKey={`navLink_${idx}_label`} value={link.label} />
                    </a>
                  );
                })}
              </nav>

              <a 
                href={data.ctaLink || "/contact"} 
                onClick={(e) => handleLinkClick(e, data.ctaLink || "/contact")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow transition-transform active:scale-95 hover:opacity-90 cursor-pointer" 
                style={{ backgroundColor: accentColor }}
              >
                <EditableText fieldKey="ctaText" value={data.ctaText || 'Contact Us'} />
              </a>
            </div>
          </header>

          {/* ========================================== */}
          {/* VIEW ROUTE 1: HOME PAGE (MULTI-SECTION SHOWCASE) */}
          {/* ========================================== */}
          {currentRoute === 'home' && (
            <main>
              {sectionsOrder.map((section, secIdx) => {
                if (section === 'hero') {
                  if (heroStyle === 'cinematic-full') {
                    return (
                      <section key="hero" className="relative group/sec min-h-[520px] md:min-h-[640px] flex items-center justify-center text-white px-4 sm:px-6 overflow-hidden bg-slate-950">
                        <SectionToolbar index={secIdx} title="Hero Section" />
                        <EditableImage slotKey="heroImageUrl" src={heroImage} alt="Hero Cinematic" className="absolute inset-0 w-full h-full object-cover opacity-45" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                        <div className="relative z-10 max-w-4xl mx-auto text-center py-16">
                          <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20 mb-6 text-amber-300">
                            <EditableText fieldKey="heroBadge" value={template.badge || 'Official Site'} />
                          </span>
                          <EditableText fieldKey="heroTitle" value={data.heroTitle || template.defaultData?.heroTitle} tagName="h1" className="text-3xl sm:text-6xl font-extrabold leading-tight font-display tracking-tight text-white block" multiline />
                          <EditableText fieldKey="heroSubtitle" value={data.heroSubtitle || template.defaultData?.heroSubtitle} tagName="p" className="mt-6 text-sm sm:text-lg max-w-2xl mx-auto text-slate-200 leading-relaxed block" multiline />
                          <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <a href={data.ctaLink || '/contact'} onClick={(e) => handleLinkClick(e, data.ctaLink || '/contact')} className="px-8 py-4 rounded-2xl text-white font-bold text-xs shadow-2xl transition-transform hover:-translate-y-0.5" style={{ backgroundColor: accentColor }}>
                              <EditableText fieldKey="ctaText" value={data.ctaText || 'Get Started'} />
                            </a>
                          </div>
                        </div>
                      </section>
                    );
                  }

                  if (heroStyle === 'bento-hero') {
                    return (
                      <section key="hero" className="relative group/sec py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
                        <SectionToolbar index={secIdx} title="Hero Section" />
                        <div className="grid lg:grid-cols-3 gap-6">
                          <div className={`lg:col-span-2 p-8 sm:p-12 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 text-white border-slate-800'} flex flex-col justify-between shadow-2xl relative overflow-hidden`}>
                            <div>
                              <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/10 text-brand-300 border border-white/10 mb-4">
                                <EditableText fieldKey="heroBadge" value={template.badge || 'Platform'} />
                              </span>
                              <EditableText fieldKey="heroTitle" value={data.heroTitle || template.defaultData?.heroTitle} tagName="h1" className="text-3xl sm:text-5xl font-extrabold leading-tight font-display text-white block" multiline />
                              <EditableText fieldKey="heroSubtitle" value={data.heroSubtitle || template.defaultData?.heroSubtitle} tagName="p" className="mt-4 text-sm opacity-80 leading-relaxed text-slate-300 max-w-xl block" multiline />
                            </div>
                            <div className="mt-8 flex flex-wrap gap-4">
                              <a href={data.ctaLink || '/contact'} onClick={(e) => handleLinkClick(e, data.ctaLink || '/contact')} className="px-6 py-3.5 rounded-2xl text-white font-bold text-xs shadow-lg transition-transform hover:-translate-y-0.5" style={{ backgroundColor: accentColor }}>
                                <EditableText fieldKey="ctaText" value={data.ctaText || 'Get Started'} />
                              </a>
                            </div>
                          </div>
                          <div className="space-y-6">
                            <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-slate-900 border border-slate-200/40 relative">
                              <EditableImage slotKey="heroImageUrl" src={heroImage} alt="Hero Bento" className="w-full h-full object-cover" />
                            </div>
                            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm flex items-center justify-between`}>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Proven Results</p>
                                <p className="text-2xl font-extrabold font-display">99.8%</p>
                                <p className="text-xs opacity-75">Client Satisfaction Score</p>
                              </div>
                              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: accentColor }}>
                                <Award className="w-5 h-5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    );
                  }

                  if (heroStyle === 'asymmetric-editorial') {
                    return (
                      <section key="hero" className="relative group/sec py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
                        <SectionToolbar index={secIdx} title="Hero Section" />
                        <div className="border-b border-slate-200/80 pb-12">
                          <span className="text-[11px] font-mono uppercase tracking-widest font-bold opacity-60 block mb-3">
                            — <EditableText fieldKey="heroBadge" value={template.badge || 'Established Studio'} />
                          </span>
                          <EditableText fieldKey="heroTitle" value={data.heroTitle || template.defaultData?.heroTitle} tagName="h1" className="text-3xl sm:text-6xl font-extrabold font-serif max-w-4xl leading-tight block" multiline />
                        </div>
                        <div className="grid md:grid-cols-12 gap-8 pt-8 items-start">
                          <div className="md:col-span-5 space-y-4">
                            <EditableText fieldKey="heroSubtitle" value={data.heroSubtitle || template.defaultData?.heroSubtitle} tagName="p" className="text-sm opacity-80 leading-relaxed font-sans block" multiline />
                            <a href={data.ctaLink || '/contact'} onClick={(e) => handleLinkClick(e, data.ctaLink || '/contact')} className="inline-block px-7 py-3.5 rounded-xl text-white font-bold text-xs shadow-md" style={{ backgroundColor: accentColor }}>
                              <EditableText fieldKey="ctaText" value={data.ctaText || 'Inquire Now'} />
                            </a>
                          </div>
                          <div className="md:col-span-7">
                            <div className="rounded-2xl overflow-hidden aspect-[16/10] shadow-xl bg-slate-900">
                              <EditableImage slotKey="heroImageUrl" src={heroImage} alt="Editorial Hero" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        </div>
                      </section>
                    );
                  }

                  if (heroStyle === 'dark-minimal') {
                    return (
                      <section key="hero" className="relative group/sec py-20 md:py-28 px-4 sm:px-6 bg-slate-950 text-white">
                        <SectionToolbar index={secIdx} title="Hero Section" />
                        <div className="max-w-5xl mx-auto text-center">
                          <span className="px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-slate-900 text-brand-400 border border-slate-800 inline-block mb-6">
                            <EditableText fieldKey="heroBadge" value={template.badge || 'Professional Brand'} />
                          </span>
                          <EditableText fieldKey="heroTitle" value={data.heroTitle || template.defaultData?.heroTitle} tagName="h1" className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-slate-100 block" multiline />
                          <EditableText fieldKey="heroSubtitle" value={data.heroSubtitle || template.defaultData?.heroSubtitle} tagName="p" className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed block" multiline />
                          <div className="mt-10 flex justify-center gap-4">
                            <a href={data.ctaLink || '/contact'} onClick={(e) => handleLinkClick(e, data.ctaLink || '/contact')} className="px-8 py-4 rounded-xl font-bold text-xs text-white shadow-xl transition-transform hover:scale-105" style={{ backgroundColor: accentColor }}>
                              <EditableText fieldKey="ctaText" value={data.ctaText || 'Get In Touch'} />
                            </a>
                          </div>
                        </div>
                      </section>
                    );
                  }

                  if (heroStyle === 'compact-left') {
                    return (
                      <section key="hero" className="relative group/sec py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
                        <SectionToolbar index={secIdx} title="Hero Section" />
                        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 grid md:grid-cols-2 gap-8 items-center">
                          <div>
                            <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white text-slate-800 border border-slate-200 inline-block mb-4">
                              <EditableText fieldKey="heroBadge" value={template.badge || 'Verified Clinic'} />
                            </span>
                            <EditableText fieldKey="heroTitle" value={data.heroTitle || template.defaultData?.heroTitle} tagName="h1" className="text-3xl sm:text-4xl font-extrabold font-display block" multiline />
                            <EditableText fieldKey="heroSubtitle" value={data.heroSubtitle || template.defaultData?.heroSubtitle} tagName="p" className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed block" multiline />
                            <a href={data.ctaLink || '/contact'} onClick={(e) => handleLinkClick(e, data.ctaLink || '/contact')} className="mt-6 inline-block px-6 py-3 rounded-xl text-white font-bold text-xs" style={{ backgroundColor: accentColor }}>
                              <EditableText fieldKey="ctaText" value={data.ctaText || 'Schedule Visit'} />
                            </a>
                          </div>
                          <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg bg-slate-900">
                            <EditableImage slotKey="heroImageUrl" src={heroImage} alt="Compact Hero" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </section>
                    );
                  }

                  // Default Hero: Arched Split
                  return (
                    <section key="hero" className="relative group/sec py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden">
                      <SectionToolbar index={secIdx} title="Hero Section" />
                      <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                          <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-slate-100 text-slate-800 border border-slate-200/80 shadow-xs">
                            <EditableText fieldKey="heroBadge" value={template.badge || 'Official Business Site'} />
                          </span>
                          <EditableText fieldKey="heroTitle" value={data.heroTitle || template.defaultData?.heroTitle} tagName="h1" className="text-3xl sm:text-5xl font-extrabold mt-4 leading-tight font-display tracking-tight block" multiline />
                          <EditableText fieldKey="heroSubtitle" value={data.heroSubtitle || template.defaultData?.heroSubtitle} tagName="p" className="mt-4 text-sm sm:text-base opacity-80 leading-relaxed font-sans block" multiline />
                          <div className="mt-8 flex flex-wrap items-center gap-4">
                            <a 
                              href={data.ctaLink || "/contact"} 
                              onClick={(e) => handleLinkClick(e, data.ctaLink || "/contact")}
                              className="px-8 py-4 rounded-2xl font-bold text-xs text-white shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer" 
                              style={{ backgroundColor: accentColor }}
                            >
                              <EditableText fieldKey="ctaText" value={data.ctaText || 'Get Started Now'} />
                            </a>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative z-10">
                            <EditableImage slotKey="heroImageUrl" src={heroImage} alt="Hero Media" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

                if (section === 'features') {
                  return (
                    <section key="features" className={`relative group/sec py-16 px-4 sm:px-6 ${isDark ? 'bg-slate-900/60' : 'bg-slate-50/70'} border-y border-slate-200/60`}>
                      <SectionToolbar index={secIdx} title="Features Section" />
                      <div className="max-w-6xl mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-10">
                          <EditableText fieldKey="featuresTitle" value={data.featuresTitle || 'Why Choose Us'} tagName="h2" className="text-2xl sm:text-4xl font-extrabold font-display block" />
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {(data.features || []).slice(0, 6).map((feat, fIdx) => (
                            <div key={fIdx} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm`}>
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-sm" style={{ backgroundColor: accentColor }}>
                                {renderIcon(feat.icon)}
                              </div>
                              <EditableText fieldKey={`feature_${fIdx}_title`} value={feat.title} tagName="h3" className="text-base font-bold font-display block" />
                              <EditableText fieldKey={`feature_${fIdx}_desc`} value={feat.desc} tagName="p" className="mt-2 text-xs opacity-75 leading-relaxed block" multiline />
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (section === 'about') {
                  return (
                    <section key="about" className="relative group/sec py-16 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
                      <SectionToolbar index={secIdx} title="About Section" />
                      <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="overflow-hidden shadow-2xl border border-slate-200/50 aspect-[4/3] w-full max-w-md bg-slate-900 rounded-3xl mx-auto">
                          <EditableImage slotKey="aboutImageUrl" src={aboutImage} alt="About Story" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm inline-block mb-3" style={{ backgroundColor: accentColor }}>
                            Our Story
                          </span>
                          <EditableText fieldKey="aboutTitle" value={data.aboutTitle || 'Built With Passion'} tagName="h2" className="text-2xl sm:text-4xl font-extrabold font-display leading-tight block" />
                          <EditableText fieldKey="aboutDesc" value={data.aboutDesc || template.defaultData?.aboutDesc} tagName="p" className="mt-4 text-xs sm:text-sm opacity-80 leading-relaxed font-sans block" multiline />
                          <a href="/about" onClick={(e) => handleLinkClick(e, '/about')} className="mt-6 inline-block text-xs font-bold underline" style={{ color: accentColor }}>
                            Read Full Story &rarr;
                          </a>
                        </div>
                      </div>
                    </section>
                  );
                }

                if (section === 'services') {
                  return (
                    <section key="services" className={`relative group/sec py-16 px-4 sm:px-6 ${isDark ? 'bg-slate-900/60' : 'bg-slate-50/70'} border-y border-slate-200/60`}>
                      <SectionToolbar index={secIdx} title="Services Section" />
                      <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-end mb-10">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Showcase</span>
                            <EditableText fieldKey="servicesTitle" value={data.servicesTitle || 'Featured Offerings'} tagName="h2" className="text-2xl sm:text-4xl font-extrabold font-display mt-1 block" />
                          </div>
                          <a href="/services" onClick={(e) => handleLinkClick(e, '/services')} className="text-xs font-bold underline hidden sm:inline-block">
                            View All Offerings &rarr;
                          </a>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {(data.services || []).slice(0, 6).map((serv, sIdx) => (
                            <div key={sIdx} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm flex flex-col justify-between`}>
                              <div>
                                <div className="flex justify-between items-start mb-3">
                                  <EditableText fieldKey={`service_${sIdx}_title`} value={serv.title} tagName="h3" className="text-base font-bold font-display" />
                                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white flex-shrink-0 ml-2" style={{ backgroundColor: accentColor }}>
                                    <EditableText fieldKey={`service_${sIdx}_price`} value={serv.price} />
                                  </span>
                                </div>
                                <EditableText fieldKey={`service_${sIdx}_desc`} value={serv.desc} tagName="p" className="text-xs opacity-75 leading-relaxed block" multiline />
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center justify-between text-[11px] font-bold opacity-80">
                                <span>{serv.tag || 'Showcase'}</span>
                                <a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="hover:underline flex items-center space-x-1">
                                  <span>Inquire</span>
                                  <ArrowRight className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                if (section === 'testimonials') {
                  return (
                    <section key="testimonials" className="relative group/sec py-16 px-4 sm:px-6 max-w-6xl mx-auto">
                      <SectionToolbar index={secIdx} title="Testimonials Section" />
                      <div className="text-center max-w-2xl mx-auto mb-10">
                        <EditableText fieldKey="testimonialsTitle" value={data.testimonialsTitle || 'Client Feedback'} tagName="h2" className="text-2xl sm:text-4xl font-extrabold font-display block" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {(data.testimonials || []).slice(0, 4).map((item, tIdx) => (
                          <div key={tIdx} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm`}>
                            <div className="flex items-center space-x-1 text-amber-400 mb-3">
                              <Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" />
                            </div>
                            <EditableText fieldKey={`testimonial_${tIdx}_text`} value={item.text} tagName="p" className="text-xs italic opacity-80 leading-relaxed block" multiline />
                            <div className="mt-4 pt-3 border-t border-slate-100/60">
                              <EditableText fieldKey={`testimonial_${tIdx}_name`} value={item.name} tagName="h4" className="text-xs font-bold font-display block" />
                              <EditableText fieldKey={`testimonial_${tIdx}_role`} value={item.role} tagName="p" className="text-[10px] opacity-60 font-medium block" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                }

                // Custom Section / Custom Box / Custom Block Renderer
                if (typeof section === 'object' || (typeof section === 'string' && section.startsWith('custom_'))) {
                  const secObj = typeof section === 'object' ? section : (data.customSections || []).find(s => s.id === section);
                  if (!secObj) return null;

                  const secType = secObj.type || (typeof section === 'string' ? section.split('_')[1] : 'custom');

                  return (
                    <section 
                      key={secObj.id || secIdx} 
                      className="relative group/sec py-16 px-4 sm:px-6 border-y border-slate-200/60 transition-all overflow-hidden" 
                      style={{ backgroundColor: secObj.backgroundColor || (isDark ? '#0f172a' : '#ffffff'), color: secObj.textColor || (isDark ? '#f8fafc' : '#0f172a') }}
                    >
                      <SectionToolbar index={secIdx} title={secObj.title || `${secType.toUpperCase()} Section`} />
                      <div className="max-w-6xl mx-auto">
                        {secObj.title && (
                          <div className="text-center max-w-2xl mx-auto mb-10">
                            <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm inline-block mb-3" style={{ backgroundColor: accentColor }}>
                              {secObj.badge || `${secType.toUpperCase()}`}
                            </span>
                            <EditableText fieldKey={`custom_sec_${secObj.id}_title`} value={secObj.title} tagName="h2" className="text-2xl sm:text-4xl font-extrabold font-display block" />
                            {secObj.subtitle && <EditableText fieldKey={`custom_sec_${secObj.id}_subtitle`} value={secObj.subtitle} tagName="p" className="mt-3 text-xs sm:text-sm opacity-80 leading-relaxed block" multiline />}
                          </div>
                        )}

                        {/* TYPE 1: IMAGE SHOWCASE SECTION */}
                        {secType === 'image' && (
                          <div className="my-6 max-w-4xl mx-auto flex items-center justify-center">
                            <EditableImage 
                              slotKey={`custom_sec_${secObj.id}_image`} 
                              src={secObj.imageUrl || template.image} 
                              alt={secObj.alt || 'Section Image'} 
                              className="rounded-3xl shadow-2xl overflow-hidden max-w-full" 
                            />
                          </div>
                        )}

                        {/* TYPE 2: CONTACT & DIRECT INQUIRY SECTION */}
                        {secType === 'contact' && (
                          <div className="grid lg:grid-cols-2 gap-8 my-6">
                            <div className="space-y-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
                              <h3 className="text-xl font-bold font-display text-white">Direct Communication</h3>
                              <p className="text-xs opacity-75 leading-relaxed">Reach out to our team for bookings, consultations, or direct quotes.</p>
                              <div className="space-y-3 pt-2 text-xs">
                                <div className="flex items-center space-x-3 text-slate-300">
                                  <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                                  <EditableText fieldKey={`custom_sec_${secObj.id}_email`} value={secObj.email || 'contact@brand.com'} />
                                </div>
                                <div className="flex items-center space-x-3 text-slate-300">
                                  <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                                  <EditableText fieldKey={`custom_sec_${secObj.id}_phone`} value={secObj.phone || '+1 (555) 234-5678'} />
                                </div>
                                <div className="flex items-center space-x-3 text-slate-300">
                                  <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
                                  <EditableText fieldKey={`custom_sec_${secObj.id}_address`} value={secObj.address || '123 Innovation Way, Suite 400'} />
                                </div>
                              </div>
                            </div>

                            <div className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-md space-y-4`}>
                              <h4 className="text-base font-bold font-display">{secObj.formTitle || 'Send Direct Message'}</h4>
                              <div>
                                <label className="block text-[10px] font-bold opacity-70 mb-1">Your Name</label>
                                <input type="text" placeholder="John Doe" disabled className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/40 border border-slate-700/60 text-white" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold opacity-70 mb-1">Your Email</label>
                                <input type="email" placeholder="john@example.com" disabled className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/40 border border-slate-700/60 text-white" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold opacity-70 mb-1">Message</label>
                                <textarea rows="3" placeholder="How can we assist you?" disabled className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/40 border border-slate-700/60 text-white resize-none"></textarea>
                              </div>
                              <button type="button" className="w-full py-3 rounded-xl font-bold text-xs text-white shadow-md" style={{ backgroundColor: accentColor }}>
                                Submit Message
                              </button>
                            </div>
                          </div>
                        )}

                        {/* TYPE 3: TESTIMONIALS SECTION */}
                        {secType === 'testimonials' && (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                            {(secObj.items || []).map((item, itemIdx) => (
                              <div key={itemIdx} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm flex flex-col justify-between`}>
                                <div>
                                  <div className="flex items-center space-x-1 text-amber-400 mb-3">
                                    <Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" />
                                  </div>
                                  <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_text`} value={item.text} tagName="p" className="text-xs italic opacity-80 leading-relaxed block" multiline />
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100/60 flex items-center space-x-3">
                                  {item.avatarUrl && <EditableImage slotKey={`custom_sec_${secObj.id}_item_${itemIdx}_avatar`} src={item.avatarUrl} alt={item.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />}
                                  <div>
                                    <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_name`} value={item.name} tagName="h4" className="text-xs font-bold font-display block" />
                                    <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_role`} value={item.role} tagName="p" className="text-[10px] opacity-60 block" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* TYPE 4: FAQ ACCORDION SECTION */}
                        {secType === 'faq' && (
                          <div className="max-w-3xl mx-auto space-y-3 my-6">
                            {(secObj.items || []).map((item, itemIdx) => (
                              <div key={itemIdx} className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm space-y-2`}>
                                <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_q`} value={item.question || item.title} tagName="h4" className="text-sm font-bold font-display block text-brand-400" />
                                <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_a`} value={item.answer || item.desc} tagName="p" className="text-xs opacity-80 leading-relaxed block" multiline />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* TYPE 5: GALLERY SECTION */}
                        {secType === 'gallery' && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
                            {(secObj.items || []).map((item, itemIdx) => (
                              <div key={itemIdx} className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-slate-900 relative">
                                <EditableImage slotKey={`custom_sec_${secObj.id}_item_${itemIdx}_img`} src={item.imageUrl || template.image} alt={item.caption || 'Gallery Image'} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* TYPE 6: TEAM SECTION */}
                        {secType === 'team' && (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                            {(secObj.items || []).map((item, itemIdx) => (
                              <div key={itemIdx} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm text-center space-y-3`}>
                                <EditableImage slotKey={`custom_sec_${secObj.id}_item_${itemIdx}_photo`} src={item.imageUrl || template.image} alt={item.name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-brand-500 shadow-md" />
                                <div>
                                  <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_name`} value={item.name} tagName="h4" className="text-sm font-bold font-display block" />
                                  <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_role`} value={item.role} tagName="p" className="text-[11px] font-bold text-brand-400 block" />
                                </div>
                                <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_bio`} value={item.bio} tagName="p" className="text-xs opacity-75 leading-relaxed block" multiline />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* TYPE 7: STANDALONE BUTTON BLOCK */}
                        {secType === 'button' && (
                          <div className="text-center my-6">
                            <a 
                              href={secObj.buttonLink || '/contact'} 
                              onClick={(e) => handleLinkClick(e, secObj.buttonLink || '/contact')} 
                              className="px-8 py-3.5 rounded-2xl text-white font-bold text-xs shadow-xl transition-transform hover:scale-105 inline-block" 
                              style={{ backgroundColor: accentColor }}
                            >
                              <EditableText fieldKey={`custom_sec_${secObj.id}_btnText`} value={secObj.buttonText || 'Explore Services'} />
                            </a>
                          </div>
                        )}

                        {/* TYPE 8: HERO BANNER SECTION */}
                        {secType === 'hero' && (
                          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-950 text-white min-h-[360px] sm:min-h-[440px] flex items-center justify-center p-6 sm:p-12 my-6">
                            <EditableImage 
                              slotKey={`custom_sec_${secObj.id}_hero_image`} 
                              src={secObj.imageUrl || template.image} 
                              alt={secObj.title || 'Hero Banner'} 
                              className="absolute inset-0 w-full h-full object-cover opacity-40" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
                            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
                              <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-amber-300">
                                <EditableText fieldKey={`custom_sec_${secObj.id}_badge`} value={secObj.badge || 'Featured Showcase'} />
                              </span>
                              <EditableText fieldKey={`custom_sec_${secObj.id}_title`} value={secObj.title || 'Headline Banner'} tagName="h2" className="text-3xl sm:text-5xl font-extrabold font-display leading-tight text-white block" multiline />
                              <EditableText fieldKey={`custom_sec_${secObj.id}_subtitle`} value={secObj.subtitle} tagName="p" className="text-xs sm:text-base opacity-85 leading-relaxed max-w-2xl mx-auto block" multiline />
                              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                                <a href={secObj.buttonLink || '/contact'} onClick={(e) => handleLinkClick(e, secObj.buttonLink || '/contact')} className="px-6 py-3 rounded-xl font-bold text-xs text-white shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: accentColor }}>
                                  <EditableText fieldKey={`custom_sec_${secObj.id}_btnText`} value={secObj.buttonText || 'Get Started Today'} />
                                </a>
                                {secObj.secondaryBtnText && (
                                  <a href={secObj.secondaryBtnLink || '/about'} onClick={(e) => handleLinkClick(e, secObj.secondaryBtnLink || '/about')} className="px-6 py-3 rounded-xl font-bold text-xs bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-md hover:bg-white/20 transition-all">
                                    <EditableText fieldKey={`custom_sec_${secObj.id}_secBtnText`} value={secObj.secondaryBtnText} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TYPE 9: SELECTED WORKS / PORTFOLIO SECTION */}
                        {secType === 'portfolio' && (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                            {(secObj.items || []).map((item, itemIdx) => (
                              <div key={itemIdx} className={`p-5 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-md flex flex-col justify-between overflow-hidden group/card`}>
                                <div>
                                  <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-slate-950 relative">
                                    <EditableImage slotKey={`custom_sec_${secObj.id}_item_${itemIdx}_img`} src={item.imageUrl || template.image} alt={item.title || 'Work Image'} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
                                  </div>
                                  {item.category && <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-400 block mb-1">{item.category}</span>}
                                  <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_title`} value={item.title} tagName="h3" className="text-base font-bold font-display block" />
                                  <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_desc`} value={item.desc} tagName="p" className="mt-2 text-xs opacity-75 leading-relaxed block" multiline />
                                </div>
                                {item.buttonText && (
                                  <div className="mt-5 pt-3 border-t border-slate-100/60 flex items-center justify-between">
                                    <a href={item.buttonLink || '/services'} onClick={(e) => handleLinkClick(e, item.buttonLink || '/services')} className="text-xs font-bold flex items-center space-x-1 hover:underline" style={{ color: accentColor }}>
                                      <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_btnText`} value={item.buttonText} />
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* TYPE 10: CALL TO ACTION BANNER SECTION */}
                        {secType === 'cta' && (
                          <div className="my-6 p-8 sm:p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden text-white" style={{ backgroundColor: accentColor }}>
                            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                              <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-black/20 text-white backdrop-blur-md border border-white/20">
                                <EditableText fieldKey={`custom_sec_${secObj.id}_badge`} value={secObj.badge || 'Take Action Today'} />
                              </span>
                              <EditableText fieldKey={`custom_sec_${secObj.id}_title`} value={secObj.title} tagName="h2" className="text-2xl sm:text-4xl font-extrabold font-display leading-tight block text-white" multiline />
                              <EditableText fieldKey={`custom_sec_${secObj.id}_subtitle`} value={secObj.subtitle} tagName="p" className="text-xs sm:text-sm opacity-90 max-w-xl mx-auto block" multiline />
                              <div className="pt-4">
                                <a 
                                  href={secObj.buttonLink || '/contact'} 
                                  onClick={(e) => handleLinkClick(e, secObj.buttonLink || '/contact')} 
                                  className="px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-xs shadow-xl transition-transform hover:scale-105 inline-block"
                                >
                                  <EditableText fieldKey={`custom_sec_${secObj.id}_btnText`} value={secObj.buttonText || 'Get Started Now'} />
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TYPE 11: DEFAULT CONTAINER GRID (Services / Features / Generic Cards) */}
                        {(!secType || ['services', 'features', 'custom', 'custom_box'].includes(secType)) && secObj.items && secObj.items.length > 0 && (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {secObj.items.map((item, itemIdx) => (
                              <div key={itemIdx} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm flex flex-col justify-between`} style={{ backgroundColor: item.backgroundColor, borderColor: item.borderColor }}>
                                <div>
                                  {item.imageUrl && (
                                    <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-slate-900">
                                      <EditableImage slotKey={`custom_sec_${secObj.id}_item_${itemIdx}_cardimg`} src={item.imageUrl} alt={item.title || 'Card Image'} className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                  <div className="flex justify-between items-start mb-2">
                                    <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_title`} value={item.title} tagName="h3" className="text-base font-bold font-display block" />
                                    {item.price && <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ml-2 flex-shrink-0" style={{ backgroundColor: accentColor }}>{item.price}</span>}
                                  </div>
                                  <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_desc`} value={item.description || item.desc} tagName="p" className="mt-2 text-xs opacity-75 leading-relaxed block" multiline />
                                </div>
                                {item.buttonText && (
                                  <div className="mt-4 pt-3 border-t border-slate-100/50">
                                    <a href={item.buttonLink || '/contact'} onClick={(e) => handleLinkClick(e, item.buttonLink || '/contact')} className="inline-block px-4 py-2 rounded-xl text-white font-bold text-xs shadow-sm" style={{ backgroundColor: accentColor }}>
                                      <EditableText fieldKey={`custom_sec_${secObj.id}_item_${itemIdx}_btnText`} value={item.buttonText} />
                                    </a>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </section>
                  );
                }

                return null;
              })}
            </main>
          )}

          {/* ========================================== */}
          {/* VIEW ROUTE 2: DEDICATED ABOUT PAGE */}
          {/* ========================================== */}
          {currentRoute === 'about' && (
            <main className="py-12 md:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm inline-block mb-4" style={{ backgroundColor: accentColor }}>
                  About Our Brand & Philosophy
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight">
                  {data.aboutTitle || 'Built With Passion & Uncompromising Excellence'}
                </h1>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center my-12">
                <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-slate-900 border border-slate-200/40">
                  <img src={aboutImage} alt="About Story" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-display mb-4">Our Heritage & Mission</h2>
                  <p className="text-sm opacity-80 leading-relaxed font-sans">{data.aboutDesc}</p>
                  
                  <div className="mt-6 space-y-3 text-xs font-medium">
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Dedicated client support & bespoke service experience</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Authentic quality backed by decades of industry expertise</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Sustainable & ethical practices in every operation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder Quote */}
              <div className={`p-8 rounded-3xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80'} border text-center max-w-3xl mx-auto my-12`}>
                <Quote className="w-10 h-10 mx-auto text-amber-400 opacity-60 mb-4" />
                <p className="text-lg font-serif italic leading-relaxed">"{data.aboutDesc}"</p>
                <p className="mt-4 text-xs font-mono tracking-widest uppercase font-bold text-slate-500">— {data.logoText || template.title} Leadership</p>
              </div>

              {/* Call to Action Bar */}
              <div className="text-center pt-8">
                <a 
                  href="/contact" 
                  onClick={(e) => handleLinkClick(e, '/contact')} 
                  className="px-8 py-4 rounded-2xl text-white font-bold text-xs shadow-xl transition-transform hover:scale-105 inline-block" 
                  style={{ backgroundColor: accentColor }}
                >
                  Get In Touch With Our Team
                </a>
              </div>
            </main>
          )}

          {/* ========================================== */}
          {/* VIEW ROUTE 3: DEDICATED SHOWCASE / SERVICES PAGE */}
          {/* ========================================== */}
          {currentRoute === 'services' && (
            <main className="py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm inline-block mb-4" style={{ backgroundColor: accentColor }}>
                  Official Offerings & Showcase
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold font-display">
                  {data.servicesTitle || 'Explore Our Complete Collection'}
                </h1>
                <p className="mt-3 text-xs sm:text-sm opacity-75">
                  Browse our curated offerings, packages, and items. Informational showcase only.
                </p>
              </div>

              {/* Feature Showcase Banner */}
              <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl aspect-[21/9] bg-slate-900 relative border border-slate-200/40">
                <img src={galleryImage} alt="Showcase Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-8 flex items-end">
                  <p className="text-white font-bold text-lg sm:text-2xl font-display">{data.servicesTitle}</p>
                </div>
              </div>

              {/* Full Services Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(data.services || []).map((serv, idx) => (
                  <div key={idx} className={`p-7 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm flex flex-col justify-between`}>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold font-display">{serv.title}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white flex-shrink-0 ml-2" style={{ backgroundColor: accentColor }}>
                          {serv.price}
                        </span>
                      </div>
                      <p className="text-xs opacity-75 leading-relaxed mt-2">{serv.desc}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100/60 flex items-center justify-between text-xs font-bold opacity-80">
                      <span>{serv.tag || 'Showcase'}</span>
                      <a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="hover:underline flex items-center space-x-1" style={{ color: accentColor }}>
                        <span>Inquire Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* ========================================== */}
          {/* VIEW ROUTE 4: DEDICATED FEATURES / CAPABILITIES PAGE */}
          {/* ========================================== */}
          {currentRoute === 'features' && (
            <main className="py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm inline-block mb-4" style={{ backgroundColor: accentColor }}>
                  Capabilities & Excellence
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold font-display">
                  {data.featuresTitle || 'Why Work With Us'}
                </h1>
              </div>

              <div className="grid md:grid-cols-3 gap-6 my-12">
                {(data.features || []).map((feat, idx) => (
                  <div key={idx} className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-md`}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md" style={{ backgroundColor: accentColor }}>
                      {renderIcon(feat.icon)}
                    </div>
                    <h3 className="text-lg font-bold font-display">{feat.title}</h3>
                    <p className="mt-3 text-xs sm:text-sm opacity-80 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* ========================================== */}
          {/* VIEW ROUTE 5: DEDICATED TESTIMONIALS / REVIEWS PAGE */}
          {/* ========================================== */}
          {currentRoute === 'testimonials' && (
            <main className="py-12 md:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm inline-block mb-4" style={{ backgroundColor: accentColor }}>
                  Client Feedback & Reviews
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold font-display">
                  {data.testimonialsTitle || 'What Our Customers Say'}
                </h1>
              </div>

              <div className="grid md:grid-cols-2 gap-8 my-12">
                {(data.testimonials || []).map((item, idx) => (
                  <div key={idx} className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-md`}>
                    <div className="flex items-center space-x-1 text-amber-400 mb-4">
                      <Star className="w-5 h-5 fill-amber-400" /><Star className="w-5 h-5 fill-amber-400" /><Star className="w-5 h-5 fill-amber-400" /><Star className="w-5 h-5 fill-amber-400" /><Star className="w-5 h-5 fill-amber-400" />
                    </div>
                    <p className="text-sm italic leading-relaxed opacity-90 font-serif">"{item.text}"</p>
                    <div className="mt-6 pt-4 border-t border-slate-100/60 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold font-display">{item.name}</h4>
                        <p className="text-xs opacity-60">{item.role}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* ========================================== */}
          {/* VIEW ROUTE 6: DEDICATED PHOTO GALLERY PAGE */}
          {/* ========================================== */}
          {currentRoute === 'gallery' && (
            <main className="py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm inline-block mb-4" style={{ backgroundColor: accentColor }}>
                  Photo & Media Gallery
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold font-display">Atmosphere & Visual Showcase</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
                <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-slate-900"><img src={heroImage} alt="Gallery 1" className="w-full h-full object-cover" /></div>
                <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-slate-900"><img src={aboutImage} alt="Gallery 2" className="w-full h-full object-cover" /></div>
                <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-slate-900"><img src={galleryImage} alt="Gallery 3" className="w-full h-full object-cover" /></div>
              </div>
            </main>
          )}

          {/* ========================================== */}
          {/* VIEW ROUTE 7: DEDICATED CONTACT PAGE */}
          {/* ========================================== */}
          {currentRoute === 'contact' && (
            <main className="py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm inline-block mb-4" style={{ backgroundColor: accentColor }}>
                  Get In Touch
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold font-display">Contact & Inquiries</h1>
                <p className="mt-3 text-xs sm:text-sm opacity-75">Reach out to our team directly for custom requests, consultations, or visits.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} shadow-xl`}>
                  <h3 className="text-2xl font-bold font-display mb-6">Contact Information</h3>
                  <div className="space-y-6 text-sm font-medium">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400"><Mail className="w-5 h-5" /></div>
                      <div><p className="text-[10px] opacity-60 uppercase font-bold">Email Us</p><p className="font-semibold text-base">{data.contactEmail || 'contact@business.com'}</p></div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400"><Phone className="w-5 h-5" /></div>
                      <div><p className="text-[10px] opacity-60 uppercase font-bold">Call Us</p><p className="font-semibold text-base">{data.contactPhone || '+1 (800) 555-0199'}</p></div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400"><MapPin className="w-5 h-5" /></div>
                      <div><p className="text-[10px] opacity-60 uppercase font-bold">Location & Address</p><p className="font-semibold text-base">{data.contactAddress || 'Downtown Main Street'}</p></div>
                    </div>
                  </div>
                </div>

                <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-800 text-white'} shadow-2xl`}>
                  {formSent ? (
                    <div className="py-12 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-6 h-6" /></div>
                      <h4 className="text-lg font-bold font-display text-white">Message Sent Successfully!</h4>
                      <p className="text-xs opacity-75 mt-2">Our team will respond to your inquiry shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); setFormSent(true); }} className="space-y-4">
                      <h4 className="text-lg font-bold font-display text-white mb-4">Send Direct Inquiry</h4>
                      <div>
                        <label className="block text-[11px] font-semibold opacity-75 mb-1">Your Name</label>
                        <input type="text" required placeholder="John Doe" className="w-full px-4 py-3 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold opacity-75 mb-1">Your Email</label>
                        <input type="email" required placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold opacity-75 mb-1">Message / Special Request</label>
                        <textarea rows="4" required placeholder="How can we assist you?" className="w-full px-4 py-3 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"></textarea>
                      </div>
                      <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-xs text-white shadow-lg flex items-center justify-center space-x-2" style={{ backgroundColor: accentColor }}>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </main>
          )}

          {/* ========================================== */}
          {/* VIEW ROUTE 8: DEDICATED PRICING PAGE */}
          {/* ========================================== */}
          {currentRoute === 'pricing' && (
            <main className="py-12 md:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm inline-block mb-4" style={{ backgroundColor: accentColor }}>
                  Service Packages & Tiers
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold font-display">{data.pricingTitle || 'Transparent Packages'}</h1>
              </div>

              <div className="grid md:grid-cols-2 gap-8 my-12">
                {(data.pricing || []).map((plan, idx) => (
                  <div key={idx} className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-md flex flex-col justify-between`}>
                    <div>
                      <h3 className="text-xl font-bold font-display">{plan.name}</h3>
                      <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-extrabold font-display">{plan.price}</span>
                        <span className="text-xs opacity-70 ml-1">{plan.period}</span>
                      </div>
                      <ul className="mt-6 space-y-3 text-xs opacity-80">
                        {(plan.features || []).map((f, i) => (
                          <li key={i} className="flex items-center space-x-2.5">
                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="mt-8 text-center block w-full py-3.5 rounded-2xl font-bold text-xs text-white shadow-md" style={{ backgroundColor: accentColor }}>
                      Get Started
                    </a>
                  </div>
                ))}
              </div>
            </main>
          )}
        </div>

        {/* FOOTER */}
        <footer className={`py-12 sm:py-16 px-4 sm:px-6 ${isDark ? 'bg-slate-950 text-slate-200 border-t border-slate-900' : 'bg-slate-900 text-white'} w-full max-w-full overflow-hidden mt-16`}>
          <div className="max-w-6xl mx-auto pb-12 border-b border-slate-800 flex flex-col md:flex-row justify-between gap-8">
            <div>
              <EditableText fieldKey="footerTitle" value={data.footerTitle || data.logoText || template.title} tagName="span" className="font-extrabold text-xl tracking-tight font-display" />
              <EditableText fieldKey="footerTagline" value={data.footerTagline || template.tagline || template.defaultData?.heroSubtitle} tagName="p" className="mt-2 text-xs opacity-75 max-w-sm leading-relaxed block" multiline />
            </div>
            <div className="flex flex-wrap gap-8 text-xs font-semibold">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Navigation</p>
                <ul className="space-y-2">
                  {defaultNavLinks.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="hover:underline opacity-80 hover:opacity-100">
                        <EditableText fieldKey={`navLink_${idx}_label`} value={link.label} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Contact</p>
                <EditableText fieldKey="contactEmail" value={data.contactEmail || 'contact@business.com'} tagName="p" className="opacity-80 block" />
                <EditableText fieldKey="contactPhone" value={data.contactPhone || '+1 (800) 555-0199'} tagName="p" className="opacity-80 mt-1 block" />
              </div>
            </div>
          </div>
          <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] opacity-70 gap-2 sm:gap-4 w-full max-w-full">
            <EditableText fieldKey="copyrightText" value={data.copyrightText || data.footerText || `© 2026 ${data.logoText || template.title}. All rights reserved.`} tagName="p" className="text-center sm:text-left break-words block" />
            <p className="mt-2 sm:mt-0 font-mono text-center sm:text-right flex-shrink-0">Built with Nexora</p>
          </div>
        </footer>

      </div>
    </div>
  );
}
