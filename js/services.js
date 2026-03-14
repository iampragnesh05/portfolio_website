/* ============================================
   Services Page Animations with GSAP
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
    
    // Services Stagger Animation
    gsap.utils.toArray('.service-item').forEach((item, index) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                y: 50,
                scale: 0.95
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
                delay: index * 0.15,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // CTA Section Animation
    const ctaTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    ctaTimeline
        .to('.cta-title', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        })
        .to('.cta-text', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4')
        .to('.cta-section .btn', {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)'
        }, '-=0.3');
    
    // Service Features Animation
    gsap.utils.toArray('.service-features li').forEach((feature, index) => {
        gsap.fromTo(feature,
            {
                opacity: 0,
                x: -20
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: 'power2.out',
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: feature.closest('.service-item'),
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Button Micro-interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
});

