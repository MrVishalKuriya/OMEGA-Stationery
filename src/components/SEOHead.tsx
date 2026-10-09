import React, { useEffect } from 'react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';

interface SEOHeadProps {
  title: string;
  description: string;
  product?: Product;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ title, description, product }) => {
  const { storeConfig } = useStore();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const fullTitle = `${title} | ${storeConfig.businessName}`;
    document.title = fullTitle;

    const updateMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute('content', content);
      }
    };

    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', fullTitle);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[name="twitter:title"]', fullTitle);
    updateMeta('meta[name="twitter:description"]', description);

    // Handle Product JSON-LD script
    const existingScript = document.getElementById('dynamic-product-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (product) {
      const script = document.createElement('script');
      script.id = 'dynamic-product-jsonld';
      script.type = 'application/ld+json';
      const effectivePrice =
        product.discountPrice && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;
      const availabilityMap: Record<string, string> = {
        'In Stock': 'https://schema.org/InStock',
        'Low Stock': 'https://schema.org/LimitedAvailability',
        'Out of Stock': 'https://schema.org/OutOfStock',
      };
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        sku: product.sku,
        category: product.category,
        description: product.description,
        image: typeof window !== 'undefined' ? window.location.origin + product.image : product.image,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: effectivePrice,
          availability: availabilityMap[product.stockStatus] || 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: storeConfig.businessName,
          },
        },
      });
      document.head.appendChild(script);
    }

    return () => {
      const scriptToClean = document.getElementById('dynamic-product-jsonld');
      if (scriptToClean) {
        scriptToClean.remove();
      }
    };
  }, [title, description, product, storeConfig.businessName]);

  return null;
};
