/**
 * Dynamically loads styles.css or androidstyles.css based on the user's platform.
 * iOS and Android devices will use androidstyles.css; all others use styles.css.
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
            // Check for iOS devices
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
     * Loads the appropriate stylesheet based on platform.
     * Removes any previous platform-specific or default stylesheet to avoid conflicts.
     */
    function loadPlatformStylesheet() {
        const isMobileDevice = isAndroid() || isIOS();
        const stylesheetHref = isMobileDevice ? '../androidstyles.css' : '../styles.css';

        // Create new link element
        const newLink = createStylesheetLink(stylesheetHref);
        newLink.id = 'platform-stylesheet';

        // Remove previously injected platform stylesheet
        const existingPlatformLink = document.getElementById('platform-stylesheet');
        if (existingPlatformLink) {
            existingPlatformLink.remove();
        }

        // Remove hardcoded default stylesheet if present
        const defaultLink = document.querySelector('link[href="styles.css"]');
        if (defaultLink) {
            defaultLink.remove();
        }

        // Inject the correct stylesheet
        if (document.head) {
            document.head.appendChild(newLink);
            console.log(`[Platform Styles] ${isAndroid() ? 'Android' : isIOS() ? 'iOS' : 'Desktop'} → Loaded: ${stylesheetHref}`);
        } else {
            // Fallback if head isn't ready yet
            console.warn("[Platform Styles] <head> not ready. Delaying injection.");
            document.addEventListener('DOMContentLoaded', () => {
                if (document.head) {
                    document.head.appendChild(newLink);
                    console.log(`[Platform Styles - Delayed] ${isAndroid() ? 'Android' : isIOS() ? 'iOS' : 'Desktop'} → Loaded: ${stylesheetHref}`);
                } else {
                    console.error("[Platform Styles] Failed to inject stylesheet: <head> missing.");
                }
            });
        }
    }

    // --- Initialize ---

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPlatformStylesheet);
    } else {
        loadPlatformStylesheet();
    }

})();
