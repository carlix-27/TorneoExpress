const logoutButton = document.getElementById("logout-button");
const logoutButtons = document.getElementById("logout-buttons");
const confirmLogoutButton = document.getElementById("confirm-logout");
const cancelLogoutButton = document.getElementById("cancel-logout");

logoutButton.addEventListener("click", function() {
    // Show the confirm/cancel buttons when clicking the logout button
    logoutButtons.style.display = "inline-flex"; // Make the buttons appear
    console.log("Logout buttons should now be visible.");
});

confirmLogoutButton.addEventListener("click", function() {
    // Perform logout and redirect to the home page
    localStorage.removeItem("userId");
    window.location.href = "index.html";
});

cancelLogoutButton.addEventListener("click", function() {
    // Hide the buttons if cancel is clicked
    logoutButtons.style.display = "none"; // Hide the buttons
});
