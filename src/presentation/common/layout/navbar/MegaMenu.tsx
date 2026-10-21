import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, PenTool, Palette, Briefcase, GraduationCap, Flame, Check } from 'lucide-react';

export interface MegaMenuCategoryData {
  id: string;
  name: string;
  badge?: string;
  subtitle: string;
  columns: {
    title: string;
    items: { label: string; href: string; badge?: string }[];
  }[];
  featured: {
    title: string;
    subtitle: string;
    image: string;
    badge: string;
    href: string;
    ctaText: string;
  };
}

export const MEGA_MENU_DATA: Record<string, MegaMenuCategoryData> = {
  notebooks: {
    id: 'notebooks',
    name: 'Notebooks',
    subtitle: 'Thread-sewn hardcovers and high-opacity register books',
    columns: [
      {
        title: 'Counter Books (Folio)',
        items: [
          { label: 'OMEGA Q2 (192 Pages)', href: '/catalog?category=Counter+Books&quire=2+Quire', badge: 'Popular' },
          { label: 'OMEGA Q3 (288 Pages)', href: '/catalog?category=Counter+Books&quire=3+Quire', badge: 'Bestseller' },
          { label: 'OMEGA Q4 (384 Pages)', href: '/catalog?category=Counter+Books&quire=4+Quire' },
          { label: 'Folio Standard Ledgers', href: '/catalog?category=Counter+Books' },
        ],
      },
      {
        title: 'Exercise Notebooks',
        items: [
          { label: 'Single Line Ruled (200p)', href: '/catalog?category=Exercise+Books' },
          { label: 'Square Grid Mathematics', href: '/catalog?category=Exercise+Books' },
          { label: 'Double Line Handwriting', href: '/catalog?category=Exercise+Books' },
          { label: 'Student Exercise Packs (32p–100p)', href: '/catalog?category=Exercise+Books' },
        ],
      },
      {
        title: 'Office Registers & Pads',
        items: [
          { label: 'Hardcover Log Registers', href: '/catalog?category=Registers' },
          { label: 'Attendance & Visitor Books', href: '/catalog?category=Registers' },
          { label: 'Examination Ruled Pads', href: '/catalog?category=Ruled+Paper' },
          { label: 'Indexed Account Folios', href: '/catalog?category=Registers' },
        ],
      },
      {
        title: 'Specifications & Finish',
        items: [
          { label: 'Thread-Sewn Hardboard', href: '/catalog?category=Counter+Books' },
          { label: '70 GSM Bleed-Proof Paper', href: '/catalog?category=Counter+Books' },
          { label: 'Laminated Gloss Spine', href: '/catalog?category=Counter+Books' },
          { label: 'All Paper Notebooks', href: '/catalog' },
        ],
      },
    ],
    featured: {
      title: 'OMEGA Hardcover Counter Book Q3',
      subtitle: '288 high-opacity feint ruled pages with reinforced thread-sewn binding.',
      image: '/omega-products/counter-book-q3-288p.jpeg',
      badge: 'Flagship Edition',
      href: '/catalog?category=Counter+Books',
      ctaText: 'Shop Counter Books',
    },
  },
  'pens-pencils': {
    id: 'pens-pencils',
    name: 'Pens & Pencils',
    subtitle: 'Precision geometry instruments, mathematical sets & writing tools',
    columns: [
      {
        title: 'Mathematical Sets',
        items: [
          { label: 'Oxford Mathematical Instrument Tin', href: '/catalog?category=School+Stationery', badge: 'Original' },
          { label: 'Brass Compasses & Dividers', href: '/catalog?category=School+Stationery' },
          { label: 'Set Squares & 180° Protractors', href: '/catalog?category=School+Stationery' },
          { label: 'Technical Drawing Rulers', href: '/catalog?category=School+Stationery' },
        ],
      },
      {
        title: 'Writing Essentials',
        items: [
          { label: 'Fine Tip Ballpoint Pens', href: '/catalog?category=School+Stationery' },
          { label: 'Smooth Gel Rollerballs', href: '/catalog?category=School+Stationery' },
          { label: 'Classic Blue Ink Desk Pens', href: '/catalog?category=School+Stationery' },
          { label: 'Red Margin Marking Pens', href: '/catalog?category=School+Stationery' },
        ],
      },
      {
        title: 'Pencils & Drafting',
        items: [
          { label: 'HB Wooden School Pencils', href: '/catalog?category=School+Stationery' },
          { label: 'Dust-Free Vinyl Erasers', href: '/catalog?category=School+Stationery' },
          { label: 'Metal Twin-Hole Sharpeners', href: '/catalog?category=School+Stationery' },
          { label: 'Woodless Graphite Sticks', href: '/catalog?category=School+Stationery' },
        ],
      },
      {
        title: 'Board & Marking Tools',
        items: [
          { label: 'Whiteboard Dry-Erase Markers', href: '/catalog?category=Office+Supplies' },
          { label: 'Chalk Sticks (White & Colour)', href: '/catalog?category=School+Stationery' },
          { label: 'Permanent Chisel Markers', href: '/catalog?category=Office+Supplies' },
          { label: 'Neon Document Highlighters', href: '/catalog?category=Office+Supplies' },
        ],
      },
    ],
    featured: {
      title: 'Oxford Mathematical Instruments Set',
      subtitle: 'Complete 9-piece precision geometry metal tin for school & engineering.',
      image: '/omega-products/oxford-mathematical-set.jpeg',
      badge: 'Student Essential',
      href: '/catalog?category=School+Stationery',
      ctaText: 'Explore Instruments',
    },
  },
  'art-craft': {
    id: 'art-craft',
    name: 'Art & Craft',
    subtitle: 'Drawing media, flipcharts, colored cardstock and cutting tools',
    columns: [
      {
        title: 'Presentation & Pads',
        items: [
          { label: 'Plain White Flipchart Pads', href: '/catalog?category=Flipcharts', badge: 'Workshop' },
          { label: 'Ruled Flipchart Paper', href: '/catalog?category=Flipcharts' },
          { label: 'A3 Cartridge Sketchbooks', href: '/catalog?category=Art+%26+Craft' },
          { label: 'Millimeter Graph Sheets', href: '/catalog?category=Ruled+Paper' },
        ],
      },
      {
        title: 'Manila & Cardstock',
        items: [
          { label: 'Assorted Colored Manila Sheets', href: '/catalog?category=Manila+%26+Folders' },
          { label: 'Heavyweight Poster Board', href: '/catalog?category=Manila+%26+Folders' },
          { label: 'Pastel Project Covers', href: '/catalog?category=Manila+%26+Folders' },
          { label: 'Display Cardboard Bundles', href: '/catalog?category=Manila+%26+Folders' },
        ],
      },
      {
        title: 'Cutting & Adhesives',
        items: [
          { label: 'Stainless Steel Paper Scissors', href: '/catalog?category=Office+Supplies' },
          { label: 'Office Glue Sticks & Liquid PVA', href: '/catalog?category=Office+Supplies' },
          { label: 'Clear Adhesive Packing Tape', href: '/catalog?category=Packaging+%26+Cartons' },
          { label: 'Cellophane Rolls & Ribbons', href: '/catalog?category=Packaging+%26+Cartons' },
        ],
      },
      {
        title: 'Classroom Materials',
        items: [
          { label: 'Geometry Stencils & Templates', href: '/catalog?category=School+Stationery' },
          { label: 'Color Crayons & Chalk', href: '/catalog?category=School+Stationery' },
          { label: 'Craft Bahasha Packs', href: '/catalog?category=Bahasha+%26+Envelopes' },
          { label: 'View All Art Supplies', href: '/catalog' },
        ],
      },
    ],
    featured: {
      title: 'Heavyweight Flipchart & Manila Sets',
      subtitle: '50-sheet conference flipchart pads and high-bulk assorted manila sheets.',
      image: '/omega-products/flipchart-catalog.jpeg',
      badge: 'Workshop Grade',
      href: '/catalog?category=Flipcharts',
      ctaText: 'Browse Presentation Pads',
    },
  },
  office: {
    id: 'office',
    name: 'Office',
    subtitle: 'Heavy-duty filing, storage, brown kraft envelopes and desktop tools',
    columns: [
      {
        title: 'Filing & Document Storage',
        items: [
          { label: 'OMEGA PVC Spring Arch Files', href: '/catalog?category=Files+%26+Folders', badge: 'Durable' },
          { label: 'Heavy Board Lever Arch Box Files', href: '/catalog?category=Files+%26+Folders' },
          { label: 'Bright Manila Flat Folders', href: '/catalog?category=Manila+%26+Folders' },
          { label: 'Document Clip Folders', href: '/catalog?category=Files+%26+Folders' },
        ],
      },
      {
        title: 'Kraft Bahasha Envelopes',
        items: [
          { label: 'A3 Heavy Kraft Bahasha', href: '/catalog?category=Bahasha+%26+Envelopes', badge: 'Strong' },
          { label: 'A4 Document Mailing Envelopes', href: '/catalog?category=Bahasha+%26+Envelopes', badge: 'Essential' },
          { label: 'A5 Official Bahasha Envelopes', href: '/catalog?category=Bahasha+%26+Envelopes' },
          { label: 'A6 Commercial Envelopes (Pack of 50)', href: '/catalog?category=Bahasha+%26+Envelopes' },
        ],
      },
      {
        title: 'Desktop Hardware',
        items: [
          { label: 'Heavy-Duty Metal Staplers & Pins', href: '/catalog?category=Office+Supplies' },
          { label: 'Two-Hole Precision Paper Punches', href: '/catalog?category=Office+Supplies' },
          { label: 'Corrugated Carton Shipping Boxes', href: '/catalog?category=Packaging+%26+Cartons' },
          { label: 'Clear & Brown Packaging Tapes', href: '/catalog?category=Packaging+%26+Cartons' },
        ],
      },
      {
        title: 'Institutional Wholesale',
        items: [
          { label: 'Carton Bundle Bulk Deals', href: '/catalog?category=Bulk+%26+Wholesale+Paper' },
          { label: 'Government & Tender Invoices', href: '/contact' },
          { label: 'Official OMEGA Registry Books', href: '/catalog?category=Registers' },
          { label: 'Request Corporate Quotation', href: '/contact' },
        ],
      },
    ],
    featured: {
      title: 'OMEGA Heavy-Duty PVC Spring File',
      subtitle: 'Steel spring mechanism and waterproof PVC binding for archival filing.',
      image: '/omega-products/omega-pvc-spring-file.jpeg',
      badge: 'Archive Standard',
      href: '/catalog?category=Files+%26+Folders',
      ctaText: 'Shop Office Filing',
    },
  },
  'school-kits': {
    id: 'school-kits',
    name: 'School Kits',
    subtitle: 'Comprehensive student bundles and semester stationery packages',
    columns: [
      {
        title: 'Primary School Level',
        items: [
          { label: '32-Page Single Line Starter Packs', href: '/catalog?category=Exercise+Books' },
          { label: 'Double Line Handwriting Books', href: '/catalog?category=Exercise+Books' },
          { label: 'Square Grid Counting Books', href: '/catalog?category=Exercise+Books' },
          { label: 'Pencil, Ruler & Eraser Kits', href: '/catalog?category=School+Stationery' },
        ],
      },
      {
        title: 'Secondary & High School',
        items: [
          { label: 'OMEGA 2-Quire & 3-Quire Counter Books', href: '/catalog?category=Counter+Books', badge: 'Required' },
          { label: 'Oxford Geometry Mathematical Sets', href: '/catalog?category=School+Stationery' },
          { label: 'Science Practical Lab Ruled Paper', href: '/catalog?category=Ruled+Paper' },
          { label: 'Ballpoint Pens Box of 50', href: '/catalog?category=School+Stationery' },
        ],
      },
      {
        title: 'College & University',
        items: [
          { label: 'OMEGA 4-Quire Hardcover Folio (384p)', href: '/catalog?category=Counter+Books&quire=4+Quire' },
          { label: 'A4 Examination Ruled Paper Reams', href: '/catalog?category=Ruled+Paper' },
          { label: 'Kraft Bahasha Document Portfolios', href: '/catalog?category=Bahasha+%26+Envelopes' },
          { label: 'Executive Presentation Files', href: '/catalog?category=Files+%26+Folders' },
        ],
      },
      {
        title: 'School Wholesale Packs',
        items: [
          { label: 'Cartons of Exercise Books (100 Books)', href: '/catalog?category=Bulk+%26+Wholesale+Paper', badge: 'Wholesale' },
          { label: 'Full Class Supply Kits', href: '/contact' },
          { label: 'Custom Stamped School Badges', href: '/contact' },
          { label: 'School Term Discounts', href: '/catalog' },
        ],
      },
    ],
    featured: {
      title: 'Complete Student Semester Bundle',
      subtitle: 'Counter books, Oxford geometry tin, and Kraft bahasha envelopes.',
      image: '/omega-products/exercise-book-200p-purple.jpeg',
      badge: 'Bundle Deal',
      href: '/catalog?category=School+Stationery',
      ctaText: 'Explore School Kits',
    },
  },
  books: {
    id: 'books',
    name: 'Books',
    subtitle: 'Classic counter books, registers, exercise books and ruled volumes',
    columns: [
      {
        title: 'Hardcover Series',
        items: [
          { label: '2-Quire (192 Pages)', href: '/catalog?category=Counter+Books&quire=2+Quire' },
          { label: '3-Quire (288 Pages)', href: '/catalog?category=Counter+Books&quire=3+Quire' },
          { label: '4-Quire (384 Pages)', href: '/catalog?category=Counter+Books&quire=4+Quire' },
          { label: 'Master Registry Folio', href: '/catalog?category=Counter+Books' },
        ],
      },
      {
        title: 'Softcover & Exercise',
        items: [
          { label: '200 Pages Single Line Ruled', href: '/catalog?category=Exercise+Books' },
          { label: '100 Pages Single Line', href: '/catalog?category=Exercise+Books' },
          { label: '80 Pages Intermediate', href: '/catalog?category=Exercise+Books' },
          { label: '32 Pages Junior Notebooks', href: '/catalog?category=Exercise+Books' },
        ],
      },
      {
        title: 'Ruling Formats',
        items: [
          { label: 'Standard Indigo Feint Ruled', href: '/catalog?category=Counter+Books' },
          { label: 'Square Grid Mathematics', href: '/catalog?category=Exercise+Books' },
          { label: 'Handwriting Double Line', href: '/catalog?category=Exercise+Books' },
          { label: 'Plain Unruled Drawing', href: '/catalog?category=Exercise+Books' },
        ],
      },
      {
        title: 'Paper Quality',
        items: [
          { label: 'High-GSM Bleed-Proof', href: '/catalog' },
          { label: 'Scratch-Proof Stiff Board', href: '/catalog' },
          { label: 'Thread-Sewn Heavy Spine', href: '/catalog' },
          { label: 'View Full Catalog', href: '/catalog' },
        ],
      },
    ],
    featured: {
      title: 'OMEGA 4-Quire Master Hardcover (384p)',
      subtitle: 'The ultimate heavy-duty accounting and records book for demanding archival use.',
      image: '/omega-products/counter-book-q4-384p.jpeg',
      badge: 'Maximum Capacity',
      href: '/catalog?category=Counter+Books&quire=4+Quire',
      ctaText: 'Shop 4-Quire Master',
    },
  },
  offers: {
    id: 'offers',
    name: 'Offers',
    badge: 'SALE',
    subtitle: 'Limited wholesale carton pricing, bulk discounts and clearance specials',
    columns: [
      {
        title: 'Special Deals',
        items: [
          { label: 'Counter Books Carton Bundle', href: '/catalog?category=Counter+Books', badge: 'Save 15%' },
          { label: 'Exercise Books Ream Packs', href: '/catalog?category=Exercise+Books', badge: 'Save 20%' },
          { label: 'Kraft Bahasha Wholesale Carton', href: '/catalog?category=Bahasha+%26+Envelopes' },
          { label: 'Oxford Math Set Multipack', href: '/catalog?category=School+Stationery' },
        ],
      },
      {
        title: 'Wholesale Tiers',
        items: [
          { label: 'Tier 1: 5–10 Cartons (Save 8%)', href: '/catalog' },
          { label: 'Tier 2: 11–25 Cartons (Save 12%)', href: '/catalog' },
          { label: 'Tier 3: 26+ Cartons (Custom Quote)', href: '/contact' },
          { label: 'Institutional School Supply', href: '/contact' },
        ],
      },
      {
        title: 'Delivery Incentives',
        items: [
          { label: 'Free Dar Delivery (Over TSh 250k)', href: '/catalog', badge: 'Free' },
          { label: 'Same-Day Kariakoo Dispatch', href: '/contact' },
          { label: 'Bus Cargo Station Parcel Service', href: '/contact' },
          { label: 'Track Active Parcel', href: '/catalog' },
        ],
      },
      {
        title: 'Direct Factory & Branch Contacts',
        items: [
          { label: 'KANTI BHAI K. HALAI (Co-Founder & MD): +255 715 268 391', href: 'https://wa.me/255715268391' },
          { label: 'VIJESH K. HALAI (Co-Founder & MD): +255 624 265 480', href: 'https://wa.me/255624265480' },
          { label: 'Mbeya Branch: +255 746 268 391', href: 'https://wa.me/255746268391' },
          { label: 'Mwanza Branch: +255 699 032 777', href: 'https://wa.me/255699032777' },
          { label: 'Download Full Price Sheet (Excel)', href: '/sheet/Indigo_Printed_Price_List.xlsx' },
        ],
      },
    ],
    featured: {
      title: 'Carton Box Wholesale Bundles',
      subtitle: 'Original OMEGA factory packaging. Buy by the carton for maximum profit margin.',
      image: '/omega-products/omega-carton-box-branded.jpeg',
      badge: 'Factory Wholesale',
      href: '/catalog',
      ctaText: 'Claim Wholesale Pricing',
    },
  },
};

interface MegaMenuProps {
  activeId: string | null;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ activeId, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!activeId || !MEGA_MENU_DATA[activeId]) {
    return null;
  }

  const category = MEGA_MENU_DATA[activeId];

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={`${category.name} Menu`}
      className="absolute top-full left-0 w-full bg-[#fafafa] text-[#14182B] border-b border-[#e2dedb] shadow-boutique-soft z-40 transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-1"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Top subtle category banner */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#e2dedb]">
          <div className="flex items-center gap-3">
            <span className="font-heading text-lg font-bold text-[#4b423b]">
              {category.name}
            </span>
            {category.badge && (
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#c49b7c] text-[#4b423b]">
                {category.badge}
              </span>
            )}
            <span className="hidden sm:inline text-xs text-[#6B7280]">
              — {category.subtitle}
            </span>
          </div>

          <Link
            to={`/catalog${activeId === 'offers' ? '' : `?category=${encodeURIComponent(category.name)}`}`}
            onClick={onClose}
            className="text-xs font-semibold text-[#4b423b] hover:text-[#c49b7c] inline-flex items-center gap-1 transition-colors group focus-ring-gold rounded-sm px-1"
          >
            <span>View all in {category.name}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Subcategory Columns + 1 Featured Card (5 Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {category.columns.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4b423b] border-b border-[#e2dedb]/60 pb-1.5">
                {col.title}
              </h4>
              <ul className="space-y-2 text-[13px]">
                {col.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className="group flex items-center justify-between text-[#6B7280] hover:text-[#4b423b] py-1 transition-colors focus-ring-gold rounded-sm"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#c49b7c]/20 text-[#4b423b]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 5th Column: Featured Boutique Card */}
          <div className="bg-white rounded-[12px] p-4 border border-[#e2dedb] flex flex-col justify-between shadow-xs hover:border-[#c49b7c] transition-all group">
            <div>
              <div className="relative aspect-4/3 rounded-[8px] overflow-hidden bg-[#fafafa] mb-3">
                <img
                  src={category.featured.image}
                  alt={category.featured.title}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#4b423b] text-[#fafafa]">
                  {category.featured.badge}
                </span>
              </div>
              <h5 className="font-heading font-bold text-sm text-[#14182B] group-hover:text-[#4b423b] transition-colors leading-snug">
                {category.featured.title}
              </h5>
              <p className="text-xs text-[#6B7280] mt-1 line-clamp-2 leading-relaxed">
                {category.featured.subtitle}
              </p>
            </div>

            <Link
              to={category.featured.href}
              onClick={onClose}
              className="mt-3 inline-flex items-center justify-between w-full px-3.5 py-2 text-xs font-bold rounded-[10px] btn-ledup-copper transition-all group"
            >
              <span>{category.featured.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 ledup-arrow-icon" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
