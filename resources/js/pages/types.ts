export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  price: number;
  tradePrice: number; // For verified contractors/trade accounts
  unit: string; // e.g., 'Bag', 'Each', 'Box of 100', 'Yard', 'Roll'
  brand: string;
  specs: Record<string, string>;
  inStock: boolean;
  stockQty: number;
  leadTimeDays?: number; // for backorders or special order items
  featured?: boolean;
  image?: string; // Product photo URL
}

export interface Category {
  id: string;
  name: string;
  label: string;
  icon: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerName: string;
  companyName?: string;
  paymentTerms: string;
  deliveryAddress: string;
  deliveryType: 'standard_truck' | 'flatbed' | 'hiab_crane' | 'pickup';
  deliveryRequiredDate: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shippingEstimate: number;
  tax: number;
  total: number;
  notes?: string;
  status: 'pending' | 'appoved' | 'converted_invoice';
}

export interface Project {
  id: string;
  name: string;
  siteAddress: string;
  foreman: string;
  contactNo: string;
  activeQuotesCount: number;
  status: 'active' | 'completed' | 'on_hold';
}

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  filename: string;
  code: string;
}
