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
            // Handle successful login
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            // save token
            localStorage.setItem("token", response.token);
            // Redirect to home page or show success message
            window.location.replace("home.html");
        } else {
            // Handle error
            console.error(xhr.responseText);
            // Show error message
            // Redirect to login error page
            window.location.replace("login_error.html");
        }
    };
    xhr.send(JSON.stringify(loginRequest));
}
