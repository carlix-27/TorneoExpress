function logout() {
    confirmLogout()
    localStorage.removeItem("userId");
    window.location.href = "index.html";
}

document.getElementById("logout-link").addEventListener("click", confirmLogout);

function confirmLogout() {
    const logoutConfirmed = window.confirm('Do you want to logout?');
    if (logoutConfirmed) {
        localStorage.removeItem("userId");
        window.location.href = "index.html";
    }
}