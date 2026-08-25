'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Global helper to trigger the top loading progress bar and execute a callback AFTER loading finishes.
 */
export function triggerTopLoadingBar(onComplete?: () => void, duration = 1800) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('ds-start-top-loading', {
        detail: { duration, onComplete }
      })
    );
  }
}

export function TopProgressBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const callbackRef = useRef<(() => void) | null>(null);

  const startProgress = (duration = 1800, onComplete?: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);

    setIsLoading(true);
    setProgress(8);
    startTimeRef.current = Date.now();
    callbackRef.current = onComplete || null;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));

      setProgress(pct);

      if (elapsed >= duration) {
        if (timerRef.current) clearInterval(timerRef.current);
        // Execute callback exactly when the bar reaches 100% and reset scroll to top of new tab
        if (callbackRef.current) {
          callbackRef.current();
          callbackRef.current = null;
        }

        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }

        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 150);
      }
    }, 35);
  };

  useEffect(() => {
    const handleCustomLoad = (e: any) => {
      const duration = e.detail?.duration || 1800;
      const onComplete = e.detail?.onComplete;
      startProgress(duration, onComplete);
    };

    // Intercept clicks on links across the site to synchronize page transitions with top progress line
    const handleGlobalLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const isExternal = anchor.getAttribute('target') === '_blank' || (href && href.startsWith('http') && !href.includes(window.location.host));
      const isAnchorHash = href && href.startsWith('#');

      if (href && !isExternal && !isAnchorHash && href !== pathname && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        // Prevent instant page change
        e.preventDefault();
        e.stopPropagation();

        // Run progress bar and navigate once loading finishes
        startProgress(1800, () => {
          router.push(href);
        });
      }
    };

    window.addEventListener('ds-start-top-loading', handleCustomLoad);
    document.addEventListener('click', handleGlobalLinkClick, true);

    return () => {
      window.removeEventListener('ds-start-top-loading', handleCustomLoad);
      document.removeEventListener('click', handleGlobalLinkClick, true);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pathname, router]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none">
      {/* 3px Top Loading Bar */}
      <div
        className="h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-[0_0_12px_rgba(220,38,38,0.9)] transition-all ease-linear"
        style={{
          width: `${progress}%`,
          transitionDuration: '35ms'
        }}
      />
    </div>
  );
}
