let autocomplete;

function initAutocomplete() {
    const input = document.getElementById('location');
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            const location = place.geometry.location;
            document.getElementById('location').dataset.latitude = location.lat();
            document.getElementById('location').dataset.longitude = location.lng();
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
            console.error('Error:', error);
        });
}

function createTeam(event) {
    event.preventDefault();

    const name = document.getElementById('team-name').value;
    const sportId = document.getElementById('sport').value;

    const latitude = document.getElementById('location').dataset.latitude;
    const longitude = document.getElementById('location').dataset.longitude;
    const isPrivate = document.getElementById('privacy').checked;
    const captainId = localStorage.getItem("userId");

    if (!name.trim()) {
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
        isPrivate: isPrivate
    };

    console.log(createTeamRequest);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/teams/create', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 201) {
            displaySuccessMessage("Equipo creado exitosamente!");
        } else if (xhr.status === 500) {
            displayErrorMessage("El nombre del equipo debe ser único. Por favor, elija un nombre diferente.");
        }
    };
    xhr.onerror = function () {
        displayErrorMessage("Ocurrió un error al crear el equipo.");
    };
    xhr.send(JSON.stringify(createTeamRequest));
}

function displaySuccessMessage(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";
    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000);
}

function displayErrorMessage(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
}
