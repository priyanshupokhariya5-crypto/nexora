import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Monitor, Tablet, Smartphone, Save, Download, Globe, 
  Palette, Type, Layout, Sliders, Sparkles, Check, Copy, Eye, RefreshCw, X, User, 
  Image as ImageIcon, ZoomIn, ZoomOut, RotateCcw, RotateCw, Layers, FileText, 
  ChevronRight, ChevronDown, Wand2, SlidersHorizontal, Square, MoveUp, MoveDown, 
  CheckCircle2, AlertCircle, UploadCloud, SlidersVertical, Edit3
} from 'lucide-react';
import TemplateRenderer from './TemplateRenderer';
import AiAssistantPanel from './AiAssistantPanel';
import confetti from 'canvas-confetti';
import { TEMPLATES_DATA } from '../data/templatesData';
import { apiFetch } from '../api';

const CURATED_COLORS = [
  { name: 'Royal Blue', hex: '#2551e8' },
  { name: 'Electric Violet', hex: '#7c3aed' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Warm Amber', hex: '#d97706' },
  { name: 'Crimson Red', hex: '#ef4444' },
  { name: 'Hot Rose', hex: '#ec4899' },
  { name: 'Ocean Teal', hex: '#0f766e' },
  { name: 'Cyber Fuchsia', hex: '#c026d3' },
  { name: 'Deep Slate', hex: '#0f172a' }
];

const PRESET_BUSINESS_IMAGES = [
  { name: 'Tech Device', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Gym & Fitness', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80' },
  { name: 'Corporate Tower', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
  { name: 'Culinary Restaurant', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
  { name: 'Luxury Villa', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Creative Agency', url: 'https://images.unsplash.com/photo-1542744094-3a3172720189?auto=format&fit=crop&w=800&q=80' },
  { name: 'SaaS Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' },
  { name: 'Artisan Bakery', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' }
];

export default function VisualEditor({ 
  template, 
  initialSite = null,
  user = null,
  onRequireAuth,
  onSaveSite, 
  onBack 
}) {
  const [leftTab, setLeftTab] = useState('sections');
  const [rightTab, setRightTab] = useState('branding'); // 'branding', 'typography', 'content', 'buttons'
  const [mobileTab, setMobileTab] = useState('preview'); // Mobile active view: 'preview', 'sections', 'settings'
  
  const [viewportMode, setViewportMode] = useState('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Saving Status States: 'idle', 'saving', 'saved', 'error'
  const [saveStatus, setSaveStatus] = useState('saved');
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedSiteData, setSavedSiteData] = useState(initialSite);
  
  // AI Assistant state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // File Upload State
  const [uploadingSlot, setUploadingSlot] = useState(null); // 'logoImageUrl', 'heroImageUrl', 'aboutImageUrl', 'galleryImageUrl'
  const fileInputRef = useRef(null);

  // Initial Custom State supporting full page content and images
  const [customState, setCustomState] = useState(() => {
    if (initialSite?.customData) {
      return {
        ...template.defaultData,
        ...initialSite.customData,
        logoImageUrl: initialSite.customData.logoImageUrl || '',
        heroImageUrl: initialSite.customData.heroImageUrl || template.image,
        aboutImageUrl: initialSite.customData.aboutImageUrl || template.image,
        galleryImageUrl: initialSite.customData.galleryImageUrl || template.image,
        accentColor: initialSite.accentColor || template.accentColor,
        fontFamily: initialSite.fontFamily || template.fontFamily,
        bgTheme: initialSite.bgTheme || template.bgTheme,
        borderRadius: initialSite.customData.borderRadius || 'rounded-2xl'
      };
    }
    return {
      ...template.defaultData,
      logoImageUrl: '',
      heroImageUrl: template.image,
      aboutImageUrl: template.defaultData?.aboutImageUrl || template.image,
      galleryImageUrl: template.defaultData?.galleryImageUrl || template.image,
      accentColor: template.accentColor || '#2551e8',
      fontFamily: template.fontFamily || 'sans',
      bgTheme: template.bgTheme || 'light',
      borderRadius: 'rounded-2xl'
    };
  });

  const [siteTitle, setSiteTitle] = useState(initialSite?.title || `${template.title} Customized`);

  // Undo / Redo History Stack
  const [history, setHistory] = useState([customState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isFirstRender = useRef(true);

  // Auto-Save Debounce Effect (800ms of inactivity)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        const payload = {
          userId: user?.id || 'usr_guest',
          siteId: initialSite?.siteId || savedSiteData?.siteId,
          templateId: template.id,
          title: siteTitle,
          accentColor: customState.accentColor,
          fontFamily: customState.fontFamily,
          bgTheme: customState.bgTheme,
          customData: customState,
          isPublished: true
        };

        const res = await apiFetch('/api/websites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          setSavedSiteData(data.website);
          if (onSaveSite) onSaveSite(data.website);
          setSaveStatus('saved');
        } else {
          setSaveStatus('error');
        }
      } catch (err) {
        console.error('Auto save error:', err);
        setSaveStatus('error');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [customState, siteTitle]);

  // Keyboard Shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const pushToHistory = (newState) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    setHistory([...updatedHistory, newState]);
    setHistoryIndex(updatedHistory.length);
    setCustomState(newState);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCustomState(history[prevIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setCustomState(history[nextIndex]);
    }
  };

  const handleTextChange = (field, value) => {
    pushToHistory({
      ...customState,
      [field]: value
    });
  };

  const handleFeatureChange = (index, key, value) => {
    const updated = [...(customState.features || [])];
    updated[index] = { ...updated[index], [key]: value };
    pushToHistory({ ...customState, features: updated });
  };

  const handleServiceChange = (index, key, value) => {
    const updated = [...(customState.services || [])];
    updated[index] = { ...updated[index], [key]: value };
    pushToHistory({ ...customState, services: updated });
  };

  const handlePricingChange = (index, key, value) => {
    const updated = [...(customState.pricing || [])];
    updated[index] = { ...updated[index], [key]: value };
    pushToHistory({ ...customState, pricing: updated });
  };

  const handleTestimonialChange = (index, key, value) => {
    const updated = [...(customState.testimonials || [])];
    updated[index] = { ...updated[index], [key]: value };
    pushToHistory({ ...customState, testimonials: updated });
  };

  // Image Upload via Cloudinary / Data URL Endpoint
  const triggerImageUpload = (slotKey) => {
    setUploadingSlot(slotKey);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file || !uploadingSlot) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      try {
        setSaveStatus('saving');
        const res = await apiFetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data })
        });
        const data = await res.json();
        if (data.success && data.url) {
          handleTextChange(uploadingSlot, data.url);
          setSaveStatus('saved');
        }
      } catch (err) {
        console.error('Image upload error:', err);
        setSaveStatus('error');
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublishClick = async () => {
    if (!user && onRequireAuth) {
      onRequireAuth();
      return;
    }
    setSaveStatus('saving');
    try {
      const payload = {
        userId: user?.id || 'usr_guest',
        siteId: initialSite?.siteId || savedSiteData?.siteId,
        templateId: template.id,
        title: siteTitle,
        accentColor: customState.accentColor,
        fontFamily: customState.fontFamily,
        bgTheme: customState.bgTheme,
        customData: customState,
        isPublished: true
      };

      const res = await apiFetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setSavedSiteData(data.website);
        if (onSaveSite) onSaveSite(data.website);
        setSaveStatus('saved');
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      setSaveStatus('error');
    }
  };

  const handleCopyPublishedLink = () => {
    if (!savedSiteData?.slug) return;
    const url = `${window.location.origin}/site/${savedSiteData.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Reusable Component Renders to guarantee 100% DOM separation between Mobile & Desktop
  const renderLeftSidebarContent = () => (
    <div className="flex-1 flex flex-col h-full bg-slate-900 border-r border-slate-800 overflow-y-auto">
      <div className="flex border-b border-slate-800 p-1 bg-slate-950 overflow-x-auto scrollbar-none flex-shrink-0">
        <button
          onClick={() => setLeftTab('sections')}
          className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${
            leftTab === 'sections' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Sections
        </button>
        <button
          onClick={() => setLeftTab('assets')}
          className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${
            leftTab === 'assets' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          3 Images
        </button>
        <button
          onClick={() => setLeftTab('templates')}
          className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${
            leftTab === 'templates' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Presets
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {leftTab === 'sections' && (
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
              Page Blocks & Sections
            </span>
            {['Hero Banner', 'Features Grid', 'About Story', 'Services / Products', 'Pricing Tiers', 'Testimonials', 'Contact Form', 'Footer'].map((sec, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-xs text-slate-200 font-medium">
                <div className="flex items-center space-x-2">
                  <Layers className="w-3.5 h-3.5 text-brand-400" />
                  <span>{sec}</span>
                </div>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            ))}
          </div>
        )}

        {leftTab === 'assets' && (
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
              3 Business Image Uploads
            </span>
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-300">Image 1: Hero Banner</label>
                  <button
                    onClick={() => triggerImageUpload('heroImageUrl')}
                    className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[9px] font-bold flex items-center space-x-1"
                  >
                    <UploadCloud className="w-3 h-3" />
                    <span>Upload File</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={customState.heroImageUrl || ''}
                  onChange={(e) => handleTextChange('heroImageUrl', e.target.value)}
                  placeholder="Image URL..."
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-300">Image 2: Brand Story</label>
                  <button
                    onClick={() => triggerImageUpload('aboutImageUrl')}
                    className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[9px] font-bold flex items-center space-x-1"
                  >
                    <UploadCloud className="w-3 h-3" />
                    <span>Upload File</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={customState.aboutImageUrl || ''}
                  onChange={(e) => handleTextChange('aboutImageUrl', e.target.value)}
                  placeholder="Image URL..."
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-300">Image 3: Product Showcase</label>
                  <button
                    onClick={() => triggerImageUpload('galleryImageUrl')}
                    className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[9px] font-bold flex items-center space-x-1"
                  >
                    <UploadCloud className="w-3 h-3" />
                    <span>Upload File</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={customState.galleryImageUrl || ''}
                  onChange={(e) => handleTextChange('galleryImageUrl', e.target.value)}
                  placeholder="Image URL..."
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="block text-[10px] font-semibold text-slate-400 mb-2">Stock Photo Library</span>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_BUSINESS_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => handleTextChange('heroImageUrl', img.url)}
                    className="p-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-brand-500 overflow-hidden text-left"
                  >
                    <img src={img.url} alt={img.name} className="w-full h-12 object-cover rounded" />
                    <span className="block text-[9px] text-slate-300 mt-1 truncate">{img.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {leftTab === 'templates' && (
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
              30 Presets Library
            </span>
            <div className="space-y-2">
              {TEMPLATES_DATA.slice(0, 10).map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTextChange('heroTitle', t.defaultData.heroTitle)}
                  className="w-full p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left flex items-center space-x-2"
                >
                  <img src={t.image} alt={t.title} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{t.title}</p>
                    <p className="text-[9px] text-slate-400">{t.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderRightInspectorContent = () => (
    <div className="flex-1 flex flex-col h-full bg-slate-900 border-l border-slate-800 overflow-y-auto">
      <div className="flex border-b border-slate-800 p-1 bg-slate-950 overflow-x-auto scrollbar-none flex-shrink-0">
        <button
          onClick={() => setRightTab('branding')}
          className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${
            rightTab === 'branding' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Branding
        </button>
        <button
          onClick={() => setRightTab('typography')}
          className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${
            rightTab === 'typography' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Fonts
        </button>
        <button
          onClick={() => setRightTab('content')}
          className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${
            rightTab === 'content' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setRightTab('buttons')}
          className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${
            rightTab === 'buttons' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Buttons
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {rightTab === 'branding' && (
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
              Brand & Palette Customizer
            </span>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Website Title</label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Logo Brand Text</label>
              <input
                type="text"
                value={customState.logoText || ''}
                onChange={(e) => handleTextChange('logoText', e.target.value)}
                placeholder="e.g. VoltTech Store"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Brand Logo Image</label>
                <button
                  type="button"
                  onClick={() => triggerImageUpload('logoImageUrl')}
                  className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[9px] font-bold flex items-center space-x-1"
                >
                  <UploadCloud className="w-3 h-3" />
                  <span>Upload Logo</span>
                </button>
              </div>
              <input
                type="text"
                value={customState.logoImageUrl || ''}
                onChange={(e) => handleTextChange('logoImageUrl', e.target.value)}
                placeholder="Custom Logo Image URL..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Accent Hex Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={customState.accentColor}
                  onChange={(e) => handleTextChange('accentColor', e.target.value)}
                  className="w-8 h-8 rounded border-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-300">{customState.accentColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Preset Swatches</label>
              <div className="grid grid-cols-3 gap-2">
                {CURATED_COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => handleTextChange('accentColor', c.hex)}
                    className="p-2 rounded-xl border border-slate-700 bg-slate-950 flex items-center space-x-2 hover:border-slate-500 text-left"
                  >
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                    <span className="text-[9px] text-slate-300 font-medium truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Canvas Theme Mode</label>
              <select
                value={customState.bgTheme}
                onChange={(e) => handleTextChange('bgTheme', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                <option value="light">Light Theme (Clean White Canvas)</option>
                <option value="dark">Dark Mode Theme</option>
              </select>
            </div>
          </div>
        )}

        {rightTab === 'typography' && (
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
              Typography & Fonts
            </span>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Font Family</label>
              <select
                value={customState.fontFamily}
                onChange={(e) => handleTextChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                <option value="sans">Plus Jakarta Sans</option>
                <option value="display">Outfit (Bold Display)</option>
                <option value="serif">Playfair Display (Editorial)</option>
                <option value="inter">Inter UI</option>
              </select>
            </div>
          </div>
        )}

        {rightTab === 'content' && (
          <div className="space-y-5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
              Full Page Content & Section Editors
            </span>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="block text-xs font-bold text-brand-400 font-display">1. Hero Section</span>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Hero Title</label>
                <textarea
                  rows={2}
                  value={customState.heroTitle || ''}
                  onChange={(e) => handleTextChange('heroTitle', e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={customState.heroSubtitle || ''}
                  onChange={(e) => handleTextChange('heroSubtitle', e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="block text-xs font-bold text-amber-400 font-display">2. Features Section</span>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Features Section Title</label>
                <input
                  type="text"
                  value={customState.featuresTitle || ''}
                  onChange={(e) => handleTextChange('featuresTitle', e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              {(customState.features || []).map((feat, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <label className="text-[9px] font-semibold text-slate-400">Feature #{idx+1}</label>
                  <input
                    type="text"
                    value={feat.title || ''}
                    onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                    className="w-full p-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-white"
                    placeholder="Feature Title..."
                  />
                  <textarea
                    rows={2}
                    value={feat.desc || ''}
                    onChange={(e) => handleFeatureChange(idx, 'desc', e.target.value)}
                    className="w-full p-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-white"
                    placeholder="Feature Description..."
                  />
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="block text-xs font-bold text-emerald-400 font-display">3. About Section</span>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">About Title</label>
                <input
                  type="text"
                  value={customState.aboutTitle || ''}
                  onChange={(e) => handleTextChange('aboutTitle', e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">About Description</label>
                <textarea
                  rows={3}
                  value={customState.aboutDesc || ''}
                  onChange={(e) => handleTextChange('aboutDesc', e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="block text-xs font-bold text-indigo-400 font-display">4. Services / Products Section</span>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Services Title</label>
                <input
                  type="text"
                  value={customState.servicesTitle || ''}
                  onChange={(e) => handleTextChange('servicesTitle', e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              {(customState.services || []).map((serv, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <label className="text-[9px] font-semibold text-slate-400">Item #{idx+1}</label>
                  <input
                    type="text"
                    value={serv.title || ''}
                    onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                    className="w-full p-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-white"
                    placeholder="Item Title..."
                  />
                  <input
                    type="text"
                    value={serv.price || ''}
                    onChange={(e) => handleServiceChange(idx, 'price', e.target.value)}
                    className="w-full p-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-white font-mono"
                    placeholder="Price Tag (e.g. $79)..."
                  />
                  <textarea
                    rows={2}
                    value={serv.desc || ''}
                    onChange={(e) => handleServiceChange(idx, 'desc', e.target.value)}
                    className="w-full p-1.5 text-xs rounded bg-slate-950 border border-slate-800 text-white"
                    placeholder="Description..."
                  />
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="block text-xs font-bold text-rose-400 font-display">5. Contact & Footer Details</span>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={customState.contactEmail || ''}
                  onChange={(e) => handleTextChange('contactEmail', e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={customState.contactPhone || ''}
                  onChange={(e) => handleTextChange('contactPhone', e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Footer Copyright Text</label>
                <input
                  type="text"
                  value={customState.footerText || ''}
                  onChange={(e) => handleTextChange('footerText', e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {rightTab === 'buttons' && (
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
              CTA Button Controls
            </span>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Button Text</label>
              <input
                type="text"
                value={customState.ctaText || ''}
                onChange={(e) => handleTextChange('ctaText', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Corner Radius</label>
              <select
                value={customState.borderRadius}
                onChange={(e) => handleTextChange('borderRadius', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                <option value="rounded-xl">Soft Corners (12px)</option>
                <option value="rounded-2xl">Modern Corners (16px)</option>
                <option value="rounded-3xl">Pill Corners (24px)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCenterCanvasContent = (isMobile = false) => (
    <div className={`flex-1 bg-slate-950 overflow-x-hidden overflow-y-auto ${isMobile ? 'p-2' : 'p-4 md:p-8'} flex items-start justify-center relative w-full max-w-full`}>
      {savedSiteData && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 sm:top-4 z-40 bg-emerald-500 text-slate-950 px-3 sm:px-4 py-2 rounded-2xl shadow-xl flex flex-wrap items-center gap-2 text-xs font-bold max-w-[95%]"
        >
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Published Live:</span>
          </div>
          <a
            href={`${window.location.origin}/site/${savedSiteData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-mono hover:opacity-80 truncate max-w-[160px] sm:max-w-none"
          >
            /site/{savedSiteData.slug}
          </a>
          <button
            onClick={handleCopyPublishedLink}
            className="px-2.5 py-1 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-[10px] font-bold flex items-center space-x-1 flex-shrink-0"
          >
            <Copy className="w-3 h-3" />
            <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
          </button>
        </motion.div>
      )}

      <div 
        style={{ transform: isMobile ? 'none' : `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        className={`transition-all duration-300 w-full max-w-full ${
          isMobile ? 'w-full max-w-full' :
          viewportMode === 'desktop' ? 'max-w-6xl' :
          viewportMode === 'tablet' ? 'max-w-xl' : 'max-w-xs'
        }`}
      >
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl overflow-hidden min-h-[600px] sm:min-h-[800px] text-slate-900 w-full max-w-full">
          <TemplateRenderer
            template={template}
            customData={customState}
            accentColor={customState.accentColor}
            fontFamily={customState.fontFamily}
            bgTheme={customState.bgTheme}
            viewportMode={isMobile ? 'mobile' : viewportMode}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white font-sans overflow-x-hidden select-none max-w-full w-full">
      
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/*"
        className="hidden"
      />

      {/* 1. TOP TOOLBAR */}
      <header className="h-14 bg-slate-900 border-b border-slate-800/80 px-2 sm:px-4 flex items-center justify-between z-30 flex-shrink-0 w-full max-w-full">
        
        {/* Left Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
          <button
            onClick={onBack}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3 border-r border-slate-800 pr-2 sm:pr-4 overflow-hidden">
            <span className="font-extrabold text-xs sm:text-sm text-white font-display truncate max-w-[90px] sm:max-w-none">Nexora</span>
            
            {/* Saving Status Badges */}
            {saveStatus === 'saving' && (
              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center space-x-1 animate-pulse flex-shrink-0">
                <RefreshCw className="w-2.5 h-2.5 animate-spin text-brand-400" />
                <span className="hidden xs:inline">Saving...</span>
              </span>
            )}

            {saveStatus === 'saved' && (
              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1 flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                <span>Saved ✓</span>
              </span>
            )}

            {saveStatus === 'error' && (
              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center space-x-1 flex-shrink-0">
                <AlertCircle className="w-2.5 h-2.5 text-red-400" />
                <span>Error</span>
              </span>
            )}
          </div>

          {/* Undo / Redo Actions */}
          <div className="hidden sm:flex items-center space-x-1 flex-shrink-0">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Viewport Controls (Desktop only) */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewportMode === 'desktop' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewportMode === 'tablet' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewportMode === 'mobile' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-1 px-2.5 py-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button 
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              className="p-1 text-slate-400 hover:text-white"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] text-slate-300 w-9 text-center">{zoomLevel}%</span>
            <button 
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
              className="p-1 text-slate-400 hover:text-white"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsAiModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-sm flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">AI Assistant</span>
          </motion.button>

          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`hidden md:flex px-3 py-1.5 rounded-xl text-xs font-bold transition-all items-center space-x-1.5 ${
              isPreviewMode 
                ? 'bg-amber-500 text-slate-950 font-extrabold' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handlePublishClick}
            className="px-3 sm:px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 flex items-center space-x-1"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish</span>
          </motion.button>
        </div>

      </header>

      {/* 2A. MOBILE RENDER CONTAINER (< 768px): RENDERS EXACTLY ONE SINGLE ACTIVE VIEW AT A TIME */}
      <div className="md:hidden flex-1 flex flex-col w-full overflow-x-hidden overflow-y-auto pb-16 relative bg-slate-950">
        {mobileTab === 'sections' && renderLeftSidebarContent()}
        {mobileTab === 'preview' && renderCenterCanvasContent(true)}
        {mobileTab === 'settings' && renderRightInspectorContent()}
      </div>

      {/* 2B. DESKTOP RENDER CONTAINER (>= 768px): RENDERS 3-COLUMN SIDE-BY-SIDE LAYOUT */}
      <div className="hidden md:flex flex-1 overflow-hidden relative w-full">
        {!isPreviewMode && (
          <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-20 overflow-y-auto">
            {renderLeftSidebarContent()}
          </aside>
        )}

        <main className="flex-1 bg-slate-950 overflow-x-hidden overflow-y-auto p-4 md:p-8 flex items-start justify-center relative max-w-full">
          {renderCenterCanvasContent(false)}
        </main>

        {!isPreviewMode && (
          <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0 z-20 overflow-y-auto">
            {renderRightInspectorContent()}
          </aside>
        )}
      </div>

      {/* 3. STICKY BOTTOM MOBILE NAVIGATION BAR (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800/90 px-4 flex items-center justify-around z-50 pb-safe shadow-2xl">
        <button
          onClick={() => setMobileTab('sections')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${
            mobileTab === 'sections' ? 'text-brand-400 font-bold bg-slate-800 scale-105' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-display">Sections</span>
        </button>

        <button
          onClick={() => setMobileTab('preview')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${
            mobileTab === 'preview' ? 'text-brand-400 font-bold bg-slate-800 scale-105' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-display">Preview</span>
        </button>

        <button
          onClick={() => setMobileTab('settings')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${
            mobileTab === 'settings' ? 'text-brand-400 font-bold bg-slate-800 scale-105' : 'text-slate-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-display">Settings</span>
        </button>
      </nav>

      {/* 4. AI ASSISTANT PANEL DRAWER */}
      <AiAssistantPanel
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        customState={customState}
        onApplyAiUpdate={(updates) => {
          pushToHistory({
            ...customState,
            ...updates
          });
        }}
      />

    </div>
  );
}
