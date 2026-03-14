/* ============================================
   Home Page Animations with GSAP
   Element-wise animation plan implementation
   ============================================ */

// ============================================
// CLOCK - Runs immediately, independent of GSAP
// ============================================
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) {
        return; // Element not found yet, will try again
    }
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    clockElement.textContent = `${displayHours}:${minutes} ${ampm}`;
}

// Function to initialize clock
function initClock() {
    // Try to update immediately
    updateClock();
    
    // If element not found, wait a bit and try again
    if (!document.getElementById('clock')) {
        setTimeout(initClock, 100);
        return;
    }
    
    // Update clock every second
    setInterval(updateClock, 1000);
}

// Initialize clock when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClock);
} else {
    // DOM already loaded
    initClock();
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // ============================================
    // HERO BANNER ANIMATIONS
    // ============================================
    
    // 1. Language Cycling Animation (Hello in Indian Languages)
    const greetingText = document.getElementById('greetingText');
    if (greetingText) {
        const greetings = [
            "Hello",
            "नमस्ते",      // Hindi
            "વંદન",        // Gujarati
            "வணக்கம்",    // Tamil
            "నమస్కారం",    // Telugu
            "ನಮಸ್ಕಾರ",      // Kannada
            "नमस्कार"       // Marathi
        ];
        
        let currentIndex = 0;
        
        function cycleGreeting() {
            // Fade out
            gsap.to(greetingText, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    // Change text
                    currentIndex = (currentIndex + 1) % greetings.length;
                    greetingText.textContent = greetings[currentIndex];
                    
                    // Fade in
                    gsap.to(greetingText, {
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        }
        
        // Start cycling after initial delay
        setTimeout(() => {
            setInterval(cycleGreeting, 1000); // Change every 1 second
        }, 1000);
    }
    
    // 2. Auto-Scrolling Hindi Text (Infinite Marquee with Multiple Phrases)
    const scrollText = document.getElementById('scrollText');
    if (scrollText) {
        // Wait for layout to calculate width properly
        setTimeout(() => {
            const scrollItems = scrollText.querySelectorAll('.scroll-item');
            if (scrollItems.length > 0) {
                // Calculate total width of first set of items (half of all items)
                let totalWidth = 0;
                const gap = 64; // 4rem gap between spans
                const firstSetCount = scrollItems.length / 2; // First half for seamless loop
                
                for (let i = 0; i < firstSetCount; i++) {
                    totalWidth += scrollItems[i].offsetWidth + gap;
                }
                
                // Create seamless infinite scroll animation
                // Move left by exactly one set width, then repeat
                gsap.to(scrollText, {
                    x: -totalWidth,
                    duration: 30,
                    ease: 'none',
                    repeat: -1
                });
            }
        }, 200);
    }
    
    // Initial fade-in animation for hero banner elements
    const heroBanner = document.querySelector('.hero-banner');
    if (heroBanner) {
        const greeting = document.querySelector('.hero-greeting');
        const heading = document.querySelector('.hero-heading');
        const scrollWrapper = document.querySelector('.hero-scroll-wrapper');
        const heroTargets = [greeting, heading, scrollWrapper].filter(Boolean);
        if (heroTargets.length === 0) return;
        // Set initial states
        gsap.set(heroTargets, {
            opacity: 0,
            y: 30
        });
        
        // Create entrance timeline
        const bannerTimeline = gsap.timeline();
        
        if (greeting) bannerTimeline.to(greeting, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
        if (heading) bannerTimeline.to(heading, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.4');
        if (scrollWrapper) bannerTimeline.to(scrollWrapper, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.4');
        // Simple test animation on .hero-heading to confirm GSAP is running
        const heroHeadingEl = document.querySelector('.hero-heading');
        if (heroHeadingEl) {
            gsap.to(heroHeadingEl, {
                scale: 1.02,
                duration: 1.2,
                ease: 'power2.inOut',
                yoyo: true,
                repeat: 1,
                delay: 1.5
            });
        }
    }
    
    // ============================================
    // CTA SECTION ANIMATION
    // ============================================
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        const ctaHeading = ctaSection.querySelector('.cta-heading');
        const ctaSubheading = ctaSection.querySelector('.cta-subheading');
        const ctaButtons = ctaSection.querySelector('.cta-buttons-wrapper');
        const ctaTargets = [ctaHeading, ctaSubheading, ctaButtons].filter(Boolean);
        if (ctaTargets.length > 0) {
            gsap.set(ctaTargets, { opacity: 0, y: 30 });
            const ctaTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: ctaSection,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
            if (ctaHeading) ctaTimeline.to(ctaHeading, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
            if (ctaSubheading) ctaTimeline.to(ctaSubheading, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
            if (ctaButtons) ctaTimeline.to(ctaButtons, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
        }
    }
    
    // ============================================
    // CUSTOM CURSOR
    // ============================================
    const cursor = document.getElementById('cursor');
    const projectCards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.btn, .contact-link, .footer-link');
    
    if (cursor && window.innerWidth >= 1024) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Add hover class on interactive elements
        [...projectCards, ...buttons].forEach(element => {
            element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }
    
    // ============================================
    // AI SOLUTIONS SECTION - Load & message animations
    // ============================================
    const aiSection = document.querySelector('.ai-solutions-section');
    if (aiSection) {
        const aiContent = aiSection.querySelector('.ai-solutions-content');
        const aiVisual = aiSection.querySelector('.ai-solutions-visual');
        const aiMsg12 = aiSection.querySelectorAll('.ai-msg[data-order="1"], .ai-msg[data-order="2"]');
        const typingWrap = aiSection.querySelector('.ai-msg-typing-wrap');
        const typingIndicator = aiSection.querySelector('.ai-typing-indicator');
        const msgReveal = aiSection.querySelector('.ai-msg-reveal');
        // Initial state so scroll-in is visible
        const aiTargets = [aiContent, aiVisual].filter(Boolean);
        if (aiTargets.length) gsap.set(aiTargets, { opacity: 0, y: 24 });
        if (aiMsg12.length) gsap.set(aiMsg12, { opacity: 0, y: 12 });
        if (typingWrap) gsap.set(typingWrap, { opacity: 0, y: 12 });
        if (msgReveal) msgReveal.style.display = 'none';
        if (typingIndicator) typingIndicator.style.display = '';
        const aiTl = gsap.timeline({
            scrollTrigger: {
                trigger: aiSection,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
        if (aiContent) aiTl.to(aiContent, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
        if (aiVisual) aiTl.to(aiVisual, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3');
        if (aiMsg12.length) aiTl.to(aiMsg12, { opacity: 1, y: 0, duration: 0.4, stagger: 0.4, ease: 'power2.out' }, '-=0.2');
        if (typingWrap && typingIndicator && msgReveal) {
            aiTl.to(typingWrap, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
                .to({}, { duration: 1.6 })
                .call(function() {
                    typingIndicator.style.display = 'none';
                    msgReveal.style.display = 'block';
                    gsap.to(msgReveal, { opacity: 1, duration: 0.4, ease: 'power2.out' });
                });
        }
    }
    
    // ============================================
    // THEME SHOWCASE SECTION - Scroll-in animations
    // ============================================
    const themeSection = document.querySelector('.theme-showcase-section');
    if (themeSection) {
        const themeContent = themeSection.querySelector('.theme-showcase-content');
        const themeVisual = themeSection.querySelector('.theme-showcase-visual');
        gsap.timeline({
            scrollTrigger: {
                trigger: themeSection,
                start: 'top 78%',
                toggleActions: 'play none none none'
            }
        })
        .to(themeContent, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' })
        .to(themeVisual, { opacity: 1, duration: 0.55, ease: 'power2.out' }, '-=0.3');
    }
    
    // ============================================
    // TECHNICAL SEO SECTION - Audit dashboard animations
    // ============================================
    const seoSection = document.querySelector('.seo-section');
    if (seoSection) {
        const seoContent = seoSection.querySelector('.seo-content');
        const seoVisual = seoSection.querySelector('.seo-visual');
        const seoItems = seoSection.querySelectorAll('.seo-audit-item');
        const seoCircle = seoSection.querySelector('[data-seo-circle]');
        const seoScoreEl = seoSection.querySelector('[data-seo-score]');
        const seoGraphLine = seoSection.querySelector('[data-seo-graph-line]');
        const seoGraphArea = seoSection.querySelector('.seo-graph-area');
        const seoGraphArrow = seoSection.querySelector('[data-seo-graph-arrow]');
        
        const circumference = 2 * Math.PI * 44;
        const offset40 = circumference * (1 - 0.4);
        const offset98 = circumference * (1 - 0.98);
        
        gsap.set(seoCircle, { strokeDasharray: circumference, strokeDashoffset: offset40 });
        
        const seoTl = gsap.timeline({
            scrollTrigger: {
                trigger: seoSection,
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });
        
        seoTl.to(seoContent, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
            .to(seoVisual, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.25')
            .to(seoItems, {
                opacity: 1,
                x: 0,
                duration: 0.35,
                stagger: 0.35,
                ease: 'power2.out',
                onStart: function() {
                    seoItems.forEach(function(item, i) {
                        setTimeout(function() { item.classList.add('animate-in'); }, i * 350);
                    });
                }
            }, '-=0.15');
        
        seoTl.to(seoCircle, {
            strokeDashoffset: offset98,
            duration: 1.2,
            ease: 'power2.inOut'
        }, '-=0.3');
        
        seoTl.to(seoScoreEl, {
            textContent: 98,
            duration: 1,
            snap: { textContent: 1 },
            ease: 'power2.inOut'
        }, '-=1.2');
        
        if (seoGraphLine) {
            seoTl.to(seoGraphLine, {
                strokeDashoffset: 0,
                duration: 0.8,
                ease: 'power2.out'
            }, '-=0.8');
        }
        if (seoGraphArea) {
            seoTl.to(seoGraphArea, {
                opacity: 0.4,
                scaleY: 1,
                transformOrigin: 'bottom',
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.8');
        }
        if (seoGraphArrow) {
            seoTl.to(seoGraphArrow, { opacity: 1, duration: 0.2 }, '-=0.2');
        }
    }
    
    // ============================================
    // WORDPRESS SECTION - Scroll-in animations
    // ============================================
    const wpSection = document.querySelector('.wp-section');
    if (wpSection) {
        const wpContent = wpSection.querySelector('.wp-content');
        const wpVisual = wpSection.querySelector('.wp-visual');
        const wpPills = wpSection.querySelectorAll('.wp-pill');
        if (wpContent) gsap.set(wpContent, { opacity: 0, y: 24 });
        if (wpVisual) gsap.set(wpVisual, { opacity: 0, x: 24 });
        if (wpPills.length) gsap.set(wpPills, { opacity: 0 });
        const wpTl = gsap.timeline({
            scrollTrigger: {
                trigger: wpSection,
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });
        if (wpContent) wpTl.to(wpContent, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' });
        if (wpVisual) wpTl.to(wpVisual, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, '-=0.35');
        if (wpPills.length) wpTl.to(wpPills, { opacity: 1, duration: 0.3, stagger: 0.08 }, '-=0.4');
    }
    
    // ============================================
    // GITHUB CONTRIBUTION SECTION - Scroll reveal
    // ============================================
    const githubSection = document.querySelector('.github-contribution-section');
    if (githubSection) {
        const githubHeader = githubSection.querySelector('.github-contribution-heading');
        const githubCardWrap = githubSection.querySelector('.github-contribution-wrapper');
        const githubAvatarBlock = githubSection.querySelector('.github-profile-link');
        const ghtl = gsap.timeline({
            scrollTrigger: {
                trigger: githubSection,
                start: 'top 78%',
                toggleActions: 'play none none none'
            }
        });
        if (githubHeader) ghtl.to(githubHeader, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        if (githubCardWrap) ghtl.to(githubCardWrap, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power2.out' }, '-=0.3');
        if (githubAvatarBlock) ghtl.to(githubAvatarBlock, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4');
    }
    
    // ============================================
    // HOW I HELP YOUR BUSINESS GROW - Scroll reveal
    // ============================================
    const helpGrowSection = document.querySelector('.help-grow-section');
    if (helpGrowSection) {
        const helpGrowTitle = helpGrowSection.querySelector('.help-grow-title');
        const helpGrowCards = helpGrowSection.querySelectorAll('.help-grow-card');
        gsap.timeline({
            scrollTrigger: {
                trigger: helpGrowSection,
                start: 'top 78%',
                toggleActions: 'play none none none'
            }
        })
        .to(helpGrowTitle, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' })
        .to(helpGrowCards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, '-=0.25');
    }
    
    // ============================================
    // STRONG CTA SECTION - Scroll reveal
    // ============================================
    const strongCtaReveal = document.querySelector('.strong-cta');
    if (strongCtaReveal) {
        const ctaHeadlineR = strongCtaReveal.querySelector('.cta-headline');
        const ctaTextR = strongCtaReveal.querySelector('.cta-text');
        const ctaButtonsR = strongCtaReveal.querySelector('.cta-buttons');
        const ctaTrust = strongCtaReveal.querySelector('.cta-trust-line');
        const stl = gsap.timeline({
            scrollTrigger: {
                trigger: strongCtaReveal,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
        if (ctaHeadlineR) stl.to(ctaHeadlineR, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        if (ctaTextR) stl.to(ctaTextR, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.25');
        if (ctaButtonsR) stl.to(ctaButtonsR, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2');
        if (ctaTrust) stl.to(ctaTrust, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    }
    
    // ============================================
    // MOBILE ELEMENT-WISE PARALLAX
    // ============================================
    if (window.innerWidth < 768) {
        // Ensure all elements are visible on mobile first
        gsap.set('section, .service-card, .project-card, .why-item, .trust-item', {
            opacity: 1,
            visibility: 'visible'
        });
        
        // Subtle parallax for sections on mobile
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            gsap.to(section, {
                y: -20,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
        
        // Parallax for project cards (subtle movement)
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            gsap.to(card, {
                y: -15,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    scrub: 1
                }
            });
        });
        
        // Parallax for service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            gsap.to(card, {
                y: -10,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    scrub: 1
                }
            });
        });
    }
    
    // ============================================
    // HEADER ANIMATION
    // ============================================
    const topNav = document.querySelector('.top-nav');
    const isMobile = window.innerWidth < 768;
    
    if (topNav && !isMobile) {
        // Top nav slides down and fades in on page load (desktop only)
        gsap.fromTo(topNav,
            {
                y: -20,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out'
            }
        );
    }
    
    // ============================================
    // HERO SECTION ANIMATION (MOST IMPORTANT)
    // ============================================
    const heroHeadline = document.querySelector('.hero-headline');
    const heroSubheading = document.querySelector('.hero-subheading');
    const heroCtas = document.querySelector('.hero-ctas');
    
    // On mobile, make elements visible immediately
    if (isMobile) {
        if (heroSubheading) {
            gsap.set(heroSubheading, { opacity: 1, y: 0 });
        }
        if (heroCtas) {
            gsap.set(heroCtas, { opacity: 1, scale: 1 });
        }
    } else {
        // Desktop animations
        // Split headline into words for animation
        if (heroHeadline) {
            const headlineText = heroHeadline.textContent;
            const words = headlineText.split(' ');
            heroHeadline.innerHTML = words.map(word => `<span class="hero-word">${word}</span>`).join(' ');
            
            const heroWords = heroHeadline.querySelectorAll('.hero-word');
            
            // Set initial state
            gsap.set(heroWords, {
                opacity: 0,
                y: 40
            });
            
            // Create hero timeline
            const heroTimeline = gsap.timeline();
            
            // Animate words with stagger
            heroTimeline.to(heroWords, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
                stagger: 0.05
            });
            
            // Subheadline fade + slide up (delayed after headline)
            if (heroSubheading) {
                gsap.set(heroSubheading, {
                    opacity: 0,
                    y: 20
                });
                
                heroTimeline.to(heroSubheading, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                }, '-=0.3');
            }
            
            // CTA buttons scale in slightly and fade in last
            if (heroCtas) {
                gsap.set(heroCtas, {
                    opacity: 0,
                    scale: 0.95
                });
                
                heroTimeline.to(heroCtas, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: 'back.out(1.2)'
                }, '-=0.2');
            }
        }
    }
    
    // ============================================
    // TRUST INDICATORS ANIMATION
    // ============================================
    const trustItems = document.querySelectorAll('.trust-item');
    
    trustItems.forEach((item, index) => {
        if (isMobile) {
            // On mobile, make visible immediately with subtle animation
            gsap.fromTo(item,
                {
                    opacity: 1,
                    y: 10
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 95%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        } else {
            // Desktop animation
            gsap.fromTo(item,
                {
                    opacity: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    delay: index * 0.15,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }
    });
    
    // ============================================
    // SERVICES SECTION ANIMATION
    // ============================================
    const servicesSection = document.querySelector('.services-preview');
    const servicesTitle = servicesSection ? servicesSection.querySelector('.section-title') : null;
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Section heading fades in first
    if (servicesTitle) {
        gsap.fromTo(servicesTitle,
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
                    trigger: servicesTitle,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Service cards stagger animation
    serviceCards.forEach((card, index) => {
        if (isMobile) {
            // Mobile: visible with subtle animation
            gsap.fromTo(card,
                {
                    opacity: 1,
                    y: 15
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    delay: index * 0.08,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 95%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        } else {
            // Desktop animation
            gsap.fromTo(card,
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
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }
        
        // Hover animation (Desktop only)
        if (window.innerWidth >= 768) {
            card.addEventListener('mouseenter', function() {
                gsap.to(this, {
                    y: -6,
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    y: 0,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        }
    });
    
    // ============================================
    // WHY CHOOSE ME ANIMATION
    // ============================================
    const whyItems = document.querySelectorAll('.why-item');
    
    whyItems.forEach((item, index) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                x: -20
            },
            {
                opacity: 1,
                x: 0,
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
    
    // ============================================
    // FEATURED WORK ANIMATION
    // ============================================
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    portfolioCards.forEach((card, index) => {
        const portfolioImage = card.querySelector('.portfolio-image img');
        const portfolioInfo = card.querySelector('.portfolio-info');
        
        // Set initial states
        if (portfolioImage) {
            gsap.set(portfolioImage, {
                scale: 1.05
            });
        }
        
        if (portfolioInfo) {
            gsap.set(portfolioInfo, {
                opacity: 0
            });
        }
        
        // Animate on scroll
        const cardTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
        
        // Image scales down gently
        if (portfolioImage) {
            cardTimeline.to(portfolioImage, {
                scale: 1,
                duration: 0.8,
                ease: 'power2.out'
            });
        }
        
        // Text fades in after image
        if (portfolioInfo) {
            cardTimeline.to(portfolioInfo, {
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.3');
        }
    });
    
    // ============================================
    // STRONG CTA SECTION ANIMATION
    // ============================================
    const strongCta = document.querySelector('.strong-cta');
    const ctaHeadline = document.querySelector('.cta-headline');
    const ctaText = document.querySelector('.cta-text');
    const ctaButtons = document.querySelector('.cta-buttons');
    const ctaTrustLine = document.querySelector('.cta-trust-line');
    const callNowBtn = ctaButtons ? ctaButtons.querySelector('.cta-btn-call') : null;
    
    if (strongCta) {
        const strongCtaTargets = [ctaHeadline, ctaText, ctaButtons, ctaTrustLine].filter(Boolean);
        if (strongCtaTargets.length) gsap.set(strongCtaTargets, { opacity: 0, y: 20 });
        gsap.set(strongCta, { scale: 0.98 });
        
        const ctaTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: strongCta,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
        ctaTimeline.to(strongCta, { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' });
        if (ctaHeadline) ctaTimeline.to(ctaHeadline, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
        if (ctaText) ctaTimeline.to(ctaText, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35');
        if (ctaButtons) ctaTimeline.to(ctaButtons, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
        if (ctaTrustLine) ctaTimeline.to(ctaTrustLine, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25');
        
        if (callNowBtn) {
            gsap.to(callNowBtn, {
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.35), 0 0 40px rgba(34, 197, 94, 0.15)',
                duration: 2,
                ease: 'power1.inOut',
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    // ============================================
    // CONTACT SECTION ANIMATION
    // ============================================
    const contactSection = document.querySelector('.home-contact');
    const contactTitle = contactSection ? contactSection.querySelector('.section-title') : null;
    const contactIntro = document.querySelector('.contact-intro');
    const contactInfo = document.querySelector('.contact-info');
    const contactFormCard = document.querySelector('.contact-form-card');
    const formGroups = document.querySelectorAll('.contact-form .form-group');
    
    // Form card fade-in on scroll
    if (contactFormCard) {
        gsap.fromTo(contactFormCard,
            { opacity: 0, y: 24 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: contactFormCard,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Section title animation
    if (contactTitle) {
        gsap.fromTo(contactTitle,
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
                    trigger: contactTitle,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Contact intro animation
    if (contactIntro) {
        gsap.fromTo(contactIntro,
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: contactIntro,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Contact info animation
    if (contactInfo) {
        gsap.fromTo(contactInfo,
            {
                opacity: 0,
                x: -20
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: contactInfo,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Form fields animate one-by-one on scroll
    formGroups.forEach((field, index) => {
        gsap.fromTo(field,
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: field,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // ============================================
    // FLOATING CALL BUTTON (MOBILE)
    // ============================================
    const floatingCta = document.querySelector('.floating-cta');
    
    if (floatingCta && window.innerWidth < 768) {
        // Fade in after 1.5s
        gsap.to(floatingCta, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: 1.5
        });
        
        // Gentle pulse loop
        gsap.to(floatingCta, {
            scale: 1.05,
            duration: 1.5,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            delay: 2.1
        });
    }
    
    // ============================================
    // SECTION TITLES ANIMATION (General)
    // ============================================
    const sectionTitles = document.querySelectorAll('.section-title');
    
    sectionTitles.forEach(title => {
        // Skip if already animated (services title)
        if (title.closest('.services-preview')) return;
        
        gsap.fromTo(title,
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
                    trigger: title,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // ============================================
    // BUTTON MICRO-INTERACTIONS
    // ============================================
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
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
    
    // ============================================
    // CONTACT FORM SUBMISSION HANDLER (Google Sheet via Apps Script)
    // Set data-submit-url on the form to your deployed Apps Script Web App URL.
    // ============================================
    const homeContactForm = document.getElementById('homeContactForm');
    if (homeContactForm) {
        homeContactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.btn-submit');
            const btnText = submitButton ? submitButton.querySelector('.btn-text') : null;
            if (!submitButton || !btnText) return;
            
            const scriptUrl = (this.getAttribute('data-submit-url') || '').trim();
            if (!scriptUrl) {
                btnText.textContent = 'Configure form URL';
                alert('Contact form is not connected. Add your Google Apps Script Web App URL to the form\'s data-submit-url attribute (see DEPLOY.md).');
                return;
            }
            
            submitButton.disabled = true;
            btnText.textContent = 'Sending...';
            
            // Submit via hidden iframe to avoid CORS (browser form POST, no fetch)
            const formData = {
                name: (this.querySelector('#homeName') || {}).value || '',
                email: (this.querySelector('#homeEmail') || {}).value || '',
                phone: (this.querySelector('#homePhone') || {}).value || '',
                projectType: (this.querySelector('#homeProjectType') || {}).value || '',
                budget: (this.querySelector('#homeBudget') || {}).value || '',
                timeline: (this.querySelector('#homeTimeline') || {}).value || '',
                website: (this.querySelector('#homeWebsite') || {}).value || '',
                message: (this.querySelector('#homeMessage') || {}).value || ''
            };
            
            let iframe = document.getElementById('contactFormHiddenFrame');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'contactFormHiddenFrame';
                iframe.name = 'contactFormHiddenFrame';
                iframe.setAttribute('aria-hidden', 'true');
                iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden';
                document.body.appendChild(iframe);
            }
            
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = scriptUrl;
            form.target = 'contactFormHiddenFrame';
            form.style.display = 'none';
            Object.keys(formData).forEach(function(key) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = formData[key];
                form.appendChild(input);
            });
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
            
            btnText.textContent = 'Message Sent!';
            if (typeof gsap !== 'undefined') {
                gsap.to(submitButton, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'back.out(1.7)',
                    yoyo: true,
                    repeat: 1
                });
            }
            homeContactForm.reset();
            setTimeout(function() {
                submitButton.disabled = false;
                btnText.textContent = 'Send Project Details';
            }, 3000);
        });
    }
});
