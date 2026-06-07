import { Product, Category } from '@/types';

export const CATEGORIES: Category[] = [
  {
    id: 'building-materials',
    name: 'building-materials',
    label: 'Building Materials',
    icon: 'Layers',
    description: 'Cement, concrete mixes, steel rebars, hollow blocks, plasterboard gypsum panels, and partition walls.'
  },
  {
    id: 'plumbing',
    name: 'plumbing',
    label: 'Plumbing',
    icon: 'Droplet',
    description: 'PVC and copper piping, couplings, brass ball valves, water meters, drains, and bathroom pipe kits.'
  },
  {
    id: 'tile-sanitary',
    name: 'tile-sanitary',
    label: 'Tile & Sanitary',
    icon: 'ShowerHead',
    description: 'Ceramic tiles, dual-flush toilet suites, modern basins, rain showers, tile thinset adhesive, and grouts.'
  },
  {
    id: 'lighting-electrical',
    name: 'lighting-electrical',
    label: 'Lighting_Electrical',
    icon: 'Lightbulb',
    description: 'Recessed LED panels, solid copper cables, home breaker boxes, wall switch controls, and utility boxes.'
  },
  {
    id: 'paint',
    name: 'paint',
    label: 'Paint & Coatings',
    icon: 'Paintbrush',
    description: 'Premium interior dynamic emulsions, weatherproof exterior primers, rollers, brushes, and masking tape.'
  },
  {
    id: 'accessories',
    name: 'accessories',
    label: 'Tools & Hardware',
    icon: 'Wrench',
    description: 'Power drills, trowels, magnesium bull floats, safety harnesses, respirator masks, and heavy-duty structural screws.'
  },
  {
    id: 'roofing-insulation',
    name: 'roofing-insulation',
    label: 'Roofing & Insulation',
    icon: 'Home',
    description: 'Architectural roof shingles, mineral fiberglass rolls, radiant bubble wraps, and gutter installations.'
  },
  {
    id: 'landscaping',
    name: 'landscaping',
    label: 'Landscaping & Outdoors',
    icon: 'Spade',
    description: 'Premium organic loose soil, interlocking paving stones, perimeter garden borders, and weed barriers.'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  // Building Materials
  {
    id: 'p1',
    sku: 'DM-BLD-01',
    name: 'Demilva Premium Portland Cement (Type I/II)',
    category: 'building-materials',
    description: 'Professional grade hydraulic cement suitable for all applications requiring high early strength. Ideal for mixing foundation slabs, retaining walls, pavements, and custom brickwork.',
    price: 15.50,
    tradePrice: 11.20,
    unit: '94 lb Bag',
    brand: 'Demilva Premium',
    specs: {
      'ASTM Rating': 'Type I/II ASTM C150',
      'Compressive Strength': '4,500 PSI at 28 days',
      'Coverage': 'Approx. 4.5 sq ft (2" thickness)'
    },
    inStock: true,
    stockQty: 320,
    featured: true,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p2',
    sku: 'DM-BLD-02',
    name: 'Reinforced Carbon Steel Deformed Rebar #4 (1/2")',
    category: 'building-materials',
    description: 'Grade 60 structural carbon steel rebar used to provide supreme tensile reinforcement in home masonry slabs, garden walkways, and driveways.',
    price: 18.25,
    tradePrice: 14.80,
    unit: '20 ft Bar',
    brand: 'Demilva Ironworks',
    specs: {
      'Grade Rating': 'Grade 60 ANSI/ASTM A615',
      'Diameter': '0.5 inch (#4 Steel)',
      'Yield Strength': '60,000 PSI Minimum'
    },
    inStock: true,
    stockQty: 850,
    featured: true,
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p3',
    sku: 'DM-BLD-03',
    name: 'Premium Red Clay Facing Brick (Classic Style)',
    category: 'building-materials',
    description: 'High-density extruded red clay brick with superb structural loading capabilities. Ideal for partition walls, fireplaces, perimeter garden retaining arches, and decorative facing.',
    price: 1.45,
    tradePrice: 0.95,
    unit: 'Per Piece',
    brand: 'Demilva Terra',
    specs: {
      'Material': '100% Extruded Red Clay',
      'Dimensions': '8" x 3-5/8" x 2-1/4"',
      'Weathering Grade': 'Severe Weathering (SW) Rated'
    },
    inStock: true,
    stockQty: 4500,
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p4',
    sku: 'DM-BLD-04',
    name: 'Moisture-Resistant Interior Gypsum Wallboard',
    category: 'building-materials',
    description: 'Technically advanced gypsum board cores wrapped in heavy moisture-retardant paper. Specially crafted for kitchen, utility, and restroom framing applications.',
    price: 24.90,
    tradePrice: 18.50,
    unit: '4ft x 8ft Sheet',
    brand: 'Knauf Gypsum',
    specs: {
      'Thickness': '1/2 inch',
      'Fire Rating': 'Class A Flame Spread',
      'Edge Type': 'Tapered'
    },
    inStock: true,
    stockQty: 180,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop'
  },

  // Plumbing
  {
    id: 'p5',
    sku: 'DM-PLM-01',
    name: 'Schedule 40 PVC Pressure Pipe (3")',
    category: 'plumbing',
    description: 'High-rigidity premium white PVC pipe manufactured to withstand continuous industrial pressure. Best for sanitary drainage lines and main water supplies.',
    price: 36.50,
    tradePrice: 28.00,
    unit: '10 ft Length',
    brand: 'Charlotte Pipe',
    specs: {
      'Diameter': '3 inches Outer Diameter',
      'Series': 'Sch. 40 Standard Solid Wall',
      'Certification': 'NSF Standard 14/61 Approved'
    },
    inStock: true,
    stockQty: 200,
    image: 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p6',
    sku: 'DM-PLM-02',
    name: 'Solid Brass Ball Valve (1" Sweat-to-Sweat)',
    category: 'plumbing',
    description: 'Full-port heavy duty brass ball valve equipped with a durable vinyl-coated lever handle. Ensures bi-directional, drip-free control on commercial water connections.',
    price: 19.80,
    tradePrice: 14.20,
    unit: 'Each',
    brand: 'NIBCO Valves',
    specs: {
      'Material': 'Lead-Free Forged Brass Body',
      'Pressure Rating': '600 PSI Non-Shock CWP',
      'Connector Size': '1 inch standard copper sweat'
    },
    inStock: true,
    stockQty: 85,
    featured: true,
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p7',
    sku: 'DM-PLM-03',
    name: 'Galvanized Steel Pipe Coupling fitting',
    category: 'plumbing',
    description: 'Corrosion-proof schedule 40 hot-dipped galvanized iron coupling. Ideal for linking high-pressure outdoor pipelines and water pump networks.',
    price: 8.90,
    tradePrice: 6.50,
    unit: 'Each',
    brand: 'Ward Manufacturing',
    specs: {
      'Thread Type': 'American National Standard Taper NPT',
      'Working Pressure': '150 PSI saturated steam'
    },
    inStock: true,
    stockQty: 340,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop'
  },

  // Tile & Sanitary
  {
    id: 'p8',
    sku: 'DM-TIL-01',
    name: 'Polished Ceramic Subway Wall Tiles (White)',
    category: 'tile-sanitary',
    description: 'Clean, radiant pure white ceramic field tiles. Perfect for kitchen slab backsplashes, sanitary restroom shower walls, and commercial accent panels.',
    price: 34.00,
    tradePrice: 26.50,
    unit: '12.5 sq ft Box',
    brand: 'Daltile Ceramic',
    specs: {
      'Tile Sizing': '3 inch x 6 inch structural tiles',
      'Surface finish': 'High-Gloss Polished glaze',
      'Scratch resistance': 'MOHS rating scale: 5'
    },
    inStock: true,
    stockQty: 110,
    featured: true,
    image: 'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p9',
    sku: 'DM-TIL-02',
    name: 'Deluxe Dual-Flush Elongated Toilet Suite',
    category: 'tile-sanitary',
    description: 'Vitreous china construction with high-performance siphon jet action and double flushing options for supreme water preservation. Easy clean base.',
    price: 295.00,
    tradePrice: 220.00,
    unit: 'Each',
    brand: 'Demilva Sanitary',
    specs: {
      'Flush Rate': 'Dual 1.1 / 1.6 Gallons Per Flush',
      'Material': 'Grade-A Vitreous China Glaze',
      'Bowl Height': '16.5" Comfort Height ADA compliant'
    },
    inStock: true,
    stockQty: 25,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p10',
    sku: 'DM-TIL-03',
    name: 'Polymer-Modified Thinset Tile Adhesive',
    category: 'tile-sanitary',
    description: 'Professional polymer-modified dry-mix mortar. Offers extreme sag resistance and powerful bond strength over exterior and interior concrete substrates.',
    price: 29.95,
    tradePrice: 23.00,
    unit: '50 lb Bag',
    brand: 'MAPEI adhesive',
    specs: {
      'Base Chemistries': 'Polymer modified cementitious dry-mix',
      'Pot Life': '4 hours before dry cure',
      'Testing standards': 'ANSI A118.4 approved'
    },
    inStock: true,
    stockQty: 240,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop'
  },

  // Lighting & Electrical
  {
    id: 'p11',
    sku: 'DM-ELC-01',
    name: 'Recessed LED Slim Backlit Ceiling Panel (Warm White)',
    category: 'lighting-electrical',
    description: 'Ultra-thin modern LED ceiling light panel with detached driver junction box. Features excellent high efficacy lighting with minimal energy consumption.',
    price: 18.20,
    tradePrice: 13.90,
    unit: 'Each',
    brand: 'Philips Lumen',
    specs: {
      'Dimension': '6 inch round edge rimless panel',
      'Efficacy Output': '900 Lumens / 12W Energy usage',
      'Color temp': '3000K Soft Warm glow'
    },
    inStock: true,
    stockQty: 300,
    image: 'https://images.unsplash.com/photo-1565538810844-1e1192111967?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p12',
    sku: 'DM-ELC-02',
    name: '12/2 Copper Romex Ground Electrical Wire Spool',
    category: 'lighting-electrical',
    description: 'Durable non-metallic sheathed cable with dual solid annealing conductors and an uninsulated bare copper ground. Crucial for heavy outlet switch drops.',
    price: 135.00,
    tradePrice: 104.00,
    unit: '250 ft Roll',
    brand: 'Southwire Electrical',
    specs: {
      'Wire Gauge Sizing': '12 AWG Romex Cable type NM-B',
      'Max Voltage Limit': '600 Volts rating',
      'Conductor Material': 'Annealed copper wire (uncoated)'
    },
    inStock: true,
    stockQty: 95,
    featured: true,
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p13',
    sku: 'DM-ELC-03',
    name: '200A Outdoor Residential Panel & Breaker Box',
    category: 'lighting-electrical',
    description: 'All-inclusive main circuit breaker box featuring extra-dense bus bars and weather-seal NEMA enclosure. Supports standard exterior panel installation.',
    price: 245.00,
    tradePrice: 195.00,
    unit: 'Each',
    brand: 'Schneider Electric',
    specs: {
      'Amp Limit rating': '200 Amps maximum overhead service',
      'Circuits Range': '30 Space rating / expandable to 40'
    },
    inStock: true,
    stockQty: 18,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop'
  },

  // Paint
  {
    id: 'p14',
    sku: 'DM-PNT-01',
    name: 'Demilva Ultra-Sheen Interior Emulsion Paint',
    category: 'paint',
    description: 'Premium formulation acrylic wash emulsion with state-of-the-art non-fade color technology. Formulated to provide unmatched scuff protection and uniform stain washability.',
    price: 159.00,
    tradePrice: 119.50,
    unit: '5 Gallon Bucket',
    brand: 'Demilva Paint',
    specs: {
      'Visual finishing': 'Semi-Gloss Ultra Sheen',
      'Toxin Rating': 'Ultra Low VOC (Under 5g/Liter)',
      'Dry Time': 'Touch dry: 1 hour / Re-coating: 4 hours'
    },
    inStock: true,
    stockQty: 140,
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p15',
    sku: 'DM-PNT-02',
    name: 'Demilva Seal-Grip Exterior Weather Shield Primer',
    category: 'paint',
    description: 'Alkali-resistant high binding exterior sealant primer. Fills brick pores and anchors top finishes beautifully to protect homes against intensive solar heat and rains.',
    price: 36.50,
    tradePrice: 28.00,
    unit: '1 Gallon Can',
    brand: 'Demilva Paint',
    specs: {
      'Composition': '100% Saturated Acrylic Emulsion Resins',
      'Solid Contents': '42% Volume percentage rating'
    },
    inStock: true,
    stockQty: 160,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p16',
    sku: 'DM-PNT-03',
    name: 'Professional 5-Piece Paint Roller & Brush Kit',
    category: 'paint',
    description: 'Comprehensive painting accessory set containing two 9-inch woven shed-resistant roller covers, heavy-duty roller frame, dynamic metal grid, and premium flat sash trim brushes.',
    price: 24.00,
    tradePrice: 18.50,
    unit: 'Set',
    brand: 'Demilva Professional',
    specs: {
      'Bristle Blend': 'Synthetic premium elastomeric blend',
      'Frame Size': '9 inches standard size heavy wire cageless'
    },
    inStock: true,
    stockQty: 220,
    image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76ae?q=80&w=600&auto=format&fit=crop'
  },

  // Accessories & Hardware
  {
    id: 'p17',
    sku: 'DM-ACC-01',
    name: 'Magnesium Bull Float Kit with Pitch Attachment',
    category: 'accessories',
    description: 'Highly robust lightweight structural magnesium slab float. Includes multi-angle pivoting gear pitch head and three 6ft extendable locking aluminum poles.',
    price: 198.00,
    tradePrice: 155.00,
    unit: 'Kit',
    brand: 'Demilva Tools',
    specs: {
      'Blade Size': '48" x 8" flat trowel face',
      'Compatible Poles': 'Includes 3x 1.8m secure push-button handles',
      'Alloy Composition': 'Magnesium ASTM B107 structural grade'
    },
    inStock: true,
    stockQty: 40,
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p18',
    sku: 'DM-ACC-02',
    name: 'OSHA-Approved Full Body Safe Safety Harness Rig',
    category: 'accessories',
    description: 'Reinforced nylon multi-loop safety harness featuring high-strength steel chest D-rings and breathable padding. A must-have for safe structural roof framing checking.',
    price: 78.00,
    tradePrice: 58.00,
    unit: 'Each',
    brand: 'Guardian Safety',
    specs: {
      'Force rating': '5,000 lbs tensile strength limit',
      'Certifications': 'OSHA 1926 & ANSI Z359.11 compliant'
    },
    inStock: true,
    stockQty: 65,
    featured: true,
    image: 'https://images.unsplash.com/photo-1605281317010-fe5fed93a40e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p19',
    sku: 'DM-ACC-03',
    name: 'Wedge-Bolt Heavy Galvanized structural Screws',
    category: 'accessories',
    description: 'Supreme-rated structural concrete frame fasteners. Self-tapping screw threads anchor structural column baseplates directly into concrete blocks.',
    price: 85.00,
    tradePrice: 65.00,
    unit: 'Box of 100',
    brand: 'Demilva Fasteners',
    specs: {
      'Sizing': '3/8 inch Diameter x 5 inch length',
      'Tensile Yield': '8,200 lbs sheer loading capacity'
    },
    inStock: true,
    stockQty: 150,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop'
  },

  // Roofing & Insulation
  {
    id: 'p20',
    sku: 'DM-ROF-01',
    name: 'Architectural Slate Asphalt Roof Shingles',
    category: 'roofing-insulation',
    description: 'Heavy duty, multi-layered asphalt roof shingles designed with beautiful relief shading to give homes a gorgeous classic slate look. Lifetime protection.',
    price: 48.00,
    tradePrice: 38.00,
    unit: '33.3 sq ft Bundle',
    brand: 'OWENS Corning',
    specs: {
      'Material Composition': 'Fiberglass backing with asphalt coating',
      'Wind Rate Speed': 'ASTM D3161 Class F 110 MPH'
    },
    inStock: true,
    stockQty: 180,
    image: 'https://images.unsplash.com/photo-1626808642875-0aa5454f2ef8?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p21',
    sku: 'DM-ROF-02',
    name: 'Pink Fiber Insulation Roll R-19 (Faced)',
    category: 'roofing-insulation',
    description: 'Highest performance insulation rolls to decrease building heating bills. Fits perfectly inside ceiling joists and wall drywalls.',
    price: 52.00,
    tradePrice: 41.50,
    unit: 'Roll (48 sq ft)',
    brand: 'OWENS Corning',
    specs: {
      'Insulation rate': 'R-19 Thermal value index',
      'Roll Dimension': '15" Wide x 38.4ft Long'
    },
    inStock: true,
    stockQty: 80,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop'
  },

  // Landscaping
  {
    id: 'p22',
    sku: 'DM-LND-01',
    name: 'Premium Organic Moisture-Retaining Topsoil Mix',
    category: 'landscaping',
    description: 'Enriched blend of mature forest compost, high quality organic leaf mould, and composted manure. Perfect for planting garden flowerbeds, lawns, and vegetables.',
    price: 7.95,
    tradePrice: 5.50,
    unit: '1 Cubic Yard Bag',
    brand: 'Demilva Agro',
    specs: {
      'Nutrient Blend': 'Balanced NPK values enriched with compost',
      'Density rating': 'Moist aerated loam'
    },
    inStock: true,
    stockQty: 120,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p23',
    sku: 'DM-LND-02',
    name: 'Locking Charcoal Concrete Driveway Paving Stone',
    category: 'landscaping',
    description: 'Highly durable rectangular charcoal grey dry-cast bricks designed for interlocking patterns on driveway surfaces, garden walkways, and outdoor fire pits.',
    price: 2.10,
    tradePrice: 1.45,
    unit: 'Per Piece',
    brand: 'Demilva Terra',
    specs: {
      'Unit sizing': '4 inch x 8 inch x 2.4 inch thickness',
      'Max compression load': '8,500 PSI testing certification'
    },
    inStock: true,
    stockQty: 2500,
    featured: true,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop'
  }
];
