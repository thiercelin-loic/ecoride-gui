// Utility functions to prevent content blinking

/**
 * Smooth image loading to prevent blinking
 */
export function setupSmoothImageLoading(): void {
  // Handle lazy loaded images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  lazyImages.forEach((img: Element) => {
    const image = img as HTMLImageElement;
    
    if (image.complete && image.naturalHeight !== 0) {
      image.classList.add('loaded');
    } else {
      image.addEventListener('load', () => {
        image.classList.add('loaded');
      });
      
      image.addEventListener('error', () => {
        image.classList.add('loaded'); // Still fade in even on error
      });
    }
  });
  
  // Handle all images to prevent layout shift
  const allImages = document.querySelectorAll('img:not([loading="lazy"])');
  allImages.forEach((img: Element) => {
    const image = img as HTMLImageElement;
    if (!image.complete) {
      image.style.opacity = '0';
      image.addEventListener('load', () => {
        image.style.opacity = '1';
      });
    }
  });
}

/**
 * Prevent layout shifts during content loading
 */
export function preventLayoutShift(): void {
  // Add will-change property to elements that will animate
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .trip-card, .eco-card');
  animatedElements.forEach((element: Element) => {
    (element as HTMLElement).style.willChange = 'transform, opacity';
  });
  
  // Clean up after animations
  setTimeout(() => {
    animatedElements.forEach((element: Element) => {
      (element as HTMLElement).style.willChange = 'auto';
    });
  }, 2000);
  
  // Prevent font loading shifts
  document.fonts.ready.then(() => {
    document.body.classList.add('fonts-loaded');
  });
}

/**
 * Setup smooth scrolling with reduced motion support
 */
export function setupSmoothScrolling(): void {
  // Override default link behavior for smooth scrolling
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="#"]') as HTMLAnchorElement;
    
    if (link && link.hash) {
      e.preventDefault();
      const targetElement = document.querySelector(link.hash);
      
      if (targetElement) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        targetElement.scrollIntoView({
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    }
  });
}

/**
 * Setup reduced motion support
 */
export function setupReducedMotion(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  function handleMotionPreference(e: MediaQueryListEvent | MediaQueryList): void {
    if (e.matches) {
      document.body.classList.add('reduce-motion');
      // Immediately show any loading content
      const loadingElements = document.querySelectorAll('.fade-in, .slide-in');
      loadingElements.forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }
  
  handleMotionPreference(prefersReducedMotion);
  prefersReducedMotion.addEventListener('change', handleMotionPreference);
}

/**
 * Optimize performance for smooth animations
 */
export function optimizePerformance(): void {
  // Enable hardware acceleration for key elements
  const performanceElements = document.querySelectorAll('.hero-section, .loading-screen, .navbar-eco');
  performanceElements.forEach((element: Element) => {
    (element as HTMLElement).style.transform = 'translateZ(0)';
  });
  
  // Preload critical resources
  const criticalLinks = document.querySelectorAll('link[rel="stylesheet"]');
  criticalLinks.forEach((link: Element) => {
    (link as HTMLLinkElement).addEventListener('load', () => {
      document.body.classList.add('styles-loaded');
    });
  });
}

/**
 * Initialize all smooth loading utilities
 */
export function initializeSmoothLoading(): void {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupSmoothImageLoading();
      preventLayoutShift();
      setupSmoothScrolling();
      setupReducedMotion();
      optimizePerformance();
    });
  } else {
    setupSmoothImageLoading();
    preventLayoutShift();
    setupSmoothScrolling();
    setupReducedMotion();
    optimizePerformance();
  }
  
  // Re-initialize on navigation (for SPAs)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(() => {
        setupSmoothImageLoading();
        preventLayoutShift();
      }, 100);
    }
  }).observe(document, { subtree: true, childList: true });
}
