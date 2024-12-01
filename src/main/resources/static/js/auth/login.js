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

            if (response === undefined) {
                console.error("userID is undefined in the response.");
                return;
            }

            localStorage.setItem("userId", response);

            showToast();
        } else {
            console.error(xhr.responseText);
            const errorMessage = document.getElementById('error-message');
            errorMessage.style.display = 'block';
        }
    };
    xhr.send(JSON.stringify(loginRequest));
}
