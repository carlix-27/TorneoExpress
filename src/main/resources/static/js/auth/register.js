function handleIncompleteRegistration() {
    const urlParams = new URLSearchParams(window.location.search);
    const isIncomplete = urlParams.get('incomplete');
    const email = urlParams.get('email');

    if (isIncomplete) {
        showToast("You need to complete more fields to register an account.", "error");

        if (email) {
            document.getElementById('email').value = email;
        }
    }
}

window.onload = handleIncompleteRegistration;

function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const address = document.getElementById('location');

    const latitude = address.dataset.latitude;
    const longitude = address.dataset.longitude;

    if (!latitude || !longitude) {
        showToast("Debe seleccionar una ubicación válida.", "error");
        return;
    }

    const location = `${latitude},${longitude}`;

    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|io|co)$/i;

    if (!emailPattern.test(email)) {
        showToast("Por favor, ingrese un email válido.", "error");
        return;
    }

    if (name === "" || address.value === "" || password === "") {
        showToast("Todos los campos son obligatorios.", "error");
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
            showToast("Registration successful!", "success");
            window.location.replace("index.html?success=true");
        })
        .catch(error => {
            console.error("Registration error:", error);
            showToast("Hubo un error al registrar la cuenta.", "error");
        });
}
