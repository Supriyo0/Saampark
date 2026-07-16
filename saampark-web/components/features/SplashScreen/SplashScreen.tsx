'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './SplashScreen.module.css';

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'particles' | 'logo' | 'text' | 'done'>('particles');
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const CX = canvas.width / 2;
    const CY = canvas.height / 2;

    // ── Particle System ────────────────────────
    const PARTICLE_COUNT = 180;
    interface Particle {
      x: number; y: number;
      tx: number; ty: number; // target
      vx: number; vy: number;
      size: number;
      alpha: number;
      color: string;
      gathered: boolean;
    }

    const colors = ['#00B4A6', '#00D4C8', '#33C9BF', '#007A74', '#FFFFFF', '#99DFD9'];
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 200 + Math.random() * 300;
      return {
        x:  CX + Math.cos(angle) * radius,
        y:  CY + Math.sin(angle) * radius,
        tx: CX + (Math.random() - 0.5) * 100,
        ty: CY + (Math.random() - 0.5) * 100,
        vx: 0, vy: 0,
        size:  1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        gathered: false,
      };
    });

    let startTime = performance.now();
    const GATHER_DURATION = 900;   // ms to gather
    const LOGO_SHOW_AT   = 1000;
    const TEXT_SHOW_AT   = 1500;
    const FADE_AT        = 2000;
    const END_AT         = 2600;

    const render = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = now - startTime;

      // Background
      ctx.fillStyle = '#0D1B2A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle radial glow
      const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, 250);
      grad.addColorStop(0, 'rgba(0,180,166,0.15)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move particles toward center
      const progress = Math.min(elapsed / GATHER_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic

      particles.forEach(p => {
        p.x += (p.tx - p.x) * eased * 0.08;
        p.y += (p.ty - p.y) * eased * 0.08;

        ctx.save();
        ctx.globalAlpha = p.alpha * (elapsed < 100 ? elapsed / 100 : 1);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Trigger phase transitions
      if (elapsed >= LOGO_SHOW_AT && phase === 'particles') setPhase('logo');
      if (elapsed >= TEXT_SHOW_AT && phase === 'logo')      setPhase('text');
      if (elapsed >= END_AT)                                 { setPhase('done'); return; }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When done, tell parent
  useEffect(() => {
    if (phase === 'done') {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  return (
    <div className={`${styles.splash} ${phase === 'done' ? styles.fadeOut : ''}`}>
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Logo */}
      <div className={`${styles.logoWrap} ${phase === 'logo' || phase === 'text' ? styles.logoVisible : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/saampark-group-logo.jpg"
          alt="Saampark Group"
          className={styles.logo}
        />
      </div>

      {/* Text */}
      <div className={`${styles.textWrap} ${phase === 'text' ? styles.textVisible : ''}`}>
        <div className={styles.wordmark}>SAAMPARK GROUP</div>
        <div className={styles.tagline}>Aspire For Optimum Excellence</div>
      </div>
    </div>
  );
}
