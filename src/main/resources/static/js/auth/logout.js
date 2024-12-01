function logout() {
    localStorage.removeItem("userId"); // Remove userId from localStorage
    window.location.href = "index.html"; // Redirect to login page after logout
}