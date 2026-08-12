import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, ArrowLeft, Zap, Globe, Sparkles } from 'lucide-react';
import TemplateRenderer from './TemplateRenderer';
import { TEMPLATES_DATA } from '../data/templatesData';
import { apiFetch } from '../api';

export default function PublicWebsite({ slug: slugProp }) {
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const actualSlug = typeof slugProp === 'object' ? slugProp.slug : slugProp;
  const initialSubPath = typeof slugProp === 'object' 
    ? (slugProp.subPath || '/') 
    : (window.location.pathname.replace(`/site/${actualSlug}`, '') || '/');

  useEffect(() => {
    const fetchPublicSite = async () => {
      setLoading(true);
      setErrorMsg('');

      try {
        const res = await apiFetch(`/api/public/${actualSlug}`);
        const data = await res.json();

        if (data.success && data.website) {
          setWebsite(data.website);
        } else {
          setErrorMsg(data.message || 'Website not found or not published.');
        }
      } catch (err) {
        setErrorMsg('Network error. Unable to load published website.');
      } finally {
        setLoading(false);
      }
    };

    if (actualSlug) {
      fetchPublicSite();
    }
  }, [actualSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center mb-4">
          <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
        </div>
        <p className="text-sm font-bold text-slate-300 font-display">Loading Published Website...</p>
        <p className="text-xs text-slate-500 font-mono mt-1">/site/{actualSlug}</p>
      </div>
    );
  }

  if (errorMsg || !website) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-7 h-7" />
          </div>
          
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-white">
            404 — Website Not Found
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
            {errorMsg || "The website you are looking for does not exist or has not been published."}
          </p>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center">
            <a
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg transition-colors"
            >
              <Zap className="w-4 h-4 fill-current text-white" />
              <span>Return to Nexora</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Find matching template definition
  const template = TEMPLATES_DATA.find(t => t.id === website.templateId) || TEMPLATES_DATA[0];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden w-full max-w-full">
      <TemplateRenderer
        template={template}
        customData={website.customData || {}}
        accentColor={website.accentColor}
        fontFamily={website.fontFamily}
        bgTheme={website.bgTheme}
        viewportMode="desktop"
        baseRoute={`/site/${actualSlug}`}
        activePath={initialSubPath}
      />
    </div>
  );
}
