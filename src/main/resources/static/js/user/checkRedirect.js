function checkRedirect() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        window.location.replace("index.html");
    }
}

checkRedirect();