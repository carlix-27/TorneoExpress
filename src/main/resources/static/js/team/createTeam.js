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
                window.location.href = "misEquipos.html";
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


