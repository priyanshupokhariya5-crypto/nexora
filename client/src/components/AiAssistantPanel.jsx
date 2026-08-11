import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Wand2, RefreshCw, X, Rocket, BookOpen, Layers, HelpCircle, 
  Search, Zap, Edit3, Scissors, Maximize2, Globe, CheckCircle2, Send, Bot, User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiFetch } from '../api';

const AI_TOOLS = [
  { id: 'chat', name: 'AI Chat Assistant', icon: Sparkles, desc: 'Interactive Google Gemini AI for website copy, creation & design advice' },
  { id: 'hero', name: 'Hero Generator', icon: Rocket, desc: 'Generate high-converting hero headlines & subtext' },
  { id: 'about', name: 'About Generator', icon: BookOpen, desc: 'Draft compelling brand stories and mission statements' },
  { id: 'services', name: 'Services Generator', icon: Layers, desc: 'Generate featured service items and pricing' },
  { id: 'faq', name: 'FAQ Generator', icon: HelpCircle, desc: 'Generate relevant questions & answers' },
  { id: 'seo', name: 'SEO Generator', icon: Search, desc: 'Generate meta title, description & keywords' },
  { id: 'cta', name: 'CTA Generator', icon: Zap, desc: 'Create high-converting call-to-action buttons' },
  { id: 'rewrite', name: 'AI Rewrite', icon: Edit3, desc: 'Polish selected copy for modern appeal' },
  { id: 'shorten', name: 'AI Shorten', icon: Scissors, desc: 'Make long sentences concise and punchy' },
  { id: 'expand', name: 'AI Expand', icon: Maximize2, desc: 'Elaborate text with rich business value' },
  { id: 'translate', name: 'AI Translate', icon: Globe, desc: 'Translate copy to target languages' }
];

const TARGET_LANGUAGES = ['Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Portuguese', 'Italian'];

export default function AiAssistantPanel({ 
  isOpen, 
  onClose, 
  customState, 
  onApplyAiUpdate 
}) {
  const [selectedTool, setSelectedTool] = useState('chat');
  const [prompt, setAiPrompt] = useState('');
  const [currentText, setCurrentText] = useState(customState?.heroTitle || '');
  const [targetLang, setTargetLang] = useState('Spanish');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'model', text: 'Hello! I am Nexora AI powered by Google Gemini. How can I help you build, design, or optimize your website today?' }
  ]);

  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (selectedTool === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, selectedTool]);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (isGenerating) return;

    if (selectedTool === 'chat') {
      const userMsg = prompt.trim();
      if (!userMsg) return;

      const newHistory = [...chatMessages, { role: 'user', text: userMsg }];
      setChatMessages(newHistory);
      setAiPrompt('');
      setIsGenerating(true);

      try {
        const res = await apiFetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMsg,
            conversation: newHistory
          })
        });

        const data = await res.json();
        if (data.reply) {
          setChatMessages(prev => [...prev, { role: 'model', text: data.reply }]);
        } else {
          setChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
        }
      } catch (err) {
        console.error('AI Chat Error:', err);
        setChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    setIsGenerating(true);
    setGeneratedPreview(null);

    try {
      const payload = {
        action: selectedTool,
        prompt: prompt || 'Modern Business',
        currentText: currentText || customState?.heroTitle,
        targetLang
      };

      const res = await apiFetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedPreview(data.data);
      }
    } catch (err) {
      console.error('AI generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToEditor = () => {
    if (!generatedPreview) return;

    if (selectedTool === 'hero') {
      onApplyAiUpdate({
        heroTitle: generatedPreview.heroTitle,
        heroSubtitle: generatedPreview.heroSubtitle,
        ctaText: generatedPreview.ctaText
      });
    } else if (selectedTool === 'about') {
      onApplyAiUpdate({
        aboutTitle: generatedPreview.aboutTitle,
        aboutDesc: generatedPreview.aboutDesc
      });
    } else if (selectedTool === 'services') {
      onApplyAiUpdate({
        servicesTitle: generatedPreview.servicesTitle,
        services: generatedPreview.services
      });
    } else if (selectedTool === 'faq') {
      onApplyAiUpdate({
        faqTitle: generatedPreview.faqTitle,
        faqs: generatedPreview.faqs
      });
    } else if (selectedTool === 'seo') {
      onApplyAiUpdate({
        metaTitle: generatedPreview.metaTitle,
        metaDescription: generatedPreview.metaDescription,
        keywords: generatedPreview.keywords
      });
    } else if (selectedTool === 'cta') {
      onApplyAiUpdate({
        ctaText: generatedPreview.ctaText
      });
    } else if (selectedTool === 'rewrite' || selectedTool === 'shorten' || selectedTool === 'expand' || selectedTool === 'translate') {
      onApplyAiUpdate({
        heroTitle: generatedPreview.resultText || generatedPreview.heroTitle
      });
    }

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  const activeToolObj = AI_TOOLS.find(t => t.id === selectedTool) || AI_TOOLS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-2xl w-full mx-2 border border-slate-800 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">Nexora AI Studio</h3>
              <p className="text-xs text-slate-400">Powered by Google Gemini API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Tools Selection Pills */}
        <div className="flex overflow-x-auto py-3 space-x-2 border-b border-slate-800 flex-shrink-0 scrollbar-none">
          {AI_TOOLS.map(t => {
            const IconComp = t.icon;
            const isSel = selectedTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTool(t.id);
                  setGeneratedPreview(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 transition-colors ${
                  isSel ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 flex flex-col">
          
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center space-x-3 flex-shrink-0">
            <activeToolObj.icon className="w-5 h-5 text-brand-400 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white font-display">{activeToolObj.name}</h4>
              <p className="text-[10px] text-slate-400">{activeToolObj.desc}</p>
            </div>
          </div>

          {selectedTool === 'chat' ? (
            /* Conversational Chat Interface */
            <div className="flex-1 flex flex-col min-h-[300px]">
              
              {/* Message History Container */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-3 max-h-[360px]">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start space-x-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-7 h-7 rounded-xl bg-brand-600/30 border border-brand-500/40 text-brand-400 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div 
                      className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-brand-600 text-white rounded-tr-none font-medium shadow-sm' 
                          : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/60 whitespace-pre-wrap'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isGenerating && (
                  <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
                    <div className="w-7 h-7 rounded-xl bg-brand-600/30 border border-brand-500/40 text-brand-400 flex items-center justify-center flex-shrink-0">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    </div>
                    <span className="animate-pulse text-[11px]">Gemini is thinking...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleGenerate} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask Gemini anything (e.g. Help me write coffee shop headlines, SEO keywords...)"
                  className="flex-1 p-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className="px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>

            </div>
          ) : (
            /* Structured Tool Generator Form */
            <>
              <form onSubmit={handleGenerate} className="space-y-3">
                {(selectedTool === 'rewrite' || selectedTool === 'shorten' || selectedTool === 'expand' || selectedTool === 'translate') && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Source Text to Transform</label>
                    <textarea
                      rows={2}
                      value={currentText}
                      onChange={(e) => setCurrentText(e.target.value)}
                      placeholder="Paste or type text..."
                      className="w-full p-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                )}

                {selectedTool === 'translate' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Language</label>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                    >
                      {TARGET_LANGUAGES.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business Niche / Prompt Instructions</label>
                  <textarea
                    rows={3}
                    required
                    value={prompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Electric sports cars, Luxury spa, Fitness app..."
                    className="w-full p-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Wand2 className="w-4 h-4 text-amber-300" />
                  )}
                  <span>{isGenerating ? 'Generating AI Tokens...' : `Generate ${activeToolObj.name}`}</span>
                </button>
              </form>

              {/* Generated Result Preview */}
              {generatedPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-slate-950 rounded-2xl border border-brand-500/40 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>AI Content Generated Ready</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-200 font-mono">
                    {generatedPreview.heroTitle && (
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Headline:</span>
                        <p className="text-white font-bold">{generatedPreview.heroTitle}</p>
                      </div>
                    )}
                    {generatedPreview.heroSubtitle && (
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Subtitle:</span>
                        <p className="text-slate-300">{generatedPreview.heroSubtitle}</p>
                      </div>
                    )}
                    {generatedPreview.resultText && (
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Result Text:</span>
                        <p className="text-white font-bold">{generatedPreview.resultText}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleApplyToEditor}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply Direct to Live Editor</span>
                  </button>
                </motion.div>
              )}
            </>
          )}

        </div>
      </motion.div>
    </div>
  );
}
