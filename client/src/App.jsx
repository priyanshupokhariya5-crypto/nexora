import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SaaSPage from './components/SaaSPage';
import TemplateCatalog from './components/TemplateCatalog';
import VisualEditor from './components/VisualEditor';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import AdminThemeModal from './components/AdminThemeModal';
import PublicWebsite from './components/PublicWebsite';
import { TEMPLATES_DATA } from './data/templatesData';
import { apiFetch } from './api';
import { Loader2, AlertTriangle, ArrowLeft, LayoutGrid, Layers } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingSite, setEditingSite] = useState(null);
  const [savedWebsites, setSavedWebsites] = useState([]);
  const [publicSlug, setPublicSlug] = useState(null);

  const [editorLoading, setEditorLoading] = useState(false);
  const [editorError, setEditorError] = useState(null);

  // User Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminThemeOpen, setIsAdminThemeOpen] = useState(false);

  // Exactly 30 template presets
  const [templates, setTemplates] = useState(TEMPLATES_DATA.slice(0, 30));

  // FAILSAFE EFFECT: Authenticated users must NEVER have an active auth modal
  useEffect(() => {
    if (user && isAuthOpen) {
      setIsAuthOpen(false);
    }
  }, [user, isAuthOpen]);

  // Fetch Template Catalog when logged in (falls back gracefully to static TEMPLATES_DATA)
  useEffect(() => {
    if (user) {
      apiFetch('/api/templates')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.templates?.length > 0) {
            setTemplates(data.templates);
          }
        })
        .catch(err => console.error('Templates fetch error:', err));
    }
  }, [user]);

  // Load User Specific Websites
  const loadSavedWebsites = async (currentUser = user) => {
    if (!currentUser) {
      setSavedWebsites([]);
      return;
    }
    try {
      const endpoint = `/api/websites?userId=${currentUser.id}`;
      const res = await apiFetch(endpoint);
      const data = await res.json();
      if (data.success) {
        setSavedWebsites(data.websites || []);
      }
    } catch (err) {
      console.error('Initial websites fetch error:', err);
    }
  };

  useEffect(() => {
    loadSavedWebsites(user);
  }, [user]);

  // Helper to change view and sync browser URL
  const navigateToView = (view, path = null) => {
    setCurrentView(view);
    if (path && window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  // Primary URL Route Inspector for initial page load & browser refresh (popstate)
  useEffect(() => {
    const checkPathRoute = async () => {
      const path = window.location.pathname;
      const search = window.location.search;

      // 1. Standalone Published Site: /site/:slug (supports subpaths like /site/:slug/about)
      if (path.startsWith('/site/')) {
        const raw = path.replace('/site/', '').trim();
        const parts = raw.split('/').filter(Boolean);
        const slug = parts[0];
        const subPath = parts.length > 1 ? '/' + parts.slice(1).join('/') : '/';
        if (slug) {
          setPublicSlug({ slug, subPath });
          return;
        }
      }
      setPublicSlug(null);

      // 2. Visual Website Editor Route: /editor/...
      if (path.startsWith('/editor')) {
        const rawParam = path.replace('/editor', '').replace(/^\/+/, '').trim();

        // If not authenticated, open Auth Login modal
        if (!user) {
          setIsAuthOpen(true);
          setCurrentView('landing');
          if (path !== '/login') {
            window.history.replaceState(null, '', '/login');
          }
          return;
        }

        // New Site Creation: /editor/new?template=...
        if (!rawParam || rawParam === 'new') {
          const queryParams = new URLSearchParams(search);
          const templateId = queryParams.get('template');
          const tpl = templates.find(t => t.id === templateId) || TEMPLATES_DATA[0];
          setSelectedTemplate(tpl);
          setEditingSite(null);
          setEditorError(null);
          setCurrentView('editor');
          setIsAuthOpen(false);
          return;
        }

        // Existing Saved Site Recovery: /editor/:websiteId
        setEditorLoading(true);
        setEditorError(null);
        try {
          const res = await apiFetch(`/api/websites/${rawParam}`);
          const data = await res.json();
          if (data.success && data.website) {
            const site = data.website;
            const tpl = templates.find(t => t.id === site.templateId) || TEMPLATES_DATA[0];
            setSelectedTemplate(tpl);
            setEditingSite(site);
            setEditorError(null);
            setCurrentView('editor');
            setIsAuthOpen(false);
          } else {
            setEditorError(data.message || 'The requested website could not be found.');
            setCurrentView('editor_error');
          }
        } catch (err) {
          console.error('Editor site recovery error:', err);
          setEditorError('Failed to load website. Please check network connection.');
          setCurrentView('editor_error');
        } finally {
          setEditorLoading(false);
        }
        return;
      }

      // 3. User Dashboard Route: /dashboard
      if (path === '/dashboard') {
        if (!user) {
          setIsAuthOpen(true);
          setCurrentView('landing');
          window.history.replaceState(null, '', '/login');
        } else {
          setCurrentView('dashboard');
          setIsAuthOpen(false);
        }
        return;
      }

      // 4. Template Catalog Route: /templates
      if (path === '/templates') {
        if (!user) {
          setIsAuthOpen(true);
          setCurrentView('landing');
          window.history.replaceState(null, '', '/login');
        } else {
          setCurrentView('catalog');
          setIsAuthOpen(false);
        }
        return;
      }

      // 5. Auth Routes: /login or /register
      if (path === '/login' || path === '/register') {
        if (!user) {
          setIsAuthOpen(true);
          setCurrentView('landing');
        } else {
          setIsAuthOpen(false);
          navigateToView('dashboard', '/dashboard');
        }
        return;
      }

      // 6. Public Landing Page: /
      if (path === '/' || path === '') {
        setCurrentView('landing');
        if (user) {
          setIsAuthOpen(false);
        }
        return;
      }
    };

    checkPathRoute();
    window.addEventListener('popstate', checkPathRoute);
    return () => window.removeEventListener('popstate', checkPathRoute);
  }, [user]);

  const handleSelectTemplate = (template) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setSelectedTemplate(template);
    setEditingSite(null);
    setIsAuthOpen(false);
    navigateToView('editor', `/editor/new?template=${template.id}`);
  };

  const handleEditSite = (site) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    const tpl = templates.find(t => t.id === site.templateId) || TEMPLATES_DATA[0];
    setSelectedTemplate(tpl);
    setEditingSite(site);
    setIsAuthOpen(false);
    navigateToView('editor', `/editor/${site.siteId || site._id}`);
  };

  const handleSiteSaved = (newSite) => {
    setEditingSite(newSite);
    setSavedWebsites(prev => {
      const idx = prev.findIndex(s => s.siteId === newSite.siteId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newSite;
        return copy;
      }
      return [newSite, ...prev];
    });

    // Update browser URL if first save from /editor/new
    if (newSite.siteId && window.location.pathname.includes('/editor/new')) {
      window.history.replaceState(null, '', `/editor/${newSite.siteId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nexora_user');
    setUser(null);
    setSavedWebsites([]);
    setIsAuthOpen(false);
    navigateToView('landing', '/');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
    loadSavedWebsites(userData);

    const path = window.location.pathname;
    if (path === '/login' || path === '/register' || path === '/') {
      navigateToView('dashboard', '/dashboard');
    }
  };

  // Render Standalone Published Public Website Page
  if (publicSlug) {
    return <PublicWebsite slug={publicSlug} />;
  }

  // Render Full-Screen Editor Loading State
  if (editorLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <h3 className="text-xl font-bold font-display">Loading Nexora Editor...</h3>
        <p className="text-xs text-slate-400 mt-2">Restoring website workspace state</p>
      </div>
    );
  }

  // Render Full-Screen Editor Error / Not Found State
  if (currentView === 'editor_error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
        <div className="w-14 h-14 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold font-display text-white mb-2">Website Not Found</h2>
        <p className="text-xs text-slate-400 max-w-md mb-6">{editorError || 'The requested website editor link could not be loaded.'}</p>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateToView('dashboard', '/dashboard')}
            className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center space-x-2"
          >
            <Layers className="w-4 h-4" />
            <span>Go to My Websites</span>
          </button>
          <button
            onClick={() => navigateToView('catalog', '/templates')}
            className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center space-x-2"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Explore Templates</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-slate-900">
      
      {/* Navbar */}
      {currentView !== 'editor' && (
        <Navbar
          currentView={currentView}
          setCurrentView={(v) => {
            const p = v === 'landing' ? '/' : v === 'catalog' ? '/templates' : v === 'dashboard' ? '/dashboard' : null;
            navigateToView(v, p);
          }}
          templatesCount={templates.length}
          savedSitesCount={savedWebsites.length}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAdminThemes={() => setIsAdminThemeOpen(true)}
          onLogout={handleLogout}
        />
      )}

      {/* Main Views Router */}
      {currentView === 'landing' && (
        <SaaSPage
          templates={templates}
          onSelectTemplate={handleSelectTemplate}
          onExploreCatalog={() => {
            if (!user) {
              setIsAuthOpen(true);
            } else {
              navigateToView('catalog', '/templates');
            }
          }}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {currentView === 'catalog' && (
        <TemplateCatalog
          templates={templates}
          onSelectTemplate={handleSelectTemplate}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {currentView === 'editor' && selectedTemplate && (
        !user ? (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-white text-center">
            <h2 className="text-2xl font-bold font-display mb-2">Authentication Required</h2>
            <p className="text-xs text-slate-400 mb-6">Please log in or sign up to access the Nexora Visual Studio Editor.</p>
            <button
              onClick={() => { setIsAuthOpen(true); navigateToView('catalog', '/templates'); }}
              className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg"
            >
              Log In To Continue
            </button>
          </div>
        ) : (
          <VisualEditor
            template={selectedTemplate}
            initialSite={editingSite}
            user={user}
            onRequireAuth={() => setIsAuthOpen(true)}
            onSaveSite={handleSiteSaved}
            onBack={() => navigateToView('catalog', '/templates')}
          />
        )
      )}

      {currentView === 'dashboard' && (
        <Dashboard
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onEditSite={handleEditSite}
          onCreateNew={() => navigateToView('catalog', '/templates')}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Admin Theme Manager Modal (ADMIN ROLE ONLY) */}
      <AdminThemeModal
        isOpen={isAdminThemeOpen && user?.role === 'admin'}
        onClose={() => setIsAdminThemeOpen(false)}
        user={user}
      />

    </div>
  );
}
