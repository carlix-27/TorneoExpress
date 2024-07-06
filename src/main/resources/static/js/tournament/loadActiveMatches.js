// Función para cargar los partidos activos del torneo
function loadActiveMatches() {
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
            const partidoSelector = document.getElementById("partidoSelector");
            partidoSelector.innerHTML = '<option value="">Seleccione un partido</option>';

            console.log('ActiveMatches: ',activeMatches.matches);

            activeMatches.matches.forEach(match => { // FIXME: No entiendo porque aca se aumenta el valor del matchId.
                const team1 = match.teamName1;
                const team2 = match.teamName2;
                const matchId = match.matchId; //getMatchIDWithAssociatedStatistics(match, tournamentId); // Punto de control accediendo al punto previo a modificarse.

                // Esto me permite, realizar otro partido, en el que puedo agregar el dato que quiera.
                const option = document.createElement('option');
                option.value = match.matchId;
                option.textContent = `${team1} VS ${team2}`;

                // Agregqr contenido al selector
                partidoSelector.appendChild(option);
                console.log('Option: ', option);

                const listItem = document.createElement('li'); // TODO: el data-match-id, debe estar asociado a cada partido.
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
                viewMatchStats(matchId);
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
document.addEventListener("DOMContentLoaded", loadActiveMatches);

// Función para mostrar las estadísticas de un partido
function viewMatchStats(matchId){ // Seguro voy a necesitar el tournamentId, fijate como lo hiciste con SaveStats
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

function getMatchIDWithAssociatedStatistics(match, tournamentId){
    fetch(`api/matches/${tournamentId}/${match.matchId}/getMatchId`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch match statistics: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })


}




/*function loadActiveMatches() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    fetch(`/api/tournaments/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournament => {
            const activeMatches = document.getElementById("match-result");
            const backButton = document.getElementById("back-button");

            backButton.addEventListener("click", () => {
                window.location.replace(`loadTournament.html?id=${tournament.id}`);
            });

            if (tournament.participatingTeams.length < tournament.maxTeams) {
                calendar.innerHTML = `
                <div id="result">
                    <h3>Partidos Activos no disponible para el torneo.</h3>
                </div>`;
            } else {
                /* Segundo fetch para agarrar el fixture. */
                /*fetchFixture(tournamentId, tournament, activeMatches);
            }

        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

function fetchFixture(id, tournament, activeMatchesList) {
    fetch(`/api/tournaments/${id}/activeMatches`) // /api/tournament/{tournamentId}/activeMatches
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(fixture => { // FIXME: Esta parte <h2>${tournament.name} - Partidos Activos</h2>. No sé si está bien.
            activeMatchesList.innerHTML = `
                <div id="result">
                    <h2>${tournament.name} - Partidos Activos</h2>
                    
                </div>
            `;

            fixture.matches.forEach(match => {
                const team1 = match.teamName1; // fetch team
                const team2 = match.teamName2; // fetch team

                const listItem = document.createElement('li');

                listItem.innerHTML = `
                    <p>${team1} VS ${team2}</p>
                `;
                activeMatchesList.appendChild(listItem);
            })

        })
}
// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadCalendar);*/


