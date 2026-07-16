'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart, ShoppingBag, Check, Eye } from 'lucide-react';
import { allServices } from '@/lib/data/services';
import { useCommerceStore } from '@/lib/store/cartStore';
import { useUIStore } from '@/lib/store/uiStore';
import { PromoCarousel } from '../PromoCarousel/PromoCarousel';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader/SkeletonLoader';
import styles from './MarketplaceHome.module.css';

const SECTION_GROUPS = [
  {
    id: 'web',
    title: '🌐 Web Engineering Services',
    description: 'ISO 9001:2015 certified responsive static, dynamic, and full e-commerce websites engineered by Saampark Technology & Research (STR) Division.',
    categories: ['website'],
  },
  {
    id: 'app',
    title: '📱 Mobile Application Development',
    description: 'Custom iOS, Android, and cross-platform hybrid applications built using Flutter, Kotlin, Swift and published to Google Play & Apple App Stores.',
    categories: ['app'],
  },
  {
    id: 'software',
    title: '⚙️ Enterprise Software & CRM Solutions',
    description: 'Comprehensive ERP portals, billing engines, CRM clients, and custom database management softwares to automate company operations.',
    categories: ['software'],
  },
  {
    id: 'specialized',
    title: '🚀 Industry-Specialized Web Systems',
    description: 'Tailored school portals, hospital records management, hotel reservation booking, restaurant ordering, and real-estate listings.',
    categories: ['specialized-website'],
  },
  {
    id: 'ads',
    title: '📢 Digital Ads Campaigns & Local SEO',
    description: 'Managed Meta (Facebook, Instagram) and Google Search keywords advertising to generate immediate high-converting local customer leads.',
    categories: ['social-media', 'meta-ads', 'google-ads', 'google-business'],
  },
  {
    id: 'video',
    title: '🤖 Video Production & AI Animation',
    description: 'Premium slideshow ads, animated cartoon explainer videos, social reels, and fully automated voiceover AI marketing videos.',
    categories: ['video-ai'],
  },
  {
    id: 'legal',
    title: '💼 Company Registrations & Compliance',
    description: 'Hassle-free Private Limited company incorporation, GST registration, MSME Udyam filings, and professional tax compliance support.',
    categories: ['business-legal'],
  },
];

export function MarketplaceHome() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--color-text-tertiary)' }}>Loading catalog...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [loading, setLoading] = useState(false);

  const { wishlistIds, toggleWishlist, compareIds, toggleCompare, addToCart, cart } = useCommerceStore();
  const { openCart, openCompare } = useUIStore();

  // Sync search state with URL query parameters in real-time
  useEffect(() => {
    const querySearch = searchParams.get('search');
    setSearch(querySearch || '');
  }, [searchParams]);

  // Trigger loading shimmer on search/sort queries
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, [search, sort]);

  const filteredServices = useMemo(() => {
    let result = allServices;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    
    // sorting
    return [...result].sort((a, b) => {
      if (sort === 'price-asc') {
        const pA = a.startingPrice || 999999;
        const pB = b.startingPrice || 999999;
        return pA - pB;
      }
      if (sort === 'price-desc') {
        const pA = a.startingPrice || -1;
        const pB = b.startingPrice || -1;
        return pB - pA;
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [search, sort]);

  const getDeterministicRating = (id: string) => {
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rating = (4.5 + (sum % 5) * 0.1).toFixed(1);
    const reviews = 12 + (sum % 80);
    return { rating, reviews };
  };

  const getOriginalPrice = (price: number | null) => {
    if (!price) return null;
    return Math.round(price * 1.25); // 25% original price markup
  };

  const formatPrice = (price: number | null, type: string) => {
    if (!price) return 'Get a Quote';
    return `₹${price.toLocaleString('en-IN')}${type === 'monthly' ? '/mo' : type === 'weekly' ? '/wk' : ''}`;
  };

  const handleAddToCart = (e: React.MouseEvent, svc: any) => {
    e.preventDefault();
    const isInCart = cart.some(c => c.serviceId === svc.id);
    if (isInCart) {
      openCart();
      return;
    }
    addToCart({
      serviceId: svc.id,
      serviceName: svc.name,
      price: svc.startingPrice,
      quantity: 1
    });
    openCart();
  };

  const handleClearFilters = () => {
    setSearch('');
    router.push('/');
  };

  const handleCompareClick = (id: string) => {
    toggleCompare(id);
    openCompare();
  };

  // Helper to render a service card
  const renderCard = (svc: any) => {
    const isWishlisted = wishlistIds.includes(svc.id);
    const isCompared = compareIds.includes(svc.id);
    const isInCart = cart.some(c => c.serviceId === svc.id);
    const { rating, reviews } = getDeterministicRating(svc.id);
    const originalPrice = getOriginalPrice(svc.startingPrice);

    return (
      <div key={svc.id} className={styles.card}>
        <Link href={svc.href} className={styles.cardLink}>
          <div className={styles.imageWrap}>
            <Image 
              src={svc.image || '/assets/images/website-dev.jpg'} 
              alt={svc.name} 
              width={300} 
              height={180} 
              className={styles.thumbnail}
            />
            
            <button 
              className={`${styles.wishBtn} ${isWishlisted ? styles.wishlisted : ''}`}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(svc.id); }}
              aria-label="Wishlist"
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>

            <span className={`${styles.entityBadge} ${svc.entity === 'str' ? styles.badgeStr : styles.badgeScs}`}>
              {svc.entity.toUpperCase()}
            </span>
          </div>
          
          <div className={styles.cardBody}>
            {/* Star Ratings Row */}
            <div className={styles.ratingRow}>
              <span className={styles.stars}>★ {rating}</span>
              <span className={styles.reviews}>({reviews} reviews)</span>
            </div>

            <h3 className={styles.cardTitle}>{svc.name}</h3>
            <p className={styles.cardDesc}>{svc.description}</p>
            
            <div className={styles.priceRow}>
              <div className={styles.priceCol}>
                {originalPrice && (
                  <span className={styles.originalPrice}>
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className={styles.price}>{formatPrice(svc.startingPrice, svc.priceType)}</span>
              </div>
              {svc.deliveryDays && <span className={styles.delivery}>⚡ {svc.deliveryDays}d</span>}
            </div>
          </div>
        </Link>
        
        <div className={styles.cardActions}>
          <button 
            onClick={(e) => handleAddToCart(e, svc)}
            className={`btn btn-sm ${isInCart ? 'btn-secondary' : 'btn-primary'}`}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {isInCart ? <Check size={14} /> : <ShoppingBag size={14} />}
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
          
          <label className={styles.compareCheck}>
            <input 
              type="checkbox" 
              checked={isCompared}
              onChange={() => handleCompareClick(svc.id)} 
            />
            <span className={styles.compareLabel}>Compare</span>
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.marketplace}>
      <div className={`container ${styles.layout}`}>
        {/* Main Content (covers full page width) */}
        <main className={styles.main}>
          {/* Flipkart/Myntra style sliding offer banner carousel */}
          <PromoCarousel />

          <div className={styles.resultsHeader}>
            <p className={styles.resultsCount}>Showing <strong>{filteredServices.length}</strong> services</p>
            <div className={styles.sortWrapDesktop}>
              <span className={styles.sortLabel}>Sort by:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className={styles.sortSelect}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <SkeletonLoader count={10} />
          ) : search ? (
            /* Search Results Flat Grid */
            <div className={styles.grid}>
              {filteredServices.map(svc => renderCard(svc))}
            </div>
          ) : (
            /* Structured Grouped Catalog Sections */
            <div className={styles.sectionsContainer}>
              {SECTION_GROUPS.map(group => {
                const groupServices = filteredServices.filter(svc => group.categories.includes(svc.category));
                if (groupServices.length === 0) return null;

                return (
                  <section key={group.id} className={styles.catalogSection}>
                    <div className={styles.sectionHeadingWrap}>
                      <h2 className={styles.sectionHeading}>{group.title}</h2>
                      <p className={styles.sectionHeadingDesc}>{group.description}</p>
                    </div>
                    <div className={styles.grid}>
                      {groupServices.map(svc => renderCard(svc))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
          
          {!loading && filteredServices.length === 0 && (
            <div className={styles.emptyState}>
              <h3>No services found</h3>
              <p>Try adjusting your search query.</p>
              <button className="btn btn-secondary" onClick={handleClearFilters}>
                Clear Search
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
