'use client';

import { useEffect, useRef, useState } from 'react';

// Performance monitoring for Core Web Vitals
export function WebVitalsReporter() {
  useEffect(() => {
    // Only track in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Dynamically import web-vitals to avoid SSR issues
    const trackVitals = async () => {
      try {
        const { onCLS, onFID, onFCP, onLCP, onTTFB } = await import('web-vitals');

        const vitalsUrl = '/api/vitals';

        function sendToAnalytics(metric: any) {
          // Send to analytics endpoint
          if ('navigator' in window && 'sendBeacon' in navigator) {
            navigator.sendBeacon(vitalsUrl, JSON.stringify(metric));
          } else {
            fetch(vitalsUrl, {
              method: 'POST',
              body: JSON.stringify(metric),
              headers: { 'Content-Type': 'application/json' },
              keepalive: true,
            }).catch(console.error);
          }

          // Also log to console in development
          if (process.env.NODE_ENV === 'development') {
            console.log('Web Vital:', metric);
          }
        }

        // Track all Core Web Vitals
        onCLS(sendToAnalytics);
        onFID(sendToAnalytics);
        onFCP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
      } catch (error) {
        console.warn('Web Vitals not available:', error);
      }
    };

    trackVitals();
  }, []);

  return null;
}

// Preload critical resources
export function CriticalResourcePreloader() {
  useEffect(() => {
    // Preload critical fonts
    const fontFiles = [
      '/fonts/inter-var.woff2',
      '/fonts/inter-var-latin.woff2',
    ];

    fontFiles.forEach((font) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com',
    ];

    preconnectDomains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, []);

  return null;
}

// Intersection Observer for lazy loading
export function LazyLoader({
  children,
  className,
  threshold = 0.1,
  rootMargin = '50px',
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : <div className="h-48 animate-pulse rounded bg-gray-200" />}
    </div>
  );
}

// Service Worker registration for caching
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === 'production'
      && 'serviceWorker' in navigator
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return null;
}

// Memory-efficient image loading
type OptimizedImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
};

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse bg-gray-200"
          style={{ aspectRatio: `${width}/${height}` }}
        />
      )}
    </div>
  );
}
