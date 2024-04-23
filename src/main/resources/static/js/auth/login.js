function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginRequest = {
        email: email,
        password: password
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/auth/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);

            // Check if response.userID is undefined (corrected key)
            if (response.userID === undefined) {
                console.error("userID is undefined in the response.");
                return;
            }

            // Store sessionId and userID in localStorage
            localStorage.setItem("sessionId", response.sessionId);
            localStorage.setItem("userId", response.userID); // Corrected key

            // Redirect to home page after successful login
            redirectToHome();
        } else {
            console.error(xhr.responseText);
            const errorMessage = document.getElementById('error-message');
            errorMessage.style.display = 'block'; // Display the error message
        }
    };
    xhr.send(JSON.stringify(loginRequest));
}

// Function to redirect to home page
function redirectToHome() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success')) {
        const successMessage = document.getElementById('success-message');
        successMessage.style.display = 'block'; // Display the success message
    }

    window.location.replace("home.html");
}
