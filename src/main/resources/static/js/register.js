function register() {
    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const registerRequest = {
        name: name,
        location: location,
        email: email,
        password: password
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/auth/submit_registration', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            localStorage.setItem("token", response.token);
            window.location.replace("login.html?success=true");
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = "Email already in use"; // Set your error message here
            errorMessage.style.display = "block"; // Display the error message div
            console.error(xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(registerRequest));
}