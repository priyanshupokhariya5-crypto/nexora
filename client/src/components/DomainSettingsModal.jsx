import React, { useState } from 'react';
import { 
  Globe, Link as LinkIcon, Lock, Copy, Check, ExternalLink, X, Sparkles
} from 'lucide-react';

export default function DomainSettingsModal({ website = {}, onClose }) {
  const [copied, setCopied] = useState(false);

  const currentOrigin = typeof window !== 'undefined' && window.location?.origin 
    ? window.location.origin 
    : 'https://nexora.app';

  const rawTitle = website?.title || website?.websiteName || website?.brandName || 'Website Name';
  
  const siteSlug = website?.slug || 
    (rawTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'my-website');

  const fullPublicUrl = `${currentOrigin}/site/${siteSlug}`;

  const handleCopy = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(fullPublicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error('Copy URL error:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Close Domain Settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shadow-soft-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display uppercase tracking-wide">
              DOMAIN SETTINGS
            </h2>
            <p className="text-xs text-slate-500">
              View your live Nexora website address and custom domain options.
            </p>
          </div>
        </div>

        {/* SECTION 1: NEXORA URL (AUTOMATICALLY GENERATED & LOCKED) */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 font-display flex items-center space-x-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-brand-600" />
              <span>Your Nexora URL</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Active
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-900 flex items-center justify-between shadow-soft-sm overflow-hidden">
              <span className="font-bold truncate text-brand-600 mr-2">{fullPublicUrl}</span>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Copy URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={fullPublicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors"
                  title="Open Live Website"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-[11px] text-slate-600 bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/60">
              <Lock className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                🔒 <strong>Automatically generated from your logo/brand name</strong> (<span className="font-semibold text-slate-900">{rawTitle}</span>). This URL cannot be edited manually.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: CUSTOM DOMAIN (COMING SOON) */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 opacity-90">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 font-display flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>CUSTOM DOMAIN</span>
            </h3>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>COMING SOON</span>
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-bold mb-1">
            Connect your own domain
          </p>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Custom domains will be available in a future Nexora update.
          </p>

          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed border border-slate-300 flex items-center justify-center space-x-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Coming Soon</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
