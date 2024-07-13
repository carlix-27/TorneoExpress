let autocomplete;

function initAutocomplete(apiKey) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initializeAutocomplete`;
    script.async = true;
    script.defer = true;
    script.onerror = function() {
        console.error("Error loading Google Maps script");
    };
    document.head.appendChild(script);
}

function initializeAutocomplete() {
    const input = document.getElementById('location');
    if (!input) {
        console.error("No input element with ID 'location' found.");
        return;
    }
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            const location = place.geometry.location;
            input.dataset.latitude = location.lat();
            input.dataset.longitude = location.lng();
        } else {
            console.error('No details available for input: ' + place.name);
        }
    });
}

function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const address = document.getElementById('location'); // Corrected here

    const latitude = address.dataset.latitude; // Corrected here
    const longitude = address.dataset.longitude; // Corrected here

    console.log(latitude);
    console.log(longitude);

    if (!latitude || !longitude) {
        displayErrorMessage("Debe seleccionar una ubicación válida.");
        return;
    }

    const location = `${latitude},${longitude}`;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/googleMapsApiKey')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch API key: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(apiKey => {
            initAutocomplete(apiKey);
        })
        .catch(error => {
            console.error('Error fetching API key:', error);
        });
});
