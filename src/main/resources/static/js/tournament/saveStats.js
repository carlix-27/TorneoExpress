document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    document.getElementById('tournamentId').value = tournamentId;

    const formularioEstadisticas = document.getElementById('formularioEstadisticas');
    formularioEstadisticas.addEventListener('submit', saveStats);

    fetchMatches(tournamentId);
    fetchTeams(tournamentId);
});

function fetchMatches(tournamentId) {
    fetch(`/api/tournaments/${tournamentId}/activeMatches`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(matches => {
            console.log("Is matches empty?: ", matches);

            if (matches.length === 0) {
                return createMatches(tournamentId)
                    .then(() => fetch(`/api/tournaments/${tournamentId}/activeMatches`))
                    .then(response => response.json())
                    .then(newMatches => {
                        displayMatches(newMatches);
                    })
                    .catch(error => {
                        console.error('Error fetching matches after creating:', error);
                    });
            } else {
                displayMatches(matches);
            }
        })
        .catch(error => {
            console.error('Error fetching matches:', error);
        });
}

function createMatches(tournamentId) {
    return fetch(`/api/tournaments/${tournamentId}/createMatches`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error creating matches');
            }
        })
        .catch(error => {
            console.error('Error creating matches:', error);
            throw error; // Re-throw the error to be caught by the caller
        });
}

function fetchTeams(tournamentId) {
    fetch(`/api/tournaments/${tournamentId}/teams`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(teams => {
            const winnerSelector = document.getElementById('winnerSelector');
            winnerSelector.innerHTML = ''; // Clear previous options if any

            teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team.id;
                option.textContent = team.name;
                winnerSelector.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching teams:', error);
        });
}

function saveStats(event) {
    event.preventDefault();

    const tournamentId = document.getElementById('tournamentId').value;
    const matchId = document.querySelector('#partidoSelector').value;
    const team1Score = document.querySelector('input[name="team1Score"]').value;
    const team2Score = document.querySelector('input[name="team2Score"]').value;
    const winnerId = document.querySelector('#winnerSelector').value;

    if (!isValidScore(team1Score) || !isValidScore(team2Score)) {
        displayErrorMessage("Ingrese puntajes válidos para los equipos");
        return;
    }

    const data = {
        winner: { id: parseInt(winnerId) },
        team1Score: parseInt(team1Score),
        team2Score: parseInt(team2Score)
    };

    fetch(`/api/matches/${tournamentId}/${matchId}/statistics`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                displaySuccessMessage("Estadísticas agregadas con éxito");
                document.getElementById('formularioEstadisticas').reset();
            } else {
                throw new Error('Hubo un problema al agregar las estadísticas');
            }
        })
        .catch(error => {
            displayErrorMessage("Error al guardar las estadísticas");
            console.error('Error saving stats:', error);
        });
}

function isValidScore(score) {
    return !isNaN(parseInt(score)) && isFinite(score) && parseInt(score) >= 0;
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

function displayMatches(matches) {
    const partidoSelector = document.getElementById('partidoSelector');
    partidoSelector.innerHTML = ''; // Clear previous options if any

    matches.forEach(match => {
        const option = document.createElement('option');
        option.value = match.id;

        const firstTeam = match.team1;
        const secondTeam = match.team2;

        option.textContent = `${firstTeam.name} vs ${secondTeam.name}`;
        partidoSelector.appendChild(option);
    });
}
