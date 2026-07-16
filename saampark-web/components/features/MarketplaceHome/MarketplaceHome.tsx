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
import styles from './MarketplaceHome.module.css';

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

  const { wishlistIds, toggleWishlist, compareIds, toggleCompare, addToCart, cart } = useCommerceStore();
  const { openCart } = useUIStore();

  // Sync search state with URL query parameters in real-time
  useEffect(() => {
    const querySearch = searchParams.get('search');
    setSearch(querySearch || '');
  }, [searchParams]);

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

  return (
    <div className={styles.marketplace}>
      <div className={styles.layout}>
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

          <div className={styles.grid}>
            {filteredServices.map(svc => {
              const isWishlisted = wishlistIds.includes(svc.id);
              const isCompared = compareIds.includes(svc.id);
              const isInCart = cart.some(c => c.serviceId === svc.id);
              
              return (
                <div key={svc.id} className={styles.card}>
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
                      onClick={() => toggleWishlist(svc.id)}
                      aria-label="Wishlist"
                    >
                      <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>

                    <span className={`${styles.entityBadge} ${svc.entity === 'str' ? styles.badgeStr : styles.badgeScs}`}>
                      {svc.entity.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{svc.name}</h3>
                    <p className={styles.cardDesc}>{svc.description}</p>
                    
                    <div className={styles.priceRow}>
                      <span className={styles.price}>{formatPrice(svc.startingPrice, svc.priceType)}</span>
                      {svc.deliveryDays && <span className={styles.delivery}>⚡ {svc.deliveryDays}d</span>}
                    </div>
                  </div>
                  
                  <div className={styles.cardActions}>
                    <button 
                      onClick={(e) => handleAddToCart(e, svc)}
                      className={`btn btn-sm ${isInCart ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      {isInCart ? <Check size={14} /> : <ShoppingBag size={14} />}
                      {isInCart ? 'In Cart' : 'Add to Cart'}
                    </button>
                    
                    <Link href={svc.href} className="btn btn-ghost btn-sm" style={{ padding: 8 }}>
                      <Eye size={16} />
                    </Link>

                    <label className={styles.compareCheck}>
                      <input 
                        type="checkbox" 
                        checked={isCompared}
                        onChange={() => toggleCompare(svc.id)} 
                      />
                      <span className={styles.compareLabel}>Compare</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredServices.length === 0 && (
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
