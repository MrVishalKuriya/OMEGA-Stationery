import React from 'react';

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * Custom-crafted SVG Icons tailored specifically for OMEGA Stationery
 * adhering to the brand colors (Obsidian Black #111113 & Crimson Red #dc2626)
 */

// 1. Counter Book / Smyth-Sewn Ledger Icon
export const IconCounterBook: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M7 3V21" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="10" y1="7" x2="17" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="5" cy="7" r="0.75" fill="#dc2626" />
    <circle cx="5" cy="12" r="0.75" fill="#dc2626" />
    <circle cx="5" cy="17" r="0.75" fill="#dc2626" />
  </svg>
);

// 2. School Exercise Book Icon
export const IconExerciseBook: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <rect x="4" y="2.5" width="16" height="19" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="7" y="5.5" width="10" height="4.5" rx="1" fill="#dc2626" fillOpacity="0.12" stroke="#dc2626" strokeWidth="1.2" />
    <line x1="8.5" y1="7.7" x2="15.5" y2="7.7" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="7" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="7" y1="16" x2="17" y2="16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="7" y1="19" x2="14" y2="19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M4 8.5H5.5M4 15.5H5.5" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 3. Stiff Cover Geometric Notebook Icon
export const IconStiffCover: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <path d="M4 4.5L12 2L20 4.5V19.5L12 22L4 19.5V4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 2V22" stroke="#dc2626" strokeWidth="1.8" />
    <path d="M4 9.5L12 7L20 9.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M4 14.5L12 12L20 14.5" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="12" cy="12" r="2" fill="#dc2626" />
  </svg>
);

// 4. Heavy Kraft Bahasha & Envelope Icon
export const IconKraftBahasha: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 5.5L12 13L21 5.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 18.5L9 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M21 18.5L15 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <rect x="9.5" y="10.5" width="5" height="3" rx="0.5" fill="#dc2626" fillOpacity="0.2" stroke="#dc2626" strokeWidth="1" />
  </svg>
);

// 5. Manila File & Folders Icon
export const IconManilaFolder: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <path d="M3 6.5C3 5.4 3.9 4.5 5 4.5H9.5L11.5 6.5H19C20.1 6.5 21 7.4 21 8.5V18.5C21 19.6 20.1 20.5 19 20.5H5C3.9 20.5 3 19.6 3 18.5V6.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M3 10H21" stroke="#dc2626" strokeWidth="1.6" />
    <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="8" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// 6. Wholesale Carton Box Icon (Flipkart B2B style)
export const IconWholesaleCarton: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <path d="M12 2.5L21 7.5V16.5L12 21.5L3 16.5V7.5L12 2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 2.5V21.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 7.5L12 12.5L21 7.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M7.5 5L16.5 10" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
    <path d="M7.5 14L10 15.5V18.5" stroke="#dc2626" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

// 7. School Tenders / Institutional Icon
export const IconSchoolTender: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M6 10.5V16.5C6 18 8.7 20 12 20C15.3 20 18 18 18 16.5V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M22 8V15" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="22" cy="16.5" r="1.5" fill="#dc2626" />
  </svg>
);

// 8. 70 GSM Bleed-Proof Paper Icon
export const IconBleedProofPaper: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 8H15M9 12H15M9 16H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M18 14C18 16.5 15.5 18 15.5 18C15.5 18 13 16.5 13 14C13 12.6 14.1 11.5 15.5 10C16.9 11.5 18 12.6 18 14Z" fill="#dc2626" stroke="#b91c1c" strokeWidth="1" />
  </svg>
);

// 9. 180° Lay-Flat Smyth-Sewn Thread Icon
export const IconLayFlatSpine: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <path d="M2 17C4.5 16 8 16 12 17.5C16 16 19.5 16 22 17V6.5C19.5 5.5 16 5.5 12 7C8 5.5 4.5 5.5 2 6.5V17Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 7V17.5" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
    <line x1="7" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="14" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M10 14L12 14.5L14 14" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 10. 1.8mm Laminated Hardcover Shield Icon
export const IconLaminatedHardcover: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <path d="M12 2.5L20 5.5V11.5C20 16.5 16.5 20.8 12 22C7.5 20.8 4 16.5 4 11.5V5.5L12 2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 7V17.5" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
    <path d="M8.5 12H15.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1.5" fill="#dc2626" />
  </svg>
);

// 11. Precision 8mm NECTA Indigo Ruling Icon
export const IconPrecisionRuling: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 3V21" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
    <path d="M3 12H21" stroke="#dc2626" strokeWidth="1.6" />
    <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="6" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2.5" fill="#dc2626" />
  </svg>
);

// 12. 31 Regions Nationwide Bus & Cargo Delivery Icon
export const IconNationwideBus: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <rect x="2.5" y="5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <line x1="2.5" y1="11" x2="21.5" y2="11" stroke="#dc2626" strokeWidth="1.6" />
    <line x1="7.5" y1="5" x2="7.5" y2="11" stroke="currentColor" strokeWidth="1.4" />
    <line x1="12.5" y1="5" x2="12.5" y2="11" stroke="currentColor" strokeWidth="1.4" />
    <line x1="17.5" y1="5" x2="17.5" y2="11" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="6.5" cy="18" r="1.8" fill="#111113" stroke="#dc2626" strokeWidth="1.4" />
    <circle cx="17.5" cy="18" r="1.8" fill="#111113" stroke="#dc2626" strokeWidth="1.4" />
    <path d="M2.5 18H4.7 M8.3 18H15.7 M19.3 18H21.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

// 13. Lightning Deal / Flash Countdown Icon
export const IconLightningDeal: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <path d="M13 2.5L4 13.5H11L10 21.5L20 10.5H13L14.5 2.5H13Z" fill="#dc2626" stroke="#b91c1c" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

// 14. 100% Genuine Guaranteed Rosette Seal Icon
export const IconQualitySeal: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="6.8" stroke="#dc2626" strokeWidth="1.4" strokeDasharray="2 2" />
    <path d="M8.5 12L11 14.5L15.5 9.5" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 15. Direct Factory WhatsApp Icon
export const IconWhatsAppCustom: React.FC<CustomIconProps> = ({ className = 'w-6 h-6', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="#25D366" fillOpacity="0.15" stroke="#25D366" strokeWidth="1.8" />
    <path
      d="M17.5 14.5C17.2 14.3 15.7 13.6 15.4 13.5C15.1 13.4 14.9 13.4 14.7 13.7C14.5 14 13.9 14.7 13.7 14.9C13.5 15.1 13.3 15.1 13 15C12.7 14.9 11.8 14.6 10.7 13.6C9.8 12.8 9.2 11.9 9.1 11.6C9 11.3 9.1 11.1 9.2 11C9.3 10.9 9.5 10.7 9.6 10.5C9.7 10.4 9.8 10.3 9.9 10.1C10 9.9 10 9.8 9.9 9.6C9.8 9.4 9.3 8.1 9.1 7.6C8.9 7.1 8.7 7.2 8.5 7.2C8.3 7.2 8.1 7.2 7.9 7.2C7.7 7.2 7.4 7.3 7.1 7.6C6.8 7.9 6.1 8.6 6.1 10C6.1 11.4 7.1 12.8 7.3 13C7.5 13.2 9.3 16 12.1 17.2C14.9 18.4 14.9 18 15.4 18C15.9 18 17 17.4 17.2 16.8C17.4 16.2 17.4 15.7 17.3 15.6C17.2 15.5 17.8 14.7 17.5 14.5Z"
      fill="#25D366"
    />
  </svg>
);
