let autocomplete;

function initAutocomplete(apiKey) {
    const input = document.getElementById('location');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initializeAutocomplete`;
    script.async = true;
    script.defer = true;
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

function fetchSports() {
    fetch('/api/sports')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch sports: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(sports => {
            const sportDropdown = document.getElementById('sport');
            sports.forEach(sport => {
                const option = document.createElement('option');
                option.value = sport.sportId;
                option.text = sport.sportName;
                sportDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching sports:', error);
        });
}

function createTeam(event) {
    event.preventDefault();

    const name = document.getElementById('team-name').value.trim();
    const sportId = document.getElementById('sport').value;
    const latitude = document.getElementById('location').dataset.latitude;
    const longitude = document.getElementById('location').dataset.longitude;

    const isPrivate = document.getElementById("privacy");
    const captainId = localStorage.getItem("userId");

    if (!name) {
        displayErrorMessage("Nombre del equipo no puede estar vacío.");
        return;
    }

    if (!latitude || !longitude) {
        displayErrorMessage("Debe seleccionar una ubicación válida.");
        return;
    }

    const location = `${latitude},${longitude}`;

    
    const createTeamRequest = {
        name: name,
        captainId: captainId,
        sport: { sportId: sportId },
        location: location,
        isPrivate: isPrivate.checked
    };

    fetch('/api/teams/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createTeamRequest)
    })
        .then(response => {
            if (response.status === 201) {
                displaySuccessMessage("Equipo creado exitosamente!");
            } else if (response.status === 500) {
                displayErrorMessage("El nombre del equipo debe ser único. Por favor, elija un nombre diferente.");
            } else {
                throw new Error(`Failed to create team: ${response.status} ${response.statusText}`);
            }
        })
        .catch(error => {
            console.error('Error creating team:', error);
            displayErrorMessage("Ocurrió un error al crear el equipo.");
        });
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

    fetchSports();
});


