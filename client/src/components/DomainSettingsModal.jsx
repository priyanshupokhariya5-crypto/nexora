import React, { useState } from 'react';
import { 
  Globe, Link as LinkIcon, CheckCircle2, AlertCircle, Clock, 
  Copy, RefreshCw, X, ShieldCheck, ArrowRight, ExternalLink, Trash2
} from 'lucide-react';
import { apiFetch } from '../api';

export default function DomainSettingsModal({ website, onClose, onUpdateWebsite }) {
  const [slug, setSlug] = useState(website?.slug || '');
  const [customDomain, setCustomDomain] = useState(website?.customDomain || '');
  
  const [slugLoading, setSlugLoading] = useState(false);
  const [slugMsg, setSlugMsg] = useState({ type: '', text: '' });

  const [domainLoading, setDomainLoading] = useState(false);
  const [domainMsg, setDomainMsg] = useState({ type: '', text: '' });

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const dnsTarget = 'cname.vercel-dns.com';
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://nexora.app';

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // 1. Save Nexora URL Slug
  const handleSaveSlug = async (e) => {
    e.preventDefault();
    if (!slug) return;

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)+/g, '');
    if (!cleanSlug) {
      setSlugMsg({ type: 'error', text: 'Please enter a valid URL slug.' });
      return;
    }

    setSlugLoading(true);
    setSlugMsg({ type: '', text: '' });

    try {
      const res = await apiFetch(`/api/websites/${website.siteId}/domain`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: cleanSlug })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSlugMsg({ type: 'success', text: 'Nexora URL slug updated successfully!' });
        if (onUpdateWebsite) onUpdateWebsite(data.website);
      } else {
        setSlugMsg({ type: 'error', text: data.message || 'Failed to update Nexora URL.' });
      }
    } catch (err) {
      setSlugMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSlugLoading(false);
    }
  };

  // 2. Connect Custom Domain
  const handleConnectDomain = async (e) => {
    e.preventDefault();
    if (!customDomain) return;

    let cleanDomain = customDomain.toLowerCase().trim()
      .replace(/^https?:\/\//i, '')
      .replace(/\/.*$/, '')
      .replace(/:\d+$/, '');

    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(cleanDomain)) {
      setDomainMsg({ type: 'error', text: 'Please enter a valid custom domain (e.g. www.mybusiness.com or mybusiness.com).' });
      return;
    }

    setDomainLoading(true);
    setDomainMsg({ type: '', text: '' });

    try {
      const res = await apiFetch(`/api/websites/${website.siteId}/domain`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customDomain: cleanDomain })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setDomainMsg({ type: 'success', text: 'Custom domain connected. Please configure DNS records below.' });
        if (onUpdateWebsite) onUpdateWebsite(data.website);
      } else {
        setDomainMsg({ type: 'error', text: data.message || 'Failed to connect custom domain.' });
      }
    } catch (err) {
      setDomainMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setDomainLoading(false);
    }
  };

  // 3. Verify DNS Records
  const handleVerifyDns = async (forceDev = false) => {
    setVerifyLoading(true);
    setDomainMsg({ type: '', text: '' });

    try {
      const res = await apiFetch(`/api/websites/${website.siteId}/domain/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceDevVerify: forceDev })
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        setDomainMsg({ type: 'success', text: data.message || 'Domain verified and connected successfully!' });
        if (onUpdateWebsite) onUpdateWebsite(data.website);
      } else {
        setDomainMsg({ type: 'error', text: data.message || 'We could not verify your DNS records yet. Please check your DNS setup.' });
        if (data.website && onUpdateWebsite) onUpdateWebsite(data.website);
      }
    } catch (err) {
      setDomainMsg({ type: 'error', text: 'DNS verification request failed.' });
    } finally {
      setVerifyLoading(false);
    }
  };

  // 4. Disconnect Custom Domain
  const handleDisconnectDomain = async () => {
    if (!window.confirm('Are you sure you want to disconnect this custom domain?')) return;

    setDomainLoading(true);
    try {
      const res = await apiFetch(`/api/websites/${website.siteId}/domain/disconnect`, {
        method: 'POST'
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCustomDomain('');
        setDomainMsg({ type: 'info', text: 'Custom domain disconnected.' });
        if (onUpdateWebsite) onUpdateWebsite(data.website);
      }
    } catch (err) {
      setDomainMsg({ type: 'error', text: 'Failed to disconnect domain.' });
    } finally {
      setDomainLoading(false);
    }
  };

  const domainStatus = website?.domainStatus || 'none';
  const isVerified = website?.domainVerified || false;
  const activeCustomDomain = website?.customDomain;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shadow-soft-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Domain & URL Settings
            </h2>
            <p className="text-xs text-slate-500">
              Manage your website URL slug or connect your own custom domain.
            </p>
          </div>
        </div>

        {/* SECTION 1: NEXORA URL SLUG */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 font-display flex items-center space-x-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-brand-600" />
              <span>Option 1: Nexora Subdomain URL</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Free & Active
            </span>
          </div>

          <form onSubmit={handleSaveSlug} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nexora Website Slug:
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-700 flex items-center shadow-soft-sm overflow-hidden">
                  <span className="text-slate-400 select-none flex-shrink-0">{currentOrigin}/site/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-business-name"
                    className="w-full bg-transparent border-none focus:outline-none font-bold text-slate-900 min-w-0"
                  />
                </div>
                <button
                  type="submit"
                  disabled={slugLoading || slug === website?.slug}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow disabled:opacity-50 transition-colors flex-shrink-0"
                >
                  {slugLoading ? 'Saving...' : 'Update URL'}
                </button>
              </div>
            </div>

            {slugMsg.text && (
              <p className={`text-xs font-semibold ${slugMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {slugMsg.text}
              </p>
            )}

            <div className="pt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Live Published URL:</span>
              <a
                href={`${currentOrigin}/site/${website?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-brand-600 hover:underline flex items-center space-x-1 font-semibold truncate max-w-[300px]"
              >
                <span>{`${currentOrigin}/site/${website?.slug}`}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
          </form>
        </div>

        {/* SECTION 2: CUSTOM DOMAIN */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 font-display flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>Option 2: Connect Custom Domain</span>
            </h3>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase flex items-center space-x-1 ${
              isVerified
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : domainStatus === 'pending'
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : domainStatus === 'failed'
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-slate-200 text-slate-700'
            }`}>
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified & Connected</span>
                </>
              ) : domainStatus === 'pending' ? (
                <>
                  <Clock className="w-3 h-3" />
                  <span>Pending DNS Verification</span>
                </>
              ) : domainStatus === 'failed' ? (
                <>
                  <AlertCircle className="w-3 h-3" />
                  <span>Verification Failed</span>
                </>
              ) : (
                <span>Not Connected</span>
              )}
            </span>
          </div>

          {!activeCustomDomain ? (
            <form onSubmit={handleConnectDomain} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Enter Domain Name:
                </label>
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <input
                    type="text"
                    required
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="www.mybusiness.com or mybusiness.com"
                    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono shadow-soft-sm"
                  />
                  <button
                    type="submit"
                    disabled={domainLoading || !customDomain}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-colors flex-shrink-0"
                  >
                    {domainLoading ? 'Connecting...' : 'Connect Domain'}
                  </button>
                </div>
              </div>

              {domainMsg.text && (
                <p className={`text-xs font-semibold ${
                  domainMsg.type === 'success' ? 'text-emerald-600' :
                  domainMsg.type === 'info' ? 'text-sky-600' : 'text-rose-600'
                }`}>
                  {domainMsg.text}
                </p>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Connected Domain:</span>
                  <a
                    href={`https://${activeCustomDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-slate-900 hover:text-brand-600 flex items-center space-x-1 mt-0.5"
                  >
                    <span>https://{activeCustomDomain}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>

                <button
                  onClick={handleDisconnectDomain}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200 flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>

              {/* DNS INSTRUCTIONS TABLE */}
              {(!isVerified || domainStatus === 'pending' || domainStatus === 'failed') && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>DNS Configuration Required</span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Add the following CNAME record at your domain registrar (GoDaddy, Namecheap, Cloudflare, Route53, etc.) to point your domain to Nexora:
                  </p>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden font-mono text-[11px]">
                    <div className="grid grid-cols-3 bg-slate-100 p-2 text-slate-500 font-bold text-[10px] uppercase border-b border-slate-200">
                      <div>Type</div>
                      <div>Name / Host</div>
                      <div>Value / Target</div>
                    </div>
                    <div className="grid grid-cols-3 p-2.5 items-center border-b border-slate-100">
                      <div className="font-bold text-brand-600">CNAME</div>
                      <div className="flex items-center justify-between pr-2">
                        <span>www</span>
                        <button onClick={() => handleCopy('www', 'cnameHost')} className="text-slate-400 hover:text-slate-700">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="truncate">{dnsTarget}</span>
                        <button onClick={() => handleCopy(dnsTarget, 'cnameVal')} className="text-slate-400 hover:text-slate-700">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {website?.domainVerificationToken && (
                      <div className="grid grid-cols-3 p-2.5 items-center bg-slate-50/50">
                        <div className="font-bold text-indigo-600">TXT</div>
                        <div className="flex items-center justify-between pr-2">
                          <span className="truncate">_nexora.{activeCustomDomain}</span>
                          <button onClick={() => handleCopy(`_nexora.${activeCustomDomain}`, 'txtHost')} className="text-slate-400 hover:text-slate-700">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="truncate max-w-[120px]">{website.domainVerificationToken}</span>
                          <button onClick={() => handleCopy(website.domainVerificationToken, 'txtVal')} className="text-slate-400 hover:text-slate-700">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={() => handleVerifyDns(false)}
                      disabled={verifyLoading}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${verifyLoading ? 'animate-spin' : ''}`} />
                      <span>{verifyLoading ? 'Checking DNS...' : 'Verify DNS Records'}</span>
                    </button>

                    <button
                      onClick={() => handleVerifyDns(true)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors"
                      title="Force verification for testing / development"
                    >
                      Quick Dev Verify
                    </button>
                  </div>
                </div>
              )}

              {domainMsg.text && (
                <p className={`text-xs font-semibold ${
                  domainMsg.type === 'success' ? 'text-emerald-600' :
                  domainMsg.type === 'info' ? 'text-sky-600' : 'text-rose-600'
                }`}>
                  {domainMsg.text}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
