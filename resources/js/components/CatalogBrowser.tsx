import { useState, useMemo } from 'react';
import {
  Search,
  Layers,
  Zap,
  Wrench,
  Hammer,
  Shield,
  Ruler,
  Plus,
  Minus,
  Check,
  ArrowRight,
  Eye,
  ShieldAlert,
  ArchiveX,
  Droplet,
  ShowerHead,
  Lightbulb,
  Paintbrush,
  Home,
  Spade
} from 'lucide-react';
import { Product, Category } from '../types';
import { CATEGORIES, MOCK_PRODUCTS } from '../pages/data/mockProducts';

interface CatalogBrowserProps {
  tradeAccountActive: boolean;
  onAddToCart: (product: Product, quantity: number, notes?: string) => void;
  cartItems: { product: Product; quantity: number }[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function CatalogBrowser({
  tradeAccountActive,
  onAddToCart,
  cartItems,
  selectedCategory,
  setSelectedCategory
}: CatalogBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qtyState, setQtyState] = useState<Record<string, number>>({});
  const [notesState, setNotesState] = useState<Record<string, string>>({});
  const [addedAnimation, setAddedAnimation] = useState<Record<string, boolean>>({});

  // Map category IDs to their lucide icons
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'building-materials': return <Layers className="w-4 h-4" />;
      case 'plumbing': return <Droplet className="w-4 h-4" />;
      case 'tile-sanitary': return <ShowerHead className="w-4 h-4" />;
      case 'lighting-electrical': return <Lightbulb className="w-4 h-4" />;
      case 'paint': return <Paintbrush className="w-4 h-4" />;
      case 'accessories': return <Wrench className="w-4 h-4" />;
      case 'roofing-insulation': return <Home className="w-4 h-4" />;
      case 'landscaping': return <Spade className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesStock = !inStockOnly || product.inStock;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [searchTerm, selectedCategory, inStockOnly]);

  const handleQtyChange = (productId: string, delta: number) => {
    setQtyState((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const currentQty = (productId: string) => qtyState[productId] || 1;

  const handleAddItem = (product: Product) => {
    const qty = currentQty(product.id);
    const notes = notesState[product.id] || '';
    onAddToCart(product, qty, notes);

    // Set feedback animation
    setAddedAnimation((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);

    // Clear notes state but keep qty
    setNotesState((prev) => ({ ...prev, [product.id]: '' }));
  };

  return (
    <div id="catalog_browser_root" className="space-y-8">

      {/* Search and Category Filter Section */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              id="product_search_input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by SKU, Product Name, Brand, Specifications..."
              className="pl-10 pr-4 py-2.5 w-full bg-slate-50 border border-slate-350 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b1b3d] placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="in_stock_toggle"
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-[#0b1b3d] border-slate-350 rounded focus:ring-[#0b1b3d]"
              />
              <span className="text-sm font-semibold text-slate-700">In-Stock Only</span>
            </label>

            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
              Showing {filteredProducts.length} items
            </span>
          </div>
        </div>

        {/* Categories Carousel/Row */}
        <div className="flex flex-wrap gap-2">
          <button
            id="cat_filter_all"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-[#0b1b3d] text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            All Products
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              id={`cat_filter_${category.id}`}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                selectedCategory === category.name
                  ? 'bg-[#0b1b3d] text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {getCategoryIcon(category.name)}
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout of Catalog */}
      {filteredProducts.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-16 text-center max-w-xl mx-auto">
          <ArchiveX className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-serif font-bold text-slate-800">No construction materials found</h3>
          <p className="text-slate-600 text-sm mt-1">
            We couldn't find any products matching your specific query. Try selecting another category or resetting the stock filters.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setInStockOnly(false); }}
            className="mt-4 px-4 py-2 bg-[#0b1b3d] text-white text-xs font-bold rounded hover:bg-opacity-95 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isAdded = addedAnimation[product.id];
            const inCart = cartItems.find(item => item.product.id === product.id);
            const qty = currentQty(product.id);

            return (
              <div
                key={product.id}
                id={`product_card_${product.id}`}
                className="bg-white rounded-xl border border-slate-200/80 hover:border-slate-350 shadow-xs hover:shadow-sm transition-all duration-350 flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Visual badge */}
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-white/95 text-slate-900 border border-slate-200/60 text-[9px] font-bold px-2 py-0.5 rounded shadow-xs z-10 uppercase tracking-wider">
                    High Demand
                  </span>
                )}

                {!product.inStock && (
                  <span className="absolute top-3 right-3 bg-rose-50 border border-rose-100/60 text-rose-600 text-[9px] font-bold px-2 py-0.5 rounded shadow-xs z-10 uppercase tracking-wider">
                    Backorder
                  </span>
                )}

                {/* Card Image Banner */}
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

                {/* Card Top */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                        {product.brand}
                      </span>
                      <span className="font-mono text-[9px] text-slate-400 bg-slate-55 border border-slate-100 rounded px-1.5 py-0.2">
                        SKU: {product.sku}
                      </span>
                    </div>

                    <h3 className="font-serif font-black text-slate-900 text-sm leading-tight h-10 overflow-hidden line-clamp-2 group-hover:text-[#ff9100] transition duration-200 mb-2">
                      {product.name}
                    </h3>

                    <p className="text-slate-500 text-xs line-clamp-2 mb-3 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Pricing Row */}
                    <div className="border-t border-slate-100 pt-2.5 pb-2.5 flex justify-between items-baseline mb-2">
                      <span className="text-slate-400 text-[10px] font-mono uppercase font-bold tracking-wider">Price per {product.unit}</span>
                      <div>
                        {tradeAccountActive ? (
                          <div className="text-right">
                            <span className="text-xs text-slate-400 line-through mr-1.5">${product.price.toFixed(2)}</span>
                            <span className="text-base font-black text-slate-900">${product.tradePrice.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-base font-black text-slate-900">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Details Expansion Mini Specs */}
                  <div className="space-y-2 mt-auto">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(product.specs).slice(0, 1).map(([key, val]) => (
                        <span key={key} className="text-[10px] text-slate-500">
                          <strong className="text-slate-400 font-mono font-medium">{key}:</strong> {String(val)}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-xs font-bold text-blue-800 hover:text-[#ff9100] transition flex items-center gap-1 focus:outline-none cursor-pointer pt-0.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Specs & Multi-view
                    </button>
                  </div>
                </div>

                {/* Card Controls & Actions */}
                <div className="p-4 pt-3 border-t border-slate-100 flex flex-col gap-2 mt-auto">
                  {/* Delivery notification */}
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <div className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span>
                      {product.inStock
                        ? 'Next-day site delivery'
                        : `Backorder: ${product.leadTimeDays || 5} days`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Qty incrementer */}
                    <div className="flex items-center border border-slate-200 bg-white rounded-lg p-0.5 overflow-hidden">
                      <button
                        onClick={() => handleQtyChange(product.id, -1)}
                        className="p-1 px-2 text-slate-400 hover:text-slate-900 transition focus:outline-none font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono text-xs font-extrabold text-slate-800">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(product.id, 1)}
                        className="p-1 px-2 text-slate-400 hover:text-slate-900 transition focus:outline-none font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Add Button */}
                    <button
                      id={`add_cart_btn_${product.id}`}
                      onClick={() => handleAddItem(product)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 border border-emerald-600 text-white'
                          : 'bg-slate-950 text-white hover:bg-[#ff9100] hover:text-slate-950'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" /> Added
                        </>
                      ) : (
                        <>
                          Request Quote {inCart && `(${inCart.quantity})`}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal Popup */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-[#050e21]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="bg-[#0b1b3d] text-white p-5 flex justify-between items-center">
              <div>
                <p className="font-mono text-xs text-[#ff9100] tracking-widest uppercase">{selectedProduct.brand}</p>
                <h2 className="text-xl font-serif font-black">{selectedProduct.name}</h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-slate-300 hover:text-white font-mono text-xl leading-none p-1 block focus:outline-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {selectedProduct.image && (
                <div className="w-full h-52 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Product Description</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Specs Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Technical Specifications Matrix</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-xs text-slate-500">SKU Code</span>
                    <span className="text-xs font-mono font-bold text-slate-800">{selectedProduct.sku}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-xs text-slate-500">Unit Package</span>
                    <span className="text-xs font-bold text-slate-800">{selectedProduct.unit}</span>
                  </div>
                  {Object.entries(selectedProduct.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-xs text-slate-500">{key}</span>
                      <span className="text-xs font-bold text-slate-800">{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-xs text-slate-500">Stock Availability</span>
                    <span className={`text-xs font-bold ${selectedProduct.inStock ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selectedProduct.inStock ? `In Stock (${selectedProduct.stockQty} ${selectedProduct.unit}s)` : 'Backorder'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery and logistics information */}
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 flex items-start gap-2.5">
                <Shield className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-sky-800 leading-tight">Jobsite Logistics Notice</h5>
                  <p className="text-slate-600 text-[11px] mt-1">
                    This item qualifies for heavy loader truck and HIAB crane unloading on construction ground. Specify site coordinates in check-out to direct crane operators correctly.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-500 block">Unit Weight / Price</span>
                <span className="text-lg font-black text-[#0b1b3d]">
                  ${tradeAccountActive ? selectedProduct.tradePrice.toFixed(2) : selectedProduct.price.toFixed(2)}
                  <span className="text-xs font-normal text-slate-600 ml-1">/{selectedProduct.unit}</span>
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                >
                  Close Specs
                </button>
                <button
                  onClick={() => { handleAddItem(selectedProduct); setSelectedProduct(null); }}
                  className="px-6 py-2 bg-[#0b1b3d] text-white text-xs font-bold rounded-lg hover:bg-opacity-90 shadow-sm transition"
                >
                  Add To RFQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
