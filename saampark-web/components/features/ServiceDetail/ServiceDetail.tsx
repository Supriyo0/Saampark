'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, X, ArrowLeft, Heart, ShoppingBag, Shield, Clock, MessageCircle } from 'lucide-react';
import { type Service, CONTACT } from '@/lib/data/services';
import { useCommerceStore } from '@/lib/store/cartStore';
import { useUIStore } from '@/lib/store/uiStore';
import styles from './ServiceDetail.module.css';

const getPortfolioImages = (category: string) => {
  const webPics = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=500&auto=format&fit=crop&q=60',
  ];

  const appPics = [
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1533228896864-cf3b91a27e7a?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=500&auto=format&fit=crop&q=60',
  ];

  const softPics = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1535303311164-664fc9ec6532?w=500&auto=format&fit=crop&q=60',
  ];

  const adsPics = [
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1506719040498-e7022a7f8436?w=500&auto=format&fit=crop&q=60',
  ];

  const videoPics = [
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1598897689888-3485d46059c5?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=500&auto=format&fit=crop&q=60',
  ];

  const legalPics = [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60',
  ];

  if (category === 'app') return appPics;
  if (category === 'software') return softPics;
  if (['social-media', 'meta-ads', 'google-ads', 'google-business'].includes(category)) return adsPics;
  if (category === 'video-ai') return videoPics;
  if (category === 'business-legal') return legalPics;
  return webPics;
};

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

          {/* Portfolio Showcase Grid (10 Pictures) */}
          <div className={styles.portfolioSection}>
            <div className={styles.portfolioHeader}>
              <h2 className={styles.portfolioTitle}>📸 Recent Work & Portfolio Mockups</h2>
              <p className={styles.portfolioDesc}>Explore 10 curated preview templates, live dashboards, and project screenshots delivered in this category.</p>
            </div>
            <div className={styles.portfolioGrid}>
              {getPortfolioImages(service.category).map((url, idx) => (
                <div key={idx} className={styles.portfolioItem}>
                  <Image
                    src={url}
                    alt={`Portfolio item ${idx + 1}`}
                    width={320}
                    height={200}
                    className={styles.portfolioImg}
                  />
                  <span className={styles.portfolioBadge}>Template {idx + 1}</span>
                </div>
              ))}
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
