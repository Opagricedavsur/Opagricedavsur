window.addEventListener("DOMContentLoaded", () => {
  updateUI();
  document.getElementById("current-year").textContent = new Date().getFullYear();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const sidebar = document.getElementById("sidebar");

  if (sidebar) {
    if (isLoggedIn) {
      sidebar.classList.add("hide");
      sidebar.classList.remove("show");
    } else {
      sidebar.classList.add("hide");
      sidebar.classList.remove("show");
    }
  }
});

function updateUI() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const fullName = localStorage.getItem("fullName") || "User";
  const email = localStorage.getItem("email") || "";
  const rawImg = localStorage.getItem("rawProfileImg") || "";
  const profileImg = processImageUrl(rawImg);
    const firstName = localStorage.getItem("firstName") || "";
  const middleName = localStorage.getItem("middleName") || "";
  const lastName = localStorage.getItem("lastName") || "";

  document.querySelectorAll(".auth-only").forEach(link => {
    link.style.display = isLoggedIn ? "inline-block" : "none";
  });

  const loginArea = document.getElementById("login-area");
  if (isLoggedIn) {
    loginArea.innerHTML = `
      <button class="profile-btn" id="profileBtn" aria-label="Profile menu">
        <img id="profilePic" src="${profileImg}" alt="${fullName}'s profile" class="profile-img"
          onerror="this.onerror=null;this.src='logo-pic/account logo.png'">
      </button>
      <div id="profileDropdown" class="profile-dropdown">
        <div class="user-info">
          <img src="${profileImg}" class="dropdown-img"
            onerror="this.onerror=null;this.src='logo-pic/account logo.png'">
          <div>
            <p class="user-name">${escapeHtml(fullName)}</p>
            <p class="user-email">${escapeHtml(email)}</p>
          </div>
        </div>
        <button type="button" onclick="logout()" class="logout-btn">Logout</button>
      </div>
    `;

    const profileBtn = document.getElementById("profileBtn");
    const dropdown = document.getElementById("profileDropdown");
    /*user logo*/
    const sidebarUserInfo = document.getElementById("sidebar-user-info");
if (sidebarUserInfo && isLoggedIn) {
  const firstName = localStorage.getItem("firstName") || "";
  const middleName = localStorage.getItem("middleName") || "";
  const lastName = localStorage.getItem("lastName") || "";

  const middleInitial = middleName ? `${middleName.charAt(0).toUpperCase()}.` : "";
  const formattedFullName = `${firstName} ${middleName} ${lastName}`.trim().toUpperCase();

  sidebarUserInfo.innerHTML = `
    <div class="user-info">
    <img src="${profileImg}" alt="${escapeHtml(formattedFullName)}" class="logo" style="width: 40px; margin-right: 10px; border-radius: 50%; object-fit: cover;">
          <div>
                 <strong style="font-size: 18px;">${escapeHtml(formattedFullName)}</strong>
          </div>
        </div>
  `;
}




    profileBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && e.target !== profileBtn) {
        dropdown.classList.remove("show");
      }
    });
  } else {
    loginArea.innerHTML = `<button class="button" onclick="toggleLoginModal()">Login</button>`;
  }
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function processImageUrl(rawImg) {
  if (!rawImg) return "logo-pic/account logo.png";
  if (rawImg.includes("drive.google.com/file/d/")) {
    const fileId = rawImg.split("/d/")[1].split("/")[0];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } else if (rawImg.includes("<img") && rawImg.includes("src=")) {
    const match = rawImg.match(/src=["']([^"']+)["']/);
    return match ? match[1] : "logo-pic/account logo.png";
  }
  return rawImg;
}
