/**
 * Circular Widget - Interactive Entry Point
 * Handles widget background animation and navigation to beyound-work page
 */

(function() {
    'use strict';

    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP is required for widget animations');
        return;
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

    function initWidget() {
        const widgetContainer = document.querySelector('.widget-container');
        const widgetBackground = document.querySelector('.widget-background');
        
        if (!widgetContainer || !widgetBackground) {
            console.warn('Widget elements not found');
            return;
        }

        // Initialize continuous background motion
        // This animation runs continuously and never stops
        function initBackgroundMotion() {
            gsap.to(widgetBackground, {
                backgroundPosition: '51% 49%',
                duration: 30,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            });
        }

        // Initialize background motion (always running)
        initBackgroundMotion();
    }
})();


