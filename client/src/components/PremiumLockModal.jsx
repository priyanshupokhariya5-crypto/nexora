import React from 'react';
import { Lock, Sparkles, X, Check } from 'lucide-react';

export default function PremiumLockModal({ 
  title = 'Premium Feature', 
  description = 'Premium templates are coming soon.', 
  onClose 
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 relative my-8 text-center animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon Header */}
        <div className="w-14 h-14 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-soft-sm">
          <Lock className="w-7 h-7" />
        </div>

        {/* Badge */}
        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center space-x-1 mb-3 font-display">
          <Lock className="w-3 h-3 text-amber-600" />
          <span>🔒 PREMIUM • COMING SOON</span>
        </span>

        {/* Title & Description */}
        <h2 className="text-xl font-extrabold text-slate-900 font-display">
          {title}
        </h2>
        
        <p className="text-xs text-slate-600 leading-relaxed mt-2.5 px-2 font-medium">
          {description}
        </p>

        {/* Feature Highlights */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs text-slate-700">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-display">
            Premium Plan Features (Coming Soon):
          </p>
          <div className="flex items-center space-x-2">
            <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span>Multiple website slots</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span>Unlock all Premium business templates</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span>Custom domain connection</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span>Remove Nexora branding</span>
          </div>
        </div>

        {/* Action Button: OK */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1"
          >
            <span>OK</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-400 mt-4">
          Real payments are currently disabled. Free plan remains 100% active.
        </p>

      </div>
    </div>
  );
}
