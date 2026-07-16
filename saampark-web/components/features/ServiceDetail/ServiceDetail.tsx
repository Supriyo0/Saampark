'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, X, ArrowLeft, Heart, ShoppingBag, Shield, Clock, MessageCircle } from 'lucide-react';
import { type Service, CONTACT } from '@/lib/data/services';
import { useCommerceStore } from '@/lib/store/cartStore';
import { useUIStore } from '@/lib/store/uiStore';
import styles from './ServiceDetail.module.css';

interface Props {
  service: Service;
}

export function ServiceDetail({ service }: Props) {
  const [qty, setQty] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  
  const { cart, addToCart, wishlistIds, toggleWishlist } = useCommerceStore();
  const { openCart } = useUIStore();
  
  const isWishlisted = wishlistIds.includes(service.id);
  const isInCart = cart.some(c => c.serviceId === service.id);

  // For sticky purchase panel
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (isInCart) {
      openCart();
      return;
    }
    addToCart({
      serviceId: service.id,
      serviceName: service.name,
      price: service.startingPrice,
      quantity: qty
    });
    openCart();
  };

  const handleWA = () => {
    const msg = `Hello Saampark,\n\nI am interested in: *${service.name}*\n\nPlease share more details.`;
    const phone = service.entity === 'str' ? '919091518567' : '918170082678';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'Get a Custom Quote';
    const num = `₹${price.toLocaleString('en-IN')}`;
    return service.priceType === 'monthly' ? `${num} / month` : 
           service.priceType === 'weekly' ? `${num} / week` : num;
  };

  return (
    <div className={styles.wrapper}>
      {/* ── Breadcrumb ── */}
      <div className="container">
        <Link href="/marketplace" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>
      </div>

      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.badges}>
                <span className={`badge ${service.entity === 'str' ? 'badge-str' : 'badge-scs'}`}>
                  {service.entity === 'str' ? 'Technology' : 'Consultancy'}
                </span>
                {service.badge && <span className="badge badge-warning">{service.badge}</span>}
              </div>
              
              <h1 className={styles.title}>{service.name}</h1>
              <p className={styles.desc}>{service.description}</p>
              
              <div className={styles.meta}>
                {service.deliveryDays && (
                  <div className={styles.metaItem}>
                    <Clock size={16} /> Delivery in {service.deliveryDays} days
                  </div>
                )}
                <div className={styles.metaItem}>
                  <Shield size={16} /> ISO 9001:2015 Certified Quality
                </div>
              </div>
            </div>

            <div className={styles.heroCard}>
              <div className={styles.heroIcon} style={{ color: service.color, background: `${service.color}15` }}>
                {service.entity === 'str' ? '💻' : '📊'}
              </div>
              <div className={styles.priceWrap}>
                <div className={styles.priceLabel}>Starting Price</div>
                <div className={styles.price}>{formatPrice(service.startingPrice)}</div>
                {service.startingPrice && <div className={styles.priceSub}>Taxes as applicable. No hidden fees.</div>}
              </div>
              
              <div className={styles.actions}>
                <button className="btn btn-primary btn-lg" onClick={handleAddToCart} style={{ width: '100%', justifyContent: 'center' }}>
                  {isInCart ? 'View in Cart' : 'Add to Cart'} <ShoppingBag size={18} />
                </button>
                <button className={`btn btn-lg ${styles.waBtn}`} onClick={handleWA} style={{ width: '100%', justifyContent: 'center' }}>
                  <MessageCircle size={18} /> Ask on WhatsApp
                </button>
              </div>

              <div className={styles.trust}>
                Secure digital transaction • Direct expert support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Details Section ── */}
      <section className={styles.details}>
        <div className="container">
          <div className={styles.detailsGrid}>
            
            {/* Features list */}
            <div className={styles.features}>
              <h2 className={styles.sectionTitle}>What's Included</h2>
              <div className={styles.featureList}>
                {service.features.map((f, i) => (
                  <div key={i} className={styles.featureItem}>
                    <div className={styles.featureCheck} style={{ color: service.color, background: `${service.color}15` }}>
                      <Check size={16} />
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {service.notIncluded && service.notIncluded.length > 0 && (
                <>
                  <h2 className={styles.sectionTitle} style={{ marginTop: 40 }}>Not Included</h2>
                  <div className={styles.featureList}>
                    {service.notIncluded.map((f, i) => (
                      <div key={i} className={styles.featureItem}>
                        <div className={styles.featureCheck} style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)' }}>
                          <X size={16} />
                        </div>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar info */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarBox}>
                <h3 className={styles.boxTitle}>Have Questions?</h3>
                <p className={styles.boxText}>Our experts are ready to assist you.</p>
                <a href={service.entity === 'str' ? CONTACT.str.tel1 : CONTACT.scs.tel} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Call {service.entity === 'str' ? 'STR' : 'SCS'} Support
                </a>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── Sticky Bottom Panel ── */}
      <div className={`${styles.stickyPanel} ${scrolled ? styles.stickyVisible : ''}`}>
        <div className={`container ${styles.stickyInner}`}>
          <div className={styles.stickyInfo}>
            <div className={styles.stickyTitle}>{service.name}</div>
            <div className={styles.stickyPrice}>{formatPrice(service.startingPrice)}</div>
          </div>
          <div className={styles.stickyActions}>
            <button 
              className={`btn btn-icon btn-ghost ${isWishlisted ? styles.wishlisted : ''}`}
              onClick={() => toggleWishlist(service.id)}
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button className="btn btn-primary" onClick={handleAddToCart}>
              {isInCart ? 'View Cart' : 'Add to Cart'} <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
