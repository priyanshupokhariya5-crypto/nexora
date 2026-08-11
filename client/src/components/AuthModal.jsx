import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, ArrowRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { apiFetch } from '../api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setErrorMsg('');
    setLoading(false);
    if (onClose) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' ? { email, password } : { name, email, password };

      const res = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (data.success) {
        // Save Session
        localStorage.setItem('nexora_user', JSON.stringify(data.user));
        setErrorMsg('');
        setName('');
        setEmail('');
        setPassword('');
        if (onAuthSuccess) onAuthSuccess(data.user);
        if (onClose) onClose();
      } else {
        setErrorMsg(data.message || 'Authentication failed.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please make sure server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-md w-full mx-2 border border-slate-200 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto mb-3 shadow-soft-sm">
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 font-display">
            {mode === 'login' ? 'Welcome Back to Nexora' : 'Create Your Nexora Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login' 
              ? 'Log in to manage your saved websites and edit presets.' 
              : 'Sign up to build, customize, and publish websites.'}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center justify-center space-x-2 transition-all"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Log In to Account' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Mode Switcher Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); }}
                className="font-bold text-brand-600 hover:underline"
              >
                Sign Up Free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className="font-bold text-brand-600 hover:underline"
              >
                Log In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
