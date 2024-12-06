document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button");
    const logoutModal = document.getElementById("logout-modal");
    const confirmLogoutButton = document.getElementById("confirm-logout");
    const cancelLogoutButton = document.getElementById("cancel-logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            console.log("Logout button clicked");
            if (logoutModal) {
                logoutModal.style.display = "flex";
            } else {
                console.error("Logout modal not found");
            }
        });
    } else {
        console.error("Logout button not found");
    }

    if (cancelLogoutButton) {
        cancelLogoutButton.addEventListener("click", () => {
            console.log("Cancel button clicked");
            if (logoutModal) {
                logoutModal.style.display = "none";
            }
        });
    } else {
        console.error("Cancel logout button not found");
    }

    if (confirmLogoutButton) {
        confirmLogoutButton.addEventListener("click", () => {
            console.log("Confirm logout clicked");
            localStorage.removeItem("userId");
            window.location.href = "index.html";
        });
    } else {
        console.error("Confirm logout button not found");
    }
});
