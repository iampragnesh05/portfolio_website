/* ============================================
   Portfolio Listing Page Animations with GSAP
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Page Header Animation
    const headerTimeline = gsap.timeline();
    
    headerTimeline
        .to('.page-title', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
        .to('.page-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4');
    
    // Portfolio Items Stagger Animation
    gsap.utils.toArray('.portfolio-item').forEach((item, index) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                y: 50,
                scale: 0.95,
                rotation: 0
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: 'power3.out',
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Enhanced hover animations for desktop
    if (window.innerWidth >= 768) {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                gsap.to(this, {
                    y: -8,
                    duration: 0.4,
                    ease: 'power2.out'
                });
                
                const overlay = this.querySelector('.portfolio-overlay');
                gsap.to(overlay, {
                    opacity: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            item.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                });
                
                const overlay = this.querySelector('.portfolio-overlay');
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
});

