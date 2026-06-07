import { useState, useEffect, FormEvent } from 'react';
import {
  Layers,
  Zap,
  Wrench,
  Hammer,
  Shield,
  Ruler,
  Calculator,
  HardHat,
  Cpu,
  ShoppingCart,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Truck,
  Printer,
  FileText,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Building2,
  Check,
  Plus,
  Minus,
  Info,
  X,
  FileSpreadsheet,
  ArrowRight,
  Send,
  HelpCircle,
  ArchiveX,
  Droplet,
  ShowerHead,
  Lightbulb,
  Paintbrush,
  Home,
  Spade,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

import { Product, Category, CartItem, Quote, Project } from '@/types';
import { CATEGORIES, MOCK_PRODUCTS } from './data/mockProducts';
import Navigation from '../components/Navigation';
import CatalogBrowser from '../components/CatalogBrowser';

// Default initial project templates for simulated client records
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj1',
    name: 'Broadside Highway Sidewalk Restoration',
    siteAddress: '394 Broadside Blv, Sector 4',
    foreman: 'Dave Vance',
    contactNo: '+1 (555) 321-9304',
    activeQuotesCount: 1,
    status: 'active'
  },
  {
    id: 'proj2',
    name: 'Retaining Wall Brick Laying Grid',
    siteAddress: '88 West Creek Lane, Hillside Area',
    foreman: 'Frankline Kip',
    contactNo: '+1 (555) 728-1192',
    activeQuotesCount: 2,
    status: 'active'
  },
  {
    id: 'proj3',
    name: 'Formwork Framing & Garage Slab',
    siteAddress: '1504 North Pines Road, Lot B',
    foreman: 'Tyler Vance',
    contactNo: '+1 (555) 902-1845',
    activeQuotesCount: 0,
    status: 'on_hold'
  }
];

// Initial mock quote logs
const INITIAL_QUOTES: Quote[] = [
  {
    id: 'q_pre_1',
    quoteNumber: 'DM-RFQ-2026-081',
    customerName: 'Dave Vance',
    companyName: 'Vance Concrete & Sidings LLC',
    paymentTerms: 'NET 30 Structural Credit',
    deliveryAddress: '394 Broadside Blv, Sector 4',
    deliveryType: 'flatbed',
    deliveryRequiredDate: '2026-06-12',
    createdAt: '2026-06-05',
    items: [
      {
        product: MOCK_PRODUCTS[0], // Type I/II Portland Bag
        quantity: 150,
      },
      {
        product: MOCK_PRODUCTS[1], // Deformed Steel Rebar #4
        quantity: 80,
      }
    ],
    subtotal: 150 * 11.20 + 80 * 14.80, // trade prices
    shippingEstimate: 185.00,
    tax: (150 * 11.20 + 80 * 14.80) * 0.0825,
    get total() { return this.subtotal + this.shippingEstimate + this.tax; },
    notes: 'Crane unloading required in early morning block.',
    status: 'pending'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('homepage');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [tradeAccountActive, setTradeAccountActive] = useState<boolean>(false); // default to false to align with standard retail workflow
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeQuotes, setActiveQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [projectsList, setProjectsList] = useState<Project[]>(INITIAL_PROJECTS);

  // Dialog / Drawer toggles
  const [showQuoteSheet, setShowQuoteSheet] = useState<boolean>(false);
  const [showInvoiceViewer, setShowInvoiceViewer] = useState<Quote | null>(null);

  // Custom Project Addition State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectAddress, setNewProjectAddress] = useState('');
  const [newProjectForeman, setNewProjectForeman] = useState('');
  const [newProjectPhone, setNewProjectPhone] = useState('');

  // Form Application for Trade Partner Pricing
  const [tradeAppSubmitting, setTradeAppSubmitting] = useState(false);
  const [tradeAppSuccess, setTradeAppSuccess] = useState(false);
  const [tradeAppCompany, setTradeAppCompany] = useState('');
  const [tradeAppLicense, setTradeAppLicense] = useState('');
  const [tradeAppTaxId, setTradeAppTaxId] = useState('');

  // RFQ Submission Details
  const [rfqCustomerName, setRfqCustomerName] = useState('Dave Vance');
  const [rfqCompany, setRfqCompany] = useState('Vance Concrete & Sidings LLC');
  const [rfqTerms, setRfqTerms] = useState('NET 30 Structural Credit');
  const [rfqAddress, setRfqAddress] = useState('394 Broadside Blv, Sector 4');
  const [rfqDeliveryType, setRfqDeliveryType] = useState<'standard_truck' | 'flatbed' | 'hiab_crane' | 'pickup'>('flatbed');
  const [rfqRequiredDate, setRfqRequiredDate] = useState('2026-06-20');
  const [rfqNotes, setRfqNotes] = useState('');

  // AI Estimator state
  const [estimateQuery, setEstimateQuery] = useState('');
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateResult, setEstimateResult] = useState<any | null>(null);
  const [estimateError, setEstimateError] = useState<string | null>(null);

  // Contact States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Delivery Query');
  const [contactProjectAddress, setContactProjectAddress] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactFormSuccess, setContactFormSuccess] = useState(false);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      setContactFormSuccess(true);
    }, 900);
  };

  // Ready-to-test preset prompts for the concrete/masonry contractor
  const PRESETS = [
    {
      label: 'Concrete Driveway Slab',
      text: 'Pouring a 20ft x 40ft driveway slab which is 4 inches deep. Calculate required bags of high early strength portland cement, premixed sand/gravel aggregates, and #4 rebar spacing for grid reinforcement.',
      type: 'Concrete flatwork'
    },
    {
      label: 'Masonry Brick Wall',
      text: 'Laying a new structural block wall: 60 feet long by 6 feet high using traditional brick block. Estimate structural cement bags to make masonry mortar and required joint felt strips.',
      type: 'Brick & block masonry'
    },
    {
      label: 'Safety & PPE Crew Check',
      text: 'I have a field crew of 15 laborers starting heavy highway concrete sawing next week. Recommend the complete OSHA-approved safety wear, face-shield silica respirators, and hand safety equipment needed from the supply.',
      type: 'Site prep & safety audit'
    }
  ];

  // Cart addition handler
  const handleAddToCart = (product: Product, quantity: number, notes?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
            : item
        );
      }
      return [...prev, { product, quantity, notes }];
    });
  };

  // Modify Cart quantities
  const handleUpdateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: qty } : item
        )
      );
    }
  };

  // Remove single item
  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Apply Trade Partnership
  const handleTradeApply = (e: FormEvent) => {
    e.preventDefault();
    if (!tradeAppCompany || !tradeAppLicense) return;
    setTradeAppSubmitting(true);
    setTimeout(() => {
      setTradeAppSubmitting(false);
      setTradeAppSuccess(true);
      setTradeAccountActive(true);
      setRfqCompany(tradeAppCompany);
    }, 1200);
  };

  // Add simulated manual local project
  const handleAddProject = (e: FormEvent) => {
    e.preventDefault();
    if (!newProjectName || !newProjectAddress) return;
    const newProj: Project = {
      id: 'proj_' + Date.now(),
      name: newProjectName,
      siteAddress: newProjectAddress,
      foreman: newProjectForeman || 'Dave Vance',
      contactNo: newProjectPhone || '+1 (555) 321-9304',
      activeQuotesCount: 0,
      status: 'active'
    };
    setProjectsList([newProj, ...projectsList]);
    setNewProjectName('');
    setNewProjectAddress('');
    setNewProjectForeman('');
    setNewProjectPhone('');
  };

  // Run AI Material Estimation
  const handleRunEstimation = async (queryText: string) => {
    if (!queryText.trim()) return;
    setEstimateLoading(true);
    setEstimateError(null);
    setEstimateResult(null);

    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestText: queryText,
          projectType: 'Drywall/Concrete Custom Estimation'
        })
      });

      if (!res.ok) {
        throw new Error('Our quantity estimation server returned an error state.');
      }

      const data = await res.json();
      setEstimateResult(data);
    } catch (err: any) {
      console.error(err);
      setEstimateError(err?.message || 'Failed connecting to Gemini API Estimator proxy. Please check your system configuration.');
    } finally {
      setEstimateLoading(false);
    }
  };

  // Compute Freight charges
  const getFreightCharge = (type: string, sub: number): number => {
    if (sub === 0) return 0;
    switch (type) {
      case 'pickup': return 0;
      case 'standard_truck': return 65.00;
      case 'flatbed': return 145.00;
      case 'hiab_crane': return 280.00;
      default: return 65.00;
    }
  };

  // Calculate Cart Metrics
  const cartSubtotal = cartItems.reduce((acc, item) => {
    const price = tradeAccountActive ? item.product.tradePrice : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const cartShipping = getFreightCharge(rfqDeliveryType, cartSubtotal);
  const cartTax = cartSubtotal * 0.0825; // 8.25% commercial state tax
  const cartTotal = cartSubtotal + cartShipping + cartTax;

  // Submit active Request For Quotation
  const handleSubmitRFQ = (e: FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const newQuoteObj: Quote = {
      id: 'q_' + Date.now(),
      quoteNumber: `DM-RFQ-2026-${Math.floor(Math.random() * 900) + 100}`,
      customerName: rfqCustomerName,
      companyName: rfqCompany,
      paymentTerms: rfqTerms,
      deliveryAddress: rfqAddress,
      deliveryType: rfqDeliveryType,
      deliveryRequiredDate: rfqRequiredDate,
      createdAt: new Date().toISOString().split('T')[0],
      items: [...cartItems],
      subtotal: cartSubtotal,
      shippingEstimate: cartShipping,
      tax: cartTax,
      total: cartTotal,
      notes: rfqNotes,
      status: 'pending'
    };

    setActiveQuotes([newQuoteObj, ...activeQuotes]);
    setCartItems([]); // Clear cart
    setShowQuoteSheet(false);
    setShowInvoiceViewer(newQuoteObj); // Display instant visual ticket!

    // Increment active code counters on projects match
    setProjectsList(prev => prev.map(p => {
      if (rfqAddress.toLowerCase().includes(p.siteAddress.toLowerCase().substring(0, 10))) {
        return { ...p, activeQuotesCount: p.activeQuotesCount + 1 };
      }
      return p;
    }));
  };

  // Auto-scroll to top when active tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">

      {/* Top Banner & Main Interactive Navigation Module */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onRequestQuoteClick={() => setShowQuoteSheet(true)}
      />

      {/* Main Core Router View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HOMEPAGE VIEW */}
        {activeTab === 'homepage' && (
          <div id="homepage_view" className="space-y-12 animate-in fade-in duration-300">

            {/* Massive Industrial Hero Section */}
            <div className="relative rounded-2xl overflow-hidden bg-[#050e21] text-white border border-slate-850 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#03112c]/95 via-[#0b1c3e]/85 to-transparent z-10" />

              {/* Decorative technical architectural blueprint pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, #ff9100 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />

              <div className="relative z-20 py-12 md:py-20 px-8 md:px-14 max-w-3xl space-y-6">
                <span className="bg-[#ff9100] text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5" /> Direct Site Despatch Active
                </span>

                <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight">
                  Premium Construction Supplies & <span className="text-[#ff9100]">Professional</span> Tools
                </h1>

                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Welcome to <strong className="text-white">Demilva Construction Supplies</strong>. We supply high-rigidity building aggregates, structural plumbing fittings, modern sanitary ware, robust copper cables, and site tools direct to your project. Standard retail pricing listed, no contractor certification required.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    id="hero_btn_catalog"
                    onClick={() => {
                      setSelectedCategory('all');
                      setActiveTab('catalog');
                    }}
                    className="bg-[#ff9100] text-slate-950 font-extrabold text-sm px-6 py-3 rounded-lg hover:bg-opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    Browse Product Catalog <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    id="hero_btn_estimator"
                    onClick={() => setActiveTab('estimator')}
                    className="bg-white/10 text-white backdrop-blur-xs font-bold text-sm px-6 py-3 rounded-lg hover:bg-white/20 border border-white/25 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 text-[#ff9100]" /> Use AI Material Estimator
                  </button>
                </div>
              </div>

              {/* Float visual card of trust stats for direct order clients */}
              <div className="hidden lg:grid grid-cols-3 gap-6 absolute right-12 bottom-12 z-20 max-w-sm bg-[#050e21]/90 p-5 rounded-xl border border-blue-900/40 backdrop-blur-md">
                <div className="text-center">
                  <h4 className="text-lg font-black font-semibold text-[#ff9100] leading-none">Fast</h4>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Checkout Quote</p>
                </div>
                <div className="text-center border-x border-slate-800 px-3">
                  <h4 className="text-lg font-black font-semibold text-[#ff9100] leading-none">Direct Only</h4>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">To Home Builders</p>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-black font-semibold text-[#ff9100] leading-none">24 Hr</h4>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Site Delivery</p>
                </div>
              </div>
            </div>

            {/* Quick Benefits Grid - Simplified for Direct Consumers */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-[#0b1b3d] rounded-lg">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-slate-900 text-sm">Industrial Quality</h4>
                  <p className="text-xs text-slate-500 mt-1">ASTM C150 materials, copper wires, and commercial aggregates.</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-500 rounded-lg">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-slate-900 text-sm">Nationwide Dispatch</h4>
                  <p className="text-xs text-slate-500 mt-1">Sturdy logistics network to deposit heavy materials directly on site.</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-slate-900 text-sm">Best Front Prices</h4>
                  <p className="text-xs text-slate-500 mt-1">Clear upfront pricing with no hidden developer or contractor margins.</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
                <div className="p-3 bg-sky-50 text-sky-500 rounded-lg">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-slate-900 text-sm">Smart Estimations</h4>
                  <p className="text-xs text-slate-500 mt-1">Add details into our AI Surveyor to generate quick material plans.</p>
                </div>
              </div>
            </div>

            {/* STYLISH DEPARTMENT CATEGORIES GRID */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[#ff9100] font-mono text-xs font-black uppercase tracking-widest">Departments</span>
                <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-900 leading-tight">Browse Materials by Project Category</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Select a tailored department catalog path to browse stock. Our physical yards carry immediate stock weights of everything listed below.
                </p>
              </div>

              <div id="homepage_categories_grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORIES.map((category) => {
                  const getCatIconWithID = (id: string) => {
                    switch (id) {
                      case 'building-materials': return <Layers className="w-5 h-5 text-blue-600" />;
                      case 'plumbing': return <Droplet className="w-5 h-5 text-sky-500" />;
                      case 'tile-sanitary': return <ShowerHead className="w-5 h-5 text-emerald-500" />;
                      case 'lighting-electrical': return <Lightbulb className="w-5 h-5 text-amber-500" />;
                      case 'paint': return <Paintbrush className="w-5 h-5 text-rose-500" />;
                      case 'accessories': return <Wrench className="w-5 h-5 text-slate-500" />;
                      case 'roofing-insulation': return <Home className="w-5 h-5 text-indigo-500" />;
                      case 'landscaping': return <Spade className="w-5 h-5 text-green-600" />;
                      default: return <Layers className="w-5 h-5 text-blue-600" />;
                    }
                  };

                  return (
                    <div
                      key={category.id}
                      id={`home_cat_card_${category.id}`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setActiveTab('catalog');
                      }}
                      className="bg-white rounded-xl border border-slate-250 p-6 shadow-xs hover:shadow-md hover:border-[#ff9100] transition-all duration-300 group cursor-pointer flex flex-col justify-between text-left h-52 relative overflow-hidden"
                    >
                      <div>
                        {/* Elegant icon badge with tinted background */}
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:bg-[#ff9100]/5 group-hover:border-[#ff9100]/20 transition-all">
                          {getCatIconWithID(category.id)}
                        </div>

                        <h3 className="font-serif font-black text-slate-900 group-hover:text-[#ff9100] transition duration-200 text-sm leading-tight mb-2">
                          {category.label}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-1 mb-2">
                          {category.description}
                        </p>
                      </div>

                      <div className="text-[11px] font-bold text-[#0b1b3d] group-hover:translate-x-1.5 transition-transform duration-250 flex items-center gap-1 mt-auto">
                        Explore Catalog <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STYLISH FEATURED PRODUCTS WITH IMAGES SECTION */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-xs font-mono font-bold text-[#ff9100] block uppercase tracking-wide">Select Showcases</span>
                  <h3 className="text-2xl font-serif font-black text-slate-900 mt-1">Featured Equipment & In-Stock Materials</h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setActiveTab('catalog');
                  }}
                  className="text-xs font-black text-[#0b1b3d] hover:text-[#ff9100] transition flex items-center gap-1 cursor-pointer select-none"
                >
                  View Complete Inventory ({MOCK_PRODUCTS.length} items) <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid Layout of Featured items with High Res thumbnails - 4 columns in a row */}
              <div id="homepage_featured_products_grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_PRODUCTS.filter(p => p.featured).slice(0, 8).map((product) => (
                  <div
                    key={product.id}
                    id={`featured_item_card_${product.id}`}
                    className="bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
                  >
                    {/* Visual Badge indicator */}
                    <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-xs text-slate-900 border border-slate-200/60 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                      IN STOCK
                    </div>
                    {product.id === 'p1' && (
                      <div className="absolute top-3 right-3 z-20 bg-amber-500/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                        HOT SELLER
                      </div>
                    )}

                    {/* Image Header with smooth Zoom support */}
                    <div className="relative h-40 w-full bg-slate-50 overflow-hidden border-b border-slate-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                          <Layers className="w-8 h-8 opacity-45" />
                        </div>
                      )}
                    </div>

                    {/* Card Content body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline text-[9px] font-mono text-slate-400">
                          <span className="font-semibold">{product.brand}</span>
                          <span className="bg-slate-50 border border-slate-100 rounded px-1.5 py-0.2">SKU: {product.sku}</span>
                        </div>

                        <h4 className="font-serif font-black text-slate-900 text-sm leading-tight group-hover:text-[#ff9100] transition duration-200 line-clamp-2 h-10 overflow-hidden">
                          {product.name}
                        </h4>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Specs overview list snippet */}
                        {product.specs && Object.keys(product.specs).length > 0 && (
                          <div className="py-2 border-t border-slate-100 flex flex-wrap gap-1">
                            {Object.entries(product.specs).slice(0, 1).map(([key, val]) => (
                              <span key={key} className="text-[10px] text-slate-500 leading-none">
                                <span className="font-semibold">{key}:</span> {String(val)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex justify-between items-baseline">
                          <span className="text-slate-400 text-[10px] font-mono uppercase font-bold tracking-wider">Price / {product.unit}</span>
                          <span className="text-base font-black text-slate-950 font-sans tracking-tight">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>

                        <button
                          id={`hd_home_add_${product.id}`}
                          onClick={() => {
                            handleAddToCart(product, 1);
                            const el = document.getElementById(`hd_home_add_${product.id}`);
                            if (el) {
                              el.innerHTML = "✓ Added to Quote";
                              el.classList.add('bg-emerald-600', 'border-emerald-600');
                              setTimeout(() => {
                                el.innerHTML = "Add to Live Quote Request";
                                el.classList.remove('bg-emerald-600', 'border-emerald-600');
                              }, 1600);
                            }
                          }}
                          className="w-full py-2 bg-slate-950 text-white hover:bg-[#ff9100] hover:text-slate-950 rounded-lg text-xs font-bold transition duration-250 text-center tracking-wide flex items-center justify-center gap-1 cursor-pointer border border-transparent shadow-xs"
                        >
                          Add to Live Quote Request
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Elegant Overlay Construction Supplies Showcase Banner */}
            <div className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 group h-80 flex items-center">
              {/* Background image backdrop */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-102"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />

              <div className="relative z-10 p-8 md:p-12 max-w-xl text-white space-y-4">
                <span className="text-[#ff9100] font-mono text-xs uppercase tracking-widest font-black flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff9100] animate-pulse" />
                  Premium Aggregates & Grade-60 Metals
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-white leading-tight">
                  High-Rigidity Bulk Materials Direct to Site
                </h3>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                  Every project demands unyielding structural integrity. From our ASTM-certified premium concrete mix and building blocks to certified grade metallic reinforcements, Demilva ensures instant logistics dispatch for homebuilders and self-build contractors alike.
                </p>
                <div className="pt-1 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedCategory('building-materials');
                      setActiveTab('catalog');
                    }}
                    className="bg-[#ff9100] hover:bg-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer"
                  >
                    Explore Materials
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('estimator');
                    }}
                    className="bg-transparent hover:bg-white/10 text-white border border-white/30 font-bold text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer"
                  >
                    Run Material Estimate
                  </button>
                </div>
              </div>

              {/* Decorative Subtle Grid overlay */}
              <div className="hidden md:block absolute right-12 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none">
                <div className="h-full w-full border-l border-r border-dashed border-white/20 flex justify-between">
                  <div className="h-full border-r border-dashed border-white/20 w-1/2" />
                  <div className="h-full border-r border-dashed border-white/20 w-1/2" />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* CATALOG BROWSER VIEW */}
        {activeTab === 'catalog' && (
          <div id="catalog_view" className="space-y-6 animate-in fade-in duration-205">
            <div>
              <span className="text-[#ff9100] font-mono text-xs font-bold uppercase tracking-widest">Demilva Warehouse Hub</span>
              <h1 className="text-3xl font-serif font-black text-slate-900 mt-1">Industrial Material & Tool Catalog</h1>
              <p className="text-slate-600 text-sm mt-1 max-w-3xl">
                Browse our real-time stock and place specific quantities on hold. Quote request features let you build multi-department plans without instant checkout pressure.
              </p>
            </div>

            <CatalogBrowser
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              tradeAccountActive={tradeAccountActive}
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
            />
          </div>
        )}

        {/* AI ESTIMATOR VIEW */}
        {activeTab === 'estimator' && (
          <div id="estimator_view" className="space-y-8 animate-in fade-in duration-300">

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                <div>
                  <span className="bg-[#ff9100]/10 text-[#ff9100] border border-[#ff9100]/30 px-3 py-1 rounded-full text-xs font-mono font-bold inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Gemini-Powered Surveyor
                  </span>
                  <h1 className="text-2xl font-serif font-black text-slate-900 mt-2">AI Construction Material Estimator</h1>
                  <p className="text-slate-500 text-xs mt-1">
                    Enter physical building dimensions or general plan notes below. Demilva's AI surveyor calculates concrete volume, aggregates, ties, and corresponding tools instantly.
                  </p>
                </div>

                {/* Visual help box */}
                <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-200 max-w-sm">
                  <span className="font-bold text-slate-800">Site Calculators Active:</span>
                  <p className="mt-1 leading-normal text-[11px] text-slate-500">
                    Calculations automatically align with ASTM and standard building safety code measurements.
                  </p>
                </div>
              </div>

              {/* Grid of Preset suggestions to test prompt block */}
              <div className="space-y-2 mb-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select an architectural mockup to test instantly:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      id={`preset_btn_${index}`}
                      onClick={() => {
                        setEstimateQuery(preset.text);
                        handleRunEstimation(preset.text);
                      }}
                      className="text-left p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100 hover:border-[#ff9100] border border-slate-200 transition text-xs space-y-1.5 focus:outline-none"
                    >
                      <span className="font-bold text-[#0b1b3d] block">{preset.label}</span>
                      <p className="text-slate-500 line-clamp-2 text-[11px] leading-relaxed">{preset.text}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Freeform Query Workspace */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Or type your specific on-site plan details:</label>
                <div className="relative">
                  <textarea
                    id="estimator_textarea"
                    rows={4}
                    value={estimateQuery}
                    onChange={(e) => setEstimateQuery(e.target.value)}
                    placeholder="e.g. I need to construct a robust 40 foot footing trench that is 12 inches wide and 24 inches deep. Calculate required rebar stakes, steel ties, and bags of high early concrete..."
                    className="w-full p-4 pr-12 bg-slate-50 border border-slate-350 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b1b3d] outline-none"
                  />
                  <div className="absolute right-3.5 bottom-3.5 flex items-center gap-2">
                    <button
                      id="clear_calc_query"
                      onClick={() => setEstimateQuery('')}
                      className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                      title="Clear textarea"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      id="run_ai_calc"
                      onClick={() => handleRunEstimation(estimateQuery)}
                      disabled={estimateLoading || !estimateQuery.trim()}
                      className="p-2 ml-1 rounded-lg bg-[#0b1b3d] text-[#ff9100] hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                      title="Run Estimation Calculations"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Prompt is processed on-the-fly by developer-configured Gemini models.
                  </span>
                  <span>Max Limit: 5,000 characters</span>
                </div>
              </div>
            </div>

            {/* Error state */}
            {estimateError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-700" />
                <div>
                  <h4 className="font-bold">Surveyor Connection Interrupted</h4>
                  <p className="mt-1 text-xs text-red-700 font-medium">
                    {estimateError}
                  </p>
                  <p className="mt-2 text-xs text-red-600 font-semibold uppercase tracking-widest">
                    Quick solution: Set a valid GEMINI_API_KEY inside the Secrets panel on the top right workspace to authenticate instantly!
                  </p>
                </div>
              </div>
            )}

            {/* Loading placeholder skeleton */}
            {estimateLoading && (
              <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-slate-200 rounded" />
                    <div className="h-3 w-32 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="space-y-3 pt-4">
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-5/6 bg-slate-100 rounded" />
                  <div className="h-3 w-4/5 bg-slate-100 rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                  <div className="h-20 bg-slate-50 rounded" />
                  <div className="h-20 bg-slate-50 rounded" />
                </div>
              </div>
            )}

            {/* Result Display Frame */}
            {estimateResult && (
              <div id="estimate_result_panel" className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md animate-in slide-in-from-bottom-3 duration-200">
                {/* Result Header */}
                <div className="bg-[#0b1b3d] text-white p-6 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#ff9100]/20 text-[#ff9100] rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-black text-lg">AI Surveyor Estimation Results</h3>
                      <p className="text-slate-300 text-xs">Calculated automatically against Demilva commercial inventory indexes</p>
                    </div>
                  </div>

                  <span className="bg-emerald-600/30 text-emerald-300 px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Formulas Validated
                  </span>
                </div>

                {/* Summary narrative card */}
                <div className="p-6 border-b border-slate-150 bg-slate-50/50">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Project Overview & Method Statement</h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                    {estimateResult.summary}
                  </p>
                  {estimateResult.mathematicalBreakdown && (
                    <div className="mt-3.5 p-3 rounded bg-slate-900 text-slate-300 font-mono text-[11px] border border-slate-800 flex justify-between items-center">
                      <span><strong>Mechanical Math:</strong> {estimateResult.mathematicalBreakdown}</span>
                    </div>
                  )}
                </div>

                {/* Twin lists of computed materials & tools */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

                  {/* Estimated Materials Needed */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                      <Layers className="w-4 h-4 text-[#ff9100]" /> Calculated Sizing Materials
                    </h4>

                    {estimateResult.materials && estimateResult.materials.length > 0 ? (
                      <div className="space-y-3">
                        {estimateResult.materials.map((mat: any, i: number) => {
                          // Try matching catalog items dynamically
                          const matchedProduct = MOCK_PRODUCTS.find(p =>
                            p.name.toLowerCase().includes(mat.name.toLowerCase().substring(0, 10)) ||
                            p.category === mat.recommendedCatalogCategory
                          ) || MOCK_PRODUCTS[0];

                          return (
                            <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="text-xs font-bold text-slate-900">{mat.name}</h5>
                                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">{mat.purpose}</p>
                                </div>
                                <span className="bg-blue-100 text-blue-900 text-xs font-extrabold px-2.5 py-1 rounded font-mono">
                                  {mat.calculatedQty}
                                </span>
                              </div>

                              <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-slate-200">
                                <span className="text-[10px] uppercase font-mono text-slate-400">Est. Range: {mat.estimatedCostRange || '$50 - $120'}</span>

                                <button
                                  id={`estimate_add_${i}`}
                                  onClick={() => {
                                    handleAddToCart(matchedProduct, 1);
                                    const el = document.getElementById(`estimate_add_${i}`);
                                    if (el) {
                                      el.innerHTML = "✓ Cart Saved";
                                      setTimeout(() => {
                                        el.innerHTML = "Add Mat to RFQ";
                                      }, 1500);
                                    }
                                  }}
                                  className="text-[11px] font-black text-[#ff9100] hover:text-[#0b1b3d] flex items-center gap-1 focus:outline-none cursor-pointer"
                                >
                                  Add Mat to RFQ <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No raw material calculations yielded from prompt notes.</p>
                    )}
                  </div>

                  {/* Recommended Site Tools */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                      <Wrench className="w-4 h-4 text-[#ff9100]" /> Essential Support Tools
                    </h4>

                    {estimateResult.tools && estimateResult.tools.length > 0 ? (
                      <div className="space-y-3">
                        {estimateResult.tools.map((tl: any, i: number) => {
                          const matchedTool = MOCK_PRODUCTS.find(p => p.category === 'power-tools' || p.category === 'hand-tools') || MOCK_PRODUCTS[4];

                          return (
                            <div key={i} className="p-4 rounded-lg bg-amber-50/40 border border-amber-200/60 flex flex-col justify-between gap-3">
                              <div>
                                <div className="flex justify-between items-center">
                                  <h5 className="text-xs font-bold text-slate-900">{tl.name}</h5>
                                  <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold px-1.5 py-0.5 bg-yellow-100 rounded text-yellow-800">
                                    {tl.purchaseOrRent || 'Rent'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">{tl.purpose}</p>
                              </div>

                              <div className="flex justify-end pt-2 border-t border-dashed border-amber-250/20">
                                <button
                                  id={`estimate_add_tl_${i}`}
                                  onClick={() => {
                                    handleAddToCart(matchedTool, 1);
                                    const el = document.getElementById(`estimate_add_tl_${i}`);
                                    if (el) {
                                      el.innerHTML = "✓ Saved";
                                      setTimeout(() => {
                                        el.innerHTML = "Add Tool to RFQ";
                                      }, 1500);
                                    }
                                  }}
                                  className="text-[11px] font-black text-[#0b1b3d] hover:text-[#ff9100] flex items-center gap-1 focus:outline-none cursor-pointer"
                                >
                                  Add Tool to RFQ <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No special tools identified.</p>
                    )}
                  </div>

                </div>

                {/* Bottom Safety Advice Tips */}
                {estimateResult.tips && estimateResult.tips.length > 0 && (
                  <div className="p-6 bg-slate-900/50 border-t border-slate-150">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-400" /> Structural Safety Protocols & Jobsite Work Tips:
                    </h5>
                    <ul className="text-xs text-slate-300 space-y-1.5 leading-normal pl-2">
                      {estimateResult.tips.map((tip: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* CONTRACTOR DASHBOARD PORTAL */}
        {activeTab === 'dashboard' && (
          <div id="dashboard_view" className="space-y-8 animate-in fade-in duration-300">

            {/* Header section with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active Site Locations</span>
                  <h3 className="text-3xl font-serif font-black text-slate-900">
                    {projectsList.filter(p => p.status === 'active').length}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Slabs, formwork, & columns</p>
                </div>
                <div className="p-3 bg-blue-50 text-[#0b1b3d] rounded-lg">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Contractor Account Type</span>
                  <h3 className="text-xl font-bold text-emerald-600 block leading-tight">Verified Trade</h3>
                  <span className="text-[11px] font-mono text-slate-400">ID: TRADE-PRO-981L</span>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active Quotes Log</span>
                  <h3 className="text-3xl font-serif font-black text-slate-900">{activeQuotes.length}</h3>
                  <p className="text-xs text-slate-500 mt-1">Quotes awaiting field verification</p>
                </div>
                <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Split layout: Active project tracking & Add project form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-serif font-black text-slate-900">Current Site Project Records</h2>
                  <p className="text-slate-500 text-xs">Simulated contractor jobsite data mapped for site delivery drops.</p>
                </div>

                <div className="space-y-4">
                  {projectsList.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                            project.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}></span>
                          <h3 className="font-serif font-black text-slate-900 text-sm">{project.name}</h3>
                        </div>
                        <p className="text-xs text-slate-500">Site Coordinates / Address: <strong className="text-slate-700">{project.siteAddress}</strong></p>

                        <div className="grid grid-cols-2 gap-4 pt-1.5 text-[11px] text-slate-600 font-medium">
                          <span>Lead Foreman: <strong className="text-slate-800">{project.foreman}</strong></span>
                          <span>Phone: <span className="font-mono text-slate-700">{project.contactNo}</span></span>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col justify-between items-end gap-3 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <span className="text-[10px] uppercase font-mono bg-slate-100 px-2.5 py-1 rounded select-none">
                          {project.activeQuotesCount} Active RFQs
                        </span>

                        <button
                          id={`p_actions_${project.id}`}
                          onClick={() => {
                            setRfqAddress(project.siteAddress);
                            setRfqCustomerName(project.foreman);
                            setActiveTab('catalog');
                          }}
                          className="bg-[#0b1b3d]/10 text-[#0b1b3d] hover:bg-[#ff9100]/20 text-xs font-extrabold px-3 py-1.5 rounded transition"
                        >
                          Dispatch Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add simulated manual Project Frame */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs h-fit space-y-4">
                <div>
                  <h3 className="text-md font-serif font-black text-slate-900">Register New Site Location</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Instantly declare active building plans or commercial properties to map crane coordinates.
                  </p>
                </div>

                <form onSubmit={handleAddProject} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Unique Project Name</label>
                    <input
                      type="text"
                      required
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="e.g. Westside Deck Joists Grid"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-350 rounded focus:ring-1 focus:ring-[#0b1b3d] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Site Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={newProjectAddress}
                      onChange={(e) => setNewProjectAddress(e.target.value)}
                      placeholder="e.g. 504 Timber Lane, Block C"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-350 rounded focus:ring-1 focus:ring-[#0b1b3d] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Foreman On duty</label>
                    <input
                      type="text"
                      value={newProjectForeman}
                      onChange={(e) => setNewProjectForeman(e.target.value)}
                      placeholder="e.g. Tyler Vance"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-350 rounded focus:ring-1 focus:ring-[#0b1b3d] outline-none"
                    />
                  </div>

                  <button
                    id="submit_project_record"
                    type="submit"
                    className="w-full py-2 bg-[#0b1b3d] hover:bg-slate-800 text-[#ff9100] font-black text-xs rounded transition uppercase tracking-wider"
                  >
                    Save Site Record
                  </button>
                </form>
              </div>

            </div>

            {/* Historic RFQ logs section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div>
                <h3 className="text-xl font-serif font-black text-slate-900">Submitted Request for Quotes (RFQ) & Draft Invoices</h3>
                <p className="text-slate-500 text-xs">A comprehensive log of active material holds, calculated weights, and estimated dispatch dates.</p>
              </div>

              {activeQuotes.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500 text-sm font-semibold">No quotation logs filed. Browse our Catalog to submit an RFQ sheet.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left font-sans text-xs">
                      <thead className="bg-[#0b1b3d] text-white uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                          <th className="p-4">RFQ / Quote #</th>
                          <th className="p-4">Created Date</th>
                          <th className="p-4">Customer Base</th>
                          <th className="p-4">Delivery Coordinates</th>
                          <th className="p-4 text-right">Quote Value</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {activeQuotes.map((quote) => (
                          <tr key={quote.id} className="hover:bg-slate-50">
                            <td className="p-4 font-mono font-bold text-blue-900">{quote.quoteNumber}</td>
                            <td className="p-4 text-slate-500">{quote.createdAt}</td>
                            <td className="p-4">
                              <span className="font-bold text-slate-800 text-[13px]">{quote.customerName}</span>
                              {quote.companyName && <p className="text-[11px] text-slate-400 font-semibold leading-none mt-0.5">{quote.companyName}</p>}
                            </td>
                            <td className="p-4">
                              <span className="text-slate-700">{quote.deliveryAddress}</span>
                              <p className="text-[10px] text-orange-500 font-bold uppercase mt-1">Freight: {quote.deliveryType}</p>
                            </td>
                            <td className="p-4 text-right font-bold text-[#0b1b3d] bg-slate-50/50">${quote.total.toFixed(2)}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setShowInvoiceViewer(quote)}
                                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded cursor-pointer"
                              >
                                View Ticket
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* DEDICATED FULL-SCREEN QUOTE SHEET PAGE */}
        {activeTab === 'quote-sheet' && (
          <div id="quote_sheet_view" className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[#ff9100] font-mono text-xs font-black uppercase tracking-widest">Active Quotation Worksheet</span>
              <h1 className="text-3xl font-serif font-black text-slate-900 leading-tight">Review & Finalize Your RFQ Bond</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Review your materials manifest, specify site logistics coordinates, and generate a printable commercial quotation document instantly.
              </p>
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-6">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                  <ShoppingCart className="w-8 h-8 opacity-60" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-black text-slate-900 text-lg">Your Quote Sheet is Empty</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    You have not added any construction supplies or heavy aggregates to your quotation list. Browse our direct inventory to begin.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-6 py-2.5 bg-slate-950 text-white hover:bg-[#ff9100] hover:text-slate-950 text-xs font-bold rounded-lg transition duration-250 cursor-pointer shadow-xs uppercase tracking-wider font-mono"
                >
                  Browse Product Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Side: Dispatch Details Form */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="font-serif font-black text-slate-900 text-lg">1. Delivery Logistics & Dispatch Form</h3>
                    <p className="text-xs text-slate-500 mt-1">Provide delivery site destination and crane coordination procedures.</p>
                  </div>

                  <form id="quote_logistics_form" onSubmit={handleSubmitRFQ} className="space-y-5 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Company / Contractor Name</label>
                        <input
                          type="text"
                          required
                          value={rfqCompany}
                          onChange={(e) => setRfqCompany(e.target.value)}
                          placeholder="e.g. Sterling Builders LLC"
                          className="w-full p-3 bg-slate-50 border border-slate-250 rounded focus:border-slate-400 focus:bg-white outline-none text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Primary Site Contact Name</label>
                        <input
                          type="text"
                          required
                          value={rfqCustomerName}
                          onChange={(e) => setRfqCustomerName(e.target.value)}
                          placeholder="e.g. David Vance"
                          className="w-full p-3 bg-slate-50 border border-slate-250 rounded focus:border-slate-400 focus:bg-white outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">On-Site Delivery Address & Coordinates</label>
                      <input
                        type="text"
                        required
                        value={rfqAddress}
                        onChange={(e) => setRfqAddress(e.target.value)}
                        placeholder="e.g. Lot 3B, Woodlawn Industrial Parkway, Gate 2"
                        className="w-full p-3 bg-slate-50 border border-slate-250 rounded focus:border-slate-400 focus:bg-white outline-none text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Required Site Drop-off Date</label>
                        <input
                          type="date"
                          required
                          value={rfqRequiredDate}
                          onChange={(e) => setRfqRequiredDate(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-250 rounded focus:border-slate-400 focus:bg-white outline-none text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Freight Transport Logistics Fleet</label>
                        <select
                          value={rfqDeliveryType}
                          onChange={(e: any) => setRfqDeliveryType(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-250 rounded focus:border-slate-400 focus:bg-white outline-none text-slate-800"
                        >
                          <option value="pickup">Customer Depot Yard Pickup ($0.00)</option>
                          <option value="standard_truck">Heavy Duty Flatbed Trailer ($65.00)</option>
                          <option value="flatbed">Hi-Load Multi Axle Long Hauler ($145.00)</option>
                          <option value="hiab_crane">Heavy Loader Crane HIAB Offloader ($280.00)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Specific Foreman Delivery & Crane Operations Instructions</label>
                      <textarea
                        rows={4}
                        value={rfqNotes}
                        onChange={(e) => setRfqNotes(e.target.value)}
                        placeholder="e.g. Needs HIAB crane offload spot marked adjacent to trench. Driver must call 30 mins before arrival."
                        className="w-full p-3 bg-slate-50 border border-slate-250 rounded focus:border-slate-400 focus:bg-white outline-none text-slate-800"
                      />
                    </div>

                    <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-lg text-[11px] text-[#0b1b3d] flex gap-2">
                      <span className="font-bold underline text-[#ff9100]">CONTRACTOR NOTE:</span>
                      <p>
                        This RFQ serves as a commercial reservation of materials. Once submitted, materials are locked at our main warehouse and an official PDF Quote Sheet is rendered.
                      </p>
                    </div>
                  </form>
                </div>

                {/* Right Side: Materials summary & live calculations */}
                <div className="lg:col-span-5 space-y-6">

                  {/* Active List of items review */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <div className="border-b pb-3 flex justify-between items-center">
                      <h3 className="font-serif font-black text-slate-900 text-base">2. Active Manifest</h3>
                      <span className="text-xs bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-700">
                        {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                      {cartItems.map((item) => {
                        const price = tradeAccountActive ? item.product.tradePrice : item.product.price;
                        return (
                          <div key={item.product.id} className="p-3 bg-slate-50/50 hover:bg-slate-50 transition border border-slate-150 rounded-lg space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-semibold">{item.product.brand}</span>
                                <h4 className="font-serif font-bold text-slate-900 text-xs leading-snug">{item.product.name}</h4>
                                <span className="text-[9px] font-mono text-slate-400">SKU: {item.product.sku}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveCartItem(item.product.id)}
                                className="p-1 text-slate-400 hover:text-red-650 transition cursor-pointer"
                                title="Remove item"
                              >
                                ✕
                              </button>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
                              <div className="flex items-center border border-slate-200 rounded bg-white overflow-hidden">
                                <button
                                  onClick={() => handleUpdateCartQty(item.product.id, item.quantity - 1)}
                                  className="px-2 py-0.5 text-slate-400 hover:bg-slate-100 text-xs font-bold font-mono"
                                >
                                  -
                                </button>
                                <span className="w-7 text-center font-mono text-xs font-black text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateCartQty(item.product.id, item.quantity + 1)}
                                  className="px-2 py-0.5 text-slate-400 hover:bg-slate-100 text-xs font-bold font-mono"
                                >
                                  +
                                </button>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-slate-450 block">${price.toFixed(2)} / {item.product.unit}</span>
                                <span className="text-xs font-black text-slate-900">${(price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pricing Sheet & Form Submission */}
                  <div className="bg-[#0b1b3d] text-white rounded-xl p-6 shadow-md space-y-5">
                    <h3 className="font-serif font-black text-white text-base border-b border-white/10 pb-3">3. Valuation Summary</h3>

                    <div className="text-xs space-y-2.5">
                      <div className="flex justify-between text-slate-300">
                        <span>Aggregate Materials Subtotal</span>
                        <span className="font-mono text-white">${cartSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Commercial Freight Logistics ({rfqDeliveryType})</span>
                        <span className="font-mono text-white">${cartShipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Estimated Sales Tax (8.25%)</span>
                        <span className="font-mono text-white">${cartTax.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between pt-3 border-t border-dashed border-white/20 text-sm font-black text-[#ff9100]">
                        <span className="uppercase tracking-wider">Total RFQ Bond Settle</span>
                        <span className="font-sans text-base">${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      id="submit_quote_sheet_finalize"
                      type="submit"
                      form="quote_logistics_form"
                      className="w-full py-3.5 bg-[#ff9100] text-slate-950 hover:bg-amber-400 text-xs font-black tracking-widest uppercase rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer text-center select-none"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Finalize & Print Quotation Document
                    </button>

                    <p className="text-[10px] text-slate-400 text-center leading-relaxed font-mono">
                      Calculations adhere to commercial contractor standards. Rebar weights estimates are based on grade 60 steel sizes.
                    </p>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

        {/* CONTACT US INTEGRATED VIEW */}
        {activeTab === 'contact' && (
          <div id="contact_view" className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[#ff9100] font-mono text-xs font-black uppercase tracking-widest">Connect with Demilva</span>
              <h1 className="text-3xl font-serif font-black text-slate-900 leading-tight">Get in Touch with our Supplies Desk</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Whether you need custom heavy aggregates, specialized rebar bending, or site-delivery schedule assistance, our support desks are here to answer within 2 business hours.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information & Channels */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                  <h3 className="font-serif font-black text-slate-900 text-base border-b pb-3">Our Logistics Offices</h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-xs">
                      <div className="p-2.5 bg-blue-50 text-[#0b1b3d] rounded-lg mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="block font-serif text-slate-900">Demilva Main Depot & Warehouse</strong>
                        <span className="text-slate-500 leading-relaxed block mt-0.5">704 Industrial Way, Gate 4</span>
                        <span className="text-slate-500 leading-relaxed block">Sector 9, Heavy Industrial District</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs">
                      <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg mt-0.5">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="block font-serif text-slate-900">Immediate Phone Support</strong>
                        <span className="font-mono text-slate-600 font-bold block mt-0.5">+1 (800) 555-DM-SYS</span>
                        <span className="text-slate-400 text-[11px]">Mon - Sat: 5:00 AM - 7:00 PM EST</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="block font-serif text-slate-900">Electronic Communications</strong>
                        <span className="text-slate-600 font-bold block mt-0.5">dispatch@demilva-supplies.com</span>
                        <span className="text-slate-400 text-[11px]">Calculations & bid specifications</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-150 text-xs">
                    <strong className="text-[#0b1b3d] block mb-1">Direct Delivery Fleet Status:</strong>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Our heavy flatbeds and crane loaders currently operate with normal traffic buffers. Site deliveries guaranteed within 24 hours of bid clearance list.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 text-white rounded-xl p-6 space-y-4">
                  <h4 className="font-serif font-black text-[#ff9100] text-sm">Need a Customs Bid Document?</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Upload your raw construction blueprints or architectural design notes in our interactive AI Surveyor calculator. It creates formatted material requirement sheets fully automatically!
                  </p>
                  <button
                    onClick={() => setActiveTab('estimator')}
                    className="w-full py-2 bg-white text-slate-950 hover:bg-[#ff9100] font-bold text-xs rounded transition text-center select-none cursor-pointer"
                  >
                    Open AI Material Estimator
                  </button>
                </div>
              </div>

              {/* Instant Interactive Message Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-serif font-black text-slate-900 text-lg">Send an Instant Support Ticket</h3>
                    <p className="text-slate-500 text-xs mt-1">Fill out the fields below and our logistics manager will address your requirements directly.</p>
                  </div>

                  {contactFormSuccess ? (
                    <div className="p-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2 animate-in zoom-in-95">
                      <h4 className="font-bold text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Ticket Successfully Filed!
                      </h4>
                      <p className="leading-relaxed">
                        Thank you for contacting the Demilva Direct Supplies Desk. We have generated a tracking token (<strong className="font-mono text-slate-900">#TK-{Math.floor(100000 + Math.random() * 900000)}</strong>) for your inquiry. A logistics team member will contact you shortly.
                      </p>
                      <button
                        onClick={() => {
                          setContactFormSuccess(false);
                          setContactName('');
                          setContactEmail('');
                          setContactSubject('General Delivery Query');
                          setContactMessage('');
                        }}
                        className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition-all select-none cursor-pointer"
                      >
                        File Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Your Full Name</label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="e.g. David Sterling"
                            className="w-full text-xs p-3 bg-slate-50 border border-slate-350 rounded focus:ring-1 focus:ring-[#0b1b3d] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Email Address</label>
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="e.g. david@sterlingbuilders.com"
                            className="w-full text-xs p-3 bg-slate-50 border border-slate-350 rounded focus:ring-1 focus:ring-[#0b1b3d] outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Inquiry Department</label>
                          <select
                            value={contactSubject}
                            onChange={(e) => setContactSubject(e.target.value)}
                            className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-[#0b1b3d] outline-none text-slate-700"
                          >
                            <option value="General Delivery Query">Dispatch & Delivery Scheduling</option>
                            <option value="Custom Aggregate Request">Custom Aggregate & Sizing Mix</option>
                            <option value="Bulk Order Rates">Bulk Order Discount Specifications</option>
                            <option value="Billing & Invoicing">Billing / Escrow / Credit Account Options</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Project Address (Optional)</label>
                          <input
                            type="text"
                            value={contactProjectAddress}
                            onChange={(e) => setContactProjectAddress(e.target.value)}
                            placeholder="e.g. 104 Pine Crest Site, Sector B"
                            className="w-full text-xs p-3 bg-slate-50 border border-slate-350 rounded focus:ring-1 focus:ring-[#0b1b3d] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Your Message Details</label>
                        <textarea
                          rows={4}
                          required
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Please provide details about the items, sizes, or freight constraints you have..."
                          className="w-full text-xs p-3 bg-slate-50 border border-slate-350 rounded focus:ring-1 focus:ring-[#0b1b3d] outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={contactSubmitting}
                        className="w-full py-3 bg-[#0b1b3d] hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {contactSubmitting ? 'Generating Digital Token...' : 'Send Live Dispatch Ticket'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#050e21] text-slate-400 py-8 border-t border-slate-800 text-xs mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[#ff9100] font-bold font-serif text-lg tracking-wide">DEMILVA.COM PROPERTIES</span>
            <p className="mt-1 font-sans text-slate-400">© 2026 Demilva Construction Supplies & Heavy Tools supply. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap gap-4 text-slate-400">
            <button onClick={() => setActiveTab('homepage')} className="hover:text-white transition focus:outline-none">Home</button>
            <button onClick={() => setActiveTab('catalog')} className="hover:text-white transition focus:outline-none">Catalog Inventory</button>
            <button onClick={() => setActiveTab('estimator')} className="hover:text-white transition focus:outline-none">AI Estimator</button>
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition focus:outline-none">Contractor Portal</button>
            <button onClick={() => setActiveTab('quote-sheet')} className={`hover:text-white transition focus:outline-none ${activeTab === 'quote-sheet' ? 'text-white font-bold' : ''}`}>Quote Sheet</button>
            <button onClick={() => setActiveTab('contact')} className="hover:text-white transition focus:outline-none text-[#ff9100]">Contact Us</button>
          </div>
        </div>
      </footer>

      {/* REQUEST FOR QUOTATION SIDE DRAWER (THE SHOPPING CART / HOLD SHEET) */}
      {showQuoteSheet && (
        <div id="rfq_cart_drawer" className="fixed inset-0 z-50 bg-[#050e21]/70 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="bg-[#0b1b3d] text-white p-5 flex justify-between items-center border-b-4 border-[#ff9100]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#ff9100]" />
                <h3 className="font-serif font-black text-md">Request for Quote Summary</h3>
              </div>
              <button
                onClick={() => setShowQuoteSheet(false)}
                className="text-slate-350 hover:text-white text-lg p-1 focus:outline-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <ArchiveX className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-slate-500 font-bold text-sm">Your RFQ quote sheet is currently empty.</p>
                  <p className="text-slate-400 text-xs px-4 leading-relaxed">
                    Browse our concrete, masonry rebar steel, fasteners or hardhat catalogs to populate live metrics.
                  </p>
                  <button
                    onClick={() => { setShowQuoteSheet(false); setActiveTab('catalog'); }}
                    className="px-4 py-2 bg-[#0b1b3d] text-white text-xs font-extrabold rounded-lg hover:bg-slate-800 transition focus:outline-none"
                  >
                    Load Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500">Selected Materials:</span>
                    <button
                      onClick={() => setCartItems([])}
                      className="text-[10px] uppercase font-bold text-red-600 hover:text-red-700 hover:underline outline-none"
                    >
                      Clear Sheet
                    </button>
                  </div>

                  {cartItems.map((item) => {
                    const price = tradeAccountActive ? item.product.tradePrice : item.product.price;
                    return (
                      <div key={item.product.id} className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="block text-[9px] uppercase font-mono tracking-widest text-[#ff9100] font-bold leading-none">{item.product.brand}</span>
                            <h4 className="font-serif font-bold text-slate-900 text-xs mt-1 leading-tight">{item.product.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">SKU: {item.product.sku}</p>
                          </div>

                          <button
                            onClick={() => handleRemoveCartItem(item.product.id)}
                            className="p-1 text-slate-450 hover:text-red-600 focus:outline-none"
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Quantity and Pricing adjustment line */}
                        <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-150">
                          <div className="flex items-center border border-slate-300 rounded bg-slate-50 overflow-hidden">
                            <button
                              onClick={() => handleUpdateCartQty(item.product.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-slate-500 hover:bg-slate-200 text-xs font-bold outline-none"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-mono text-xs font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateCartQty(item.product.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-slate-500 hover:bg-slate-200 text-xs font-bold outline-none"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-slate-500 block">
                              ${price.toFixed(2)} / {item.product.unit}
                            </span>
                            <span className="text-xs font-black text-slate-900">
                              Sub: ${(price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Form details section removed for clean drawer layout */}
            </div>

            {/* Calculations & Go to Quote Sheet Page */}
            {cartItems.length > 0 && (
              <div className="bg-slate-50 border-t border-slate-200 p-5 space-y-4">
                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-slate-800">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono tracking-tight text-center bg-slate-100/50 py-1 rounded">
                    Adjust freight details and options on the next page
                  </p>
                </div>

                <button
                  id="final_drawer_rfq_submit"
                  onClick={() => {
                    setShowQuoteSheet(false);
                    setActiveTab('quote-sheet');
                  }}
                  className="w-full py-3 bg-[#ff9100] text-slate-950 font-black tracking-widest text-[11px] uppercase rounded-lg hover:bg-amber-500 transition shadow-md flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
                >
                  Configure & Finalize Quote Sheet <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAILED PRINTABLE INVOICE / TICKET VISUALIZER */}
      {showInvoiceViewer && (
        <div id="invoice_ticket_modal" className="fixed inset-0 z-50 bg-[#050e21]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-350 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Ticket Header & Actions */}
            <div className="bg-[#0b1b3d] text-white p-4 flex justify-between items-center no-print">
              <span className="text-xs font-mono font-bold tracking-widest text-[#ff9100]">COMMERCIAL QUOTE DOCUMENTATION</span>
              <div className="flex items-center gap-2">
                <button
                  id="print_ticket_btn"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded flex items-center gap-1 focus:outline-none"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Invoice / PDF
                </button>
                <button
                  onClick={() => setShowInvoiceViewer(null)}
                  className="p-1 text-slate-300 hover:text-white font-mono text-sm block focus:outline-none cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Actual Invoice Sheet */}
            <div id="print_area" className="p-8 space-y-6">

              {/* Top Row: Brand & ID */}
              <div className="flex justify-between items-start border-b-2 border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-black text-2xl text-[#0b1b3d]">DEMILVA</span>
                    <span className="text-[9px] font-sans font-extrabold tracking-widest text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded leading-none uppercase">SUPPLY</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono leading-none">DEMILVA CONSTRUCTION SUPPLIES INC.</p>
                  <p className="text-[10px] text-slate-400 mt-1">904 Industrial Highway, Terminal Section 2</p>
                  <p className="text-[10px] text-slate-400 leading-none">Email: support@demilva.com</p>
                </div>

                <div className="text-right">
                  <h2 className="text-xl font-serif font-black text-[#0b1b3d] leading-none uppercase">Quote Sheet</h2>
                  <p className="text-xs font-mono text-blue-900 font-bold mt-1.5">{showInvoiceViewer.quoteNumber}</p>
                  <div className="mt-2 text-[10px] text-slate-400 space-y-0.5">
                    <p>Issue Date: {showInvoiceViewer.createdAt}</p>
                    <p>Terms: {showInvoiceViewer.paymentTerms}</p>
                    <p className="text-orange-600 font-bold">Expires: 30 Days after creation</p>
                  </div>
                </div>
              </div>

              {/* Middle Row: Client Billing and Drop Coordinates */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Submitted To / Contractor</h4>
                  <p className="font-bold text-slate-800 text-sm leading-tight">{showInvoiceViewer.customerName}</p>
                  {showInvoiceViewer.companyName && <p className="font-medium text-slate-500 mt-0.5">{showInvoiceViewer.companyName}</p>}
                  <p className="text-xs text-slate-400 mt-1 hover:underline">Net-30 verified billing partner</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Jobsite Coordinates / Destination</h4>
                  <p className="font-semibold text-slate-700">{showInvoiceViewer.deliveryAddress}</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Transit Method: <strong className="text-slate-800 uppercase font-bold">{showInvoiceViewer.deliveryType}</strong>
                  </p>
                  <p className="text-[10px] text-[#ff9100] font-bold leading-none mt-1">Expected Drop Date: {showInvoiceViewer.deliveryRequiredDate}</p>
                </div>
              </div>

              {/* Items Matrix */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="min-w-full text-left font-sans text-xs">
                  <thead className="bg-[#0b1b3d] text-white uppercase text-[9px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3">Material Spec Description</th>
                      <th className="p-3 text-center">Unit</th>
                      <th className="p-3 text-center">Qty Required</th>
                      <th className="p-3 text-right">Unit Net Price</th>
                      <th className="p-3 text-right">Extended Net Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {showInvoiceViewer.items.map((item, id) => {
                      const itemPrice = tradeAccountActive ? item.product.tradePrice : item.product.price;
                      return (
                        <tr key={id} className="hover:bg-slate-50/55 text-slate-700">
                          <td className="p-3 font-semibold">
                            <span>{item.product.name}</span>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-normal">SKU: {item.product.sku}</p>
                          </td>
                          <td className="p-3 text-center font-mono text-[11px] text-slate-500">{item.product.unit}</td>
                          <td className="p-3 text-center font-bold font-mono text-[#0b1b3d]">{item.quantity}</td>
                          <td className="p-3 text-right font-mono">${itemPrice.toFixed(2)}</td>
                          <td className="p-3 text-right font-bold font-mono text-slate-900">${(itemPrice * item.quantity).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary and Terms math */}
              <div className="flex justify-between items-start gap-4 pt-4 border-t border-slate-200">
                <div className="max-w-xs text-[10px] text-slate-400 leading-normal">
                  <h5 className="font-bold text-slate-600 uppercase tracking-widest mb-1.5 leading-none">Demilva Quality Bond Warranty</h5>
                  <p>
                    All cement products and structural deformed rebars conform strictly with ASTM standards. Subfloor framing and structural fasteners are code validated. Special crane unloading drops may require site supervisor validation before hiab arm extension is deployed.
                  </p>
                  {showInvoiceViewer.notes && (
                    <div className="mt-3 p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px]">
                      <strong>Foreman Crane Instructions:</strong> {showInvoiceViewer.notes}
                    </div>
                  )}
                </div>

                <div className="w-56 space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Inventory Subtotal</span>
                    <span className="font-mono font-semibold">${showInvoiceViewer.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Freight Transport Transit</span>
                    <span className="font-mono font-semibold">${showInvoiceViewer.shippingEstimate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">State Sales Tax (8.25%)</span>
                    <span className="font-mono font-semibold">${showInvoiceViewer.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-slate-300 font-extrabold text-[#0b1b3d] text-sm">
                    <span>Bond Invoice Valuation</span>
                    <span className="font-mono text-[#0b1b3d]">${showInvoiceViewer.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Visual Action Button Block */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-2.5 no-print">
              <button
                onClick={() => {
                  // Simulate complete approve order workflow
                  alert(`Quotation successfully finalized! The physical materials hold for quote ${showInvoiceViewer.quoteNumber} has been updated. Demilva's municipal loading desk has queued your flatbed truck.`);
                  setShowInvoiceViewer(null);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
              >
                Approve Site Delivery Queue
              </button>
              <button
                onClick={() => setShowInvoiceViewer(null)}
                className="px-4 py-2 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
              >
                Close Visual Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for printable layouts */}
      <style>{`
        @media print {
          .no-print, header, footer, #rfq_cart_drawer {
            display: none !important;
          }
          body, .min-h-screen, main {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #print_area {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          #invoice_ticket_modal {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            background: white !important;
            display: block !important;
          }
        }
      `}</style>

    </div>
  );
}
