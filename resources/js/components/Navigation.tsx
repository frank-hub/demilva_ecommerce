import { ShoppingCart, Layers, Mail, Calculator } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onRequestQuoteClick: () => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  cartCount,
  onRequestQuoteClick
}: NavigationProps) {

  return (
    <header id="nav_header" className="bg-[#0b1b3d] text-white border-b-4 border-[#ff9100] sticky top-0 z-50 shadow-md">
      {/* Top Bar for Retail/End Client Status */}
      <div className="bg-[#050e21] text-xs py-2.5 px-4 flex justify-between items-center border-b border-blue-950/40">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ff9100] animate-pulse"></span>
          <span className="text-gray-300">Demilva Direct Supplies is currently dispatching homebuilder and residential material orders.</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] font-semibold text-orange-400 bg-orange-950/40 border border-orange-900/40 px-2 py-0.5 rounded">
            End-Client Workspace
          </span>
          <a href="#tel" className="text-gray-300 font-mono hover:text-[#ff9100] transition">
            Call Support: +1 (800) 555-DM-SYS
          </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* LOGO Recreation of Demilva */}
        <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => setActiveTab('homepage')}>
          {/* Logo Monogram */}
          <div className="relative w-14 h-12 flex items-center justify-center bg-white rounded-md shadow-inner px-1 border border-slate-350">
            {/* Custom SVG Monogram DM looking like the uploaded image */}
            <svg id="demilva_brand_svg" viewBox="0 0 100 80" className="w-full h-full text-[#032060]">
              <defs>
                <style>
                  {`
                    .letter-d { font-family: 'Georgia', serif; font-size: 78px; font-weight: 900; fill: #002664; }
                    .letter-m { font-family: 'Times New Roman', serif; font-size: 58px; font-weight: 800; fill: #002664; opacity: 0.95; }
                  `}
                </style>
              </defs>
              {/* Custom combined letterings representing DM layout */}
              <text x="5" y="65" className="letter-d">D</text>
              <text x="44" y="64" className="letter-m">M</text>
              {/* Swoosh line representing Logo */}
              <path d="M5 58 C 30 54, 70 55, 95 62" stroke="#002664" strokeWidth="5" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Logo Text */}
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-black tracking-wider leading-none text-white flex items-baseline">
              DEMILVA
            </span>
            <span className="text-[9px] font-sans font-bold tracking-[0.22em] text-[#ff9100] mt-1 whitespace-nowrap leading-none uppercase">
              CONSTRUCTION SUPPLIES & TOOLS
            </span>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex flex-wrap items-center justify-center gap-1">
          <button
            id="tab_home"
            onClick={() => setActiveTab('homepage')}
            className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
              activeTab === 'homepage'
                ? 'bg-[#ff9100] text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Home Overview
          </button>
          <button
            id="tab_catalog"
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-[#ff9100] text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            Product Catalog
          </button>

          <button
            id="tab_estimator"
            onClick={() => setActiveTab('estimator')}
            className={`px-4 py-2 rounded text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'estimator'
                ? 'bg-[#ff9100] text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Calculator className="w-4 h-4" />
            AI Material Estimator
          </button>

          <button
            id="tab_contact"
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded text-sm font-semibold border border-orange-450/20 transition-all flex items-center gap-2 bg-orange-600/10 hover:bg-orange-600/25 ${
              activeTab === 'contact'
                ? 'bg-[#ff9100] border-[#ff9100] text-slate-950 font-bold'
                : 'text-orange-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 text-orange-400" />
            Contact Us
          </button>
        </nav>

        {/* Action Triggers (Quote and Cart) */}
        <div className="flex items-center gap-3">
          <button
            id="quote_cart_btn"
            onClick={onRequestQuoteClick}
            className="relative p-2.5 rounded-full bg-slate-850 hover:bg-slate-800 text-white hover:text-[#ff9100] transition group focus:outline-none focus:ring-2 focus:ring-[#ff9100]"
            title="Open Quote & Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#ff9100] text-slate-950 font-extrabold text-[11px] w-5.5 h-5.5 rounded-full flex items-center justify-center animate-bounce shadow-md animate-duration-1000">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
