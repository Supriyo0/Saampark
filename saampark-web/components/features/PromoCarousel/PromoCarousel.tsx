'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, Rocket, Megaphone, ShieldAlert, Smartphone } from 'lucide-react';
import styles from './PromoCarousel.module.css';

interface Slide {
  title: string;
  highlight: string;
  subtitle: string;
  badge: string;
  badgeIcon: React.ComponentType<{ size?: number }>;
  href: string;
  image: string;
  gradient: string;
}

const SLIDES: Slide[] = [
  {
    title: 'Web Engineering Special',
    highlight: 'One Page Website at ₹1,499! (Save 25%)',
    subtitle: 'Fully responsive, modern portfolio layout. Essential SEO and social links included. Start online today!',
    badge: '⚡ Special Offer',
    badgeIcon: Rocket,
    href: '/technology/web-development/one-page-website',
    image: '/assets/images/website-dev.jpg',
    gradient: 'linear-gradient(135deg, rgba(0, 180, 166, 0.08) 0%, rgba(30, 144, 255, 0.08) 100%)',
  },
  {
    title: 'Local Ads Launch Deal',
    highlight: 'Meta & Google Ads Trial at ₹499/wk!',
    subtitle: 'Target 1,000,000+ local customers, increase leads, and boost impressions. Weekly campaign report.',
    badge: '🔥 Highly Popular',
    badgeIcon: Megaphone,
    href: '/consultancy/ads-management/meta-ads',
    image: '/assets/images/digital-marketing.jpg',
    gradient: 'linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(245, 166, 35, 0.08) 100%)',
  },
  {
    title: 'Creative AI Production',
    highlight: 'Full AI Explainer Video at ₹999! (Save 33%)',
    subtitle: 'Engaging scripts, professional AI voiceover, and full animation editing completed within 72 hours.',
    badge: '🤖 AI Innovation',
    badgeIcon: Sparkles,
    href: '/consultancy/video-ai/full-ai-video',
    image: '/assets/images/ai-video.jpg',
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
  },
  {
    title: 'Business Incorporation Special',
    highlight: 'Pvt Ltd Registration at ₹5,999!',
    subtitle: 'All-inclusive company registration including DSC, DIN, PAN, TAN, and government fee assistance.',
    badge: '💼 Professional Legal',
    badgeIcon: ShieldAlert,
    href: '/consultancy/business-legal/pvt-ltd-registration',
    image: '/assets/images/business-legal.jpg',
    gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
  },
  {
    title: 'Mobile App Prototyping',
    highlight: 'Interactive App Mockup at ₹19,999!',
    subtitle: 'Complete UI/UX clickable wireframe prototypes for Android & iOS to pitch to investors or clients.',
    badge: '📱 App Architecture',
    badgeIcon: Smartphone,
    href: '/technology/app-development/hybrid',
    image: '/assets/images/app-dev.jpg',
    gradient: 'linear-gradient(135deg, rgba(30, 144, 255, 0.08) 0%, rgba(76, 175, 80, 0.08) 100%)',
  },
];

export function PromoCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrent(prev => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrent(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <div 
      className={styles.carousel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotional Carousel"
    >
      {/* Slides Container */}
      <div 
        className={styles.slidesTrack}
        style={{ transform: `translateX(calc(15% - ${current * 70}%))` }}
      >
        {SLIDES.map((slide, idx) => {
          const BadgeIcon = slide.badgeIcon;
          const isActive = idx === current;
          return (
            <div 
              key={idx} 
              className={`${styles.slide} ${isActive ? styles.activeSlide : styles.inactiveSlide}`}
              style={{ background: slide.gradient }}
            >
              <div className={styles.slideContent}>
                {/* Promo Badge */}
                <div className={styles.badge}>
                  <BadgeIcon size={14} />
                  <span>{slide.badge}</span>
                </div>

                {/* Offer Text */}
                <h3 className={styles.title}>{slide.title}</h3>
                <div className={styles.highlight}>{slide.highlight}</div>
                <p className={styles.subtitle}>{slide.subtitle}</p>

                {/* CTA Action */}
                <div className={styles.ctaRow}>
                  <Link href={slide.href} className="btn btn-primary btn-sm">
                    Claim Offer Now →
                  </Link>
                </div>
              </div>

              {/* Slide Mockup Image */}
              <div className={styles.imageColumn}>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={320}
                  height={200}
                  className={styles.slideImg}
                  priority
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Arrow Controls */}
      <button 
        className={`${styles.arrowBtn} ${styles.left}`} 
        onClick={handlePrev}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        className={`${styles.arrowBtn} ${styles.right}`} 
        onClick={handleNext}
        aria-label="Next Slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot Indicators */}
      <div className={styles.dots}>
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${idx === current ? styles.activeDot : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
