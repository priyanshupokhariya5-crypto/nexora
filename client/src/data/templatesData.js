export const TEMPLATE_CATEGORIES = [
  "All",
  "E-Commerce",
  "Business & Legal",
  "Fitness & Health",
  "Restaurants & Cafe",
  "Real Estate & Architecture",
  "Tech & SaaS",
  "Creative & Agency",
  "Services & Lifestyle"
];

export const TEMPLATES_DATA = [
  // 1. E-Commerce (Tech & Electronics)
  {
    id: "ecom-tech",
    title: "VoltTech Gadgets & Store",
    category: "E-Commerce",
    badge: "Trending",
    tagline: "High-converting online store template for tech, gadgets, and consumer devices.",
    accentColor: "#2563eb",
    bgTheme: "light",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "VoltTech",
      heroTitle: "Next-Gen Tech Essentials Built For Tomorrow",
      heroSubtitle: "Discover ultra-fast wireless chargers, ergonomic gear, and smart accessories crafted with aerospace engineering.",
      ctaText: "Shop New Arrivals",
      ctaLink: "#products",
      heroImageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Why Tech Lovers Choose VoltTech",
      features: [
        { title: "Same-Day Dispatch", desc: "Order before 2 PM and get your tech shipped instantly with trackable express courier.", icon: "Zap" },
        { title: "2-Year Hardware Warranty", desc: "All devices come backed by our zero-hassle replacement guarantee.", icon: "ShieldCheck" },
        { title: "Carbon Neutral Shipping", desc: "Every delivery is 100% offset via verified clean renewable energy projects.", icon: "Leaf" }
      ],
      aboutTitle: "Engineering Precision Gear Since 2021",
      aboutDesc: "VoltTech was born out of a desire to create minimalist, durable everyday tech accessories without corporate inflated price tags.",
      servicesTitle: "Featured Product Collections",
      services: [
        { title: "MagCharge Pro Wireless Hub", desc: "15W fast charging stand with magnetic multi-device support.", price: "$79.00" },
        { title: "Acoustix ANC Earbuds", desc: "Active noise cancellation with 36-hour total playback battery.", price: "$129.00" },
        { title: "ErgoFlow Mechanical Board", desc: "Ultra-compact hot-swappable keyboard with custom RGB backlighting.", price: "$149.00" }
      ],
      pricingTitle: "Exclusive Member Bundles",
      pricing: [
        { name: "Starter Setup", price: "$99", period: "one-time", features: ["MagCharge Hub", "Braided USB-C Cable", "Free Shipping"] },
        { name: "Creator Pro Pack", price: "$249", period: "one-time", features: ["Acoustix ANC", "ErgoFlow Keyboard", "Desk Mat", "Priority Support"] }
      ],
      testimonialsTitle: "What Verified Buyers Say",
      testimonials: [
        { name: "Marcus Vance", role: "Software Architect", text: "The MagCharge hub completely cleared up my desk cable mess. Build quality is premium." },
        { name: "Elena Rostova", role: "Digital Artist", text: "Acoustix earbuds sound clearer than earphones twice their price. Super impressed!" }
      ],
      contactEmail: "support@volttech.shop",
      contactPhone: "+1 (800) 555-8658",
      footerText: "© 2026 VoltTech Inc. All rights reserved."
    }
  },

  // 2. Fitness & Gym
  {
    id: "fitness-gym",
    title: "PulseFit Gym & Athletic Hub",
    category: "Fitness & Health",
    badge: "Popular",
    tagline: "Dynamic high-energy template designed for gyms, personal trainers, and cross-fit studios.",
    accentColor: "#ea580c",
    bgTheme: "dark",
    fontFamily: "display",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "PULSEFIT",
      heroTitle: "UNLEASH YOUR HIGHEST POTENTIAL TODAY",
      heroSubtitle: "State-of-the-art equipment, elite certified trainers, and high-intensity community classes engineered for real transformations.",
      ctaText: "Claim Free 7-Day Pass",
      ctaLink: "#membership",
      heroImageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "The PulseFit Advantage",
      features: [
        { title: "24/7 Unlimited Access", desc: "Train on your schedule with keyless biometric security entry.", icon: "Clock" },
        { title: "Elite Personal Coaches", desc: "Customized nutrition protocols and bi-weekly body composition tracking.", icon: "Award" },
        { title: "Recovery & Sauna Zone", desc: "Infrared saunas, cold plunge tubs, and compression therapy rooms.", icon: "Flame" }
      ],
      aboutTitle: "Built For Champions & Beginners Alike",
      aboutDesc: "At PulseFit, we believe fitness is not a temporary phase—it's a lifelong commitment to strength, resilience, and vitality.",
      servicesTitle: "Training Programs",
      services: [
        { title: "HIIT & Cardio Burn", desc: "45-minute pulse-pounding group sweat sessions designed to incinerate calories.", price: "Included" },
        { title: "Heavy Iron Powerlifting", desc: "Dedicated lifting platforms, Olympic bars, and chalk-friendly power racks.", price: "Included" },
        { title: "1-on-1 Transformation Coaching", desc: "Direct guidance with Master Trainers including custom macro planning.", price: "+$60/hr" }
      ],
      pricingTitle: "Simple Membership Tiers",
      pricing: [
        { name: "Basic Access", price: "$49", period: "/month", features: ["24/7 Gym Floor Access", "Locker Room & Showers", "Free Wifi"] },
        { name: "All-Access Pro", price: "$89", period: "/month", features: ["Unlimited Group Classes", "Sauna & Cold Plunge", "1 Monthly Trainer Session", "Guest Pass"] }
      ],
      testimonialsTitle: "Member Stories",
      testimonials: [
        { name: "David Kim", role: "Lost 30 lbs in 4 Months", text: "The coaches here actually care about your form and progress. Atmosphere is top tier!" },
        { name: "Sarah Jenkins", role: "Cross-Training Athlete", text: "Best equipment in the city. The recovery zone cold plunge is a total game changer." }
      ],
      contactEmail: "join@pulsefitgym.com",
      contactPhone: "+1 (555) 948-3829",
      footerText: "© 2026 PulseFit Athletics. No excuses, only results."
    }
  },

  // 3. Business / Corporate Advisory
  {
    id: "business-corporate",
    title: "Apex Advisory & Consultancy",
    category: "Business & Legal",
    badge: "Enterprise",
    tagline: "Sophisticated corporate layout tailored for management consultants, financial advisers, and firms.",
    accentColor: "#0f172a",
    bgTheme: "light",
    fontFamily: "serif",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "APEX ADVISORY",
      heroTitle: "Strategic Clarity For Complex Global Markets",
      heroSubtitle: "We partner with visionary executive leaders to optimize operations, navigate M&A opportunities, and unlock sustainable valuation growth.",
      ctaText: "Schedule Strategy Call",
      ctaLink: "#contact",
      heroImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Our Core Practice Areas",
      features: [
        { title: "Corporate Restructuring", desc: "Data-driven capital optimization and operational streamlining for resilient performance.", icon: "TrendingUp" },
        { title: "Cross-Border M&A", desc: "End-to-end transaction advisory, target evaluation, and post-merger integration.", icon: "Briefcase" },
        { title: "Digital Transformation", desc: "Modernizing legacy enterprise architectures with secure cloud & automated AI workflows.", icon: "Cpu" }
      ],
      aboutTitle: "Over $4.2B in Advisory Transactions Executed",
      aboutDesc: "Founded in 2012 by former McKinsey and Goldman Sachs partners, Apex brings institutional-grade rigor to growth companies.",
      servicesTitle: "Advisory Packages",
      services: [
        { title: "Growth Diagnostic Audit", desc: "Deep-dive 2-week evaluation of financial metrics, unit economics, and market position.", price: "Custom" },
        { title: "Retained Executive Advisory", desc: "Direct weekly strategic counsel for C-suite executives and board directors.", price: "Retainer" }
      ],
      pricingTitle: "Engagement Models",
      pricing: [
        { name: "Strategic Sprint", price: "$15,000", period: "flat rate", features: ["2-Week Operations Audit", "Competitive Intelligence Report", "C-Suite Presentation"] },
        { name: "Enterprise Retainer", price: "$25,000", period: "/month", features: ["Dedicated Senior Partner", "Quarterly Board Review", "Priority M&A Support"] }
      ],
      testimonialsTitle: "Client Endorsements",
      testimonials: [
        { name: "Jonathan Sterling", role: "CEO, Nexa Logistics", text: "Apex guided us through our Series C capital raise smoothly. Their strategic insight saved us months of negotiations." },
        { name: "Clara Thorne", role: "Managing Director, Solis Capital", text: "Impeccable execution, sharp analysis, and complete discretion." }
      ],
      contactEmail: "inquiries@apexadvisory.com",
      contactPhone: "+1 (212) 555-0199",
      footerText: "© 2026 Apex Advisory Group LLC. Wall Street • London • Singapore"
    }
  },

  // 4. Restaurant & Cafe
  {
    id: "restaurant-cafe",
    title: "Bistro Craft Artisan Kitchen",
    category: "Restaurants & Cafe",
    badge: "Warm Editorial",
    tagline: "Elegant culinary template perfect for farm-to-table restaurants, fine dining, and cozy cafes.",
    accentColor: "#991b1b",
    bgTheme: "light",
    fontFamily: "serif",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "BISTRO CRAFT",
      heroTitle: "Authentic Farm-to-Table Dining Experience",
      heroSubtitle: "Handcrafted seasonal pasta, wood-fired organic meats, and natural bio-dynamic wines served in a warm candlelit ambience.",
      ctaText: "Reserve A Table",
      ctaLink: "#reservation",
      heroImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "The Bistro Craft Philosophy",
      features: [
        { title: "Locally Sourced Produce", desc: "100% of our vegetables and micro-greens are harvested daily from local heirloom farms.", icon: "Sprout" },
        { title: "Wood-Fired Hearth", desc: "Slow-roasted flavors crafted over aged oak & cherry wood logs in our custom masonry oven.", icon: "Flame" },
        { title: "Sommelier Cellar", desc: "Over 200 handpicked organic wines curated from boutique independent vineyards.", icon: "GlassWater" }
      ],
      aboutTitle: "Culinary Passion in Every Dish",
      aboutDesc: "Executive Chef Mateo Rossi brings three generations of Italian heritage combined with modern gastronomic techniques.",
      servicesTitle: "Chef's Tasting Highlights",
      services: [
        { title: "Truffle Tagliolini", desc: "Fresh egg pasta, black Umbrian truffle, cultured butter, Parmigiano-Reggiano.", price: "$34" },
        { title: "Wood-Roasted Duck Breast", desc: "Heritage duck, spiced cherry reduction, caramelized root vegetables.", price: "$42" },
        { title: "Artisan Tiramisù", desc: "Single-origin espresso, mascarpone mousse, Valrhona dark cocoa.", price: "$14" }
      ],
      pricingTitle: "Dining Experiences",
      pricing: [
        { name: "Seasonal 4-Course", price: "$85", period: "/guest", features: ["Amuse-Bouche", "Starter of Choice", "Main Course", "Dessert Pairing"] },
        { name: "Chef's 7-Course Tasting", price: "$140", period: "/guest", features: ["Full Culinary Journey", "Sommelier Wine Pairing (+$60)", "Private Kitchen Tour"] }
      ],
      testimonialsTitle: "Press & Food Critic Reviews",
      testimonials: [
        { name: "Michelin Guide Review", role: "2025 Selection", text: "Bistro Craft delivers unpretentious elegance with dishes that celebrate raw, unblemished flavor." },
        { name: "Gourmet Magazine", role: "Feature Story", text: "The Truffle Tagliolini alone is worth booking a table weeks in advance." }
      ],
      contactEmail: "hello@bistrocraft.restaurant",
      contactPhone: "+1 (415) 555-7382",
      footerText: "© 2026 Bistro Craft Kitchen. 482 Market St, San Francisco, CA"
    }
  },

  // 5. Real Estate & Property
  {
    id: "realestate-property",
    title: "EstateHub Luxury Real Estate",
    category: "Real Estate & Architecture",
    badge: "High End",
    tagline: "Sleek, modern property template for real estate agencies, luxury listings, and brokers.",
    accentColor: "#0f766e",
    bgTheme: "light",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "ESTATEHUB",
      heroTitle: "Find Your Extraordinary Sanctuary",
      heroSubtitle: "Curated collection of architecturally significant modern estates, beachfront villas, and luxury penthouses.",
      ctaText: "Explore Properties",
      ctaLink: "#listings",
      heroImageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Why Elite Buyers Trust EstateHub",
      features: [
        { title: "Off-Market Pocket Listings", desc: "Access confidential luxury estates before they hit public MLS databases.", icon: "Key" },
        { title: "3D Virtual Walkthroughs", desc: "Immersive 4K Matterport tours from anywhere in the world.", icon: "Eye" },
        { title: "White-Glove Legal Escrow", desc: "Seamless private legal representation and escrow transaction management.", icon: "Shield" }
      ],
      aboutTitle: "$1.8 Billion in Closed Residential Sales",
      aboutDesc: "Representing buyers and sellers of the world's finest architectural homes with unmatched market intelligence.",
      servicesTitle: "Featured Signature Listings",
      services: [
        { title: "The Glass Pavilion", desc: "4 Bed • 5 Bath • 6,200 Sq Ft • Hollywood Hills", price: "$8,950,000" },
        { title: "Horizon Ocean Villa", desc: "5 Bed • 6 Bath • Private Beach Access • Malibu", price: "$14,200,000" },
        { title: "The Penthouse At One Tower", desc: "3 Bed • 4 Bath • 360 Sky Skyline Views • Manhattan", price: "$11,500,000" }
      ],
      pricingTitle: "Seller Services Tiers",
      pricing: [
        { name: "Premier Listing", price: "Competitive Commission", period: "flat", features: ["Professional Staging & Drone Video", "Architectural Digest Feature", "Global Private Buyer Network"] }
      ],
      testimonialsTitle: "Client Success Stories",
      testimonials: [
        { name: "Richard & Sarah Vance", role: "Homebuyers", text: "EstateHub found us an off-market coastal villa in under 10 days. The negotiation was handled masterfully." },
        { name: "Helena Rostova", role: "Property Developer", text: "Their digital marketing brought qualified overseas buyers to our penthouse launch event." }
      ],
      contactEmail: "concierge@estatehubrealty.com",
      contactPhone: "+1 (310) 555-9200",
      footerText: "© 2026 EstateHub Luxury Real Estate Brokerage. Beverly Hills • Miami • New York"
    }
  },

  // 6. Digital Agency & Marketing
  {
    id: "agency-creative",
    title: "Vivid Studio Creative Agency",
    category: "Creative & Agency",
    badge: "Award Winning",
    tagline: "Bold, modern digital agency template for design studios, marketing firms, and branding experts.",
    accentColor: "#7c3aed",
    bgTheme: "dark",
    fontFamily: "display",
    image: "https://images.unsplash.com/photo-1542744094-3a3172720189?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "VIVID STUDIO",
      heroTitle: "WE CRAFT BRANDS THAT DOMINATE CULTURES",
      heroSubtitle: "Full-service digital creative studio specializing in brand identity, high-converting websites, and viral motion graphics.",
      ctaText: "Start A Project",
      ctaLink: "#contact",
      heroImageUrl: "https://images.unsplash.com/photo-1542744094-3a3172720189?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Our Creative Arsenal",
      features: [
        { title: "Brand Architecture", desc: "Visual systems, logo design, tone of voice, and comprehensive brand guidelines.", icon: "Palette" },
        { title: "WebGL & Motion Web", desc: "Interactive 3D web experiences engineered with Three.js and Framer Motion.", icon: "Sparkles" },
        { title: "Performance Growth", desc: "Data-backed ad creative and landing page funnels optimized for high ROAS.", icon: "TrendingUp" }
      ],
      aboutTitle: "We Don't Do Boring Web Design",
      aboutDesc: "Vivid Studio is a collective of designers, coders, and strategists obsessed with pushing the boundaries of digital aesthetics.",
      servicesTitle: "Recent Case Studies",
      services: [
        { title: "Aura Skincare Rebrand", desc: "Complete visual redesign resulting in +184% DTC conversion surge.", price: "Case Study" },
        { title: "Nova Finance App Design", desc: "Fintech mobile UI/UX design awarded FWA Site of the Day.", price: "Case Study" }
      ],
      pricingTitle: "Project Estimator",
      pricing: [
        { name: "Brand Identity Sprint", price: "$6,500", period: "one-time", features: ["Logo System & Variations", "Typography & Palette", "Brand Style Guide PDF", "Asset Kit"] },
        { name: "Full Web & Rebrand", price: "$18,000", period: "one-time", features: ["Custom Webflow/React Site", "Brand Identity Package", "3D Motion Assets", "SEO & Copywriting"] }
      ],
      testimonialsTitle: "What Clients Say",
      testimonials: [
        { name: "Alexei Volkov", role: "Founder, NovaPay", text: "Vivid Studio took our outdated app design and turned it into an award-winning user experience." }
      ],
      contactEmail: "hello@vividstudio.design",
      contactPhone: "+1 (415) 555-3011",
      footerText: "© 2026 Vivid Studio Inc. Crafted with passion."
    }
  },

  // 7. SaaS & Tech Product
  {
    id: "saas-cloud",
    title: "CloudPulse Developer Platform",
    category: "Tech & SaaS",
    badge: "Developer Choice",
    tagline: "Clean, high-tech SaaS template designed for cloud tools, dev engines, and AI platforms.",
    accentColor: "#0284c7",
    bgTheme: "light",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "CloudPulse",
      heroTitle: "Instant Cloud Infrastructure For Modern Engineering Teams",
      heroSubtitle: "Deploy microservices globally in milliseconds with auto-scaling database read-replicas, zero cold starts, and built-in edge security.",
      ctaText: "Deploy For Free",
      ctaLink: "#pricing",
      heroImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Engineered For Speed & Reliability",
      features: [
        { title: "Global Edge Network", desc: "280+ POP locations worldwide ensuring sub-10ms response latency anywhere.", icon: "Globe" },
        { title: "Automated CI/CD Pipelines", desc: "Git push to deploy with instant atomic previews and automatic database migrations.", icon: "GitBranch" },
        { title: "SOC2 Type II Certified", desc: "Bank-grade AES-256 encryption at rest and in transit with DDoS mitigation.", icon: "Lock" }
      ],
      aboutTitle: "Handling 14 Billion Requests Every Day",
      aboutDesc: "CloudPulse abstracts away cloud complexity so developer teams can focus on shipping features instead of managing server clusters.",
      servicesTitle: "Platform Capabilities",
      services: [
        { title: "Serverless Database Functions", desc: "Instant GraphQL & REST endpoints auto-generated from your database schema.", price: "Included" },
        { title: "Edge Key-Value Cache", desc: "Ultra-fast global memory storage for session states and dynamic config flags.", price: "Included" }
      ],
      pricingTitle: "Transparent Pricing",
      pricing: [
        { name: "Hobby", price: "$0", period: "/month", features: ["3 Projects", "100k API Requests/mo", "Community Discord Support"] },
        { name: "Pro Team", price: "$29", period: "/month", features: ["Unlimited Projects", "10 Million API Requests/mo", "Custom Domains", "Priority SLA"] }
      ],
      testimonialsTitle: "Trusted By Lead Tech Teams",
      testimonials: [
        { name: "Samantha Wright", role: "CTO, FleetStream", text: "Migrating to CloudPulse cut our monthly AWS bill by 60% while doubling API latency speed." }
      ],
      contactEmail: "support@cloudpulse.io",
      contactPhone: "+1 (888) 555-0144",
      footerText: "© 2026 CloudPulse Platform. Status: All Systems Operational."
    }
  },

  // 8. Personal Portfolio & Freelancer
  {
    id: "portfolio-freelance",
    title: "Alex Morgan UX/UI & Product Designer",
    category: "Creative & Agency",
    badge: "Personal",
    tagline: "Minimalist editorial portfolio template for designers, developers, and creative directors.",
    accentColor: "#18181b",
    bgTheme: "light",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "ALEX MORGAN",
      heroTitle: "Crafting Intuitive Digital Products & Seamless User Experiences",
      heroSubtitle: "Independent Product Designer based in Brooklyn, NY. Specializing in mobile apps, SaaS design systems, and visual strategy.",
      ctaText: "View Selected Work",
      ctaLink: "#work",
      heroImageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "My Core Expertise",
      features: [
        { title: "UX Architecture & Research", desc: "User journeys, wireframing, usability testing, and interactive prototyping.", icon: "Layers" },
        { title: "Design Systems", desc: "Scalable Figma component libraries, token structures, and developer documentation.", icon: "Grid" },
        { title: "Front-End Engineering", desc: "Translating pixel-perfect designs into clean React and Tailwind CSS code.", icon: "Code" }
      ],
      aboutTitle: "8+ Years Crafting Digital Experiences",
      aboutDesc: "I've helped startups raise over $40M and enterprise brands revamp their core software products.",
      servicesTitle: "Selected Projects",
      services: [
        { title: "Krypton Web3 Wallet", desc: "Mobile crypto wallet onboarding UX design for 500k active users.", price: "View Case" },
        { title: "Zenith Productivity App", desc: "Minimalist task manager interface featured on Apple App Store.", price: "View Case" }
      ],
      pricingTitle: "Availability & Rates",
      pricing: [
        { name: "Design Sprint", price: "$4,500", period: "/week", features: ["UX Audit & Redesign", "Figma Design System", "Interactive Prototype"] },
        { name: "Retainer Partnership", price: "$9,000", period: "/month", features: ["Full Product Design Ownership", "Weekly Team Syncs", "Front-End Code Handoff"] }
      ],
      testimonialsTitle: "What Founders Say",
      testimonials: [
        { name: "Michael Chang", role: "CEO, Zenith App", text: "Alex transformed our confusing app workflow into a clean design our users love." }
      ],
      contactEmail: "hello@alexmorgandesign.com",
      contactPhone: "+1 (917) 555-8392",
      footerText: "© 2026 Alex Morgan. Built with Nexora."
    }
  },

  // 9. Coffee Shop & Artisan Bakery
  {
    id: "cafe-bakery",
    title: "Bean & Brew Coffee & Bakery",
    category: "Restaurants & Cafe",
    badge: "Cozy Vibe",
    tagline: "Warm, inviting template for specialty coffee shops, roasteries, and sourdough bakeries.",
    accentColor: "#b48e65",
    bgTheme: "light",
    fontFamily: "serif",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "BEAN & BREW",
      heroTitle: "Freshly Roasted Coffee & Handcrafted Sourdough",
      heroSubtitle: "Single-origin beans ethically sourced from smallholder family farms, roasted daily in-house alongside hot flaky pastries.",
      ctaText: "Order Online For Pickup",
      ctaLink: "#menu",
      heroImageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Our Artisan Commitment",
      features: [
        { title: "Direct-Trade Beans", desc: "We pay 35% above fair-trade prices directly to micro-lot coffee growers.", icon: "Heart" },
        { title: "Wild Ferment Sourdough", desc: "Slow 36-hour natural fermentation process using organic heritage flours.", icon: "Cookie" },
        { title: "Zero Waste Roastery", desc: "Our coffee chaff is composted for community gardens, and packaging is 100% biodegradable.", icon: "Sun" }
      ],
      aboutTitle: "A Neighborhood Tradition Since 2018",
      aboutDesc: "Founded by childhood friends Liam & Maya, Bean & Brew was created to bring people together over honest coffee.",
      servicesTitle: "Popular Menu Favorites",
      services: [
        { title: "Ethical Espresso Flight", desc: "3 single-origin espressos highlighting distinct regional tasting notes.", price: "$9.50" },
        { title: "Almond Croissant", desc: "Double-baked buttery croissant filled with rich almond frangipane cream.", price: "$5.75" },
        { title: "Avocado Sourdough Toast", desc: "Thick sourdough slice, crushed avocado, poached organic egg, chili oil.", price: "$13.00" }
      ],
      pricingTitle: "Coffee Subscription Boxes",
      pricing: [
        { name: "Roaster's Choice", price: "$22", period: "/month", features: ["2 Bags (12oz) Fresh Beans", "Free Home Shipping", "Tasting Card Notes"] }
      ],
      testimonialsTitle: "Locals Love Us",
      testimonials: [
        { name: "Rachel Adams", role: "Neighborhood Regular", text: "The best oat milk flat white in town. Their almond croissants sell out by 10 AM for a reason!" }
      ],
      contactEmail: "hello@beanandbrew.coffee",
      contactPhone: "+1 (206) 555-4921",
      footerText: "© 2026 Bean & Brew Coffee Roasters. Seattle, WA"
    }
  },

  // 10. Healthcare & Dental Clinic
  {
    id: "medical-dental",
    title: "CarePoint Dental & Wellness",
    category: "Fitness & Health",
    badge: "Trusted",
    tagline: "Professional, reassuring healthcare template for clinics, dental offices, and medical centers.",
    accentColor: "#0284c7",
    bgTheme: "light",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "CarePoint Dental",
      heroTitle: "Gentle, State-of-the-Art Dental Care For Whole Families",
      heroSubtitle: "Experience stress-free dentistry with modern 3D digital imaging, laser whitening, and compassionate specialists.",
      ctaText: "Book Appointment",
      ctaLink: "#appointment",
      heroImageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Why Patients Choose CarePoint",
      features: [
        { title: "Pain-Free Technology", desc: "Advanced laser treatments and needle-free anesthesia options for complete comfort.", icon: "Smile" },
        { title: "Same-Day Dental Crowns", desc: "CAD/CAM ceramic crown fabrication while you relax in our comfortable chairs.", icon: "Sparkles" },
        { title: "Flexible Insurance Plans", desc: "In-network with major insurance providers plus zero-interest payment plans.", icon: "CreditCard" }
      ],
      aboutTitle: "20+ Years Serving Our Community",
      aboutDesc: "Led by Dr. Emily Thorne, CarePoint has transformed over 15,000 smiles with gentle care and modern technology.",
      servicesTitle: "Clinical Services",
      services: [
        { title: "Preventative Checkup & Clean", desc: "Comprehensive examination, digital X-rays, and ultrasonic plaque cleaning.", price: "$149" },
        { title: "Cosmetic Teeth Whitening", desc: "Professional 45-minute in-office whitening session up to 8 shades brighter.", price: "$299" },
        { title: "Clear Invisalign Alignment", desc: "Custom invisible aligner systems for discreet orthodontic correction.", price: "Consult" }
      ],
      pricingTitle: "Smile Membership Plan",
      pricing: [
        { name: "Annual Family Pass", price: "$29", period: "/month", features: ["2 Free Bi-Annual Cleaning Exams", "Free Annual X-Rays", "15% Off All Procedures"] }
      ],
      testimonialsTitle: "Patient Reviews",
      testimonials: [
        { name: "George Miller", role: "Patient for 5 Years", text: "I used to fear going to the dentist until I found CarePoint. Dr. Thorne and the team are fantastic." }
      ],
      contactEmail: "care@carepointdental.com",
      contactPhone: "+1 (312) 555-0812",
      footerText: "© 2026 CarePoint Dental Group. Emergency appointments available."
    }
  },

  // 11. Law Firm & Legal Services
  {
    id: "law-legal",
    title: "Vanguard Legal Counsel",
    category: "Business & Legal",
    badge: "Corporate",
    tagline: "Authoritative, dignified legal template for attorney practices, litigation firms, and legal counselors.",
    accentColor: "#1e293b",
    bgTheme: "light",
    fontFamily: "serif",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "VANGUARD LEGAL",
      heroTitle: "Relentless Advocacy & Experienced Strategic Counsel",
      heroSubtitle: "Protecting business assets, intellectual property, and high-net-worth individuals in complex dispute litigation.",
      ctaText: "Request Legal Consultation",
      ctaLink: "#contact",
      heroImageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Areas of Legal Practice",
      features: [
        { title: "Commercial Litigation", desc: "High-stakes breach of contract, shareholder disputes, and antitrust defense.", icon: "Scale" },
        { title: "Intellectual Property & Patents", desc: "Trademark registration, patent defense, and trade secret protection.", icon: "Shield" },
        { title: "Estate & Asset Protection", desc: "Comprehensive trust structure, wealth preservation, and tax optimization.", icon: "FileText" }
      ],
      aboutTitle: "$500M+ Secured For Legal Clients",
      aboutDesc: "Vanguard Legal brings over 35 years of combined trial courtroom experience across state and federal jurisdictions.",
      servicesTitle: "Legal Consultations",
      services: [
        { title: "Business Formation & Contracts", desc: "Custom corporate agreements, LLC operating agreements, and founder vesting.", price: "Fixed Fee" },
        { title: "IP Protection Package", desc: "Federal trademark filing, clearance search, and brand enforcement.", price: "Fixed Fee" }
      ],
      pricingTitle: "Fee Structure",
      pricing: [
        { name: "Initial Strategy Review", price: "$350", period: "1 Hour", features: ["Case Merit Assessment", "Risk Analysis Document", "Actionable Next Steps"] }
      ],
      testimonialsTitle: "Client Testimonials",
      testimonials: [
        { name: "Arthur Pendelton", role: "CEO, TechCorp", text: "Vanguard represented us during a difficult IP litigation case and achieved an outstanding settlement." }
      ],
      contactEmail: "intake@vanguardlegal.com",
      contactPhone: "+1 (212) 555-9080",
      footerText: "© 2026 Vanguard Legal Counsel LLP. Attorney Advertising."
    }
  },

  // 12. Spa, Salon & Beauty
  {
    id: "spa-beauty",
    title: "Aura Wellness Spa & Salon",
    category: "Services & Lifestyle",
    badge: "Serene",
    tagline: "Tranquil, luxurious beauty template for spas, hair salons, skin aesthetics, and massage therapy.",
    accentColor: "#db2777",
    bgTheme: "light",
    fontFamily: "serif",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "AURA SPA",
      heroTitle: "Restore Balance To Mind, Body & Radiant Skin",
      heroSubtitle: "Escape the city hustle in our soothing sanctuary. Experience organic facial rituals, deep-tissue massage, and holistic rejuvenation.",
      ctaText: "Book Your Sanctuary",
      ctaLink: "#services",
      heroImageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "The Aura Wellness Experience",
      features: [
        { title: "Organic Botanical Formulas", desc: "Formulated with 100% natural cold-pressed essential oils and botanical extracts.", icon: "Sparkles" },
        { title: "Master Aesthetic Therapists", desc: "Licensed estheticians trained in European lymphatic facial techniques.", icon: "Heart" },
        { title: "Private Mineral Hydrotherapy", desc: "Soak in heated mineral baths infused with Epsom salts and lavender blossoms.", icon: "Sun" }
      ],
      aboutTitle: "Voted Best Luxury Spa 2025",
      aboutDesc: "Aura Spa was designed as an urban haven focused on deep healing, skin health, and sensory peace.",
      servicesTitle: "Signature Treatments",
      services: [
        { title: "Aura Radiance Hydrafacial", desc: "60-min deep cleansing, diamond exfoliation, and hyaluronic infusion.", price: "$165" },
        { title: "Deep Hot Stone Therapy", desc: "90-min therapeutic massage using warm basalt stones to melt muscle tension.", price: "$195" },
        { title: "Botanical Hair & Scalp Ritual", desc: "Nourishing scalp massage, herbal steam, and custom hair blowout.", price: "$120" }
      ],
      pricingTitle: "Wellness Passes",
      pricing: [
        { name: "Monthly Spa Escape", price: "$139", period: "/month", features: ["1 Monthly Treatment of Choice", "Unlimited Hydrotherapy Pool Access", "20% Off Retail Products"] }
      ],
      testimonialsTitle: "Guest Experiences",
      testimonials: [
        { name: "Claire Bennett", role: "Spa Guest", text: "The Radiance Hydrafacial left my skin glowing for weeks. The most relaxing afternoon I've had in years!" }
      ],
      contactEmail: "relax@aurawellnessspa.com",
      contactPhone: "+1 (305) 555-2940",
      footerText: "© 2026 Aura Spa & Wellness Sanctuary. Miami Beach, FL"
    }
  },

  // 13. Photography & Creative Portfolio
  {
    id: "photography-visuals",
    title: "Aperture Visuals Studio",
    category: "Creative & Agency",
    badge: "Visual Art",
    tagline: "High-impact visual photography showcase for commercial, wedding, and editorial photographers.",
    accentColor: "#09090b",
    bgTheme: "dark",
    fontFamily: "display",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "APERTURE VISUALS",
      heroTitle: "CAPTURING MOMENTS THAT TIME CANNOT ERASE",
      heroSubtitle: "Award-winning commercial, fashion, and editorial photography for visionary brands and unforgettable celebrations worldwide.",
      ctaText: "Explore Gallery",
      ctaLink: "#gallery",
      heroImageUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Visual Disciplines",
      features: [
        { title: "Commercial & Product", desc: "High-resolution studio product lighting and commercial brand campaigns.", icon: "Camera" },
        { title: "Fashion & Editorial", desc: "High-fashion lookbooks, cover shoots, and creative runway coverage.", icon: "Film" },
        { title: "Destination Weddings", desc: "Candid emotional storytelling capturing intimate moments across the globe.", icon: "Heart" }
      ],
      aboutTitle: "Featured in Vogue, Harper's Bazaar & GQ",
      aboutDesc: "Lead photographer Marcus Thorne has spent 12 years documenting human emotion and architectural beauty in over 40 countries.",
      servicesTitle: "Photography Packages",
      services: [
        { title: "Brand Campaign Session", desc: "Full day studio or location shoot including commercial usage rights.", price: "$3,500" },
        { title: "Full Destination Wedding", desc: "10 hours of coverage, second shooter, and online print gallery.", price: "$5,800" }
      ],
      pricingTitle: "Booking Options",
      pricing: [
        { name: "Editorial Half-Day", price: "$2,200", period: "4 Hours", features: ["50 Retouched High-Res Images", "Online Client Portal", "Commercial License"] }
      ],
      testimonialsTitle: "Client Reviews",
      testimonials: [
        { name: "Victoria Sterling", role: "Creative Director, Luxe Mag", text: "Marcus has an incredible eye for light and mood. Every frame looks like a museum print." }
      ],
      contactEmail: "booking@aperturevisuals.com",
      contactPhone: "+1 (213) 555-8819",
      footerText: "© 2026 Aperture Visuals. Los Angeles • Paris • Tokyo"
    }
  },

  // 14. Education & Online Courses
  {
    id: "education-courses",
    title: "SkillForge Tech Academy",
    category: "Services & Lifestyle",
    badge: "Learn Skills",
    tagline: "Engaging educational landing page for online academies, coding bootcamps, and tutors.",
    accentColor: "#4f46e5",
    bgTheme: "light",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "SkillForge",
      heroTitle: "Master In-Demand Tech Skills & Land Your Dream Role",
      heroSubtitle: "Hands-on project bootcamps in Full-Stack Web Development, AI Engineering, and UX Design with 1-on-1 mentorship.",
      ctaText: "Browse Courses",
      ctaLink: "#courses",
      heroImageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "The SkillForge Edge",
      features: [
        { title: "Build Real Portfolio Projects", desc: "Graduate with 5 real production apps deployed live on GitHub & Vercel.", icon: "Code" },
        { title: "Direct Industry Mentors", desc: "Weekly code reviews from senior engineers working at FAANG companies.", icon: "Users" },
        { title: "Job Placement Guarantee", desc: "Get hired within 6 months of graduation or receive 100% tuition refund.", icon: "Award" }
      ],
      aboutTitle: "94% Job Placement Rate Within 180 Days",
      aboutDesc: "SkillForge has trained over 4,200 students who now work at top tech companies worldwide.",
      servicesTitle: "Popular Career Tracks",
      services: [
        { title: "Full-Stack React & Node Bootcamp", desc: "12-week intensive track covering JavaScript, React, Express, MongoDB, and AWS.", price: "$1,499" },
        { title: "AI Application Developer Track", desc: "8-week course building LLM agents, RAG systems, and Python APIs.", price: "$1,199" }
      ],
      pricingTitle: "Enrollment Plans",
      pricing: [
        { name: "Self-Paced Track", price: "$499", period: "one-time", features: ["Lifetime Access to All Lessons", "Discord Developer Community", "Certificate of Completion"] },
        { name: "Mentored Bootcamp", price: "$1,499", period: "one-time", features: ["1-on-1 Weekly Mentor Calls", "Resume & Interview Coaching", "Job Guarantee Protection"] }
      ],
      testimonialsTitle: "Graduate Stories",
      testimonials: [
        { name: "Jason Rivera", role: "Software Engineer @ Stripe", text: "SkillForge gave me the exact hands-on skills I needed to switch careers from retail to software engineering." }
      ],
      contactEmail: "admissions@skillforge.academy",
      contactPhone: "+1 (800) 555-7545",
      footerText: "© 2026 SkillForge Academy. Empowering the future of code."
    }
  },

  // 15. Event & Conference
  {
    id: "event-conference",
    title: "TechSummit 2026 Global Conference",
    category: "Services & Lifestyle",
    badge: "Live Event",
    tagline: "High-impact event registration layout for tech summits, conferences, and expos.",
    accentColor: "#2563eb",
    bgTheme: "dark",
    fontFamily: "display",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "TECHSUMMIT 2026",
      heroTitle: "THE FUTURE OF AI, WEB3 & DISRUPTIVE INNOVATION",
      heroSubtitle: "Join 3,000+ founders, investors, and engineers for 3 days of inspiring keynotes, networking, and hands-on workshops in San Francisco.",
      ctaText: "Get Pass Today",
      ctaLink: "#tickets",
      heroImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Event Highlights",
      features: [
        { title: "50+ World-Class Keynotes", desc: "Speakers from OpenAI, Google DeepMind, Y Combinator, and leading VCs.", icon: "Mic" },
        { title: "Startup Pitch Competition", desc: "$250k in equity-free cash prizes for top winning early-stage founders.", icon: "Trophy" },
        { title: "VIP Networking Afterparty", desc: "Connect with angel investors and tech pioneers in an exclusive setting.", icon: "GlassWater" }
      ],
      aboutTitle: "San Francisco • Moscone Center • Oct 14-16",
      aboutDesc: "The premier annual technology gathering where groundbreaking products are unveiled to the world.",
      servicesTitle: "Featured Keynote Speakers",
      services: [
        { title: "Dr. Aris Thorne", desc: "Head of AI Research at NextMind Systems", price: "Speaker" },
        { title: "Elena Rostova", desc: "General Partner at Horizon Capital", price: "Speaker" }
      ],
      pricingTitle: "Ticket Options",
      pricing: [
        { name: "Developer Pass", price: "$299", period: "Standard", features: ["3-Day Keynote & Expo Access", "Conference Swag Bag", "Coffee & Lunch"] },
        { name: "VIP Executive Pass", price: "$799", period: "VIP", features: ["VIP Front Row Seating", "Exclusive Speakers Lounge", "Afterparty Gala Ticket"] }
      ],
      testimonialsTitle: "Past Attendee Praise",
      testimonials: [
        { name: "Michael Chang", role: "Founder, Zenith AI", text: "I met our lead Series A investor right at the TechSummit networking dinner!" }
      ],
      contactEmail: "organizers@techsummit2026.io",
      contactPhone: "+1 (415) 555-8820",
      footerText: "© 2026 TechSummit Events LLC."
    }
  },

  // 16. Construction & Architecture
  {
    id: "construction-architecture",
    title: "BuildCraft Architecture & Construction",
    category: "Real Estate & Architecture",
    badge: "Industrial",
    tagline: "Solid, trustworthy template for general contractors, architects, and construction firms.",
    accentColor: "#d97706",
    bgTheme: "light",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "BUILDCRAFT",
      heroTitle: "Precision Construction & Modern Architectural Engineering",
      heroSubtitle: "Building custom commercial headquarters, luxury custom homes, and sustainable infrastructure projects on budget and on schedule.",
      ctaText: "Request Construction Estimate",
      ctaLink: "#contact",
      heroImageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Our Construction Pillars",
      features: [
        { title: "On-Time Project Delivery", desc: "Rigorous milestone management ensuring zero project schedule delays.", icon: "CheckCircle" },
        { title: "LEED Certified Green Building", desc: "Energy-efficient eco-materials reducing operational energy costs by 40%.", icon: "Leaf" },
        { title: "Full General Contracting", desc: "End-to-end management from structural foundation to interior finishing.", icon: "Wrench" }
      ],
      aboutTitle: "Over 250 Commercial & Residential Projects Built",
      aboutDesc: "BuildCraft has set the standard for craftsmanship, safety, and architectural integrity for over 2 decades.",
      servicesTitle: "Specialized Contracting Services",
      services: [
        { title: "Custom Luxury Estate Builds", desc: "Bespoke architectural home construction crafted to exacting standards.", price: "Estimate" },
        { title: "Commercial Interior Fit-Outs", desc: "Modern office and retail renovations optimized for workflow.", price: "Estimate" }
      ],
      pricingTitle: "Estimate Process",
      pricing: [
        { name: "Free Feasibility Review", price: "$0", period: "Initial Consultation", features: ["Site Assessment", "Budget Estimation Range", "Timeline Blueprint"] }
      ],
      testimonialsTitle: "Client Reviews",
      testimonials: [
        { name: "David Henderson", role: "Developer, Urban Heights", text: "BuildCraft delivered our 6-story commercial building 3 weeks ahead of deadline. Exceptional project management." }
      ],
      contactEmail: "info@buildcraftconstruction.com",
      contactPhone: "+1 (312) 555-3920",
      footerText: "© 2026 BuildCraft Contracting Inc. Licensed & Bonded."
    }
  },

  // 17. Non-Profit & NGO
  {
    id: "nonprofit-ngo",
    title: "GreenEarth Conservation Initiative",
    category: "Services & Lifestyle",
    badge: "Impact",
    tagline: "Inspiring non-profit template for charities, environmental causes, and NGOs.",
    accentColor: "#15803d",
    bgTheme: "light",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "GreenEarth",
      heroTitle: "Protecting Our Planet's Wild Rainforests & Oceans",
      heroSubtitle: "We fight climate change by protecting endangered ecosystems, planting native trees, and empowering local indigenous stewards.",
      ctaText: "Donate Now",
      ctaLink: "#donate",
      heroImageUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Our Global Impact",
      features: [
        { title: "1.2M+ Trees Planted", desc: "Restoring degraded tropical ecosystems with native biodiverse flora.", icon: "Sprout" },
        { title: "500k Acres Protected", desc: "Securing legally protected wildlife sanctuaries for endangered species.", icon: "Shield" },
        { title: "88% Direct Field Funding", desc: "88 cents of every dollar goes directly to boots-on-the-ground field projects.", icon: "Heart" }
      ],
      aboutTitle: "Transparency & Real Environmental Results",
      aboutDesc: "GreenEarth is a 501(c)(3) non-profit organization dedicated to transparent planetary protection.",
      servicesTitle: "Current Conservation Missions",
      services: [
        { title: "Amazon Rainforest Shield", desc: "Preventing illegal deforestation in high-risk biodiversity corridors.", price: "Active Mission" },
        { title: "Ocean Coral Restoration", desc: "Nurturing resilient coral nurseries to rebuild endangered reef systems.", price: "Active Mission" }
      ],
      pricingTitle: "Monthly Supporter Tiers",
      pricing: [
        { name: "Forest Guardian", price: "$15", period: "/month", features: ["Plant 15 Trees Monthly", "Quarterly Field Impact Report", "GreenEarth Sticker Kit"] },
        { name: "Ocean Champion", price: "$45", period: "/month", features: ["Protect 500 Sq Ft Reef", "VIP Annual Impact Webinar", "Eco Tote Bag"] }
      ],
      testimonialsTitle: "What Supporters Say",
      testimonials: [
        { name: "Dr. Linda Sterling", role: "Environmental Scientist", text: "GreenEarth is one of the few non-profits that publishes exact GPS coordinates for tree planting sites." }
      ],
      contactEmail: "help@greenearthinitiative.org",
      contactPhone: "+1 (800) 555-0192",
      footerText: "© 2026 GreenEarth Initiative 501(c)(3) Tax-Exempt Charity."
    }
  },

  // 18. Fashion & Apparel Brand
  {
    id: "fashion-apparel",
    title: "Aura Wear Sustainable Fashion",
    category: "E-Commerce",
    badge: "Editorial",
    tagline: "Chic luxury fashion template for apparel brands, streetwear labels, and boutique clothing.",
    accentColor: "#1c1917",
    bgTheme: "light",
    fontFamily: "serif",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "AURA WEAR",
      heroTitle: "Timeless Minimalist Apparel Crafted From Organic Linen",
      heroSubtitle: "Ethically tailored sustainable apparel designed with clean silhouettes, natural dyes, and zero toxic chemicals.",
      ctaText: "Shop Autumn Collection",
      ctaLink: "#shop",
      heroImageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Conscious Craftsmanship",
      features: [
        { title: "100% GOTS Organic Cotton", desc: "Soft breathable textiles grown without harmful chemical pesticides.", icon: "Sparkles" },
        { title: "Fair-Wage Artisan Tailoring", desc: "Hand-stitched in small batches by skilled garment artisans paid living wages.", icon: "Heart" },
        { title: "Plastic-Free Packaging", desc: "Shipped in compostable cassava starch bags and recycled card boxes.", icon: "Leaf" }
      ],
      aboutTitle: "Less Clothing, Better Quality",
      aboutDesc: "Aura Wear rejects fast-fashion consumerism in favor of capsule wardrobe pieces designed to last a decade.",
      servicesTitle: "Featured Seasonal Capsule",
      services: [
        { title: "Oversized Organic Linen Trench", desc: "Hand-dyed oat trench coat with horn button details.", price: "$240" },
        { title: "Classic Heavyweight Cotton Tee", desc: "280 GSM organic cotton crewneck tee in stone wash.", price: "$65" }
      ],
      pricingTitle: "Capsule Bundles",
      pricing: [
        { name: "Essential Capsule", price: "$320", period: "Set", features: ["1 Linen Trench", "2 Heavyweight Tees", "Free Canvas Tote Bag"] }
      ],
      testimonialsTitle: "Customer Reviews",
      testimonials: [
        { name: "Sophia Martinez", role: "Fashion Stylist", text: "The weight and drape of Aura Wear's linen trench is unmatched. My go-to daily outfit!" }
      ],
      contactEmail: "orders@aurawear.co",
      contactPhone: "+1 (888) 555-8310",
      footerText: "© 2026 Aura Wear Studio. Conscious Luxury."
    }
  },

  // 19. Mobile App Showcase
  {
    id: "app-showcase",
    title: "SwiftPay Mobile Finance App",
    category: "Tech & SaaS",
    badge: "Mobile UI",
    tagline: "Sleek app store landing page for iOS & Android mobile applications.",
    accentColor: "#059669",
    bgTheme: "dark",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "SwiftPay",
      heroTitle: "Send Money Worldwide In Seconds With Zero Hidden Fees",
      heroSubtitle: "The borderless financial app designed for global freelancers, digital nomads, and smart spenders.",
      ctaText: "Download Free App",
      ctaLink: "#download",
      heroImageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1556742049-0a6747a96409?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Financial Superpowers In Your Pocket",
      features: [
        { title: "Instant International Transfers", desc: "Send money to 80+ countries at real mid-market exchange rates.", icon: "Zap" },
        { title: "Virtual Disposable Cards", desc: "Generate instant single-use virtual cards for safe online shopping.", icon: "CreditCard" },
        { title: "Automated Savings Vaults", desc: "Round up spare change on purchases to auto-invest in index funds.", icon: "DollarSign" }
      ],
      aboutTitle: "Over 2 Million Active Users",
      aboutDesc: "SwiftPay is licensed and regulated by financial conduct authorities globally with bank-level security.",
      servicesTitle: "App Features",
      services: [
        { title: "Multi-Currency Accounts", desc: "Hold & exchange 40+ currencies instantly in one single app.", price: "Free" }
      ],
      pricingTitle: "Account Plans",
      pricing: [
        { name: "Standard Free", price: "$0", period: "/mo", features: ["Free Metal Card", "Fee-Free Transfers up to $2k/mo", "App Budgeting Tools"] },
        { name: "Swift Black", price: "$9.99", period: "/mo", features: ["Unlimited Fee-Free Transfers", "Complimentary Airport Lounge Access", "1% Cashback on All Purchases"] }
      ],
      testimonialsTitle: "User Praise",
      testimonials: [
        { name: "Daniel Vance", role: "Digital Nomad", text: "SwiftPay saved me hundreds in currency exchange conversion fees during my travels in Europe." }
      ],
      contactEmail: "support@swiftpay.app",
      contactPhone: "+1 (800) 555-7940",
      footerText: "© 2026 SwiftPay Technologies Inc. FDIC Insured."
    }
  },

  // 20. Car Rental & Automotive
  {
    id: "auto-rental",
    title: "Velocity Drives Luxury Exotic Car Rental",
    category: "Services & Lifestyle",
    badge: "Exotic",
    tagline: "High-octane car rental & automotive showcase for supercars and luxury fleets.",
    accentColor: "#dc2626",
    bgTheme: "dark",
    fontFamily: "display",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "VELOCITY DRIVES",
      heroTitle: "EXPERIENCE UNMATCHED SUPERCAR PERFORMANCE",
      heroSubtitle: "Rent the world's most thrilling exotic sports cars—Lamborghini, Ferrari, Porsche, and McLaren—delivered right to your hotel or airport terminal.",
      ctaText: "Reserve Supercar",
      ctaLink: "#fleet",
      heroImageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "The Velocity Experience",
      features: [
        { title: "White-Glove Airport Delivery", desc: "Your rental vehicle will be waiting at private VIP arrivals.", icon: "Key" },
        { title: "Zero Mileage Limits", desc: "Enjoy unlimited driving freedom with no hidden mileage penalties.", icon: "Zap" },
        { title: "Full Comprehensive Insurance", desc: "Complete peace of mind coverage included in every reservation.", icon: "Shield" }
      ],
      aboutTitle: "The Premier Luxury Fleet In Miami & Los Angeles",
      aboutDesc: "Velocity Drives offers an impeccably maintained fleet of exotic supercars for high-profile clients and enthusiasts.",
      servicesTitle: "Featured Supercar Fleet",
      services: [
        { title: "Lamborghini Huracán EVO", desc: "V10 Engine • 640 HP • 0-60 mph in 2.9 seconds", price: "$1,200/day" },
        { title: "Ferrari F8 Tributo", desc: "Twin-Turbo V8 • 710 HP • Italian Stallion Performance", price: "$1,450/day" },
        { title: "Porsche 911 GT3 RS", desc: "Naturally Aspirated 4.0L • Track Monster Handling", price: "$990/day" }
      ],
      pricingTitle: "Rental Packages",
      pricing: [
        { name: "Weekend Supercar Escape", price: "$2,800", period: "3 Days", features: ["Choice of Lamborghini or Ferrari", "200 Miles/Day Included", "Free VIP Delivery"] }
      ],
      testimonialsTitle: "Driver Reviews",
      testimonials: [
        { name: "Christian Vance", role: "Supercar Enthusiast", text: "Renting the Huracán EVO for my birthday was effortless. Velocity's service was 10/10!" }
      ],
      contactEmail: "vip@velocitydrives.com",
      contactPhone: "+1 (305) 555-8833",
      footerText: "© 2026 Velocity Exotic Drives. Miami • Los Angeles • Las Vegas"
    }
  },

  // 21. Coworking Space & Hub
  {
    id: "coworking-space",
    title: "Nexus Workspaces & Innovation Hub",
    category: "Business & Legal",
    badge: "Modern Space",
    tagline: "Clean, collaborative space template for coworking offices, shared desks, and private suites.",
    accentColor: "#2563eb",
    bgTheme: "light",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "NEXUS WORKSPACES",
      heroTitle: "Inspiring Shared Spaces For Innovators & Remote Teams",
      heroSubtitle: "Flexible hot desks, private acoustic soundproof booths, high-speed fiber internet, and gourmet espresso lounges in central business districts.",
      ctaText: "Book A Free Day Pass",
      ctaLink: "#tours",
      heroImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Built For Modern Productivity",
      features: [
        { title: "Gigabit Fiber Internet", desc: "Redundant dual-line gigabit internet with 99.9% uptime reliability.", icon: "Zap" },
        { title: "Ergonomic Herman Miller Chairs", desc: "Height-adjustable motorized desks and premium supportive seating.", icon: "CheckCircle" },
        { title: "Unlimited Artisan Coffee", desc: "Cold brew on tap, specialty teas, and weekly networking happy hours.", icon: "Coffee" }
      ],
      aboutTitle: "Where Founders Connect & Scale",
      aboutDesc: "Nexus Workspaces houses over 400 tech startups, creative agencies, and remote executives in vibrant eco-friendly spaces.",
      servicesTitle: "Membership Options",
      services: [
        { title: "Hot Desk Access", desc: "Flexible desk seating in open collaborative lounge zones.", price: "$250/mo" },
        { title: "Dedicated Desk", desc: "Your own permanent desk with locked storage cabinet.", price: "$450/mo" },
        { title: "Private Team Suite", desc: "Enclosed soundproof office for teams of 4 to 20 people.", price: "$1,800/mo" }
      ],
      pricingTitle: "Flexible Passes",
      pricing: [
        { name: "Day Pass", price: "$35", period: "/day", features: ["Open Lounge Access", "High-Speed Wifi", "Free Coffee & Tea"] }
      ],
      testimonialsTitle: "Member Praise",
      testimonials: [
        { name: "Jessica Lin", role: "Founder, Bloom Tech", text: "Moving our startup team to Nexus boosted our energy and team morale. Great community events!" }
      ],
      contactEmail: "hello@nexusworkspaces.com",
      contactPhone: "+1 (415) 555-4080",
      footerText: "© 2026 Nexus Workspaces LLC. San Francisco • Austin • New York"
    }
  },

  // 22. Music & Artist Hub
  {
    id: "music-artist",
    title: "SonicWave Records & Recording Studio",
    category: "Creative & Agency",
    badge: "Audio Art",
    tagline: "Vibrant studio layout for musicians, record labels, and audio producers.",
    accentColor: "#c026d3",
    bgTheme: "dark",
    fontFamily: "display",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "SONICWAVE",
      heroTitle: "WORLD-CLASS ANALOG RECORDING & AUDIO MASTERING",
      heroSubtitle: "Vintage Neve consoles, SSL mixing rooms, pristine acoustics, and Grammy-winning sound engineers ready to bring your sound to life.",
      ctaText: "Book Studio Time",
      ctaLink: "#studio",
      heroImageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Studio Specifications",
      features: [
        { title: "Solid State Logic 4000 G Console", desc: "Legendary analog warm punch and surgical mixing control.", icon: "Mic" },
        { title: "Vintage Microphone Locker", desc: "Neumann U47, Telefunken ELA M 251, and Coles ribbon mics.", icon: "Sparkles" },
        { title: "Dolby Atmos Spatial Audio", desc: "State-of-the-art 9.1.4 immersive spatial audio mixing suite.", icon: "Volume2" }
      ],
      aboutTitle: "Over 30 Platinum Certified Albums Tracked",
      aboutDesc: "SonicWave Studios has been the recording home for legendary rock, hip-hop, and electronic artists for over 15 years.",
      servicesTitle: "Recording & Mixing Rates",
      services: [
        { title: "Studio A Tracking (Neve)", desc: "Includes house engineer and assistant. 10-hour block.", price: "$1,200/day" },
        { title: "Stereo Audio Mastering", desc: "Analog outboard processing with DDP file delivery.", price: "$150/song" }
      ],
      pricingTitle: "Studio Packages",
      pricing: [
        { name: "Single Production Sprint", price: "$2,500", period: "2 Days", features: ["Full Studio A Access", "Mastering Included", "Stems Export"] }
      ],
      testimonialsTitle: "Artist Feedback",
      testimonials: [
        { name: "Trevor Vance", role: "Indie Rock Producer", text: "The room acoustics in Studio A are unmatched. The Neve console gave our vocals incredible warmth." }
      ],
      contactEmail: "booking@sonicwaverecords.com",
      contactPhone: "+1 (615) 555-9012",
      footerText: "© 2026 SonicWave Studios. Nashville, TN"
    }
  },

  // 23. Hotel & Boutique Resort
  {
    id: "hotel-resort",
    title: "Serene Stay Coastal Boutique Resort",
    category: "Services & Lifestyle",
    badge: "Luxury Getaway",
    tagline: "Breathtaking hospitality template for boutique hotels, resorts, and vacation rentals.",
    accentColor: "#0284c7",
    bgTheme: "light",
    fontFamily: "serif",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "SERENE STAY",
      heroTitle: "Unwind In Coastal Luxury & Oceanfront Tranquility",
      heroSubtitle: "Perched above cliffs overlooking turquoise ocean waters, Serene Stay offers private infinity plunge pools, oceanfront dining, and personalized concierge.",
      ctaText: "Check Availability",
      ctaLink: "#booking",
      heroImageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Resort Amenities",
      features: [
        { title: "Private Ocean View Villas", desc: "Architectural suites featuring floor-to-ceiling glass and private sun terraces.", icon: "Sun" },
        { title: "Cliffside Infinity Pool", desc: "Heated infinity pool overlooking breathtaking sunset ocean views.", icon: "Eye" },
        { title: "Private Butler Service", desc: "24/7 dedicated butler service for champagne, dining, and island excursions.", icon: "Heart" }
      ],
      aboutTitle: "Voted #1 Boutique Hotel in California",
      aboutDesc: "Designed as an intimate coastal retreat, Serene Stay combines minimalist modern architecture with warm hospitality.",
      servicesTitle: "Suite Collections",
      services: [
        { title: "Sunset Ocean Villa", desc: "King Bed • Oceanfront Terrace • Private Infinity Plunge Pool", price: "$850/night" },
        { title: "Cliffside Penthouse", desc: "2 Bedroom • 360 Panorama Views • Outdoor Fire Pit", price: "$1,450/night" }
      ],
      pricingTitle: "Exclusive Escape Packages",
      pricing: [
        { name: "Romantic Getaway", price: "$2,200", period: "3 Nights", features: ["Sunset Villa Upgrade", "Daily Champagne Breakfast", "Couples 90-min Spa Massage"] }
      ],
      testimonialsTitle: "Guest Endorsements",
      testimonials: [
        { name: "Amanda & Robert Vance", role: "Honeymooners", text: "Waking up to ocean waves from our plunge pool was pure paradise. Staff paid attention to every detail." }
      ],
      contactEmail: "reservations@serenestayresort.com",
      contactPhone: "+1 (800) 555-3910",
      footerText: "© 2026 Serene Stay Boutique Resort. Big Sur, CA"
    }
  },

  // 24. Financial Tech / Crypto
  {
    id: "fintech-crypto",
    title: "VaultPay Institutional Web3 Gateway",
    category: "Tech & SaaS",
    badge: "Fintech",
    tagline: "High-security financial tech template for crypto gateways, trading platforms, and Web3 banks.",
    accentColor: "#6366f1",
    bgTheme: "dark",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "VaultPay",
      heroTitle: "Institutional Crypto Asset Storage & Settlement Platform",
      heroSubtitle: "Multi-party computation (MPC) cold storage custody, instant off-chain clearing, and regulatory compliant digital asset API infrastructure.",
      ctaText: "Request Enterprise Access",
      ctaLink: "#contact",
      heroImageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Institutional Grade Security",
      features: [
        { title: "MPC Threshold Security", desc: "Private key fragments stored across air-gapped hardware vaults worldwide.", icon: "Shield" },
        { title: "Sub-Second Settlement Engine", desc: "Execute multi-million dollar liquidity trades with zero slippage or latency.", icon: "Zap" },
        { title: "$500M Insurance Protection", desc: "Cryptographic assets fully insured against crime & cyber vulnerabilities by Lloyd's of London.", icon: "Lock" }
      ],
      aboutTitle: "Securing $12 Billion In Digital Assets",
      aboutDesc: "VaultPay provides the underlying financial technology rail for institutional hedge funds, fintech banks, and market makers.",
      servicesTitle: "Enterprise Products",
      services: [
        { title: "MPC Custody API", desc: "Programmatic wallet creation and signing API with custom approval policies.", price: "Enterprise" },
        { title: "Cross-Chain Liquidity Engine", desc: "Automated liquidity routing across top global digital exchanges.", price: "Enterprise" }
      ],
      pricingTitle: "Institution Plans",
      pricing: [
        { name: "Enterprise API", price: "Custom", period: "Billed Annually", features: ["Dedicated Vault Infrastructure", "24/7 SLA Technical Support", "Custom Approval Workflows"] }
      ],
      testimonialsTitle: "Client Reviews",
      testimonials: [
        { name: "Eric Thorne", role: "Managing Partner, Apex Crypto Fund", text: "VaultPay's MPC wallet architecture gave our investment committee total peace of mind for custody." }
      ],
      contactEmail: "institutional@vaultpay.io",
      contactPhone: "+1 (212) 555-0019",
      footerText: "© 2026 VaultPay Financial Technologies Inc. New York • Zurich"
    }
  },

  // 25. Pet Care & Veterinary
  {
    id: "pet-veterinary",
    title: "Paws & Claws Veterinary Clinic",
    category: "Services & Lifestyle",
    badge: "Pet Friendly",
    tagline: "Heartwarming, trustworthy template for pet care centers, animal hospitals, and groomers.",
    accentColor: "#0284c7",
    bgTheme: "light",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "Paws & Claws",
      heroTitle: "Compassionate Medical Care & Grooming For Your Beloved Pets",
      heroSubtitle: "From routine health checkups and vaccinations to advanced surgical care and luxurious dog grooming, we treat your pets like family.",
      ctaText: "Schedule Pet Appointment",
      ctaLink: "#contact",
      heroImageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Why Pet Parents Love Us",
      features: [
        { title: "24/7 Emergency Care", desc: "On-call veterinary surgeons ready for emergencies day or night.", icon: "Heart" },
        { title: "Fear-Free Certified", desc: "Gentle handling techniques designed to minimize stress for cats and dogs.", icon: "Smile" },
        { title: "In-House Diagnostics & X-Ray", desc: "Same-day blood lab testing and digital X-ray imaging.", icon: "CheckCircle" }
      ],
      aboutTitle: "Treating Happy Pets Since 2014",
      aboutDesc: "Dr. Sarah Jenkins and her passionate team provide state-of-the-art medical care in a warm, friendly environment.",
      servicesTitle: "Pet Services",
      services: [
        { title: "Wellness Exam & Vaccinations", desc: "Comprehensive nose-to-tail physical exam and essential vaccinations.", price: "$75" },
        { title: "Full Spa Grooming Session", desc: "Bath, coat trim, nail clip, ear cleaning, and teeth brushing.", price: "$65" }
      ],
      pricingTitle: "Pet Wellness Plans",
      pricing: [
        { name: "Puppy/Kitten Plan", price: "$39", period: "/month", features: ["Unlimited Free Office Exams", "All First-Year Vaccinations", "Microchip Insertion"] }
      ],
      testimonialsTitle: "Pet Owner Praise",
      testimonials: [
        { name: "Emily Watson", role: "Dog Parent to Max", text: "Dr. Jenkins saved Max when he ate chocolate. Her calm professionalism and care were incredible!" }
      ],
      contactEmail: "care@pawsandclawsvet.com",
      contactPhone: "+1 (415) 555-8300",
      footerText: "© 2026 Paws & Claws Animal Hospital."
    }
  },

  // 26. Interior Design
  {
    id: "interior-design",
    title: "Minimalist Spaces Interior Studio",
    category: "Real Estate & Architecture",
    badge: "Design Aesthetics",
    tagline: "Elegant architectural design portfolio template for interior designers and decor studios.",
    accentColor: "#78716c",
    bgTheme: "light",
    fontFamily: "serif",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "MINIMALIST SPACES",
      heroTitle: "Transforming Spaces Into Harmonious Architectural Art",
      heroSubtitle: "Bespoke residential interior design focused on natural light, tactile warm textures, and functional spatial elegance.",
      ctaText: "View Design Portfolio",
      ctaLink: "#portfolio",
      heroImageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Our Design Methodology",
      features: [
        { title: "3D Photorealistic Rendering", desc: "Visualize every room in high definition before construction begins.", icon: "Eye" },
        { title: "Custom Furniture Fabrication", desc: "Handcrafted furniture pieces built exclusively for your home layout.", icon: "Sparkles" },
        { title: "Turnkey Project Management", desc: "We manage contractors, procurement, and installation seamlessly.", icon: "CheckCircle" }
      ],
      aboutTitle: "Featured in Architectural Digest & Elle Decor",
      aboutDesc: "Principal designer Clara Vane creates serene living environments that celebrate organic materials and timeless simplicity.",
      servicesTitle: "Design Services",
      services: [
        { title: "Full Home Interior Design", desc: "End-to-end spatial planning, material selection, and custom furniture.", price: "Custom Quote" }
      ],
      pricingTitle: "Consultation",
      pricing: [
        { name: "In-Home Design Consultation", price: "$450", period: "2 Hours", features: ["Spatial Walkthrough", "Color & Material Swatch Board", "Budget & Scope Outline"] }
      ],
      testimonialsTitle: "Client Reviews",
      testimonials: [
        { name: "Hannah Sterling", role: "Homeowner", text: "Clara turned our noisy suburban home into a peaceful, light-filled sanctuary. Every detail feels intentional." }
      ],
      contactEmail: "studio@minimalistspaces.com",
      contactPhone: "+1 (310) 555-7820",
      footerText: "© 2026 Minimalist Spaces Design Studio. Los Angeles • New York"
    }
  },

  // 27. Wedding & Event Planning
  {
    id: "wedding-planning",
    title: "Forever Events Luxury Wedding Planner",
    category: "Services & Lifestyle",
    badge: "Romantic",
    tagline: "Enchanting wedding planner and celebration template for planners, venues, and event coordinators.",
    accentColor: "#be185d",
    bgTheme: "light",
    fontFamily: "serif",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "FOREVER EVENTS",
      heroTitle: "Unforgettable Wedding Celebrations Crafted With Elegance",
      heroSubtitle: "We curate flawless destination weddings and lavish celebrations, turning your dreams into enchanting realities.",
      ctaText: "Schedule Consultation",
      ctaLink: "#contact",
      heroImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "The Forever Experience",
      features: [
        { title: "Full-Service Wedding Design", desc: "From floral installations to custom lighting, catering, and entertainment.", icon: "Heart" },
        { title: "Destination Concierge", desc: "Managing guest travel, luxury hotel bookings, and private transfers.", icon: "Globe" },
        { title: "Day-Of Execution Precision", desc: "A dedicated team of 5 coordinators ensuring every timeline minute is flawless.", icon: "Clock" }
      ],
      aboutTitle: "Over 180 Romantic Celebrations Designed",
      aboutDesc: "Lead planner Isabella Rossi brings Italian flair and unmatched organization to high-profile weddings worldwide.",
      servicesTitle: "Planning Offerings",
      services: [
        { title: "Full Destination Wedding Package", desc: "Complete conceptual design, vendor management, and 3-day wedding weekend coordination.", price: "Custom" }
      ],
      pricingTitle: "Service Packages",
      pricing: [
        { name: "Full Wedding Design & Execution", price: "$7,500+", period: "Flat Rate", features: ["Unlimited Vendor Meetings", "Floral & Decor Styling", "Day-Of Lead Coordinator Team"] }
      ],
      testimonialsTitle: "Bride & Groom Stories",
      testimonials: [
        { name: "Sophia & Marcus Vance", role: "Married Sept 2025 in Amalfi", text: "Isabella made our dream Amalfi Coast wedding stress-free! Our guests said it was the best wedding they've ever attended." }
      ],
      contactEmail: "love@foreverevents.com",
      contactPhone: "+1 (212) 555-4900",
      footerText: "© 2026 Forever Events Luxury Weddings. New York • Florence"
    }
  },

  // 28. Cleaning & Home Services
  {
    id: "cleaning-services",
    title: "SparkleClean Home & Office Services",
    category: "Services & Lifestyle",
    badge: "Sparkling",
    tagline: "Fresh, trustworthy home cleaning and office maintenance service template.",
    accentColor: "#0284c7",
    bgTheme: "light",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "SparkleClean",
      heroTitle: "Spotless Eco-Friendly Home & Office Cleaning Services",
      heroSubtitle: "Background-checked professional cleaners, non-toxic eco-friendly products, and a 100% satisfaction guarantee.",
      ctaText: "Book Cleaning Session",
      ctaLink: "#booking",
      heroImageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Why Homeowners Trust SparkleClean",
      features: [
        { title: "100% Non-Toxic Eco Products", desc: "Safe for kids, pets, and allergy sufferers with zero harsh chemical residue.", icon: "Leaf" },
        { title: "Insured & Background-Checked", desc: "Every cleaner undergoes rigorous criminal background checks and training.", icon: "Shield" },
        { title: "100% Re-Clean Guarantee", desc: "If you're not completely thrilled, we'll return and re-clean for free.", icon: "CheckCircle" }
      ],
      aboutTitle: "Over 25,000 Homes Cleaned",
      aboutDesc: "SparkleClean was founded to give busy professionals back their weekends with reliable, premium cleaning care.",
      servicesTitle: "Popular Cleaning Options",
      services: [
        { title: "Deep Home Clean", desc: "Thorough deep scrub of kitchen appliances, baseboards, bathrooms, and bedrooms.", price: "$180" },
        { title: "Regular Weekly Clean", desc: "Consistent maintenance cleaning to keep your home smelling fresh.", price: "$120/visit" }
      ],
      pricingTitle: "Subscription Plans",
      pricing: [
        { name: "Bi-Weekly Clean", price: "$130", period: "/visit", features: ["Whole Home Scrub", "Bed Linen Change", "Eco Products Included", "Flexible Cancellation"] }
      ],
      testimonialsTitle: "Customer Praise",
      testimonials: [
        { name: "Jennifer Lopez", role: "Busy Working Mom", text: "SparkleClean comes every Thursday and my house looks like a luxury hotel when I get home. Life saver!" }
      ],
      contactEmail: "clean@sparkleclean.com",
      contactPhone: "+1 (800) 555-2244",
      footerText: "© 2026 SparkleClean Services Inc."
    }
  },

  // 29. Gaming Community & Esport
  {
    id: "gaming-esport",
    title: "Apex Gaming Clan & Esport Team",
    category: "Services & Lifestyle",
    badge: "Esport",
    tagline: "High-energy cyber aesthetic template for gaming clans, esport teams, and Twitch streamers.",
    accentColor: "#9333ea",
    bgTheme: "dark",
    fontFamily: "display",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "APEX GAMING",
      heroTitle: "DOMINATING COMPETITIVE CYBER ARENAS WORLDWIDE",
      heroSubtitle: "Home to championship esports rosters in Valorant, Apex Legends, and Counter-Strike. Join our Discord community of 80,000+ gamers.",
      ctaText: "Join Discord Community",
      ctaLink: "#discord",
      heroImageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Clan Achievements",
      features: [
        { title: "3 World Championship Titles", desc: "First place trophies in international tournament majors.", icon: "Trophy" },
        { title: "Pro Streaming House", desc: "State-of-the-art 10,000 sq ft gaming mansion equipped with fiber gigabit lines.", icon: "Tv" },
        { title: "Official Creator Apparel", desc: "Exclusive limited-edition jerseys and streetwear designed for gamers.", icon: "ShoppingBag" }
      ],
      aboutTitle: "Founded In 2020 • Built By Gamers",
      aboutDesc: "Apex Gaming has grown from a group of college friends into an international esports franchise.",
      servicesTitle: "Official Pro Roster",
      services: [
        { title: "Valorant Champions Squad", desc: "Ranked #1 North America Tournament Circuit", price: "Pro Roster" }
      ],
      pricingTitle: "VIP Supporter Pass",
      pricing: [
        { name: "Apex Founder Pass", price: "$9.99", period: "/month", features: ["Custom Discord Badge", "Exclusive Twitch Emotes", "Early Access Merch Drop"] }
      ],
      testimonialsTitle: "Fan Testimonials",
      testimonials: [
        { name: "GamerTag: ShadowNinja", role: "Community Member", text: "Apex has the friendliest gaming community and insane tournament watch parties!" }
      ],
      contactEmail: "sponsors@apexgaming.gg",
      contactPhone: "+1 (415) 555-0922",
      footerText: "© 2026 Apex Esport Clan LLC. Play to Win."
    }
  },

  // 30. Podcast & Media Show
  {
    id: "podcast-show",
    title: "The Daily Pulse Podcast",
    category: "Creative & Agency",
    badge: "Audio Show",
    tagline: "Engaging podcast landing page template for show hosts, creators, and media networks.",
    accentColor: "#ea580c",
    bgTheme: "dark",
    fontFamily: "sans",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    defaultData: {
      logoText: "DAILY PULSE",
      heroTitle: "Unfiltered Conversations With World-Changers & Innovators",
      heroSubtitle: "Hosted by Marcus Vance, exploring tech breakthroughs, philosophy, human longevity, and high-performance mindsets.",
      ctaText: "Listen On Spotify",
      ctaLink: "#episodes",
      heroImageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
      aboutImageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
      galleryImageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      featuresTitle: "Why Listeners Tune In",
      features: [
        { title: "Deep 2-Hour Interviews", desc: "Uncut long-form conversations exploring root truths with top experts.", icon: "Mic" },
        { title: "Weekly New Episodes", desc: "Fresh episodes dropped every Tuesday and Thursday morning.", icon: "Clock" },
        { title: "Ad-Free Patreon Feed", desc: "Support the podcast and get exclusive bonus Q&A sessions.", icon: "Sparkles" }
      ],
      aboutTitle: "Over 50 Million Total Downloads",
      aboutDesc: "The Daily Pulse ranks among the top 10 tech and philosophy podcasts on Apple Podcasts & Spotify.",
      servicesTitle: "Recent Trending Episodes",
      services: [
        { title: "Ep 284: The Next 10 Years of AI", desc: "Guest: Dr. Aris Thorne on artificial general intelligence breakthroughs.", price: "Listen Now" },
        { title: "Ep 283: Mastering Sleep Biology", desc: "Guest: Dr. Elena Rostova on circadian rhythms and recovery.", price: "Listen Now" }
      ],
      pricingTitle: "Patreon Supporter Tiers",
      pricing: [
        { name: "Insider Member", price: "$5", period: "/month", features: ["Ad-Free Audio Feed", "Private Discord Channel", "Submit Listener Questions"] }
      ],
      testimonialsTitle: "Listener Reviews",
      testimonials: [
        { name: "Brian K.", role: "Avid Listener", text: "The Daily Pulse is my mandatory morning commute listen. Marcus asks the best questions!" }
      ],
      contactEmail: "contact@thedailypulse.show",
      contactPhone: "+1 (888) 555-4400",
      footerText: "© 2026 The Daily Pulse Media Network."
    }
  }
];
