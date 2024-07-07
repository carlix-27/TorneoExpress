// Funcion para traer los partidos para el historial

function viewMatchesOfHistoryTournament() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');


    fetch(`/api/tournaments/${tournamentId}/activeMatches`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch active matches: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(activeMatches => {
            const activeMatchesList = document.getElementById("match-result");

            activeMatches.matches.forEach(match => { // FIXME: No entiendo porque aca se aumenta el valor del matchId.
                const team1 = match.teamName1;
                const team2 = match.teamName2;
                const matchId = match.matchId;

                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <td>${team1} VS ${team2}</td>
                    <td>
                        <button class="action-button view-button" data-match-id="${matchId}">Ver Estadísticas</button>
                    </td>
                `;
                activeMatchesList.appendChild(listItem);
            });

            document.querySelectorAll('.view-button').forEach(button => {
                button.addEventListener('click', handleViewMatchStats);
            });

            function handleViewMatchStats(event) {
                const matchId = event.target.getAttribute('data-match-id');
                // Implement view stats functionality here
                viewMatchStatsOfHistoryTournament(matchId); // El metodo debo traerlo de loadActiveMatches
            }
            // Opcional: Agregar un mensaje si no hay partidos activos
            if (activeMatches.matches.length === 0) {
                activeMatchesList.innerHTML = `
                    <li>No hay partidos activos disponibles</li>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Manejar el error, mostrar un mensaje al usuario, etc.
        });
}

// Al cargar la página, cargar los partidos activos del torneo
document.addEventListener("DOMContentLoaded", viewMatchesOfHistoryTournament);


// Función para mostrar las estadísticas de un partido
function viewMatchStatsOfHistoryTournament(matchId){ // Seguro voy a necesitar el tournamentId, fijate como lo hiciste con SaveStats
    console.log('Match ID: ', matchId);
    fetch(`/api/matches/${matchId}/getStatistics`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch match statistics: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(stats => {
            // Mostrar las estadísticas en la página
            const statsContainer = document.getElementById('stats-container');
            statsContainer.innerHTML = `
                <h3>Estadísticas del partido ${matchId}</h3>
                <p>Resultado: ${stats.resultadoPartido}</p>
                <p>Ganador: ${stats.ganador}</p>
                <!-- Agregar más estadísticas según sea necesario -->
            `;
        })
        .catch(error => {
            console.error('Error:', error);
            // Manejar el error, mostrar un mensaje al usuario, etc.
        });
}




