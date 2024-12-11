document.addEventListener("DOMContentLoaded", () => {
    fetchAndLoadGoogleMapsAPI()
        .then(() => {
            initializeAutocomplete('location');
        })
        .catch(error => {
            console.error("Error loading Google Maps API:", error);
            showErrorToast("Error loading location services.", "error");
        });
});

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
        displayErrorMessage("El nombre del torneo no puede estar vació.")
        return
    }

    if (maxTeams < 0) {
        displayErrorMessage("No se puede ingresar números negativos")
        return;
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
        isActive: true,
        type: type
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/tournaments/create', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            window.location.href = "misTorneos.html";
        } else if (xhr.status === 500) {
            displayErrorMessage("El nombre del torneo debe ser único, por favor elegir un nuevo nombre.")
        } else {
            console.error("Error:", xhr.status, xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(tournamentData));

}
