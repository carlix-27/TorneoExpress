function handleIncompleteRegistration() {
    const urlParams = new URLSearchParams(window.location.search);
    const isIncomplete = urlParams.get('incomplete');
    const email = urlParams.get('email');
    const name = urlParams.get('name');

    if (isIncomplete) {
        showErrorToast("You need to complete more fields to register an account.", "error");

        if (email) {
            document.getElementById('email').value = email;
        }
        if (name) {
            document.getElementById('name').value = name;
        }
    }
}

document.addEventListener("DOMContentLoaded", handleIncompleteRegistration);

function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const address = document.getElementById('location');

    const latitude = address.dataset.latitude;
    const longitude = address.dataset.longitude;

    if (!latitude || !longitude) {
        showErrorToast("Debe seleccionar una ubicación válida.", "error");
        return;
    }

    const location = `${latitude},${longitude}`;

    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|io|co)$/i;

    if (!emailPattern.test(email)) {
        showErrorToast("Por favor, ingrese un email válido.", "error");
        return;
    }

    if (name === "" || address.value === "" || password === "") {
        showErrorToast("Todos los campos son obligatorios.", "error");
        return;
    }

    const formData = {
        name: name,
        email: email,
        location: location,
        password: password
    };

    fetch('/api/auth/submit_registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(() => {
            showSuccessToast("Registration successful!");
            window.location.replace("index.html?success=true");
        })
        .catch(error => {
            console.error("Registration error:", error);
            showErrorToast("Hubo un error al registrar la cuenta.", "error");
        });
}
