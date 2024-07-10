document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    document.getElementById('tournamentId').value = tournamentId;

    fetchMatches(tournamentId)
        .then(() => {
            fetchTeams(tournamentId);
            checkTournamentCreator(tournamentId);

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
    return fetch(`/api/tournaments/${tournamentId}/matches`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(matches => {
            const listaPartidosTerminados = document.getElementById('listaPartidosTerminados');
            const listaPartidosPendientes = document.getElementById('listaPartidosPendientes');

            matches.forEach(match => {
                const option = document.createElement('option');
                option.value = match.matchId;
                option.textContent = `${match.team1.name} vs ${match.team2.name}`;

                if (match.isCompleted) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${match.team1.name} ${match.team1Score} - ${match.team2Score} ${match.team2.name}`;
                    listaPartidosTerminados.appendChild(listItem);
                } else {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${match.team1.name} vs ${match.team2.name}`;
                    listaPartidosPendientes.appendChild(listItem);
                }
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

function checkTournamentCreator(tournamentId) {
    // Aquí debes implementar la lógica para verificar si el usuario loggeado es el creador del torneo
    // Por ejemplo, podrías comparar el userId con tournament.creatorId
    const userId = getUserId(); // Implementa cómo obtienes el userId del usuario loggeado

    if (userId === tournament.creatorId) {
        const agregarEstadisticasSection = document.getElementById('agregarEstadisticas');
        const addButton = document.createElement('button');
        addButton.textContent = 'Agregar Estadísticas';
        addButton.addEventListener('click', () => {
            // Aquí podrías abrir un modal, o redireccionar a una página para agregar estadísticas
            // Puedes usar window.location.href = 'URL_DE_LA_PÁGINA' para redireccionar
            console.log('Agregar estadísticas para el partido seleccionado');
        });
        agregarEstadisticasSection.appendChild(addButton);
    }
}

// Función de ejemplo para obtener el userId del usuario loggeado
function getUserId() {
    // Implementa cómo obtienes el userId del usuario loggeado en tu aplicación
    return 'exampleUserId'; // Cambia esto según tu implementación real
}
