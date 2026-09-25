'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PageEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const revealItems = gsap.utils.toArray('.scroll-reveal');

      if (reducedMotion) {
        gsap.set(revealItems, { clearProps: 'all' });
        return;
      }

      gsap.set(revealItems, { autoAlpha: 0, y: 34 });

      gsap.from('.page-section > *', {
        autoAlpha: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.3,
        ease: 'power3.out',
      });
      gsap.from('.hero-content', {
        autoAlpha: 0,
        y: 28,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
      });
      gsap.from('.hero-visual', {
        autoAlpha: 0,
        scale: 0.92,
        duration: 1,
        delay: 0.25,
        ease: 'power2.out',
      });
      gsap.from('footer', {
        autoAlpha: 0,
        y: 18,
        duration: 0.7,
        delay: 0.4,
        ease: 'power3.out',
      });

      revealItems.forEach((item) => {
        gsap.to(item, {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 86%',
            once: true,
          },
        });
      });

      gsap.to('.scroll-indicator', {
        y: 10,
        autoAlpha: 0.45,
        repeat: -1,
        yoyo: true,
        duration: 1.1,
        ease: 'sine.inOut',
      });
    });

    return () => context.revert();
  }, [pathname]);

  return null;
}
