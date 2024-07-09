document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    document.getElementById('tournamentId').value = tournamentId;

    const formularioEstadisticas = document.getElementById('formularioEstadisticas');
    formularioEstadisticas.addEventListener('submit', function(event) {
        saveStats(event);
    });

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
            const partidoSelector = document.getElementById('partidoSelector');
            matches.forEach(match => {
                const option = document.createElement('option');
                option.value = match.id;
                option.textContent = `${match.team1.name} vs ${match.team2.name}`;
                partidoSelector.appendChild(option);
            });

            // Actualizar etiquetas de resultados dinámicamente
            const team1Label = document.getElementById('team1ScoreLabel');
            const team2Label = document.getElementById('team2ScoreLabel');
            if (matches.length > 0) {
                team1Label.textContent = `Resultado ${matches[0].team1.name}:`;
                team2Label.textContent = `Resultado ${matches[0].team2.name}:`;
            }
        })
        .catch(error => {
            console.error('Error fetching matches:', error);
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
