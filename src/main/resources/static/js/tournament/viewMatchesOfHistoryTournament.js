// Funcion para traer los partidos para el historial

function viewMatchesOfHistoryTournament() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');


    fetch(`/api/tournaments/${tournamentId}/matches`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch active matches: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(matches => {
            const matchesList = document.getElementById("match-result");

            matches.forEach(match => { // FIXME: No entiendo porque aca se aumenta el valor del matchId.
                const team1 = match.team1.name;
                const team2 = match.team2.name;
                const matchId = match.matchId;

                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <td>${team1} VS ${team2}</td>
                    <td>
                        <button class="action-button view-button" data-match-id="${matchId}">Ver Estadísticas</button>
                    </td>
                `;
                matchesList.appendChild(listItem);
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
            if (matches.length === 0) {
                matchesList.innerHTML = `
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


// TODO: Debemos esperar a que Marcos haga esto de agregar estadisticas.
// Función para mostrar las estadísticas de un partido
function viewMatchStatsOfHistoryTournament(matchId){ // Seguro voy a necesitar el tournamentId, fijate como lo hiciste con SaveStats
    console.log('Match ID: ', matchId);
    fetch(`/api/matches/${matchId}`) // Hace en este endpoint, un get de los stats del match.
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch match statistics: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(async match => {
            // Mostrar las estadísticas en la página
            console.log(match);
            const matchContainer = document.getElementById('stats-container');
            const winnerName = await getWinner(match.winner);
            matchContainer.innerHTML = `
                <h3>Estadísticas del partido ${matchId}</h3>
                <p>Resultado: ${match.firstTeamScore} a ${match.secondTeamScore}</p>
                <p>Ganador: ${winnerName}</p>
                <!-- Agregar más estadísticas según sea necesario -->
            `;
        })
        .catch(error => {
            console.error('Error:', error);
            // Manejar el error, mostrar un mensaje al usuario, etc.
        });
}

async function getWinner(teamId){
    try {
        const response = await fetch(`/api/teams/${teamId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch team: ${response.status} ${response.statusText}`);
        }
        const team = await response.json();
        return team.name;
    } catch (error) {
        console.error('Error:', error);
    }
}



