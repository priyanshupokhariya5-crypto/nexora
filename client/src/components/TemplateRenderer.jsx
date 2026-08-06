import React from 'react';
import { 
  Zap, ShieldCheck, Leaf, Clock, Award, Flame, TrendingUp, Briefcase, 
  Cpu, Sprout, GlassWater, Key, Eye, Shield, Palette, Sparkles, Globe, 
  GitBranch, Lock, Layers, Grid, Code, Heart, Cookie, Sun, Smile, 
  CreditCard, Scale, FileText, Camera, Film, Mic, Trophy, CheckCircle, 
  Wrench, DollarSign, Volume2, Coffee, Check, Mail, Phone, MapPin, ArrowRight
} from 'lucide-react';

const ICON_MAP = {
  Zap, ShieldCheck, Leaf, Clock, Award, Flame, TrendingUp, Briefcase, 
  Cpu, Sprout, GlassWater, Key, Eye, Shield, Palette, Sparkles, Globe, 
  GitBranch, Lock, Layers, Grid, Code, Heart, Cookie, Sun, Smile, 
  CreditCard, Scale, FileText, Camera, Film, Mic, Trophy, CheckCircle, 
  Wrench, DollarSign, Volume2, Coffee, Check, Mail, Phone, MapPin
};

export default function TemplateRenderer({ 
  template, 
  customState = {}, 
  viewportMode = 'desktop' 
}) {
  if (!template) return null;

  // Merge template defaultData with custom user edits
  const data = {
    ...template.defaultData,
    ...customState
  };

  const accentColor = customState.accentColor || template.accentColor || '#2551e8';
  const fontFamily = customState.fontFamily || template.fontFamily || 'sans';
  const bgTheme = customState.bgTheme || template.bgTheme || 'light';
  const sectionsOrder = customState.sectionsOrder || ['hero', 'features', 'about', 'services', 'pricing', 'testimonials', 'contact'];

  // 3 Distinct Business Images for different purposes
  const heroImage = customState.heroImageUrl || template.image || data.heroImageUrl;
  const aboutImage = customState.aboutImageUrl || data.aboutImageUrl || template.image;
  const galleryImage = customState.galleryImageUrl || data.galleryImageUrl || template.image;

  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    display: 'font-display',
    mono: 'font-mono'
  }[fontFamily] || 'font-sans';

  const isDark = bgTheme === 'dark';

  const renderIcon = (iconName) => {
    const IconComp = ICON_MAP[iconName] || Sparkles;
    return <IconComp className="w-5 h-5" />;
  };

  // Viewport Container Adjuster
  const viewportStyles = {
    desktop: 'w-full',
    tablet: 'max-w-[768px] mx-auto border-x border-slate-300 shadow-2xl rounded-2xl overflow-hidden my-4',
    mobile: 'max-w-[390px] mx-auto border-x border-slate-300 shadow-2xl rounded-3xl overflow-hidden my-6 border-y-8 border-slate-800'
  }[viewportMode];

  return (
    <div className={`transition-all duration-300 ${viewportStyles}`}>
      <div className={`${fontClass} ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'} min-h-screen selection:bg-brand-600 selection:text-white`}>
        
        {/* NAVBAR */}
        <header className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white/90'} sticky top-0 z-40 backdrop-blur-md`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {data.logoUrl ? (
                <img src={data.logoUrl} alt="Logo" className="h-8 max-w-[140px] object-contain" />
              ) : (
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm font-display"
                  style={{ backgroundColor: accentColor }}
                >
                  {(data.logoText || 'N').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-extrabold text-lg tracking-tight font-display">
                {data.logoText || template.title}
              </span>
            </div>

            <nav className="hidden md:flex space-x-6 text-xs font-semibold opacity-80">
              <a href="#features" className="hover:opacity-100">Features</a>
              <a href="#about" className="hover:opacity-100">About</a>
              <a href="#services" className="hover:opacity-100">Offerings</a>
              <a href="#pricing" className="hover:opacity-100">Pricing</a>
            </nav>

            <a
              href="#contact"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow transition-transform active:scale-95"
              style={{ backgroundColor: accentColor }}
            >
              {data.ctaText || 'Get Started'}
            </a>
          </div>
        </header>

        {/* DYNAMIC SECTIONS RENDERER */}
        {sectionsOrder.map(section => {
          
          // 1. HERO SECTION WITH IMAGE #1 (Hero Main Image)
          if (section === 'hero') {
            return (
              <section key="hero" className="relative py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  
                  <div className="text-left">
                    <span 
                      className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
                      style={{ backgroundColor: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}33` }}
                    >
                      Welcome to {data.logoText || 'Our Platform'}
                    </span>

                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] font-display">
                      {data.heroTitle}
                    </h1>

                    <p className="mt-6 text-base sm:text-lg opacity-80 leading-relaxed">
                      {data.heroSubtitle}
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                      <a
                        href={data.ctaLink || '#contact'}
                        className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-lg transition-all transform hover:-translate-y-0.5 text-center"
                        style={{ backgroundColor: accentColor }}
                      >
                        {data.ctaText || 'Get Started Now'}
                      </a>
                      
                      <a
                        href="#features"
                        className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold border text-center ${
                          isDark ? 'border-slate-800 bg-slate-900 hover:bg-slate-850' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        Learn More
                      </a>
                    </div>
                  </div>

                  {/* IMAGE #1: Main Business Hero Image Card */}
                  {heroImage && (
                    <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 aspect-[4/3] bg-slate-900">
                      <img 
                        src={heroImage} 
                        alt="Main Business Hero" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                        <span className="text-white text-xs font-extrabold font-display uppercase tracking-wider">
                          Main Hero Feature • {data.logoText || template.title}
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              </section>
            );
          }

          // 2. FEATURES SECTION
          if (section === 'features' && data.features?.length) {
            return (
              <section key="features" id="features" className={`py-16 px-4 sm:px-6 border-t ${isDark ? 'border-slate-800/80 bg-slate-900/50' : 'border-slate-200 bg-slate-50/60'}`}>
                <div className="max-w-6xl mx-auto">
                  <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
                      {data.featuresTitle || 'Key Highlights'}
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.features.map((feat, idx) => (
                      <div 
                        key={idx} 
                        className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm hover:shadow-md transition-all`}
                      >
                        <div 
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white mb-4 shadow"
                          style={{ backgroundColor: accentColor }}
                        >
                          {renderIcon(feat.icon)}
                        </div>
                        <h3 className="text-lg font-bold font-display">{feat.title}</h3>
                        <p className="mt-2 text-xs sm:text-sm opacity-75 leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 3. ABOUT SECTION WITH IMAGE #2 (Brand Story & Facility Image)
          if (section === 'about' && (data.aboutTitle || data.aboutDesc)) {
            return (
              <section key="about" id="about" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
                <div className={`p-8 md:p-12 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm grid md:grid-cols-2 gap-8 items-center`}>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 mb-2 block">
                      Brand Story & Mission
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-display">{data.aboutTitle}</h2>
                    <p className="mt-4 text-xs sm:text-sm opacity-80 leading-relaxed">{data.aboutDesc}</p>
                    
                    <div className="mt-6 flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-widest opacity-80">Verified Excellence & Service</span>
                    </div>
                  </div>

                  {/* IMAGE #2: About / Brand Story Image */}
                  <div className="relative group rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-300 shadow-md">
                    {aboutImage && (
                      <img src={aboutImage} alt="Brand Story & Facility" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent p-4 flex items-end">
                      <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                        Image #2: Brand Story & Facility
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          // 4. SERVICES SECTION WITH IMAGE #3 (Gallery / Product Showcase Image)
          if (section === 'services' && data.services?.length) {
            return (
              <section key="services" id="services" className={`py-16 px-4 sm:px-6 border-t ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                <div className="max-w-6xl mx-auto">
                  
                  {/* Top Header with IMAGE #3 Gallery Banner */}
                  <div className="grid md:grid-cols-3 gap-8 items-center mb-12">
                    <div className="md:col-span-2">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 mb-1 block">
                        Offerings & Product Showcase
                      </span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
                        {data.servicesTitle || 'Featured Offerings'}
                      </h2>
                    </div>

                    {/* IMAGE #3: Product / Gallery Feature Image Card */}
                    {galleryImage && (
                      <div className="relative group rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-300 shadow-md">
                        <img src={galleryImage} alt="Product Showcase" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-3 flex items-end">
                          <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                            Image #3: Product / Gallery Showcase
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.services.map((item, idx) => (
                      <div 
                        key={idx}
                        className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold font-display">{item.title}</h3>
                            {item.price && (
                              <span 
                                className="px-2.5 py-1 rounded-full text-xs font-extrabold text-white shadow"
                                style={{ backgroundColor: accentColor }}
                              >
                                {item.price}
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm opacity-75 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </section>
            );
          }

          // 5. PRICING SECTION
          if (section === 'pricing' && data.pricing?.length) {
            return (
              <section key="pricing" id="pricing" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
                    {data.pricingTitle || 'Simple & Transparent Pricing'}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {data.pricing.map((tier, idx) => (
                    <div 
                      key={idx}
                      className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm flex flex-col justify-between`}
                    >
                      <div>
                        <h3 className="text-xl font-bold font-display">{tier.name}</h3>
                        <div className="mt-4 flex items-baseline">
                          <span className="text-4xl font-extrabold font-display">{tier.price}</span>
                          <span className="text-xs opacity-70 ml-1">{tier.period}</span>
                        </div>
                        <ul className="mt-6 space-y-2.5 text-xs sm:text-sm">
                          {tier.features?.map((f, fIdx) => (
                            <li key={fIdx} className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        className="mt-8 w-full py-3 rounded-2xl font-bold text-xs sm:text-sm text-white shadow"
                        style={{ backgroundColor: accentColor }}
                      >
                        Choose {tier.name}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          // 6. TESTIMONIALS SECTION
          if (section === 'testimonials' && data.testimonials?.length) {
            return (
              <section key="testimonials" className={`py-16 px-4 sm:px-6 border-t ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                <div className="max-w-6xl mx-auto">
                  <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
                      {data.testimonialsTitle || 'What People Say'}
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {data.testimonials.map((t, idx) => (
                      <div 
                        key={idx}
                        className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm`}
                      >
                        <p className="text-xs sm:text-sm italic opacity-90 leading-relaxed font-serif">"{t.text}"</p>
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold font-display">{t.name}</p>
                            <p className="text-xs opacity-60">{t.role}</p>
                          </div>
                          <div className="flex text-amber-500 text-xs">★★★★★</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 7. CONTACT SECTION
          if (section === 'contact') {
            return (
              <section key="contact" id="contact" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
                <div className={`p-8 md:p-12 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm grid md:grid-cols-2 gap-8`}>
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold font-display">Get In Touch</h2>
                    <p className="mt-3 text-xs sm:text-sm opacity-75">Have questions or want to inquire? Reach out to us anytime.</p>
                    
                    <div className="mt-8 space-y-4 text-xs sm:text-sm">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{data.contactEmail || 'contact@business.com'}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{data.contactPhone || '+1 (800) 555-0199'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Your Name</label>
                      <input 
                        type="text"
                        required
                        placeholder="John Doe"
                        className={`w-full px-4 py-2.5 rounded-xl text-xs border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'} focus:outline-none focus:ring-2`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Email Address</label>
                      <input 
                        type="email"
                        required
                        placeholder="john@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl text-xs border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'} focus:outline-none focus:ring-2`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Message</label>
                      <textarea 
                        rows="3"
                        required
                        placeholder="How can we help you?"
                        className={`w-full px-4 py-2.5 rounded-xl text-xs border ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'} focus:outline-none focus:ring-2`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold text-xs text-white shadow transition-all"
                      style={{ backgroundColor: accentColor }}
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </section>
            );
          }

          return null;
        })}

        {/* FOOTER */}
        <footer className={`py-8 px-4 sm:px-6 text-center text-xs opacity-75 border-t ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-100'}`}>
          <p>{data.footerText || `© 2026 ${data.logoText || template.title}. All rights reserved.`}</p>
        </footer>

      </div>
    </div>
  );
}
