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
            localStorage.setItem("sessionId", response.sessionId); // Store sessionId in localStorage
            window.location.replace("home.html"); // Redirect to home page after successful login
        } else {
            console.error(xhr.responseText);
            const errorMessage = document.getElementById('error-message');
            errorMessage.style.display = 'block'; // Display the error message
        }
    };
    xhr.send(JSON.stringify(loginRequest));
}
