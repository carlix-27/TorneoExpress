const logoutButton = document.getElementById("logout-button");
const logoutModal = document.getElementById("logout-modal");
const confirmLogoutButton = document.getElementById("confirm-logout");
const cancelLogoutButton = document.getElementById("cancel-logout");

logoutButton.addEventListener("click", function () {
    console.log("Logout button clicked");
    logoutModal.style.display = "flex";
});

cancelLogoutButton.addEventListener("click", function () {
    console.log("Cancel button clicked");
    logoutModal.style.display = "none";
});

confirmLogoutButton.addEventListener("click", function () {
    console.log("Confirm logout clicked");
    localStorage.removeItem("userId");
    window.location.href = "index.html";
});
