document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    // Get elements
    const loginCard = document.getElementById("login-card");
    const registerCard = document.getElementById("register-card");
    const profileCard = document.getElementById("profile-card");

    if (isLoggedIn) {
        // Hide login and register, show profile
        loginCard.style.display = "none";
        registerCard.style.display = "none";
        profileCard.style.display = "block";
    } else {
        // Show login and register, hide profile
        loginCard.style.display = "block";
        registerCard.style.display = "block";
        profileCard.style.display = "none";
    }

    // Logout functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("userId");
            window.location.href = "index.html";
        });
    }
});
