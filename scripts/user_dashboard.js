// user_dashboard.js
(function () {
    'use strict';

    /**
     * Decreases the quantity in an input field, ensuring it doesn't go below 1.
     * @param {HTMLElement} button - The decrease button element.
     */
    function decreaseQuantity(button) {
        const input = button.nextElementSibling;
        if (input && input.tagName === 'INPUT' && !isNaN(input.value) && parseInt(input.value) > 1) {
            input.value = parseInt(input.value) - 1;
        }
    }

    /**
     * Increases the quantity in an input field, ensuring it doesn't exceed the max attribute.
     * @param {HTMLElement} button - The increase button element.
     */
    function increaseQuantity(button) {
        const input = button.previousElementSibling;
        if (input && input.tagName === 'INPUT') {
            const currentValue = parseInt(input.value) || 0; // Default to 0 if NaN
            const maxValue = parseInt(input.max) || Infinity; // Default to no limit if NaN or missing

            if (currentValue < maxValue) {
                input.value = currentValue + 1;
            }
        }
    }

    /**
     * Hides a specified dropdown menu if a click occurs outside of it or its trigger.
     * @param {Event} event - The click event object.
     * @param {string} triggerId - The ID of the element that triggers the dropdown.
     * @param {string} dropdownId - The ID of the dropdown menu element.
     */
    function handleDropdownClose(event, triggerId, dropdownId) {
        const triggerElement = document.getElementById(triggerId);
        const dropdownElement = document.getElementById(dropdownId);

        if (triggerElement && dropdownElement &&
            !triggerElement.contains(event.target) &&
            !dropdownElement.contains(event.target)) {
            dropdownElement.style.display = "none";
        }
    }

    // --- Initialization & Event Listeners ---

    /**
     * Initializes dashboard-specific event listeners.
     */
    function initDashboardListeners() {
        // Example: Close a specific dropdown (adjust IDs as needed)
        // If you have multiple dropdowns, you might need a more generic approach
        // or call handleDropdownClose for each one with specific IDs.
        // document.addEventListener("click", function (event) {
        //     handleDropdownClose(event, "userIcon", "dropdownMenu");
        // });

        // Expose functions to global scope if they are called directly by HTML onclick attributes
        // It's generally better to attach listeners in JS, but if HTML onclick is used:
        window.decreaseQuantity = decreaseQuantity;
        window.increaseQuantity = increaseQuantity;
    }

    // Initialize when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboardListeners);
    } else {
        // DOM is already loaded
        initDashboardListeners();
    }

})();