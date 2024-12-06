function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const address = document.getElementById('location');

    const latitude = address.dataset.latitude;
    const longitude = address.dataset.longitude;

    if (!latitude || !longitude) {
        displayErrorMessage("Debe seleccionar una ubicación válida.");
        return;
    }

    const location = `${latitude},${longitude}`;

    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|io|co)$/i;

    if (!emailPattern.test(email)) {
        displayErrorMessage("Por favor, ingrese un email válido.");
        return;
    }

    if (name === "" || address.value === "" || password === "") {
        displayErrorMessage("Todos los campos son obligatorios.");
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
            window.location.replace("index.html?success=true");
        })
}

