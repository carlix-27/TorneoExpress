document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button");
    const logoutModal = document.getElementById("logout-modal");
    const confirmLogoutButton = document.getElementById("confirm-logout");
    const cancelLogoutButton = document.getElementById("cancel-logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            if (logoutModal) {
                logoutModal.style.display = "flex";
            }
        });
    } else {
    }

    if (cancelLogoutButton) {
        cancelLogoutButton.addEventListener("click", () => {
            if (logoutModal) {
                logoutModal.style.display = "none";
            }
        });
    } else {
    }

    if (confirmLogoutButton) {
        confirmLogoutButton.addEventListener("click", () => {
            localStorage.removeItem("userId");
            window.location.href = "index.html";
        });
    } else {
    }
});
