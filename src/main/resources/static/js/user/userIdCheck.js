function userIdCheck() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        window.location.replace("index.html");
    }
}

userIdCheck();