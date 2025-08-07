/**
 * Dynamically loads styles.css or androidstyles.css based on the user's platform.
 * This script should be included in the HTML <head> before other stylesheets
 * whose loading it might control, or at least before the body content that depends on the styles.
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
            // The case-insensitive 'i' flag is important as user agent strings can vary
            return /android/i.test(userAgent);
        } catch (error) {
            console.warn("Error detecting Android platform:", error);
            return false; // Default to not Android on error
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
     * @param {string} href - The path to the CSS file.
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
     * Removes any existing link with id 'platform-stylesheet' or href containing 'styles.css'
     * to prevent conflicts, then appends the new one.
     */
    function loadPlatformStylesheet() {
        const isMobileDevice = isAndroid() || isIOS();
        // Fixed path: corrected double space and used consistent folder structure
        const stylesheetHref = isMobileDevice 
            ? 'prtf  pages/scripts/androidstyles.css' 
            : 'prtf  pages/scripts/styles.css';

        // Create the new link element
        const newStylesheetLink = createStylesheetLink(stylesheetHref);
        newStylesheetLink.id = 'platform-stylesheet'; // For easy identification/removal

        // Remove previously injected platform stylesheet
        const existingPlatformLink = document.getElementById('platform-stylesheet');
        if (existingPlatformLink) {
            existingPlatformLink.parentNode.removeChild(existingPlatformLink);
        }

        // Remove any existing default styles.css link (even if full path differs)
        // Using endsWith to catch 'styles.css' regardless of relative path issues
        const defaultStylesheetLink = document.querySelector('link[href$="styles.css"]');
        if (defaultStylesheetLink) {
            defaultStylesheetLink.parentNode.removeChild(defaultStylesheetLink);
        }

        // Append the new stylesheet
        if (document.head) {
            document.head.appendChild(newStylesheetLink);
            console.log(
                `[Platform Styles] ${isAndroid() ? 'Android' : isIOS() ? 'iOS' : 'Desktop'} → Loaded: ${stylesheetHref}`
            );
        } else {
            console.warn("[Platform Styles] <head> not found. Retrying on DOMContentLoaded.");
            document.addEventListener('DOMContentLoaded', function () {
                if (document.head) {
                    document.head.appendChild(newStylesheetLink);
                    console.log(
                        `[Platform Styles - Delayed] ${isAndroid() ? 'Android' : isIOS() ? 'iOS' : 'Desktop'} → Loaded: ${stylesheetHref}`
                    );
                } else {
                    console.error("[Platform Styles] <head> still not found after DOMContentLoaded. Stylesheet loading failed.");
                }
            });
        }
    }

    // --- Initialization ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPlatformStylesheet);
    } else {
        loadPlatformStylesheet();
    }

})();
