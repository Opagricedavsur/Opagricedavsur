/**
 * Dynamically loads newsstyles.css or androidstyles.css based on the user's platform.
 * Android (and optionally iOS) devices get androidstyles.css; others get newsstyles.css.
 * This script should be included in the HTML <head> before other stylesheets
 * to prevent style conflicts or flash of unstyled content.
 */
(function () {
    'use strict';

    /**
     * Detects if the current platform is Android.
     * @returns {boolean} True if Android is detected, false otherwise.
     */
    function isAndroid() {
        try {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return /android/i.test(userAgent);
        } catch (error) {
            console.warn("Error detecting Android platform:", error);
            return false;
        }
    }

    /**
     * Detects if the current platform is iOS (iPhone, iPad, iPod).
     * @returns {boolean} True if iOS is detected, false otherwise.
     */
    function isIOS() {
        try {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        } catch (error) {
            console.warn("Error detecting iOS platform:", error);
            return false;
        }
    }

    /**
     * Creates a <link> element for a stylesheet.
     * @param {string} href - Path to the CSS file.
     * @returns {HTMLLinkElement} The created link element.
     */
    function createStylesheetLink(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        return link;
    }

    /**
     * Inserts the platform-specific stylesheet into the document head.
     * Removes any previously injected platform stylesheet or default style links
     * to prevent conflicts.
     */
    function loadPlatformStylesheet() {
        const isMobileDevice = isAndroid() || isIOS();
        // Use androidstyles.css for Android/iOS, otherwise newsstyles.css
        const stylesheetHref = isMobileDevice 
            ? '../../androidstyles.css' 
            : '../../scripts/newsstyles.css';

        // Create new stylesheet link
        const newLink = createStylesheetLink(stylesheetHref);
        newLink.id = 'platform-stylesheet'; // For identification/removal

        // Remove previously injected platform-specific stylesheet
        const existingPlatformLink = document.getElementById('platform-stylesheet');
        if (existingPlatformLink) {
            existingPlatformLink.remove();
        }

        // Remove any existing link pointing to either styles.css or newsstyles.css
        // Using attribute selector to catch variations in path
        const staleLinks = document.querySelectorAll('link[href*="styles.css"], link[href*="newsstyles.css"]');
        staleLinks.forEach(link => {
            if (link !== newLink) {
                link.remove();
            }
        });

        // Inject the correct stylesheet
        if (document.head) {
            document.head.appendChild(newLink);
            console.log(
                `[Platform Styles] ${isAndroid() ? 'Android' : isIOS() ? 'iOS' : 'Desktop'} → Loaded: ${stylesheetHref}`
            );
        } else {
            // Fallback when <head> isn't ready yet
            console.warn("[Platform Styles] <head> not available. Deferring to DOMContentLoaded.");
            document.addEventListener('DOMContentLoaded', () => {
                if (document.head) {
                    document.head.appendChild(newLink);
                    console.log(
                        `[Platform Styles - Delayed] ${isAndroid() ? 'Android' : isIOS() ? 'iOS' : 'Desktop'} → Loaded: ${stylesheetHref}`
                    );
                } else {
                    console.error("[Platform Styles] <head> still missing after DOMContentLoaded. Load failed.");
                }
            });
        }
    }

    // --- Initialize on DOM Ready ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPlatformStylesheet);
    } else {
        loadPlatformStylesheet();
    }

})();
