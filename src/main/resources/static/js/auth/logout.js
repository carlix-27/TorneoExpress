function logout() {
    localStorage.removeItem("userId"); // Remove userId from localStorage
    window.location.href = "index.html"; // Redirect to login page after logout
}

document.getElementById("logout-link").addEventListener("click", confirmLogout);

function confirmLogout() {
    const logoutConfirmed = window.confirm('Do you want to logout?');
    if (logoutConfirmed) {
        localStorage.removeItem("userId");
        window.location.href = "login.html";
    }
}