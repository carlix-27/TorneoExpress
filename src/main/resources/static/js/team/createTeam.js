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

function fetchSportDetails(sportId) {
    return fetch(`/api/sports/${sportId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch sport details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function createTeam(event) {
    event.preventDefault();

    const name = document.getElementById('team-name').value;
    const sportId = document.getElementById('sport').value;
    const location = document.getElementById('team-location').value;
    const isPrivate = document.getElementById('privacy').checked;
    const captainId = localStorage.getItem("userId");

    if (!name.trim()) {
        displayErrorMessage("Nombre del equipo no puede estar vacío.");
        return;
    }

    if (!location.trim()) {
        displayErrorMessage("Ubicación del equipo no puede estar vacía.");
        return;
    }

    // Fetch the sport details and then create the team
    fetchSportDetails(sportId)
        .then(sport => {
            if (!sport) {
                displayErrorMessage("No se pudo obtener los detalles del deporte.");
                return;
            }

            const createTeamRequest = {
                name: name,
                sport: sport,
                location: location,
                isPrivate: isPrivate,
                captainId: captainId
            };

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
        })
        .catch(error => {
            displayErrorMessage("Error al obtener los detalles del deporte.");
            console.error('Error:', error);
        });
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

const form = document.getElementById('add-team-form');
form.addEventListener('submit', createTeam);

fetchSports();
