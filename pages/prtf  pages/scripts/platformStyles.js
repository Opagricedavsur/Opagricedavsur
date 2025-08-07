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
     * Detects if the current platform is iOS.
     * @returns {boolean} True if iOS is detected, false otherwise.
     */
    function isIOS() {
        try {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            // Check for iOS devices (iPhone, iPad, iPod)
            return /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        } catch (error) {
            console.warn("Error detecting iOS platform:", error);
            return false; // Default to not iOS on error
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
        const isIOSDevice = isIOS();
        // Use androidstyles.css for both Android and iOS devices
        const stylesheetHref = (isAndroidDevice || isIOSDevice) ? 'scripts/androidstyles.css' : 'scripts/styles.css';

        // Create the new link element
        const newStylesheetLink = createStylesheetLink(stylesheetHref);
        newStylesheetLink.id = 'platform-stylesheet'; // Give it an ID for identification

        // Try to find and remove any previously injected platform stylesheet
        const existingPlatformLink = document.getElementById('platform-stylesheet');
        if (existingPlatformLink) {
            existingPlatformLink.parentNode.removeChild(existingPlatformLink);
        }

        // Try to find and remove the default styles.css link if it exists in HTML
        const defaultStylesheetLink = document.querySelector('link[href="styles.css"]');
        if (defaultStylesheetLink) {
            defaultStylesheetLink.parentNode.removeChild(defaultStylesheetLink);
        }

        // Append the new, platform-specific stylesheet to the head
        if (document.head) {
            document.head.appendChild(newStylesheetLink);
            console.log(`[Platform Styles] ${isAndroidDevice ? 'Android' : isIOSDevice ? 'iOS' : 'Non-Mobile'} detected. Loaded: ${stylesheetHref}`);
        } else {
            // Fallback in case the script runs extremely early
            console.warn("[Platform Styles] <head> not found. Retrying on DOMContentLoaded.");
            document.addEventListener('DOMContentLoaded', function () {
                if (document.head) {
                    document.head.appendChild(newStylesheetLink);
                    console.log(`[Platform Styles - Delayed] ${isAndroidDevice ? 'Android' : isIOSDevice ? 'iOS' : 'Non-Mobile'} detected. Loaded: ${stylesheetHref}`);
                } else {
                    console.error("[Platform Styles] <head> still not found after DOMContentLoaded. Stylesheet loading failed.");
                }
            });
        }
    }

    // Run the loading logic when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPlatformStylesheet);
    } else {
        loadPlatformStylesheet();
    }

})();
