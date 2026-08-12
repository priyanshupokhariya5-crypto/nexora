import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Monitor, Tablet, Smartphone, Save, Download, Globe, 
  Palette, Type, Layout, Sliders, Sparkles, Check, Copy, Eye, RefreshCw, X, User, 
  Image as ImageIcon, ZoomIn, ZoomOut, RotateCcw, RotateCw, Layers, FileText, 
  ChevronRight, ChevronDown, Wand2, SlidersHorizontal, Square, MoveUp, MoveDown, 
  CheckCircle2, AlertCircle, UploadCloud, SlidersVertical, Edit3, ExternalLink, Plus,
  Copy as DuplicateIcon, Trash2, EyeOff, LayoutGrid, Box, MessageSquare, HelpCircle,
  Users, Award, PhoneCall, Zap, MousePointer
} from 'lucide-react';
import TemplateRenderer from './TemplateRenderer';
import confetti from 'canvas-confetti';
import { TEMPLATES_DATA } from '../data/templatesData';
import { apiFetch, getApiUrl } from '../api';

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

const SECTION_PRESETS = [
  { type: 'hero', name: 'Hero Banner', icon: Layout, desc: 'Large title, tagline, cta button, and media' },
  { type: 'about', name: 'About Story', icon: FileText, desc: 'Brand heritage, mission, and image block' },
  { type: 'services', name: 'Services & Products', icon: LayoutGrid, desc: 'Showcase grid for items, pricing, tags' },
  { type: 'features', name: 'Features & Value', icon: Sparkles, desc: 'Icon grid highlighting core capabilities' },
  { type: 'gallery', name: 'Photo Gallery', icon: ImageIcon, desc: 'Visual image grid' },
  { type: 'portfolio', name: 'Selected Works', icon: Eye, desc: 'Project case studies & lookbook' },
  { type: 'testimonials', name: 'Testimonials', icon: MessageSquare, desc: 'Star rating reviews & client quotes' },
  { type: 'team', name: 'Team & Leadership', icon: Users, desc: 'Team member cards & roles' },
  { type: 'pricing', name: 'Pricing Tiers', icon: Award, desc: 'Package options with checkmark features' },
  { type: 'faq', name: 'FAQ & Help', icon: HelpCircle, desc: 'Question & answer accordion list' },
  { type: 'contact', name: 'Contact Form', icon: PhoneCall, desc: 'Store details & direct message form' },
  { type: 'cta', name: 'Call to Action', icon: Zap, desc: 'High conversion banner block' },
  { type: 'custom_box', name: 'Custom Box Section', icon: Box, desc: 'Container cards with text, image, and button' }
];

class EditorErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Editor Error Boundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center text-white my-8 max-w-xl mx-auto shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display">Canvas Rendering Interrupted</h3>
          <p className="text-xs text-slate-400">An unexpected error occurred while rendering the template canvas. Your website edits are safely preserved.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md"
          >
            Reset Canvas View
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function VisualEditor({ 
  template, 
  initialSite = null,
  user = null,
  onRequireAuth,
  onSaveSite, 
  onBack 
}) {
  const [leftTab, setLeftTab] = useState('sections');
  const [rightTab, setRightTab] = useState('branding');
  const [mobileTab, setMobileTab] = useState('preview');
  
  const [viewportMode, setViewportMode] = useState('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editorActivePage, setEditorActivePage] = useState('/');
  
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  const [saveStatus, setSaveStatus] = useState('saved');
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedSiteData, setSavedSiteData] = useState(initialSite);

  const [uploadingSlot, setUploadingSlot] = useState(null);
  const fileInputRef = useRef(null);

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
        sectionsOrder: initialSite.customData.sectionsOrder || template.defaultData?.sectionsOrder || ['hero', 'features', 'about', 'services', 'pricing', 'testimonials', 'contact'],
        customSections: initialSite.customData.customSections || [],
        customBoxes: initialSite.customData.customBoxes || [],
        customButtons: initialSite.customData.customButtons || [],
        customPages: initialSite.customData.customPages || [],
        customTextBlocks: initialSite.customData.customTextBlocks || []
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
      sectionsOrder: template.defaultData?.sectionsOrder || ['hero', 'features', 'about', 'services', 'pricing', 'testimonials', 'contact'],
      customSections: [],
      customBoxes: [],
      customButtons: [],
      customPages: [],
      customTextBlocks: []
    };
  });

  const [siteTitle, setSiteTitle] = useState(initialSite?.title || `${template.title} Customized`);

  const [history, setHistory] = useState([customState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        const payload = {
          userId: user?.id,
          siteId: initialSite?.siteId || savedSiteData?.siteId,
          templateId: template.id,
          title: siteTitle,
          accentColor: customState.accentColor,
          fontFamily: customState.fontFamily,
          bgTheme: customState.bgTheme,
          customData: customState,
          isPublished: Boolean(initialSite?.isPublished || savedSiteData?.isPublished)
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const pushToHistory = (newState) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newState);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
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

  const handleTextChange = (key, value) => {
    pushToHistory({
      ...customState,
      [key]: value
    });
  };

  const handleUpdateContent = (keyPath, value) => {
    if (keyPath.startsWith('feature_')) {
      const parts = keyPath.split('_');
      const idx = parseInt(parts[1], 10);
      const prop = parts[2];
      const updatedFeatures = [...(customState.features || template.defaultData?.features || [])];
      if (updatedFeatures[idx]) {
        updatedFeatures[idx] = { ...updatedFeatures[idx], [prop]: value };
        pushToHistory({ ...customState, features: updatedFeatures });
        return;
      }
    }
    if (keyPath.startsWith('service_')) {
      const parts = keyPath.split('_');
      const idx = parseInt(parts[1], 10);
      const prop = parts[2];
      const updatedServices = [...(customState.services || template.defaultData?.services || [])];
      if (updatedServices[idx]) {
        updatedServices[idx] = { ...updatedServices[idx], [prop]: value };
        pushToHistory({ ...customState, services: updatedServices });
        return;
      }
    }
    if (keyPath.startsWith('testimonial_')) {
      const parts = keyPath.split('_');
      const idx = parseInt(parts[1], 10);
      const prop = parts[2];
      const updatedTestimonials = [...(customState.testimonials || template.defaultData?.testimonials || [])];
      if (updatedTestimonials[idx]) {
        updatedTestimonials[idx] = { ...updatedTestimonials[idx], [prop]: value };
        pushToHistory({ ...customState, testimonials: updatedTestimonials });
        return;
      }
    }
    if (keyPath.startsWith('navLink_')) {
      const parts = keyPath.split('_');
      const idx = parseInt(parts[1], 10);
      const prop = parts[2];
      const updatedNavLinks = [...(customState.navLinks || template.defaultData?.navLinks || [])];
      if (updatedNavLinks[idx]) {
        updatedNavLinks[idx] = { ...updatedNavLinks[idx], [prop]: value };
        pushToHistory({ ...customState, navLinks: updatedNavLinks });
        return;
      }
    }
    if (keyPath.startsWith('custom_sec_')) {
      const parts = keyPath.split('_');
      const secId = parts[2];
      const prop = parts[3];
      const updatedCustomSecs = (customState.customSections || []).map(sec => {
        if (sec.id === secId) {
          return { ...sec, [prop]: value };
        }
        return sec;
      });
      pushToHistory({ ...customState, customSections: updatedCustomSecs });
      return;
    }

    handleTextChange(keyPath, value);
  };

  const handleMoveSection = (index, direction) => {
    const sections = [...(customState.sectionsOrder || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    
    const temp = sections[index];
    sections[index] = sections[targetIdx];
    sections[targetIdx] = temp;
    
    pushToHistory({ ...customState, sectionsOrder: sections });
  };

  const handleDuplicateSection = (index) => {
    const sections = [...(customState.sectionsOrder || [])];
    const secToDup = sections[index];
    const newSecId = `custom_sec_${Date.now()}`;
    sections.splice(index + 1, 0, newSecId);

    const customSecs = [...(customState.customSections || [])];
    customSecs.push({
      id: newSecId,
      title: `${typeof secToDup === 'string' ? secToDup.toUpperCase() : 'CUSTOM'} Section Copy`,
      subtitle: 'Duplicated custom content section',
      items: [
        { title: 'Feature Item 1', desc: 'Description of custom service card', buttonText: 'Learn More', buttonLink: '/about' },
        { title: 'Feature Item 2', desc: 'Description of custom service card', buttonText: 'Contact Us', buttonLink: '/contact' }
      ]
    });

    pushToHistory({ ...customState, sectionsOrder: sections, customSections: customSecs });
  };

  const handleDeleteSection = (index) => {
    const sections = [...(customState.sectionsOrder || [])];
    sections.splice(index, 1);
    pushToHistory({ ...customState, sectionsOrder: sections });
  };

  const handleAddPresetSection = (presetType) => {
    const newSecId = `custom_${presetType}_${Date.now()}`;
    const sections = [...(customState.sectionsOrder || []), newSecId];

    const newSecObj = {
      id: newSecId,
      type: presetType,
      title: `${presetType.toUpperCase()} Section`,
      subtitle: 'Customizable section layout block',
      items: [
        { title: 'Headline Title 1', desc: 'Detailed description for this custom block.', buttonText: 'Explore', buttonLink: '/services' },
        { title: 'Headline Title 2', desc: 'Detailed description for this custom block.', buttonText: 'Inquire', buttonLink: '/contact' }
      ]
    };

    const customSecs = [...(customState.customSections || []), newSecObj];
    setShowAddSectionModal(false);
    pushToHistory({ ...customState, sectionsOrder: sections, customSections: customSecs });
  };

  const handleAddCustomText = (textType = 'heading') => {
    const newTextObj = {
      id: `txt_${Date.now()}`,
      type: textType,
      content: textType === 'heading' ? 'New Custom Heading' : textType === 'paragraph' ? 'Add your custom paragraph description here.' : 'Custom Label',
      fontSize: textType === 'heading' ? 'text-2xl' : 'text-sm',
      fontWeight: textType === 'heading' ? 'font-bold' : 'font-normal',
      color: customState.accentColor || '#2563eb'
    };

    const updatedTextBlocks = [...(customState.customTextBlocks || []), newTextObj];
    pushToHistory({ ...customState, customTextBlocks: updatedTextBlocks });
  };

  const handleAddCustomBox = () => {
    const newBoxObj = {
      id: `box_${Date.now()}`,
      title: 'New Custom Box Card',
      description: 'Highlight your custom services, features, or product packages here.',
      imageUrl: template.image,
      buttonText: 'Learn More',
      buttonLink: '/about',
      backgroundColor: customState.bgTheme === 'dark' ? '#0f172a' : '#ffffff',
      borderColor: '#e2e8f0',
      borderRadius: 'rounded-2xl',
      shadow: 'shadow-md'
    };

    const updatedBoxes = [...(customState.customBoxes || []), newBoxObj];
    const customSecId = `custom_box_sec_${Date.now()}`;
    const sections = [...(customState.sectionsOrder || []), customSecId];

    const customSecs = [...(customState.customSections || [])];
    customSecs.push({
      id: customSecId,
      title: 'Custom Content Cards',
      subtitle: 'Personalized interactive container boxes',
      items: updatedBoxes
    });

    pushToHistory({ ...customState, sectionsOrder: sections, customSections: customSecs, customBoxes: updatedBoxes });
  };

  const handleAddCustomButton = () => {
    const newBtn = {
      id: `btn_${Date.now()}`,
      label: 'Explore Offerings',
      link: '/services',
      style: 'solid',
      bg: customState.accentColor || '#2563eb',
      textColor: '#ffffff',
      radius: 'rounded-xl'
    };

    const updatedButtons = [...(customState.customButtons || []), newBtn];
    pushToHistory({ ...customState, customButtons: updatedButtons });
  };

  const handleAddCustomPageSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newPageName || !newPageSlug) return;

    const cleanSlug = newPageSlug.replace(/^\/+/, '').toLowerCase();
    const newPage = {
      name: newPageName,
      slug: cleanSlug,
      href: `/${cleanSlug}`
    };

    const updatedNavLinks = [...(customState.navLinks || template.defaultData?.navLinks || []), { label: newPageName, href: `/${cleanSlug}` }];
    const updatedPages = [...(customState.customPages || []), newPage];

    setShowAddPageModal(false);
    setNewPageName('');
    setNewPageSlug('');
    setEditorActivePage(`/${cleanSlug}`);

    pushToHistory({ ...customState, navLinks: updatedNavLinks, customPages: updatedPages });
  };

  const [showImageModal, setShowImageModal] = useState(false);
  const [activeImageSlot, setActiveImageSlot] = useState('');
  const [imageModalTab, setImageModalTab] = useState('upload');
  const [imageModalUrlInput, setImageModalUrlInput] = useState('');
  const [imageModalAltInput, setImageModalAltInput] = useState('');
  const [imageModalFitMode, setImageModalFitMode] = useState('contain');
  const [imageModalPosition, setImageModalPosition] = useState('center');
  const [imageModalAlign, setImageModalAlign] = useState('center');
  const [imageModalWidth, setImageModalWidth] = useState('');
  const [imageModalHeight, setImageModalHeight] = useState('');
  const [imageModalLockAspect, setImageModalLockAspect] = useState(true);
  const [imageOriginalRatio, setImageOriginalRatio] = useState(1);
  const [imageModalPreview, setImageModalPreview] = useState('');
  const [imageModalError, setImageModalError] = useState('');
  const [imageModalLoading, setImageModalLoading] = useState(false);

  const handleWidthChange = (val) => {
    const numVal = parseInt(val, 10);
    if (isNaN(numVal) || numVal <= 0) {
      setImageModalWidth('');
      return;
    }
    setImageModalWidth(numVal);
    if (imageModalLockAspect && imageOriginalRatio > 0) {
      setImageModalHeight(Math.round(numVal / imageOriginalRatio));
    }
  };

  const handleHeightChange = (val) => {
    const numVal = parseInt(val, 10);
    if (isNaN(numVal) || numVal <= 0) {
      setImageModalHeight('');
      return;
    }
    setImageModalHeight(numVal);
    if (imageModalLockAspect && imageOriginalRatio > 0) {
      setImageModalWidth(Math.round(numVal * imageOriginalRatio));
    }
  };

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

  const triggerImageUpload = (slotKey) => {
    if (!slotKey) return;
    const safeSlot = typeof slotKey === 'string' ? slotKey : '';
    setActiveImageSlot(safeSlot);
    const rawExisting = customState[safeSlot] || template.defaultData?.[safeSlot] || template.image;
    const existingUrl = getImageUrl(rawExisting, template.image || '');
    setImageModalPreview(existingUrl);
    setImageModalUrlInput(typeof existingUrl === 'string' && existingUrl.startsWith('http') ? existingUrl : '');
    setImageModalAltInput(typeof customState[`${safeSlot}_alt`] === 'string' ? customState[`${safeSlot}_alt`] : '');
    setImageModalFitMode(customState[`${safeSlot}_fitMode`] || 'contain');
    setImageModalPosition(customState[`${safeSlot}_position`] || 'center');
    setImageModalAlign(customState[`${safeSlot}_align`] || 'center');
    setImageModalWidth(customState[`${safeSlot}_width`] || '');
    setImageModalHeight(customState[`${safeSlot}_height`] || '');
    setImageModalLockAspect(true);
    setImageModalError('');
    setImageModalTab('upload');
    setShowImageModal(true);
  };

  const handlePreviewImageUrl = () => {
    if (!imageModalUrlInput || !imageModalUrlInput.trim()) {
      setImageModalError('Please enter a valid image URL.');
      return;
    }
    const cleanUrl = imageModalUrlInput.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('data:image/')) {
      setImageModalError('URL must start with http:// or https://');
      return;
    }

    setImageModalLoading(true);
    setImageModalError('');
    const img = new Image();
    img.onload = () => {
      setImageModalLoading(false);
      setImageModalPreview(cleanUrl);
      setImageModalError('');
    };
    img.onerror = () => {
      setImageModalLoading(false);
      setImageModalError('Unable to load this image. Please check the URL.');
    };
    img.src = cleanUrl;
  };

  const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.85) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL(file.type || 'image/jpeg', quality));
        };
        img.onerror = () => resolve(event.target.result);
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleModalFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    console.log("IMAGE FILE SELECTED:", file);
    console.log("FILE NAME:", file?.name);
    console.log("FILE TYPE:", file?.type);
    console.log("FILE SIZE:", file?.size);

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageModalError('Please upload JPG, PNG, JPEG or WEBP.');
      if (e.target) e.target.value = '';
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setImageModalError('Image size is too large. Max allowed size is 25MB.');
      if (e.target) e.target.value = '';
      return;
    }

    setImageModalLoading(true);
    setImageModalError('');

    try {
      // 1. Instant local object URL preview for immediate feedback
      const instantLocalUrl = URL.createObjectURL(file);
      setImageModalPreview(instantLocalUrl);

      // 2. Build FormData with field name 'image'
      const formData = new FormData();
      formData.append('image', file);

      for (const [key, value] of formData.entries()) {
        console.log("FORM DATA ENTRY:", key, value);
      }

      // 3. Post to backend upload endpoint
      const res = await apiFetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP status ${res.status}`);
      }

      const data = await res.json();
      console.log("UPLOAD BACKEND RESPONSE:", data);

      if (data.success && (data.url || data.imageUrl)) {
        const returnedUrl = data.url || data.imageUrl;
        const resolvedUrl = getImageUrl(returnedUrl);
        setImageModalPreview(resolvedUrl);
        setImageModalUrlInput(resolvedUrl);
        setImageModalError('');
      } else {
        throw new Error(data.message || 'Image upload failed.');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setImageModalError('Image upload failed. Please try again.');
    } finally {
      setImageModalLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleApplyModalImage = () => {
    if (!imageModalPreview || imageModalError) {
      setImageModalError('Please provide a valid image before applying.');
      return;
    }

    handleUpdateContent(activeImageSlot, imageModalPreview);
    if (imageModalAltInput !== undefined) {
      handleTextChange(`${activeImageSlot}_alt`, imageModalAltInput);
    }
    if (imageModalFitMode) {
      handleTextChange(`${activeImageSlot}_fitMode`, imageModalFitMode);
    }
    if (imageModalPosition) {
      handleTextChange(`${activeImageSlot}_position`, imageModalPosition);
    }
    if (imageModalAlign) {
      handleTextChange(`${activeImageSlot}_align`, imageModalAlign);
    }
    if (imageModalWidth !== undefined) {
      handleTextChange(`${activeImageSlot}_width`, imageModalWidth);
    }
    if (imageModalHeight !== undefined) {
      handleTextChange(`${activeImageSlot}_height`, imageModalHeight);
    }

    setShowImageModal(false);
    setActiveImageSlot('');
    setImageModalError('');
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
        setMobileTab('preview');
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
          onClick={() => setLeftTab('add_content')}
          className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${
            leftTab === 'add_content' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          + Add Content
        </button>
        <button
          onClick={() => setLeftTab('pages')}
          className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${
            leftTab === 'pages' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Pages
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {leftTab === 'sections' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
                Section Manager & Order
              </span>
              <button
                onClick={() => setShowAddSectionModal(true)}
                className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-bold flex items-center space-x-1 shadow-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-2">
              {(customState.sectionsOrder || []).map((sec, i) => {
                const secName = typeof sec === 'string' ? sec : (sec.type || 'Custom');
                return (
                  <div key={i} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-xs text-slate-200 font-medium group">
                    <div className="flex items-center space-x-2 truncate">
                      <Layers className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                      <span className="capitalize truncate">{secName}</span>
                    </div>

                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button onClick={() => handleMoveSection(i, 'up')} disabled={i === 0} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30">
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleMoveSection(i, 'down')} disabled={i === (customState.sectionsOrder || []).length - 1} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30">
                        <MoveDown className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDuplicateSection(i)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Duplicate">
                        <DuplicateIcon className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDeleteSection(i)} className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400" title="Delete">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {leftTab === 'add_content' && (
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
              Add New Content Blocks
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleAddCustomText('heading')}
                className="p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left space-y-1.5 transition-all"
              >
                <Type className="w-4 h-4 text-amber-400" />
                <p className="text-xs font-bold text-white">+ Add Heading</p>
                <p className="text-[9px] text-slate-400">Insert custom title block</p>
              </button>

              <button
                onClick={() => triggerImageUpload('heroImageUrl')}
                className="p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left space-y-1.5 transition-all"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-bold text-white">+ Add Image</p>
                <p className="text-[9px] text-slate-400">Upload or replace media</p>
              </button>

              <button
                onClick={handleAddCustomBox}
                className="p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left space-y-1.5 transition-all"
              >
                <Box className="w-4 h-4 text-brand-400" />
                <p className="text-xs font-bold text-white">+ Add Box Card</p>
                <p className="text-[9px] text-slate-400">Container card with text/button</p>
              </button>

              <button
                onClick={handleAddCustomButton}
                className="p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left space-y-1.5 transition-all"
              >
                <MousePointer className="w-4 h-4 text-purple-400" />
                <p className="text-xs font-bold text-white">+ Add Button</p>
                <p className="text-[9px] text-slate-400">Styled CTA button</p>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddPageModal(true)}
                className="w-full p-3 rounded-2xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/40 text-brand-300 font-bold text-xs flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Custom Sub-Page</span>
              </button>
            </div>
          </div>
        )}

        {leftTab === 'pages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
                Website Sub-Pages
              </span>
              <button
                onClick={() => setShowAddPageModal(true)}
                className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-bold flex items-center space-x-1 shadow-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Add Page</span>
              </button>
            </div>

            <div className="space-y-2">
              {(customState.navLinks || template.defaultData?.navLinks || []).map((link, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                    <span className="font-bold text-white truncate">{link.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">{link.href}</span>
                  </div>
                  <button
                    onClick={() => setEditorActivePage(link.href)}
                    className="px-2 py-1 rounded bg-slate-700 text-[10px] font-bold text-white hover:bg-brand-600"
                  >
                    View
                  </button>
                </div>
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
        <button onClick={() => setRightTab('branding')} className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${rightTab === 'branding' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
          Colors
        </button>
        <button onClick={() => setRightTab('typography')} className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${rightTab === 'typography' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
          Fonts
        </button>
        <button onClick={() => setRightTab('content')} className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${rightTab === 'content' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
          Text Content
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {rightTab === 'branding' && (
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
              Brand & Color Palette
            </span>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Website Title</label>
              <input type="text" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Logo Brand Text</label>
              <input type="text" value={customState.logoText || ''} onChange={(e) => handleTextChange('logoText', e.target.value)} placeholder="e.g. VoltTech Store" className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Accent Hex Color</label>
              <div className="flex items-center space-x-2">
                <input type="color" value={customState.accentColor} onChange={(e) => handleTextChange('accentColor', e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer" />
                <span className="text-xs font-mono text-slate-300">{customState.accentColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Curated Palettes</label>
              <div className="grid grid-cols-3 gap-2">
                {CURATED_COLORS.map((c) => (
                  <button key={c.name} onClick={() => handleTextChange('accentColor', c.hex)} className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-600 flex items-center space-x-1.5">
                    <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.hex }} />
                    <span className="text-[10px] text-slate-300 truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Background Theme</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleTextChange('bgTheme', 'light')} className={`py-2 px-3 rounded-xl text-xs font-bold border ${customState.bgTheme === 'light' ? 'bg-white text-slate-950 border-white' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>
                  Light Mode
                </button>
                <button onClick={() => handleTextChange('bgTheme', 'dark')} className={`py-2 px-3 rounded-xl text-xs font-bold border ${customState.bgTheme === 'dark' ? 'bg-slate-950 text-white border-slate-700' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>
                  Dark Mode
                </button>
              </div>
            </div>
          </div>
        )}

        {rightTab === 'typography' && (
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
              Typography & Fonts
            </span>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'sans', name: 'Inter Sans', sample: 'Modern & Clean' },
                { id: 'serif', name: 'Playfair Serif', sample: 'Luxury & Elegant' },
                { id: 'display', name: 'Outfit Display', sample: 'Bold & High-Energy' },
                { id: 'mono', name: 'JetBrains Mono', sample: 'Technical Code' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleTextChange('fontFamily', f.id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    customState.fontFamily === f.id ? 'bg-brand-600 text-white border-brand-500' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{f.name}</p>
                  <p className="text-[10px] opacity-75 mt-1">{f.sample}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {rightTab === 'content' && (
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-display">
              Main Headlines & Text
            </span>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Title</label>
              <textarea rows={2} value={customState.heroTitle || ''} onChange={(e) => handleTextChange('heroTitle', e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white resize-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Subtitle</label>
              <textarea rows={3} value={customState.heroSubtitle || ''} onChange={(e) => handleTextChange('heroSubtitle', e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white resize-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">About Story Title</label>
              <input type="text" value={customState.aboutTitle || ''} onChange={(e) => handleTextChange('aboutTitle', e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">About Story Text</label>
              <textarea rows={3} value={customState.aboutDesc || ''} onChange={(e) => handleTextChange('aboutDesc', e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white resize-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCenterCanvasContent = (isMobile) => (
    <div className={`w-full flex flex-col items-center justify-start ${isMobile ? 'p-2' : ''}`}>
      
      {savedSiteData?.isPublished && savedSiteData?.slug && (
        <div className="w-full max-w-4xl mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-2 truncate">
            <Globe className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">Live URL: {window.location.origin}/site/{savedSiteData.slug}</span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button onClick={handleCopyPublishedLink} className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all">
              {copiedLink ? 'Copied Link!' : 'Copy Link'}
            </button>
            <a href={`/site/${savedSiteData.slug}`} target="_blank" rel="noreferrer" className="p-1 text-emerald-300 hover:text-white">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      <div 
        className="w-full transition-all duration-300 origin-top flex justify-center"
        style={{ transform: isMobile ? 'none' : `scale(${zoomLevel / 100})` }}
      >
        <div className={`bg-white text-slate-900 w-full max-w-full ${isMobile ? 'rounded-2xl border border-slate-800 shadow-xl overflow-hidden' : 'rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl overflow-hidden min-h-[600px] sm:min-h-[800px]'}`}>
          <EditorErrorBoundary>
            <TemplateRenderer
              template={template}
              customData={customState}
              accentColor={customState.accentColor}
              fontFamily={customState.fontFamily}
              bgTheme={customState.bgTheme}
              viewportMode={isMobile ? 'full' : viewportMode}
              activePath={editorActivePage}
              onNavigate={(path) => setEditorActivePage(path)}
              isEditMode={!isPreviewMode}
              onUpdateContent={handleUpdateContent}
              onTriggerImageUpload={(slot) => triggerImageUpload(slot)}
              onSectionMove={(idx, dir) => handleMoveSection(idx, dir)}
              onSectionDuplicate={(idx) => handleDuplicateSection(idx)}
              onSectionDelete={(idx) => handleDeleteSection(idx)}
            />
          </EditorErrorBoundary>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white font-sans overflow-x-hidden select-none max-w-full w-full">
      
      <input type="file" ref={fileInputRef} onChange={handleFileSelected} accept="image/*" className="hidden" />

      <header className="h-14 bg-slate-900 border-b border-slate-800/80 px-2 sm:px-4 flex items-center justify-between z-30 flex-shrink-0 w-full max-w-full">
        
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
          <button onClick={onBack} className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0" title="Back to Catalog">
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3 border-r border-slate-800 pr-2 sm:pr-4 overflow-hidden">
            <span className="font-extrabold text-xs sm:text-sm text-white font-display truncate max-w-[90px] sm:max-w-none">Nexora</span>
            
            {saveStatus === 'saving' && (
              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center space-x-1 animate-pulse flex-shrink-0">
                <RefreshCw className="w-2.5 h-2.5 animate-spin text-brand-400" />
                <span className="hidden xs:inline">Saving...</span>
              </span>
            )}

            {saveStatus === 'saved' && (
              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1 flex-shrink-0">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                <span className="hidden xs:inline">Saved</span>
              </span>
            )}
          </div>

          <div className="hidden sm:flex items-center space-x-1 flex-shrink-0">
            <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors" title="Undo (Ctrl+Z)">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors" title="Redo (Ctrl+Y)">
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button onClick={() => setViewportMode('desktop')} className={`p-1.5 rounded-lg text-xs transition-colors ${viewportMode === 'desktop' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`} title="Desktop View">
              <Monitor className="w-4 h-4" />
            </button>
            <button onClick={() => setViewportMode('tablet')} className={`p-1.5 rounded-lg text-xs transition-colors ${viewportMode === 'tablet' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`} title="Tablet View">
              <Tablet className="w-4 h-4" />
            </button>
            <button onClick={() => setViewportMode('mobile')} className={`p-1.5 rounded-lg text-xs transition-colors ${viewportMode === 'mobile' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`} title="Mobile View">
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {(customState.navLinks || template.defaultData?.navLinks || [
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Services', href: '/services' },
              { label: 'Contact', href: '/contact' }
            ]).slice(0, 4).map((link, idx) => {
              const isPillActive = (link.href === '/' && (editorActivePage === '/' || editorActivePage === 'home')) ||
                (link.href !== '/' && editorActivePage.toLowerCase().includes(link.href.toLowerCase()));
              return (
                <button
                  key={idx}
                  onClick={() => setEditorActivePage(link.href)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    isPillActive ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          <button onClick={() => setIsPreviewMode(!isPreviewMode)} className={`hidden md:flex px-3 py-1.5 rounded-xl text-xs font-bold transition-all items-center space-x-1.5 ${isPreviewMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'}`}>
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
          </button>

          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handlePublishClick} className="px-3 sm:px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md flex items-center space-x-1">
            <Save className="w-3.5 h-3.5" />
            <span>Publish</span>
          </motion.button>
        </div>

      </header>

      <div className="md:hidden flex-1 flex flex-col w-full max-w-full overflow-x-hidden overflow-y-auto relative bg-slate-950 box-border">
        {mobileTab === 'sections' && renderLeftSidebarContent()}
        {mobileTab === 'preview' && renderCenterCanvasContent(true)}
        {mobileTab === 'settings' && renderRightInspectorContent()}
      </div>

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

      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full max-w-full h-16 bg-slate-900 border-t border-slate-800/90 px-2 sm:px-4 flex items-center justify-around z-50 pb-safe shadow-2xl box-border">
        <button onClick={() => setMobileTab('sections')} className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${mobileTab === 'sections' ? 'text-brand-400 font-bold bg-slate-800 scale-105' : 'text-slate-400 hover:text-white'}`}>
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-display">Sections</span>
        </button>

        <button onClick={() => setMobileTab('preview')} className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${mobileTab === 'preview' ? 'text-brand-400 font-bold bg-slate-800 scale-105' : 'text-slate-400 hover:text-white'}`}>
          <Eye className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-display">Preview</span>
        </button>

        <button onClick={() => setMobileTab('settings')} className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${mobileTab === 'settings' ? 'text-brand-400 font-bold bg-slate-800 scale-105' : 'text-slate-400 hover:text-white'}`}>
          <Sliders className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-display">Settings</span>
        </button>
      </nav>

      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold font-display">Select Section Preset To Insert</h3>
              <button onClick={() => setShowAddSectionModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 max-h-[60vh] overflow-y-auto">
              {SECTION_PRESETS.map((sec) => {
                const IconComp = sec.icon;
                return (
                  <button
                    key={sec.type}
                    onClick={() => handleAddPresetSection(sec.type)}
                    className="p-3.5 rounded-2xl bg-slate-800 hover:bg-brand-600 border border-slate-700 text-left space-y-1.5 transition-all group"
                  >
                    <IconComp className="w-5 h-5 text-brand-400 group-hover:text-white" />
                    <p className="text-xs font-bold text-white">{sec.name}</p>
                    <p className="text-[9px] text-slate-400 group-hover:text-slate-200 line-clamp-2">{sec.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showAddPageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold font-display">Create Custom Sub-Page</h3>
              <button onClick={() => setShowAddPageModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomPageSubmit} className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Page Name</label>
                <input
                  type="text"
                  required
                  value={newPageName}
                  onChange={(e) => {
                    setNewPageName(e.target.value);
                    if (!newPageSlug) {
                      setNewPageSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  placeholder="e.g. FAQ or Team"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL Route Slug</label>
                <input
                  type="text"
                  required
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="e.g. faq or team"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowAddPageModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md">
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-4 sm:p-6 text-white shadow-2xl space-y-3.5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-brand-400" />
                  <span>Edit / Replace Image</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Slot: <span className="font-mono text-brand-300">{activeImageSlot}</span></p>
              </div>
              <button onClick={() => setShowImageModal(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs: Upload vs URL */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setImageModalTab('upload'); setImageModalError(''); }}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${imageModalTab === 'upload' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Image</span>
              </button>
              <button
                type="button"
                onClick={() => { setImageModalTab('url'); setImageModalError(''); }}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${imageModalTab === 'url' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Globe className="w-4 h-4" />
                <span>Image URL</span>
              </button>
            </div>

            {/* Tab Body */}
            {imageModalTab === 'upload' ? (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Choose Image File (JPG, PNG, WEBP, GIF)</label>
                <div className="border-2 border-dashed border-slate-700 hover:border-brand-500 rounded-2xl p-5 text-center bg-slate-950/60 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleModalFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <UploadCloud className="w-7 h-7 text-brand-400 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-200">Click or Drag & Drop image file here</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Supports JPG, PNG, WEBP, GIF up to 10MB</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Paste External Image URL</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={imageModalUrlInput}
                    onChange={(e) => setImageModalUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-0"
                  />
                  <button
                    type="button"
                    onClick={handlePreviewImageUrl}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex-shrink-0"
                  >
                    Preview
                  </button>
                </div>
              </div>
            )}

            {/* Dimensions & Alignment Controls */}
            <div className="space-y-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-200">Image Dimensions (Canvas px)</span>
                <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-slate-300 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={imageModalLockAspect}
                    onChange={(e) => setImageModalLockAspect(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-brand-600 focus:ring-brand-500"
                  />
                  <span>Lock Aspect Ratio</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Width (px)</label>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleWidthChange(Math.max(20, (parseInt(imageModalWidth, 10) || 300) - 20))}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={imageModalWidth}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      placeholder="Auto"
                      className="w-full px-2 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-center"
                    />
                    <button
                      type="button"
                      onClick={() => handleWidthChange((parseInt(imageModalWidth, 10) || 300) + 20)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Height (px)</label>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleHeightChange(Math.max(20, (parseInt(imageModalHeight, 10) || 200) - 20))}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={imageModalHeight}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      placeholder="Auto"
                      className="w-full px-2 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-center"
                    />
                    <button
                      type="button"
                      onClick={() => handleHeightChange((parseInt(imageModalHeight, 10) || 200) + 20)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Alignment Selector */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Canvas Alignment</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => setImageModalAlign(align)}
                      className={`py-1 rounded-lg text-[11px] font-bold capitalize text-center transition-all ${imageModalAlign === align ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Fit Controls */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300">Image Fit Mode</label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {[
                  { id: 'contain', label: 'Contain (Entire)' },
                  { id: 'cover', label: 'Cover (Fill)' },
                  { id: 'fill', label: 'Fill (Stretch)' }
                ].map(fit => (
                  <button
                    key={fit.id}
                    type="button"
                    onClick={() => setImageModalFitMode(fit.id)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all truncate ${imageModalFitMode === fit.id ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {fit.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Position Controls (Visible when Cover is selected) */}
            {imageModalFitMode === 'cover' && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-300">Focal Position (Cover Mode)</label>
                <div className="grid grid-cols-5 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px]">
                  {['center', 'top', 'bottom', 'left', 'right'].map(pos => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setImageModalPosition(pos)}
                      className={`py-1 rounded-lg font-bold capitalize text-center transition-all truncate ${imageModalPosition === pos ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Alt Text Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-300">Alt Text Description (SEO & Accessibility)</label>
              <input
                type="text"
                value={imageModalAltInput}
                onChange={(e) => setImageModalAltInput(e.target.value)}
                placeholder="Describe image content..."
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Error Message */}
            {imageModalError && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{imageModalError}</span>
              </div>
            )}

            {/* Live Preview Box */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Live Image Preview</span>
              <div className="w-full h-48 sm:h-56 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center relative p-2">
                {imageModalLoading ? (
                  <div className="flex flex-col items-center justify-center text-brand-400 space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-bold">Loading Image Preview...</span>
                  </div>
                ) : imageModalPreview ? (
                  <img
                    src={imageModalPreview}
                    alt={imageModalAltInput || 'Preview'}
                    onLoad={(e) => {
                      if (e.target.naturalWidth && e.target.naturalHeight) {
                        setImageOriginalRatio(e.target.naturalWidth / e.target.naturalHeight);
                      }
                    }}
                    className={`max-w-full max-h-full ${imageModalFitMode === 'cover' ? 'object-cover w-full h-full' : imageModalFitMode === 'fill' ? 'object-fill w-full h-full' : 'object-contain'} object-${imageModalPosition} rounded-xl shadow-md transition-all`}
                    onError={() => setImageModalError('Unable to load this image. Please check the URL.')}
                  />
                ) : (
                  <span className="text-xs text-slate-500 font-mono">No image loaded</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end space-x-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyModalImage}
                disabled={imageModalLoading || !imageModalPreview || Boolean(imageModalError)}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg transition-all flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Use Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
