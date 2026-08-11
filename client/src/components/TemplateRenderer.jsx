import React, { useState } from 'react';
import { 
  Zap, ShieldCheck, Leaf, Clock, Award, Flame, TrendingUp, Briefcase, 
  Cpu, Sprout, GlassWater, Key, Eye, Shield, Palette, Sparkles, Globe, 
  GitBranch, Lock, Layers, Grid, Code, Heart, Cookie, Sun, Smile, 
  CreditCard, Scale, FileText, Camera, Film, Mic, Trophy, CheckCircle, 
  Wrench, DollarSign, Volume2, Coffee, Check, Mail, Phone, MapPin, ArrowRight,
  Star, MessageSquare, Send
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
  customData = {}, 
  accentColor: customAccent, 
  fontFamily: customFont, 
  bgTheme: customBg, 
  viewportMode = 'desktop' 
}) {
  const [formSent, setFormSent] = useState(false);
  if (!template) return null;

  // Merge template defaultData with custom user edits
  const data = {
    ...template.defaultData,
    ...customData
  };

  const accentColor = customData.accentColor || customAccent || template.accentColor || '#2551e8';
  const fontFamily = customData.fontFamily || customFont || template.fontFamily || 'sans';
  const bgTheme = customData.bgTheme || customBg || template.bgTheme || 'light';
  const sectionsOrder = customData.sectionsOrder || ['hero', 'features', 'about', 'services', 'pricing', 'testimonials', 'contact'];

  // Layout style variation (e.g. 'arched', 'modern', 'luxury', 'minimal')
  const layoutStyle = customData.layoutStyle || data.layoutStyle || template.layoutStyle || 'standard';

  // 3 Distinct Business Images for different purposes
  const heroImage = customData.heroImageUrl || data.heroImageUrl || template.image;
  const aboutImage = customData.aboutImageUrl || data.aboutImageUrl || template.image;
  const galleryImage = customData.galleryImageUrl || data.galleryImageUrl || template.image;
  const logoImage = customData.logoImageUrl || data.logoImageUrl || data.logoUrl;

  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    display: 'font-display',
    mono: 'font-mono'
  }[fontFamily] || 'font-sans';

  const isDark = bgTheme === 'dark';

  // Dynamic Navigation Links tailored per business category
  const defaultNavLinks = data.navLinks || [
    { label: 'About', href: '#about' },
    { label: data.servicesTitle ? data.servicesTitle.split(' ')[0] : 'Services', href: '#services' },
    { label: 'Highlights', href: '#features' },
    { label: 'Contact', href: '#contact' }
  ];

  const renderIcon = (iconName) => {
    const IconComp = ICON_MAP[iconName] || Sparkles;
    return <IconComp className="w-5 h-5" />;
  };

  // Viewport Container Adjuster
  const viewportStyles = {
    desktop: 'w-full max-w-full',
    tablet: 'max-w-[768px] mx-auto border-x border-slate-300 shadow-2xl rounded-2xl overflow-hidden my-4',
    mobile: 'w-full max-w-full sm:max-w-[390px] mx-auto overflow-hidden',
    full: 'w-full max-w-full'
  }[viewportMode] || 'w-full max-w-full';

  // Image Shape Helper (Arched for local/food/beauty/artisan vs Rounded for corporate)
  const isArched = layoutStyle === 'arched' || template.badge?.includes('Local') || template.category?.includes('Restaurants') || template.category?.includes('Retail');

  const heroImageShape = isArched
    ? 'rounded-t-[120px] sm:rounded-t-[160px] rounded-b-3xl'
    : 'rounded-3xl';

  const aboutImageShape = isArched
    ? 'rounded-t-[140px] rounded-b-3xl'
    : 'rounded-3xl';

  return (
    <div className={`transition-all duration-300 ${viewportStyles}`}>
      <div className={`${fontClass} ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'} min-h-screen selection:bg-brand-600 selection:text-white`}>
        
        {/* NAVBAR WITH INSTANT EDITABLE BRAND LOGO */}
        <header className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200/80 bg-white/90'} sticky top-0 z-40 backdrop-blur-md`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            
            <div className="flex items-center space-x-3">
              {logoImage ? (
                <img 
                  src={logoImage} 
                  alt="Brand Logo" 
                  className="h-8 max-w-[150px] object-contain rounded-md" 
                />
              ) : (
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm font-display text-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  {(data.logoText || template.title || 'N').charAt(0).toUpperCase()}
                </div>
              )}
              
              <span className="font-extrabold text-lg tracking-tight font-display">
                {data.logoText || template.title}
              </span>
            </div>

            <nav className="hidden md:flex space-x-6 text-xs font-semibold opacity-80">
              {defaultNavLinks.map((link, idx) => (
                <a key={idx} href={link.href} className="hover:opacity-100 transition-opacity">
                  {link.label}
                </a>
              ))}
            </nav>

            <a
              href={data.ctaLink || "#contact"}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow transition-transform active:scale-95 hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              {data.ctaText || 'Contact Us'}
            </a>
          </div>
        </header>

        {/* DYNAMIC SECTIONS RENDERER */}
        {sectionsOrder.map(section => {
          
          // 1. HERO SECTION WITH IMAGE #1 (Hero Main Image)
          if (section === 'hero') {
            return (
              <section key="hero" className="relative py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div>
                    <span 
                      className="inline-block px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-slate-100 text-slate-800 border border-slate-200/80 shadow-xs"
                    >
                      {template.badge || 'Official Business Site'}
                    </span>
                    
                    <h1 className="text-3xl sm:text-5xl font-extrabold mt-4 leading-tight font-display tracking-tight">
                      {data.heroTitle || template.defaultData?.heroTitle}
                    </h1>
                    
                    <p className="mt-4 text-sm sm:text-base opacity-80 leading-relaxed font-sans">
                      {data.heroSubtitle || template.defaultData?.heroSubtitle}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4 items-center">
                      <a
                        href={data.ctaLink || '#contact'}
                        className="px-6 py-3.5 rounded-2xl text-white font-bold text-xs shadow-lg transition-transform hover:-translate-y-0.5"
                        style={{ backgroundColor: accentColor }}
                      >
                        {data.ctaText || 'Get In Touch'}
                      </a>
                      
                      <a
                        href="#about"
                        className={`px-6 py-3.5 rounded-2xl font-semibold text-xs border transition-colors ${
                          isDark ? 'border-slate-800 hover:bg-slate-900 text-slate-200' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        Learn More
                      </a>
                    </div>
                  </div>

                  {/* Hero Main Image Slot #1 */}
                  <div className="relative flex justify-center">
                    <div className={`overflow-hidden shadow-2xl border border-slate-200/50 aspect-[4/3] w-full max-w-md bg-slate-900 group ${heroImageShape}`}>
                      <img 
                        src={heroImage} 
                        alt="Hero Banner" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          // 2. FEATURES SECTION
          if (section === 'features') {
            return (
              <section key="features" id="features" className={`py-16 px-4 sm:px-6 ${isDark ? 'bg-slate-900/60' : 'bg-slate-50/70'} border-y border-slate-200/60`}>
                <div className="max-w-6xl mx-auto">
                  <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
                      {data.featuresTitle || 'Why Choose Us'}
                    </h2>
                  </div>

                  <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(data.features || []).map((feat, idx) => (
                      <div 
                        key={idx}
                        className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm hover:shadow-card-hover transition-all duration-200`}
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-sm"
                          style={{ backgroundColor: accentColor }}
                        >
                          {renderIcon(feat.icon)}
                        </div>
                        <h3 className="text-base font-bold font-display">{feat.title}</h3>
                        <p className="mt-2 text-xs opacity-75 leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 3. ABOUT SECTION WITH IMAGE #2 (Brand Story & Facility)
          if (section === 'about') {
            return (
              <section key="about" id="about" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  
                  {/* Image #2: About & Story */}
                  <div className="order-2 md:order-1 relative flex justify-center">
                    <div className={`overflow-hidden shadow-2xl border border-slate-200/50 aspect-[4/3] w-full max-w-md bg-slate-900 group ${aboutImageShape}`}>
                      <img 
                        src={aboutImage} 
                        alt="About Story" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="order-1 md:order-2">
                    <span 
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm"
                      style={{ backgroundColor: accentColor }}
                    >
                      Our Story
                    </span>

                    <h2 className="text-2xl sm:text-4xl font-extrabold mt-4 font-display leading-tight">
                      {data.aboutTitle || 'Built With Passion & Precision'}
                    </h2>
                    
                    <p className="mt-4 text-xs sm:text-sm opacity-80 leading-relaxed font-sans">
                      {data.aboutDesc || 'We are dedicated to delivering world-class quality and exceptional experience for every client.'}
                    </p>

                    <div className="mt-6 space-y-3 text-xs font-medium">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Verified Quality & Professional Excellence</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Dedicated Client Care & Support</span>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            );
          }

          // 4. SERVICES / PRODUCTS / SHOWCASE WITH IMAGE #3
          if (section === 'services') {
            return (
              <section key="services" id="services" className={`py-16 px-4 sm:px-6 ${isDark ? 'bg-slate-900/60' : 'bg-slate-50/70'} border-y border-slate-200/60`}>
                <div className="max-w-6xl mx-auto">
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
                      {data.servicesTitle || 'Featured Offerings & Services'}
                    </h2>
                  </div>

                  {/* Feature Image #3 Showcase Banner */}
                  <div className="mb-10 rounded-3xl overflow-hidden shadow-xl aspect-[21/9] bg-slate-900 group relative border border-slate-200/40">
                    <img 
                      src={galleryImage} 
                      alt="Showcase Gallery" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-6 flex items-end">
                      <p className="text-white font-bold text-sm sm:text-lg font-display">
                        Official Business Showcase
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(data.services || []).map((serv, idx) => (
                      <div 
                        key={idx}
                        className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm flex flex-col justify-between hover:shadow-md transition-shadow`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-base font-bold font-display">{serv.title}</h3>
                            <span 
                              className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm flex-shrink-0 ml-2"
                              style={{ backgroundColor: accentColor }}
                            >
                              {serv.price}
                            </span>
                          </div>
                          <p className="text-xs opacity-75 leading-relaxed">{serv.desc}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center justify-between text-[11px] font-bold opacity-80">
                          <span>{serv.tag || 'Showcase'}</span>
                          <a href="#contact" className="hover:underline flex items-center space-x-1">
                            <span>Inquire</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 5. PRICING / PACKAGES SECTION
          if (section === 'pricing') {
            return (
              <section key="pricing" id="pricing" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
                    {data.pricingTitle || 'Service Tiers & Packages'}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  {(data.pricing || []).map((plan, idx) => (
                    <div 
                      key={idx}
                      className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-md flex flex-col justify-between`}
                    >
                      <div>
                        <h3 className="text-xl font-bold font-display">{plan.name}</h3>
                        <div className="mt-4 flex items-baseline">
                          <span className="text-4xl font-extrabold font-display">{plan.price}</span>
                          <span className="text-xs opacity-70 ml-1">{plan.period}</span>
                        </div>
                        
                        <ul className="mt-6 space-y-2.5 text-xs opacity-80">
                          {(plan.features || []).map((f, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <a
                        href="#contact"
                        className="mt-8 text-center block w-full py-3 rounded-2xl font-bold text-xs text-white shadow-md transition-transform active:scale-95"
                        style={{ backgroundColor: accentColor }}
                      >
                        Get Started
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          // 6. TESTIMONIALS SECTION
          if (section === 'testimonials') {
            return (
              <section key="testimonials" className={`py-16 px-4 sm:px-6 ${isDark ? 'bg-slate-900/60' : 'bg-slate-50/70'} border-y border-slate-200/60`}>
                <div className="max-w-6xl mx-auto">
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
                      {data.testimonialsTitle || 'Client Feedback'}
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {(data.testimonials || []).map((item, idx) => (
                      <div 
                        key={idx}
                        className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-soft-sm`}
                      >
                        <div className="flex items-center space-x-1 text-amber-400 mb-3">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <Star className="w-4 h-4 fill-amber-400" />
                          <Star className="w-4 h-4 fill-amber-400" />
                          <Star className="w-4 h-4 fill-amber-400" />
                          <Star className="w-4 h-4 fill-amber-400" />
                        </div>
                        <p className="text-xs italic opacity-80 leading-relaxed font-sans">
                          "{item.text}"
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-100/60 flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold font-display">{item.name}</h4>
                            <p className="text-[10px] opacity-60 font-medium">{item.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 7. CONTACT & FOOTER WITH INQUIRY FORM
          if (section === 'contact') {
            return (
              <footer key="contact" id="contact" className={`py-12 sm:py-16 px-4 sm:px-6 ${isDark ? 'bg-slate-950 text-slate-200 border-t border-slate-900' : 'bg-slate-900 text-white'} w-full max-w-full overflow-hidden`}>
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 pb-12 border-b border-slate-800">
                  
                  {/* Left Column: Business Contact Info */}
                  <div>
                    <span 
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm inline-block mb-4"
                      style={{ backgroundColor: accentColor }}
                    >
                      Get In Touch
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-display">Have Questions or Special Requests?</h3>
                    <p className="mt-3 text-xs sm:text-sm opacity-75 leading-relaxed">
                      Reach out directly to our team for consultations, custom orders, site visits, or general inquiries.
                    </p>

                    <div className="mt-8 space-y-4 text-xs font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-brand-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] opacity-60 uppercase font-bold">Email Us</p>
                          <p className="font-semibold">{data.contactEmail || 'contact@business.com'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-brand-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] opacity-60 uppercase font-bold">Call Us</p>
                          <p className="font-semibold">{data.contactPhone || '+1 (800) 555-0199'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-brand-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] opacity-60 uppercase font-bold">Visit Store / Studio</p>
                          <p className="font-semibold">{data.contactAddress || 'Downtown Business Hub, Main St.'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Inquiry Form Card (Reference Screenshot Style) */}
                  <div className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-800/90 border-slate-700'} shadow-2xl`}>
                    {formSent ? (
                      <div className="py-12 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold font-display text-white">Message Sent Successfully!</h4>
                        <p className="text-xs opacity-75 mt-2">Thank you for reaching out. Our team will contact you shortly.</p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => { e.preventDefault(); setFormSent(true); }} className="space-y-4">
                        <h4 className="text-base font-bold font-display text-white mb-2">Send an Inquiry</h4>
                        <div>
                          <label className="block text-[11px] font-semibold opacity-75 mb-1">Your Name</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="John Doe" 
                            className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold opacity-75 mb-1">Your Email</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="john@example.com" 
                            className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold opacity-75 mb-1">Message / Request</label>
                          <textarea 
                            rows="3" 
                            required 
                            placeholder="How can we help you?" 
                            className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                          ></textarea>
                        </div>
                        <button 
                          type="submit" 
                          className="w-full py-3 rounded-xl font-bold text-xs text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center space-x-2"
                          style={{ backgroundColor: accentColor }}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
                        </button>
                      </form>
                    )}
                  </div>

                </div>

                <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] opacity-70 gap-2 sm:gap-4 w-full max-w-full">
                  <p className="text-center sm:text-left break-words">{data.footerText || `© 2026 ${data.logoText || template.title}. All rights reserved.`}</p>
                  <p className="mt-2 sm:mt-0 font-mono text-center sm:text-right flex-shrink-0">Built with Nexora</p>
                </div>
              </footer>
            );
          }

          return null;
        })}

      </div>
    </div>
  );
}
