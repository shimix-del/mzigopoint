import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function MagneticButton({
  children,
  onClick,
  className = "",
  magneticStrength = 0.3,
  type = "button"
}) {
  const btnRef = useRef(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    // Check if touch device or reduced motion
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * magneticStrength;
      const y = (e.clientY - (rect.top + rect.height / 2)) * magneticStrength;

      gsap.to(el, {
        x,
        y,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const onMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1.1, 0.4)'
      });
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [magneticStrength]);

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center transition-shadow cursor-pointer select-none active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}
