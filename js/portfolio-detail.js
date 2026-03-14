/* ============================================
   Portfolio Detail Page Animations with GSAP
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero Image Animation
    gsap.to('.project-hero-image img', {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.project-hero',
            start: 'top top',
            toggleActions: 'play none none none'
        }
    });
    
    // Project Header Animation
    const headerTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.project-header',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    headerTimeline
        .to('.project-category', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        })
        .to('.project-title', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.3')
        .to('.project-description', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.4');
    
    // Project Meta Items Animation
    gsap.utils.toArray('.meta-item').forEach((item, index) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Technologies Section Animation
    gsap.fromTo('.project-technologies',
        {
            opacity: 0,
            y: 30
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.project-technologies',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );
    
    // Tech List Items Stagger Animation
    gsap.utils.toArray('.tech-list li').forEach((item, index) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                x: -30
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: 'power2.out',
                delay: index * 0.08,
                scrollTrigger: {
                    trigger: '.project-technologies',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Gallery Title Animation
    gsap.fromTo('.gallery-title',
        {
            opacity: 0,
            y: 20
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.gallery-title',
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        }
    );
    
    // Gallery Items Stagger Animation
    gsap.utils.toArray('.gallery-item').forEach((item, index) => {
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
    
    // Navigation Links Animation
    const navTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.project-navigation',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
    
    navTimeline
        .to('.nav-link-btn', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1
        });
    
    // Navigation Button Hover Effects
    const navButtons = document.querySelectorAll('.nav-link-btn');
    navButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
});

