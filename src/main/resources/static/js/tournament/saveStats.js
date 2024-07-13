document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');
    document.getElementById('tournamentId').value = tournamentId;

    const formularioEstadisticas = document.getElementById('formularioEstadisticas');
    formularioEstadisticas.addEventListener('submit', saveStats);

    loadUnplayedMatches(tournamentId);
    loadActiveMatches(tournamentId);
});

function loadUnplayedMatches(tournamentId) {
    fetch(`/api/tournaments/${tournamentId}/matches`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(matches => {
            const unplayedMatches = matches.filter(match => !match.played);
            populateMatchSelector(unplayedMatches);
        })
        .catch(error => {
            console.error('Error fetching matches:', error);
        });
}

function loadActiveMatches(tournamentId) {
    fetch(`/api/tournaments/${tournamentId}/matches`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(matches => {
            const now = new Date();
            const activeMatches = matches.filter(match => new Date(match.date) < now && !match.played);
            populateActiveMatches(activeMatches);
        })
        .catch(error => {
            console.error('Error fetching matches:', error);
        });
}

function populateMatchSelector(matches) {
    const partidoSelector = document.getElementById('partidoSelector');
    const ganadorSelector = document.getElementById('ganadorSelector');

    // Limpiar el selector de partidos y ganador
    partidoSelector.innerHTML = '<option value="">Seleccione un partido</option>';
    ganadorSelector.innerHTML = '<option value="">Seleccione el ganador</option>';

    matches.forEach(match => {
        const option = document.createElement('option');
        option.value = match.matchId;
        option.textContent = `${match.team1.name} vs ${match.team2.name}`;
        partidoSelector.appendChild(option);
    });

    partidoSelector.addEventListener('change', () => {
        ganadorSelector.innerHTML = '<option value="">Seleccione el ganador</option>'; // Reset the winner options
        const selectedMatch = matches.find(m => m.matchId == partidoSelector.value);

        if (selectedMatch) {
            const team1Option = document.createElement('option');
            team1Option.value = selectedMatch.team1.id;
            team1Option.textContent = selectedMatch.team1.name;
            ganadorSelector.appendChild(team1Option);

            const team2Option = document.createElement('option');
            team2Option.value = selectedMatch.team2.id;
            team2Option.textContent = selectedMatch.team2.name;
            ganadorSelector.appendChild(team2Option);

            // Agregar opción de empate
            const empateOption = document.createElement('option');
            empateOption.value = '0';
            empateOption.textContent = 'Empate';
            ganadorSelector.appendChild(empateOption);
        }
    });
}

function populateActiveMatches(matches) {
    const matchResult = document.getElementById('matchResult');
    matchResult.innerHTML = ''; // Limpiar la lista antes de agregar elementos nuevos

    matches.forEach(match => {
        const listItem = document.createElement('li');
        listItem.textContent = `${match.team1.name} vs ${match.team2.name}`;
        matchResult.appendChild(listItem);
    });
}


function saveStats(event) {
    event.preventDefault();

    const matchId = document.querySelector('#partidoSelector').value;
    const team1Score = document.querySelector('input[name="team1Score"]').value;
    const team2Score = document.querySelector('input[name="team2Score"]').value;
    const ganador = document.querySelector('select[name="ganador"]').value;

    if (!isValidScore(team1Score) || !isValidScore(team2Score)) {
        displayErrorMessage("Ingrese puntajes válidos para los equipos");
        return;
    }

    let winnerId = null;
    if (ganador === "Empate") {
        winnerId = 0; // Si es empate, asignar 0 como Long para el ganador
    } else {
        winnerId = parseInt(ganador); // Si es un equipo, asignar el ID del equipo como Long
    }

    const data = {
        team1Score: parseInt(team1Score),
        team2Score: parseInt(team2Score),
        winner: winnerId
    };

    fetch(`/api/tournaments/matches/stats/${matchId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                displaySuccessMessage("Estadísticas agregadas con éxito");
                document.getElementById('formularioEstadisticas').reset();

                // Refrescar la página después de un segundo
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                displayErrorMessage("Hubo un problema al agregar las estadísticas");
            }
        })
        .catch(error => {
            displayErrorMessage("Error al guardar las estadísticas");
        });
}


function isValidScore(score) {
    return !isNaN(parseInt(score)) && isFinite(score) && parseInt(score) >= 0;
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

function logout() {
    localStorage.removeItem("userId");
    window.location.href = "login.html";
}
