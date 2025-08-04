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
     * Removes any existing link with id 'platform-stylesheet' or href 'styles.css'
     * to prevent conflicts, then appends the new one.
     */
    function loadPlatformStylesheet() {
        const isAndroidDevice = isAndroid();
        const stylesheetHref = isAndroidDevice ? '../../androidstyles.css' : '../../scripts/newsstyles.css';
        // Adjust the path if your androidstyles.css is in a different directory
        // e.g., './mobile/androidstyles.css'

        // Create the new link element
        const newStylesheetLink = createStylesheetLink(stylesheetHref);
        newStylesheetLink.id = 'platform-stylesheet'; // Give it an ID for identification

        // Try to find and remove any previously injected platform stylesheet
        const existingPlatformLink = document.getElementById('platform-stylesheet');
        if (existingPlatformLink) {
            existingPlatformLink.parentNode.removeChild(existingPlatformLink);
        }

        // Try to find and remove the default styles.css link if it exists in HTML
        // This prevents loading both stylesheets
        const defaultStylesheetLink = document.querySelector('link[href="styles.css"]');
        if (defaultStylesheetLink) {
            defaultStylesheetLink.parentNode.removeChild(defaultStylesheetLink);
        }

        // Append the new, platform-specific stylesheet to the head
        // Ensure the <head> element is available
        if (document.head) {
            document.head.appendChild(newStylesheetLink);
            console.log(`[Platform Styles] ${isAndroidDevice ? 'Android' : 'Non-Android'} detected. Loaded: ${stylesheetHref}`);
        } else {
            // Fallback in case the script runs extremely early
            console.warn("[Platform Styles] <head> not found. Retrying on DOMContentLoaded.");
            document.addEventListener('DOMContentLoaded', function () {
                if (document.head) {
                    document.head.appendChild(newStylesheetLink);
                    console.log(`[Platform Styles - Delayed] ${isAndroidDevice ? 'Android' : 'Non-Android'} detected. Loaded: ${stylesheetHref}`);
                } else {
                    console.error("[Platform Styles] <head> still not found after DOMContentLoaded. Stylesheet loading failed.");
                }
            });
        }
    }

    // --- Initialization ---

    // Run the loading logic when the DOM is ready or immediately if it already is.
    // Using DOMContentLoaded ensures the <head> is accessible.
    if (document.readyState === 'loading') {
        // The document is still loading, wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', loadPlatformStylesheet);
    } else {
        // The document has already loaded (DOM is ready)
        loadPlatformStylesheet();
    }

})();