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
            console.log("ActiveMatches: ", activeMatches);
            const activeMatchesList = document.getElementById("match-result");
            const partidoSelector = document.getElementById("partidoSelector");
            activeMatchesList.innerHTML = ''; // Limpiar la lista actual de partidos activos
            partidoSelector.innerHTML = '<option value="">Seleccione un partido</option>';

            activeMatches.matches.forEach(match => {
                const team1 = match.teamName1;
                const team2 = match.teamName2;

                // Agregqr contenido al selector
                const option = document.createElement('option');
                option.value = match.matchId;
                option.textContent = `${team1} VS ${team2}`;
                partidoSelector.appendChild(option);
                console.log("Desde loadActiveMatches, está: ", option);

                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <p>${team1} VS ${team2}</p>
                `;
                activeMatchesList.appendChild(listItem);
            });

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


