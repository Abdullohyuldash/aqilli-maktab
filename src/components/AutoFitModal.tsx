import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

interface AutoFitModalProps {
  children: React.ReactNode;
  /** Tailwind classes for the outer full-viewport backdrop/container (e.g., bg-slate-900/65 z-50) */
  overlayClassName?: string;
  /** Optional classes on the unscaled inner wrapper that holds the modal card */
  contentClassName?: string;
  /** Fraction of viewport width available before scaling down (default: 0.94) */
  widthRatio?: number;
  /** Fraction of viewport height available before scaling down (default: 0.92) */
  heightRatio?: number;
  /** Render as fixed overlay (modals) or full-screen container (Start Screen) */
  variant?: 'modal' | 'screen';
}

export const AutoFitModal: React.FC<AutoFitModalProps> = ({
  children,
  overlayClassName = '',
  contentClassName = '',
  widthRatio = 0.94,
  heightRatio = 0.92,
  variant = 'modal',
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  const recalculateScale = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    // offsetWidth / offsetHeight return the unscaled natural layout dimensions
    // unaffected by CSS transform: scale(...)
    const contentWidth = Math.max(el.offsetWidth, el.scrollWidth);
    const contentHeight = Math.max(el.offsetHeight, el.scrollHeight);

    if (contentWidth <= 0 || contentHeight <= 0) return;

    const availWidth = window.innerWidth * widthRatio;
    const availHeight = window.innerHeight * heightRatio;

    const nextScale = Math.min(1, availWidth / contentWidth, availHeight / contentHeight);
    // Round slightly to avoid subpixel jitter while keeping precision
    const clamped = Math.max(0.25, Math.floor(nextScale * 1000) / 1000);

    setScale((prev) => (Math.abs(prev - clamped) > 0.002 ? clamped : prev));
  }, [widthRatio, heightRatio]);

  useLayoutEffect(() => {
    recalculateScale();

    const el = contentRef.current;
    let observer: ResizeObserver | null = null;
    if (el && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        recalculateScale();
      });
      observer.observe(el);
    }

    const handleResize = () => recalculateScale();
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);

    // Re-check once fonts settle so text reflows are captured
    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) recalculateScale();
      });
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [recalculateScale]);

  const basePositionClass =
    variant === 'modal'
      ? 'fixed inset-0 h-dvh w-screen overflow-hidden flex items-center justify-center'
      : 'relative h-dvh w-screen overflow-hidden flex items-center justify-center';

  return (
    <div className={`${basePositionClass} ${overlayClassName}`}>
      <div
        ref={contentRef}
        className={`shrink-0 will-change-transform ${contentClassName}`}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
};
