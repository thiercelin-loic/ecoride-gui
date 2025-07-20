import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[noBlinking]',
  standalone: true
})
export class NoBlinkingDirective implements OnInit, OnDestroy {
  @Input() preventImageBlink = true;
  @Input() preventTextBlink = true;
  @Input() preventLayoutShift = true;

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.setupNoBlinking();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupNoBlinking(): void {
    const element = this.el.nativeElement;

    // Prevent layout shifts
    if (this.preventLayoutShift) {
      element.style.willChange = 'transform, opacity';
      element.style.transform = 'translateZ(0)';
    }

    // Handle images within the element
    if (this.preventImageBlink) {
      this.setupImageHandling(element);
    }

    // Handle text rendering
    if (this.preventTextBlink) {
      element.style.textRendering = 'optimizeLegibility';
      (element.style as any).webkitFontSmoothing = 'antialiased';
      (element.style as any).mozOsxFontSmoothing = 'grayscale';
    }

    // Setup intersection observer for performance
    this.setupIntersectionObserver(element);

    // Clean up after initial render
    setTimeout(() => {
      if (this.preventLayoutShift) {
        element.style.willChange = 'auto';
      }
    }, 2000);
  }

  private setupImageHandling(element: HTMLElement): void {
    const images = element.querySelectorAll('img');
    
    images.forEach((img: HTMLImageElement) => {
      if (!img.complete) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        const handleLoad = () => {
          img.style.opacity = '1';
          img.removeEventListener('load', handleLoad);
          img.removeEventListener('error', handleLoad);
        };
        
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleLoad);
      }
    });
  }

  private setupIntersectionObserver(element: HTMLElement): void {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              element.classList.add('in-viewport');
              // Optimize for visible elements
              element.style.contain = 'layout style paint';
            } else {
              element.classList.remove('in-viewport');
              // Reduce resource usage for non-visible elements
              element.style.contain = 'strict';
            }
          });
        },
        { 
          rootMargin: '50px',
          threshold: 0.1 
        }
      );

      this.observer.observe(element);
    }
  }
}
