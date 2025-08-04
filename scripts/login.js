// login.js
const backendURL = "https://script.google.com/macros/s/AKfycbzffkrxeSY5HqPc4KnwEX0LGE19gbTesa0p7Nq5GWQIsdB8wT23JOaVHHH9E1LPdoZq/exec";
const logScriptURL = "https://script.google.com/macros/s/AKfycbyxdjN9rSxdQIx1POoqfVV75wvPqCDoXJ-jpSeFuzeSpctBkyQFMgUDovhxDqJyGcWiAg/exec";

// Login form logic
document.getElementById("logForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const emailOrUsername = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const loadingSpinner = document.getElementById("login-loading-spinner");
  const loginModal = document.getElementById("loginModal"); // Get modal element

  // Show loading spinner
  if (loadingSpinner) {
    loadingSpinner.style.display = "flex";
  }

  if (!navigator.onLine) {
    if (loadingSpinner) loadingSpinner.style.display = "none";
    alert("📡 No internet connection. Please check your network.");
    return;
  }

  try {
    const loginRes = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: "login", username: emailOrUsername, password })
    });

    const loginData = await loginRes.json();

    if (!loginData.success) {
      if (loadingSpinner) loadingSpinner.style.display = "none";
      switch (loginData.reason) {
        case "username": alert("❌ Username not found."); break;
        case "password": alert("🔒 Incorrect password."); break;
        default: alert("❌ Invalid credentials.");
      }
      return;
    }

    const { username, authToken } = loginData;
    const userRes = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: "getUserData", username, authToken })
    });

    const userData = await userRes.json();

    if (!userData.success) {
      if (loadingSpinner) loadingSpinner.style.display = "none";
      alert("⚠️ Login token invalid or expired.");
      return;
    }

    const rawImg = userData.profileImg || "";
    const profileImg = processImageUrl(rawImg);

    // Store user data in localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("username", username);
    localStorage.setItem("email", userData.email || "");
    localStorage.setItem("fullName", `${userData.firstName} ${userData.lastName}`);
    localStorage.setItem("profileImg", profileImg);
    localStorage.setItem("rawProfileImg", rawImg);
    localStorage.setItem("firstName", `${userData.firstName}`);
    localStorage.setItem("middleName", `${userData.middleInitial}`);
    localStorage.setItem("lastName", `${userData.lastName}`);

    // Log the login action
    await fetch(logScriptURL, {
      method: "POST",
      body: JSON.stringify({ username, email: userData.email || "", action: "login" })
    });

    // --- Changes Start Here ---
    // 1. Close the login modal
    if (loginModal) {
      loginModal.style.display = "none"; // Or use a fade-out animation if preferred
    }

    // 2. Hide loading spinner
    if (loadingSpinner) {
      loadingSpinner.style.display = "none";
    }

    // 3. Show welcome message (consider using a toast notification instead of alert)
    alert(`✅ Welcome, ${userData.firstName} ${userData.lastName}!`);

    // 4. Reload the current page to reflect the login state
    //    This allows session.js or other scripts to update the UI.
    //    Remove or comment out the redirect logic:
    /*
    const redirectURL = localStorage.getItem("redirectAfterLogin") || "index.html";
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = redirectURL;
    */
    // --- End Changes ---

    // Reload the current page
    window.location.reload();

  } catch (error) {
    console.error("Login error:", error);
    if (loadingSpinner) loadingSpinner.style.display = "none";
    alert("⚠️ Something went wrong during login.");
  } finally {
    // Ensure spinner is hidden in case of early return or error after showing it
    if (loadingSpinner && loadingSpinner.style.display !== "none") {
      loadingSpinner.style.display = "none";
    }
  }
});

// Helper to convert image link
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

// Function to toggle the login modal visibility
function toggleLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = modal.style.display === "block" ? "none" : "block";
  }
}

// Close modal if clicked outside content
window.addEventListener("click", function (event) {
  const modal = document.getElementById("loginModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});