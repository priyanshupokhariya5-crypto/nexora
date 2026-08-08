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

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingSite, setEditingSite] = useState(null);
  const [savedWebsites, setSavedWebsites] = useState([]);
  const [publicSlug, setPublicSlug] = useState(null);

  // Check URL pathname for /site/:slug routing
  useEffect(() => {
    const checkPathRoute = () => {
      const path = window.location.pathname;
      if (path.startsWith('/site/')) {
        const slug = path.replace('/site/', '').trim();
        if (slug) {
          setPublicSlug(slug);
          return;
        }
      }
      setPublicSlug(null);
    };

    checkPathRoute();
    window.addEventListener('popstate', checkPathRoute);
    return () => window.removeEventListener('popstate', checkPathRoute);
  }, []);

  // Exactly 30 template presets
  const templates = TEMPLATES_DATA.slice(0, 30);

  // User Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nexora_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminThemeOpen, setIsAdminThemeOpen] = useState(false);

  // Load User Specific Websites
  const loadSavedWebsites = async (currentUser = user) => {
    try {
      const endpoint = currentUser ? `/api/websites?userId=${currentUser.id}` : '/api/websites';
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

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setEditingSite(null);
    setCurrentView('editor');
  };

  const handleEditSite = (site) => {
    const tpl = templates.find(t => t.id === site.templateId) || templates[0];
    setSelectedTemplate(tpl);
    setEditingSite(site);
    setCurrentView('editor');
  };

  const handleSiteSaved = (newSite) => {
    setSavedWebsites(prev => {
      const idx = prev.findIndex(s => s.siteId === newSite.siteId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newSite;
        return copy;
      }
      return [newSite, ...prev];
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('nexora_user');
    setUser(null);
    setSavedWebsites([]);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    loadSavedWebsites(userData);
  };

  // If URL path is /site/:slug, render PublicWebsite standalone page
  if (publicSlug) {
    return <PublicWebsite slug={publicSlug} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-slate-900">
      
      {/* Navbar */}
      {currentView !== 'editor' && (
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
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
          onExploreCatalog={() => setCurrentView('catalog')}
        />
      )}

      {currentView === 'catalog' && (
        <TemplateCatalog
          templates={templates}
          onSelectTemplate={handleSelectTemplate}
        />
      )}

      {currentView === 'editor' && selectedTemplate && (
        <VisualEditor
          template={selectedTemplate}
          initialSite={editingSite}
          user={user}
          onRequireAuth={() => setIsAuthOpen(true)}
          onSaveSite={handleSiteSaved}
          onBack={() => setCurrentView('catalog')}
        />
      )}

      {currentView === 'dashboard' && (
        <Dashboard
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onEditSite={handleEditSite}
          onCreateNew={() => setCurrentView('catalog')}
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
