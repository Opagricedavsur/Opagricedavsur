// openmenu.js
(function () {
    'use strict';

    function initSidebarToggle() {
        const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
        const sidebar = document.getElementById("sidebar");

        if (toggleSidebarBtn && sidebar) {
            toggleSidebarBtn.addEventListener("click", (event) => {
                event.preventDefault();

                sidebar.classList.toggle("hide");

                // --- Toggle 'active' class for hamburger animation ---
                toggleSidebarBtn.classList.toggle("active");
                // -------------------------------
            });
        } else {
            console.warn("Sidebar toggle button or sidebar element not found.");
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebarToggle);
    } else {
        initSidebarToggle();
    }

})();