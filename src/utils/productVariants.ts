import { Product, ProductVariantOption } from '../types/store';
import { getProductImageSrc } from '@/components/ProductImage';

export interface ResolvedProductOption {
  /** Unique identifier for this option (product.id or inline variant.id) */
  id: string;
  /** Short badge title e.g. "Q2", "Q3", "Q4", "200P", "A4" */
  shortLabel: string;
  /** Concise sub-detail e.g. "192P · 48/Box" */
  subLabel: string;
  /** Full product or variant title */
  fullName: string;
  price: number;
  discountPrice?: number;
  wholesalePrice: number;
  quire?: string;
  pageCount?: string;
  size?: string;
  packaging?: string;
  sku: string;
  image: string;
  description?: string;
  /** If backed by a full sibling product in the catalog */
  targetProduct?: Product;
  /** If backed by an inline variant option on a product */
  inlineVariant?: ProductVariantOption;
}

export const VARIANT_GROUP_PRESETS = [
  {
    id: 'OMEGA Counter Books (Q2, Q3, Q4)',
    label: 'Counter Books (Q2, Q3, Q4)',
    category: 'Counter Books',
    description: 'Groups Q2, Q3, and Q4 under one unified switcher',
  },
  {
    id: 'OMEGA Student Exercise Books',
    label: 'Exercise Books (32P–200P)',
    category: 'Exercise Books',
    description: 'Groups 32P, 80P, 100P, and 200P Exercise Books',
  },
  {
    id: 'OMEGA Kraft Bahasha Envelopes',
    label: 'Kraft Bahasha (A3–A6)',
    category: 'Bahasha & Envelopes',
    description: 'Groups A3, A4, A5, and A6 Envelopes',
  },
  {
    id: 'OMEGA Archival Registers & Ledgers',
    label: 'Registers & Ledgers',
    category: 'Registers',
    description: 'Groups Attendance, Cash, and Visitor Registers',
  },
] as const;

/**
 * Normalizes a Quire string into a clean short code like Q2, Q3, Q4
 * Only extracts Quire when the product is a Counter Book / Register or its title explicitly mentions Quire/Q2/Q3/Q4.
 */
export function normalizeQuireBadge(
  quire?: string,
  name?: string,
  category?: string
): string | null {
  const catLower = (category || '').toLowerCase();
  const nameStr = name || '';

  // First check the product name itself
  const nameMatch = nameStr.match(/\b(?:Q\s*([1-6])|([1-6])\s*[-\s]?Quire)\b/i);
  if (nameMatch) {
    return `Q${nameMatch[1] || nameMatch[2]}`;
  }

  // Only trust the `quire` field if it's a Counter Book or Register
  if (catLower.includes('counter') || catLower.includes('register')) {
    const quireMatch = (quire || '').match(/\b(?:Q\s*([1-6])|([1-6])\s*[-\s]?Quire)\b/i);
    if (quireMatch) {
      return `Q${quireMatch[1] || quireMatch[2]}`;
    }
  }

  return null;
}

/**
 * Extracts a short, minimal-text badge label (e.g. "Q2", "Q3", "Q4", "200P", "A4")
 */
export function getOptionShortLabel(p: {
  quire?: string;
  pageCount?: string;
  size?: string;
  name: string;
  category?: string;
}): string {
  const qBadge = normalizeQuireBadge(p.quire, p.name, p.category);
  const catLower = (p.category || '').toLowerCase();

  if (qBadge) {
    return qBadge;
  }

  if (catLower.includes('bahasha') || catLower.includes('envelope')) {
    const sizeMatch = `${p.size || ''} ${p.name}`.match(/\b(A3|A4|A5|A6|DL|B4|B5|C4|C5)\b/i);
    if (sizeMatch) {
      return sizeMatch[1].toUpperCase();
    }
  }

  if (catLower.includes('exercise')) {
    const pageMatch = `${p.pageCount || ''} ${p.name}`.match(/(\d+)\s*Pages/i);
    if (pageMatch) {
      const ruleMatch = p.name.match(/\b(SL|DL|SQ|Square|Double)\b/i);
      const suffix = ruleMatch ? ` ${ruleMatch[1].slice(0, 2).toUpperCase()}` : '';
      return `${pageMatch[1]}P${suffix}`;
    }
  }

  const genericPages = (p.pageCount || '').match(/(\d+)\s*Pages/i);
  if (genericPages && catLower.includes('book')) {
    return `${genericPages[1]}P`;
  }

  if (p.size && p.size !== 'N/A') {
    return p.size.replace(/\s+Standard/i, '');
  }

  return p.name
    .replace(/^OMEGA\s+/i, '')
    .replace(/^Hardcover\s+/i, '')
    .replace(/^Student\s+/i, '')
    .slice(0, 16)
    .trim();
}

/**
 * Extracts a compact sub-label with minimal text (e.g. "192P · 48/Box")
 */
export function getOptionSubLabel(p: {
  quire?: string;
  pageCount?: string;
  packaging?: string;
  size?: string;
  category?: string;
}): string {
  const parts: string[] = [];
  const catLower = (p.category || '').toLowerCase();
  const isBook =
    catLower.includes('counter') ||
    catLower.includes('exercise') ||
    catLower.includes('register');

  if (isBook && p.pageCount && p.pageCount !== 'N/A') {
    parts.push(p.pageCount.replace(/\s*Pages/i, 'P'));
  } else if (p.size && p.size !== 'N/A') {
    parts.push(p.size.replace(/\s*Standard/i, ''));
  }

  if (p.packaging) {
    const numMatch = p.packaging.match(/(\d+)\s*(?:Pcs|Boxes|Pkts|Sheets|Sets|Rolls)/i);
    if (numMatch) {
      parts.push(`${numMatch[1]}/Box`);
    }
  }
  return parts.join(' · ') || 'Factory Pack';
}

function getSortWeight(opt: ResolvedProductOption): number {
  const qMatch = opt.shortLabel.match(/^Q(\d+)/i);
  if (qMatch) {
    return parseInt(qMatch[1], 10) * 10;
  }
  const pageMatch = opt.shortLabel.match(/^(\d+)P/i) || (opt.pageCount || '').match(/(\d+)/);
  if (pageMatch) {
    return parseInt(pageMatch[1], 10);
  }
  const sizeOrder: Record<string, number> = { A6: 1, A5: 2, A4: 3, A3: 4 };
  for (const [k, v] of Object.entries(sizeOrder)) {
    if (opt.shortLabel.toUpperCase().startsWith(k)) {
      return v * 100 + opt.price / 1000;
    }
  }
  return opt.price;
}

/**
 * Categories that naturally represent a single book/product family with size/page/quire editions.
 * Other categories (like general Office Supplies) only group if an explicit `variantGroup` or `variants` is set.
 */
function isNaturalVariantFamilyCategory(category?: string): boolean {
  const c = (category || '').toLowerCase();
  return (
    c.includes('counter') ||
    c.includes('exercise') ||
    c.includes('bahasha') ||
    c.includes('envelope') ||
    c.includes('register')
  );
}

/**
 * Resolves all selectable category/variant options for an open product.
 */
export function getProductFamilyOptions(
  activeProduct: Product,
  allProducts: Product[]
): ResolvedProductOption[] {
  // 1. If the product has inline variants defined at upload time
  if (activeProduct.variants && activeProduct.variants.length > 0) {
    return activeProduct.variants.map((v) => ({
      id: v.id,
      shortLabel:
        normalizeQuireBadge(v.quire, v.label, activeProduct.category) ||
        v.label ||
        v.quire ||
        v.pageCount ||
        'Opt',
      subLabel: getOptionSubLabel({
        quire: v.quire,
        pageCount: v.pageCount,
        packaging: v.packaging || activeProduct.packaging,
        size: v.size,
        category: activeProduct.category,
      }),
      fullName: `${activeProduct.name
        .replace(/\s*\(?(?:Q[1-6]|[1-6]\s*Quire|\d+\s*Pages)\)?/gi, '')
        .trim()} (${v.label || v.quire || v.pageCount})`,
      price: Number(v.price) || activeProduct.price,
      discountPrice: v.discountPrice ? Number(v.discountPrice) : undefined,
      wholesalePrice:
        Number(v.wholesalePrice) ||
        activeProduct.wholesalePrice ||
        Math.round((Number(v.price) || activeProduct.price) * 0.7),
      quire: v.quire || activeProduct.quire,
      pageCount: v.pageCount || activeProduct.pageCount,
      size: v.size || activeProduct.size,
      packaging: v.packaging || activeProduct.packaging,
      sku: v.sku || activeProduct.sku,
      image: v.image || getProductImageSrc(activeProduct.image),
      description: v.description || activeProduct.description,
      inlineVariant: v,
    }));
  }

  // 2. Sibling products sharing an explicit `variantGroup` OR belonging to a natural book/envelope family
  const activeGroup = activeProduct.variantGroup?.trim().toLowerCase();
  const activeCategory = (activeProduct.category || '').trim().toLowerCase();
  const allowCategoryGrouping = isNaturalVariantFamilyCategory(activeProduct.category);

  if (!activeGroup && !allowCategoryGrouping) {
    return [];
  }

  let siblings = allProducts.filter((p) => {
    if (p.id === activeProduct.id) return true;
    if (activeGroup && p.variantGroup?.trim().toLowerCase() === activeGroup) {
      return true;
    }
    if (allowCategoryGrouping && (p.category || '').trim().toLowerCase() === activeCategory) {
      return true;
    }
    return false;
  });

  // For Counter Books: keep strictly Q2, Q3, Q4 deduplicated
  if (activeCategory.includes('counter')) {
    const q234Siblings = siblings.filter((p) => {
      if (p.id === activeProduct.id) return true;
      const qBadge = normalizeQuireBadge(p.quire, p.name, p.category);
      return qBadge === 'Q2' || qBadge === 'Q3' || qBadge === 'Q4';
    });
    const byQuire = new Map<string, Product>();
    const activeQ =
      normalizeQuireBadge(activeProduct.quire, activeProduct.name, activeProduct.category) ||
      activeProduct.id;
    byQuire.set(activeQ, activeProduct);
    for (const sib of q234Siblings) {
      const qKey = normalizeQuireBadge(sib.quire, sib.name, sib.category) || sib.id;
      if (!byQuire.has(qKey)) {
        byQuire.set(qKey, sib);
      }
    }
    siblings = Array.from(byQuire.values());
  }

  // Deduplicate by shortLabel so we never show duplicate badges
  const uniqueByLabel = new Map<string, Product>();
  uniqueByLabel.set(getOptionShortLabel(activeProduct), activeProduct);
  for (const sib of siblings) {
    const lbl = getOptionShortLabel(sib);
    if (!uniqueByLabel.has(lbl)) {
      uniqueByLabel.set(lbl, sib);
    }
  }

  const resolved: ResolvedProductOption[] = Array.from(uniqueByLabel.values()).map((p) => {
    const retailPrice = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
    const wholesaleRate = p.wholesalePrice || Math.round(retailPrice * 0.7);
    return {
      id: p.id,
      shortLabel: getOptionShortLabel(p),
      subLabel: getOptionSubLabel(p),
      fullName: p.name,
      price: p.price,
      discountPrice: p.discountPrice || undefined,
      wholesalePrice: wholesaleRate,
      quire: p.quire,
      pageCount: p.pageCount,
      size: p.size,
      packaging: p.packaging,
      sku: p.sku,
      image: getProductImageSrc(p.image),
      description: p.description,
      targetProduct: p,
    };
  });

  resolved.sort((a, b) => getSortWeight(a) - getSortWeight(b));

  return resolved.slice(0, 6);
}

/**
 * Given a base Product and a selected ResolvedProductOption, returns a complete Product object
 */
export function applyOptionToProduct(
  baseProduct: Product,
  option: ResolvedProductOption
): Product {
  if (option.targetProduct) {
    return option.targetProduct;
  }

  const updatedSpecs = [...(baseProduct.specifications || [])];
  const upsertSpec = (label: string, value?: string) => {
    if (!value) return;
    const idx = updatedSpecs.findIndex((s) => s.label.toLowerCase() === label.toLowerCase());
    if (idx >= 0) {
      updatedSpecs[idx] = { ...updatedSpecs[idx], value };
    } else {
      updatedSpecs.unshift({ label, value });
    }
  };

  if (option.pageCount) {
    upsertSpec(
      'Page Count',
      option.quire ? `${option.pageCount} (${option.quire})` : option.pageCount
    );
  }
  if (option.packaging) {
    upsertSpec('Packaging', option.packaging);
  }
  if (option.sku) {
    upsertSpec('SKU', option.sku);
  }

  return {
    ...baseProduct,
    name: option.fullName || baseProduct.name,
    price: option.price,
    discountPrice: option.discountPrice,
    wholesalePrice: option.wholesalePrice,
    quire: option.quire || baseProduct.quire,
    pageCount: option.pageCount || baseProduct.pageCount,
    size: option.size || baseProduct.size,
    packaging: option.packaging || baseProduct.packaging,
    sku: option.sku || baseProduct.sku,
    image: option.image || baseProduct.image,
    description: option.description || baseProduct.description,
    stockStatus: option.inlineVariant?.stockStatus || baseProduct.stockStatus,
    specifications: updatedSpecs,
  };
}

/**
 * Ready-made multi-variant presets for the Admin Product Upload Modal
 */
export function getPresetVariantsForCategory(category: string): ProductVariantOption[] {
  const catLower = category.toLowerCase();
  if (catLower.includes('counter')) {
    return [
      {
        id: 'var-cb-q2',
        label: 'Q2',
        quire: 'Q2',
        pageCount: '192 Pages',
        price: 56000,
        wholesalePrice: 56000,
        packaging: '48 Pcs / Box',
        sku: 'OMG-CB-Q2',
        image: '/omega-products/counter-book-q2-192p.jpeg',
        description: '2-Quire (192 Pages) Hardcover Archival Counter Book · 48 Pcs / Box',
        stockStatus: 'In Stock',
      },
      {
        id: 'var-cb-q3',
        label: 'Q3',
        quire: 'Q3',
        pageCount: '288 Pages',
        price: 57000,
        wholesalePrice: 57000,
        packaging: '36 Pcs / Box',
        sku: 'OMG-CB-Q3',
        image: '/omega-products/counter-book-q3-288p.jpeg',
        description: '3-Quire (288 Pages) Hardcover Archival Counter Book · 36 Pcs / Box',
        stockStatus: 'In Stock',
      },
      {
        id: 'var-cb-q4',
        label: 'Q4',
        quire: 'Q4',
        pageCount: '384 Pages',
        price: 60000,
        wholesalePrice: 60000,
        packaging: '24 Pcs / Box',
        sku: 'OMG-CB-Q4',
        image: '/omega-products/counter-book-q4-384p.jpeg',
        description: '4-Quire (384 Pages) Heavy-Duty Hardcover Counter Book · 24 Pcs / Box',
        stockStatus: 'In Stock',
      },
    ];
  }

  if (catLower.includes('exercise')) {
    return [
      {
        id: 'var-ex-80p',
        label: '80P',
        quire: 'N/A',
        pageCount: '80 Pages',
        price: 42000,
        wholesalePrice: 42000,
        packaging: '100 Pcs / Box',
        sku: 'OMG-EX-80',
        image: '/omega-products/exercise-book-80p-yellow.jpeg',
        description: '80 Pages Student Exercise Book · 100 Pcs / Box',
        stockStatus: 'In Stock',
      },
      {
        id: 'var-ex-100p',
        label: '100P',
        quire: 'N/A',
        pageCount: '100 Pages',
        price: 41000,
        wholesalePrice: 41000,
        packaging: '120 Pcs / Box',
        sku: 'OMG-EX-100',
        image: '/omega-products/exercise-book-100p-pink.jpeg',
        description: '100 Pages Student Exercise Book · 120 Pcs / Box',
        stockStatus: 'In Stock',
      },
      {
        id: 'var-ex-200p',
        label: '200P',
        quire: 'N/A',
        pageCount: '200 Pages',
        price: 68000,
        wholesalePrice: 68000,
        packaging: '96 Pcs / Box',
        sku: 'OMG-EX-200-PUR',
        image: '/omega-products/exercise-book-200p-purple.jpeg',
        description: '200 Pages Student Exercise Book · 96 Pcs / Box',
        stockStatus: 'In Stock',
      },
    ];
  }

  if (catLower.includes('bahasha') || catLower.includes('envelope')) {
    return [
      {
        id: 'var-bh-a5',
        label: 'A5',
        size: 'A5',
        pageCount: '50 Envelopes / Pack',
        price: 29000,
        wholesalePrice: 29000,
        packaging: '1000 Pcs / Carton',
        sku: 'OMG-BH-A5',
        image: '/omega-products/bahasha-a5-catalog.jpeg',
        description: 'A5 Kraft Bahasha Envelopes · 1000 Pcs / Carton',
        stockStatus: 'In Stock',
      },
      {
        id: 'var-bh-a4',
        label: 'A4',
        size: 'A4',
        pageCount: '50 Envelopes / Pack',
        price: 27000,
        wholesalePrice: 27000,
        packaging: '500 Pcs / Carton',
        sku: 'OMG-BH-A4',
        image: '/omega-products/bahasha-a4-envelope.jpeg',
        description: 'A4 Heavy Kraft Bahasha Envelopes · 500 Pcs / Carton',
        stockStatus: 'In Stock',
      },
      {
        id: 'var-bh-a3',
        label: 'A3',
        size: 'A3',
        pageCount: '50 Envelopes / Pack',
        price: 46000,
        wholesalePrice: 46000,
        packaging: '500 Pcs / Carton',
        sku: 'OMG-BH-A3',
        image: '/omega-products/bahasha-a3-envelope.jpeg',
        description: 'A3 Giant Kraft Bahasha Envelopes · 500 Pcs / Carton',
        stockStatus: 'In Stock',
      },
    ];
  }

  return [
    {
      id: `var-${Date.now()}-1`,
      label: 'Q2',
      quire: 'Q2',
      pageCount: '192 Pages',
      price: 56000,
      wholesalePrice: 56000,
      packaging: '48 Pcs / Box',
      sku: 'OMG-VAR-Q2',
      stockStatus: 'In Stock',
    },
    {
      id: `var-${Date.now()}-2`,
      label: 'Q3',
      quire: 'Q3',
      pageCount: '288 Pages',
      price: 57000,
      wholesalePrice: 57000,
      packaging: '36 Pcs / Box',
      sku: 'OMG-VAR-Q3',
      stockStatus: 'In Stock',
    },
    {
      id: `var-${Date.now()}-3`,
      label: 'Q4',
      quire: 'Q4',
      pageCount: '384 Pages',
      price: 60000,
      wholesalePrice: 60000,
      packaging: '24 Pcs / Box',
      sku: 'OMG-VAR-Q4',
      stockStatus: 'In Stock',
    },
  ];
}
