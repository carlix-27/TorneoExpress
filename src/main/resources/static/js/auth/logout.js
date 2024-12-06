const logoutButton = document.getElementById("logout-button");
const logoutModal = document.getElementById("logout-modal");
const confirmLogoutButton = document.getElementById("confirm-logout");
const cancelLogoutButton = document.getElementById("cancel-logout");

logoutButton.addEventListener("click", function () {
    logoutModal.style.display = "flex";
});

cancelLogoutButton.addEventListener("click", function () {
    logoutModal.style.display = "none";
});

confirmLogoutButton.addEventListener("click", function () {
    localStorage.removeItem("userId");
    window.location.href = "index.html";
});
