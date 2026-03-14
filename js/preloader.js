/**
 * Portfolio Preloader
 * Handwriting-style typewriter effect and smooth fade-out on load
 */
(function () {
    'use strict';

    var preloader = document.getElementById('preloader');
    var line1 = document.getElementById('preloader-line1');
    var line2 = document.getElementById('preloader-line2');
    var cursor = document.getElementById('preloader-cursor');
    var startTime = typeof performance !== 'undefined' ? performance.now() : 0;
    var MIN_DISPLAY_MS = 3200;

    if (!preloader || !line1 || !line2) return;

    var LINE1_TEXT = "Hi, I'm Pragnesh 👋";
    var LINE2_TEXT = "Preparing something awesome...";
    var CHAR_DELAY = 70;
    var LINE_DELAY = 400;

    function wrapChars(element, text, baseDelay) {
        element.innerHTML = '';
        text.split('').forEach(function (ch, i) {
            var span = document.createElement('span');
            span.className = 'preloader__char';
            span.textContent = ch;
            span.style.animationDelay = (baseDelay + i * CHAR_DELAY) + 'ms';
            element.appendChild(span);
        });
    }

    function runTypewriter() {
        wrapChars(line1, LINE1_TEXT, 0);
        if (cursor) cursor.classList.remove('hidden');
        setTimeout(function () {
            if (cursor) cursor.classList.add('hidden');
            wrapChars(line2, LINE2_TEXT, 0);
            line2.querySelectorAll('.preloader__char').forEach(function (el, i) {
                el.style.animationDelay = (i * 45) + 'ms';
            });
        }, LINE1_TEXT.length * CHAR_DELAY + LINE_DELAY);
    }

    function hidePreloader() {
        preloader.classList.add('preloader--hidden');
        setTimeout(function () { preloader.remove(); }, 900);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runTypewriter);
    } else {
        runTypewriter();
    }

    window.addEventListener('load', function () {
        var elapsed = (typeof performance !== 'undefined' ? performance.now() : 0) - startTime;
        var remaining = Math.max(400, MIN_DISPLAY_MS - elapsed);
        setTimeout(hidePreloader, remaining);
    });
})();
