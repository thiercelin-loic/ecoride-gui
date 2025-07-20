import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmoothTransitionService {
  private isTransitioningSubject = new BehaviorSubject<boolean>(false);
  public isTransitioning$ = this.isTransitioningSubject.asObservable();

  constructor() {
    this.setupGlobalTransitionHandling();
  }

  /**
   * Start a smooth transition
   */
  startTransition(): void {
    this.isTransitioningSubject.next(true);
    document.body.classList.add('transitioning');
  }

  /**
   * End a smooth transition
   */
  endTransition(): void {
    setTimeout(() => {
      this.isTransitioningSubject.next(false);
      document.body.classList.remove('transitioning');
    }, 100);
  }

  /**
   * Execute a function with smooth transition
   */
  withTransition(fn: () => void, delay: number = 0): void {
    this.startTransition();
    
    setTimeout(() => {
      fn();
      this.endTransition();
    }, delay);
  }

  /**
   * Prevent blinking during async operations
   */
  preventBlinkingDuring(promise: Promise<any>, element?: HTMLElement): Promise<any> {
    if (element) {
      element.classList.add('loading');
    }

    return promise.finally(() => {
      if (element) {
        setTimeout(() => {
          element.classList.remove('loading');
        }, 50);
      }
    });
  }

  /**
   * Setup global transition handling
   */
  private setupGlobalTransitionHandling(): void {
    // Handle form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      if (form) {
        this.startTransition();
      }
    });

    // Handle button clicks that might cause navigation
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button, .btn, a[href]');
      
      if (button && !button.hasAttribute('data-no-transition')) {
        this.startTransition();
      }
    });

    // Auto-end transitions after a reasonable time
    this.isTransitioning$.subscribe(isTransitioning => {
      if (isTransitioning) {
        setTimeout(() => {
          if (this.isTransitioningSubject.value) {
            this.endTransition();
          }
        }, 2000);
      }
    });
  }

  /**
   * Optimize element for smooth animations
   */
  optimizeElement(element: HTMLElement): void {
    element.style.willChange = 'transform, opacity';
    element.style.transform = 'translateZ(0)';
    
    // Clean up after a reasonable time
    setTimeout(() => {
      element.style.willChange = 'auto';
    }, 3000);
  }

  /**
   * Smooth scroll to element
   */
  smoothScrollTo(element: HTMLElement | string, offset: number = 0): void {
    const target = typeof element === 'string' 
      ? document.querySelector(element) as HTMLElement
      : element;

    if (!target) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset + rect.top - offset;

    if (prefersReducedMotion.matches) {
      window.scrollTo(0, scrollTop);
    } else {
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }
}
