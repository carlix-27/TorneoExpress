let autocomplete;

function initAutocomplete() {
    const input = document.getElementById('address');
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            const location = place.geometry.location;
            document.getElementById('address').dataset.latitude = location.lat();
            document.getElementById('address').dataset.longitude = location.lng();
        } else {
            console.error('No details available for input: ' + place.name);
        }
    });
}

function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const latitude = document.getElementById('address').dataset.latitude;
    const longitude = document.getElementById('address').dataset.longitude;

    if (!latitude || !longitude) {
        displayErrorMessage("Debe seleccionar una ubicación válida.");
        return;
    }

    const location = `${latitude},${longitude}`;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        displayErrorMessage("Por favor, ingrese un email válido.")
        return;
    }

    if (name === "" || address === "" || password === "") {
        displayErrorMessage("Todos los campos son obligatorios.")
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
        .then(data => {
            console.log('User registered successfully:', data);
            window.location.replace("login.html?success=true");
        })
        .catch(error => {
            console.error('Error registering user:', error);
        });
}

function displayErrorMessage(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    initAutocomplete();
});
