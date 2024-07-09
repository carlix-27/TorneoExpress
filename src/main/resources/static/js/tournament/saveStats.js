document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    document.getElementById('tournamentId').value = tournamentId;

    fetchMatches(tournamentId)
        .then(() => {
            fetchTeams(tournamentId);

            const formularioEstadisticas = document.getElementById('formularioEstadisticas');
            formularioEstadisticas.addEventListener('submit', function(event) {
                saveStats(event, tournamentId);
            });
        })
        .catch(error => {
            console.error('Error fetching matches:', error);
        });
});

function fetchMatches(tournamentId) {
    return fetch(`/api/tournaments/${tournamentId}/activeMatches`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(matches => {
            const partidoSelector = document.getElementById('partidoSelector');
            partidoSelector.innerHTML = ''; // Clear existing options

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
            }

            matches.forEach(match => {
                const option = document.createElement('option');
                option.value = match.matchId;
                option.textContent = `${match.team1.name} vs ${match.team2.name}`;
                partidoSelector.appendChild(option);
            });

            const team1Label = document.getElementById('team1ScoreLabel');
            const team2Label = document.getElementById('team2ScoreLabel');
            if (matches.length > 0) {
                team1Label.textContent = `Resultado ${matches[0].team1.name}:`;
                team2Label.textContent = `Resultado ${matches[0].team2.name}:`;
            }
        })
        .catch(error => {
            console.error('Error fetching matches:', error);
            throw error; // Propagate the error to the caller
        });
}

function fetchTeams(tournamentId) {
    return fetch(`/api/tournaments/${tournamentId}/teams`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(teams => {
            const winnerSelector = document.getElementById('winnerSelector');
            winnerSelector.innerHTML = ''; // Clear existing options
            teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team.id;
                option.textContent = team.name;
                winnerSelector.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching teams:', error);
            throw error;
        });
}

function saveStats(event, tournamentId) {
    event.preventDefault();

    const matchId = document.querySelector('#partidoSelector').value;
    const team1Score = document.querySelector('input[name="team1Score"]').value;
    const team2Score = document.querySelector('input[name="team2Score"]').value;
    const winnerId = document.querySelector('#winnerSelector').value;

    if (!isValidScore(team1Score) || !isValidScore(team2Score)) {
        displayErrorMessage("Ingrese puntajes válidos para los equipos");
        return;
    }

    const data = {
        winner: parseInt(winnerId),
        team1Score: parseInt(team1Score),
        team2Score: parseInt(team2Score)
    };

    console.log(data)

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
        option.value = match.matchId;
        option.textContent = `${match.team1.name} vs ${match.team2.name}`;
        partidoSelector.appendChild(option);
    });
}

function createMatches(tournamentId) {
    return fetch(`/api/tournaments/${tournamentId}/createMatches`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
        // Optionally, you can include request body if needed
        // body: JSON.stringify({ /* data if needed */ })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create matches');
            }
            console.log('Matches created successfully');
        })
        .catch(error => {
            console.error('Error creating matches:', error);
            throw error;
        });
}
