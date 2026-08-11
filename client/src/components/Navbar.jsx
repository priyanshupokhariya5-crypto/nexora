import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, LayoutGrid, ArrowRight, Zap, Layers, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  templatesCount = 0,
  savedSitesCount = 0,
  user = null,
  onOpenAuth,
  onOpenAdminThemes,
  onLogout 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-soft-md py-2.5' 
        : 'bg-white/90 backdrop-blur-md border-b border-slate-100 py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <motion.div 
          onClick={() => setCurrentView('landing')} 
          className="flex items-center space-x-3 cursor-pointer group select-none"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-600/25 group-hover:shadow-brand-600/40 transition-all duration-300">
            <Zap className="w-5 h-5 fill-current text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-display">
              Nexora
            </span>
          </div>
        </motion.div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80 relative">
          
          <button
            onClick={() => setCurrentView('landing')}
            className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-200 z-10 ${
              currentView === 'landing' ? 'text-brand-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {currentView === 'landing' && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-white rounded-xl shadow-soft-sm border border-slate-200/60 -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span>Home</span>
          </button>
          
          <button
            onClick={() => {
              if (!user) {
                onOpenAuth();
              } else {
                setCurrentView('catalog');
              }
            }}
            className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-200 z-10 flex items-center space-x-2 ${
              currentView === 'catalog' ? 'text-brand-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {currentView === 'catalog' && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-white rounded-xl shadow-soft-sm border border-slate-200/60 -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>30 Templates</span>
          </button>

          <button
            onClick={() => {
              if (!user) {
                onOpenAuth();
              } else {
                setCurrentView('dashboard');
              }
            }}
            className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-200 z-10 flex items-center space-x-2 ${
              currentView === 'dashboard' ? 'text-brand-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {currentView === 'dashboard' && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-white rounded-xl shadow-soft-sm border border-slate-200/60 -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Layers className="w-3.5 h-3.5" />
            <span>My Websites</span>
            {user && (
              <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded-md bg-slate-200 text-slate-700">
                {savedSitesCount}
              </span>
            )}
          </button>

        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2.5">

          {/* Admin Themes Access Button (ADMIN ONLY) */}
          {user?.role === 'admin' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAdminThemes}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-xs font-bold transition-all duration-200 shadow-soft-sm"
              title="Admin Template Themes Manager"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Admin Themes</span>
            </motion.button>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200/80 hover:bg-slate-200/70 transition-colors text-slate-900 text-xs font-bold shadow-soft-sm"
              >
                <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-soft-lg py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 text-xs">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => { setCurrentView('dashboard'); setDropdownOpen(false); }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <Layers className="w-3.5 h-3.5 text-brand-600" />
                      <span>My Websites</span>
                    </button>

                    {user?.role === 'admin' && (
                      <button
                        onClick={() => { onOpenAdminThemes(); setDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center space-x-2 border-t border-slate-100"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Admin Theme Manager</span>
                      </button>
                    )}

                    <button
                      onClick={() => { onLogout(); setDropdownOpen(false); }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t border-slate-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
              >
                Log In
              </button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenAuth}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold shadow-soft-sm transition-all"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/80" />
              </motion.button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
