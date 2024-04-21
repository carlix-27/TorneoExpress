function logout() {
    // Make a request to your logout endpoint
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/auth/logout', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            localStorage.removeItem("sessionId"); // Clear sessionId from localStorage
            window.location.replace("login.html"); // Redirect to login page after logout
        } else {
            console.error(xhr.responseText);
            // Handle any error response
        }
    };
    xhr.send();
}
