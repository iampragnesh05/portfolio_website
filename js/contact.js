/* ============================================
   Contact Page Animations with GSAP
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
    
    // Contact Info Animation
    gsap.fromTo('.contact-info',
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
                trigger: '.contact-info',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );
    
    // Contact Detail Items Stagger Animation
    gsap.utils.toArray('.contact-detail-item').forEach((item, index) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                x: -30
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: 'power2.out',
                delay: index * 0.15,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Contact Form Animation
    gsap.fromTo('.contact-form-wrapper',
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
                trigger: '.contact-form-wrapper',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );
    
    // Form Fields Stagger Animation
    gsap.utils.toArray('.form-group').forEach((field, index) => {
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
    
    // Form Input Focus Animations
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            gsap.to(this, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        input.addEventListener('blur', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Form Submission Handler
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (contactForm && successMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.btn-submit');
            const btnText = submitButton.querySelector('.btn-text');
            const btnLoader = submitButton.querySelector('.btn-loader');
            
            // Disable form and show loading state
            submitButton.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline';
            
            // Simulate form submission (no backend)
            setTimeout(() => {
                // Hide form
                gsap.to(contactForm, {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    ease: 'power2.in',
                    onComplete: function() {
                        contactForm.style.display = 'none';
                        
                        // Show success message
                        successMessage.classList.add('active');
                        gsap.fromTo(successMessage,
                            {
                                opacity: 0,
                                scale: 0.8,
                                y: 20
                            },
                            {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                duration: 0.6,
                                ease: 'back.out(1.7)'
                            }
                        );
                        
                        // Animate success icon
                        gsap.fromTo('.success-icon',
                            {
                                scale: 0,
                                rotation: -180
                            },
                            {
                                scale: 1,
                                rotation: 0,
                                duration: 0.8,
                                ease: 'back.out(1.7)',
                                delay: 0.2
                            }
                        );
                        
                        // Animate success text
                        gsap.fromTo('.success-title, .success-text',
                            {
                                opacity: 0,
                                y: 10
                            },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: 'power2.out',
                                delay: 0.4,
                                stagger: 0.1
                            }
                        );
                    }
                });
            }, 1500);
        });
    }
    
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

