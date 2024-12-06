function checkRedirect() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error('User ID not found in localStorage');
        window.location.replace("index.html");
    }
}

checkRedirect();