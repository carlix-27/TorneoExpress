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

function createTournament() {
    const name = document.getElementById('tournament-name').value;
    const sportId = document.getElementById('sport').value;

    const latitude = document.getElementById('location').dataset.latitude;
    const longitude = document.getElementById('location').dataset.longitude;

    if (!latitude || !longitude) {
        displayErrorMessage("Debe seleccionar una ubicación válida.");
        return;
    }

    const location = `${latitude},${longitude}`;

    const date = document.getElementById('start-date').value;
    const isPrivate = document.getElementById('privacy').checked;
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;
    const maxTeams = document.getElementById('maxTeams').value;
    const userId = localStorage.getItem("userId");

    if (!name.trim()) {
        displayErrorMessage("Tournament name cannot be blank.")
        return
    }

    const tournamentData = {
        name: name,
        sport: { sportId: sportId },
        location: location,
        date: date,
        isPrivate: isPrivate,
        difficulty: difficulty,
        creatorId: userId,
        maxTeams: maxTeams,
        isActive: true
    };

    console.log(tournamentData)

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/tournaments/create', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const createdTournament = JSON.parse(xhr.responseText);
            displaySuccessMessage("Torneo creado con exito!")
        } else if (xhr.status === 500) {
            displayErrorMessage("El nombre del torneo debe ser único, por favor elegir un nuevo nombre.")
        } else {
            console.error("Error:", xhr.status, xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(tournamentData));

}

function displaySuccessMessage(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";
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
    fetchSports();
});
