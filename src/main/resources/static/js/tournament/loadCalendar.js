// Función para cargar los torneos del usuario
// Function to load the user's tournaments
function loadCalendar() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    // Hay algo raro con el fixture aca. Fijate.
    fetch(`/api/tournaments/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournament => {
            console.log("Tournament: ", tournament);
            const calendar = document.getElementById("calendar-result");
            const backButton = document.getElementById("back-button");

            backButton.addEventListener("click", () => {
                window.location.replace(`loadTournament.html?id=${tournament.id}`);
            });

            if (tournament.participatingTeams.length < tournament.maxTeams) {
                calendar.innerHTML = `
                <div id="result">
                    <h3>Calendario no disponible para el torneo.</h3>
                </div>`;
            } else {
                switch(tournament.type){
                    case 'ROUNDROBIN': // FIXME: Le estas pasando toda la entidad de tournament, fijate que haces con tournament ahi, sino pedi lo que necesitas nada mas.
                        fetchRoundRobinFixture(tournamentId, tournament.matches, tournament.name, tournament.creatorId, calendar, tournament.type);
                        break;
                    case 'KNOCKOUT':
                        fetchKnockoutFixture(tournamentId, tournament.matches, tournament.name, tournament.creatorId, calendar, tournament.type);
                        break;
                    case 'GROUPSTAGE':
                        fetchGroupStage(tournamentId, tournament.matches, tournament.name, tournament.creatorId, calendar, tournament.type);
                        break;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// TODO: Fijate aca de usar el fixture-generator.
function fetchRoundRobinFixture(id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type) {
    fetch(`/api/tournaments/${id}/${type}/calendar`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(matches => {
            calendarListHTML.innerHTML = `
                <div id="result">
                    <h2>${tournamentName} - Calendario</h2>
                    
                </div>
            `;

            if (tournamentCreatorId !== localStorage.getItem("userId")) {
                matches.forEach(match => {
                    const location = match.matchLocation;
                    const date = match.date;
                    const team1 = match.team1.name; // fetch team
                    const team2 = match.team2.name; // fetch team

                    const listItem = document.createElement('li');

                    listItem.innerHTML = `
                    <h3>${date}</h3>
                    <p>${team1} VS ${team2}</p>
                    <p>${location}</p>
                `;
                    calendarListHTML.appendChild(listItem);
                })
            } else {
                matches.forEach(match => {
                    const location = match.location;
                    const date = match.date;
                    const team1 = match.team1.name; // fetch team
                    const team2 = match.team2.name; // fetch team

                    const listItem = document.createElement('li');

                    listItem.innerHTML = `
                    <h3>${date}</h3>
                    <p>${team1} VS ${team2}</p>
                    <p>${location}</p>
                    <button class="modify-date-button" onclick="modifyDate(${match.id}, ${id})">Modificar fecha</button>
                `;
                    //<button onclick="editarEquipo(${teamId})">Editar</button>
                    calendarListHTML.appendChild(listItem);
                })
            }
        })
}

function fetchKnockoutFixture(id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type){
    fetch(`/api/tournaments/${id}/${type}/calendar`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(matches => {
            calendarListHTML.innerHTML = `
                <div id="result">
                    <h2>${tournamentName} - Calendario</h2>
                    
                </div>
            `;

            if (tournamentCreatorId !== localStorage.getItem("userId")) {
                matches.forEach(match => {
                    const location = match.matchLocation;
                    const date = match.date;
                    const team1 = match.team1.name; // fetch team
                    const team2 = match.team2.name; // fetch team

                    const listItem = document.createElement('li');

                    listItem.innerHTML = `
                    <h3>${date}</h3>
                    <p>${team1} VS ${team2}</p>
                    <p>${location}</p>
                `;
                    calendarListHTML.appendChild(listItem);
                })
            } else {
                matches.forEach(match => {
                    const location = match.matchLocation;
                    const date = match.date;
                    const team1 = match.team1.name; // fetch team
                    const team2 = match.team2.name; // fetch team

                    const listItem = document.createElement('li');

                    listItem.innerHTML = `
                    <h3>${date}</h3>
                    <p>${team1} VS ${team2}</p>
                    <p>${location}</p>
                    <button class="modify-date-button" onclick="modifyDate(${match.id}, ${id})">Modificar fecha</button>
                `;
                    calendarListHTML.appendChild(listItem);
                })
            }
        })
}

function fetchGroupStage(id, calendarListHTML, type) {
    fetch(`/api/tournaments/${id}/${type}/calendar`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(matches => {
            calendarListHTML.innerHTML = `
                <div id="result">
                    <h2>Calendario del Torneo</h2>
                </div>
            `;

            // Objeto para almacenar los grupos de partidos
            const groupedMatches = groupMatchesByGroupId(matches);

            // Iterar sobre cada grupo y mostrar los partidos
            Object.values(groupedMatches).forEach(group => {
                // Crear elemento HTML para el grupo
                const groupElement = document.createElement('div');
                groupElement.classList.add('group'); // Estilo CSS para grupos

                // Encabezado del grupo (número de grupo)
                const groupHeader = document.createElement('h2');
                groupHeader.textContent = `Grupo ${group.id}`;
                groupElement.appendChild(groupHeader);

                // Lista de partidos del grupo
                const matchesList = document.createElement('ul');
                group.matches.forEach(match => {
                    const date = match.date;
                    const team1 = match.team1.name;
                    const team2 = match.team2.name;

                    const matchItem = document.createElement('li');
                    matchItem.innerHTML = `
                        <h3>${date}</h3>
                        <p>${team1} VS ${team2}</p>
                    `;
                    matchesList.appendChild(matchItem);
                });
                groupElement.appendChild(matchesList);

                // Agregar el grupo a la lista principal en HTML
                calendarListHTML.appendChild(groupElement);
            });
        })
        .catch(error => {
            console.error('Error fetching tournament calendar:', error);
        });
}

function groupMatchesByGroupId(matches) {
    const groupedMatches = {};
    matches.forEach(match => {
        const groupId = match.groupId;
        if (!groupedMatches[groupId]) {
            groupedMatches[groupId] = {
                id: groupId,
                matches: []
            };
        }
        groupedMatches[groupId].matches.push(match);
    });
    return groupedMatches;
}





/*function fetchGroupStage(id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type) {
    fetch(`/api/tournaments/${id}/${type}/calendar`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(matches => {
            calendarListHTML.innerHTML = `
                <div id="result">
                    <h2>${tournamentName} - Calendario</h2>
                    
                </div>
            `;


            if (tournamentCreatorId !== localStorage.getItem("userId")) {
                // Objeto para almacenar los grupos de partidos
                const groupedMatches = {};
                let groupCounter = 1;

                // Iterar sobre los partidos y agrupar de a 2 por grupo
                for (let i = 0; i < matches.length; i += 2) {
                    const groupMatches = matches.slice(i, i + 2); // Tomar los próximos 2 partidos

                    // Verificar y ajustar equipos para que no se repitan dentro del grupo
                    adjustTeamsForGroup(groupMatches);

                    // Crear un objeto para el grupo actual
                    const group = {
                        id: groupCounter++,
                        matches: groupMatches
                    };

                    // Agregar el grupo al objeto de grupos
                    groupedMatches[group.id] = group;
                }

                // Función para ajustar equipos y evitar repeticiones dentro del grupo
                function adjustTeamsForGroup(groupMatches) {
                    // Utilizar un set para almacenar equipos únicos dentro del grupo
                    const usedTeams = new Set();

                    // Iterar sobre los partidos del grupo y ajustar los equipos si es necesario
                    groupMatches.forEach(match => {
                        usedTeams.add(match.team1.name);
                        usedTeams.add(match.team2.name);
                    });
                }

                // Iterar sobre cada grupo y mostrar los partidos
                Object.values(groupedMatches).forEach(group => {
                    // Crear elemento HTML para el grupo
                    const groupElement = document.createElement('div');
                    groupElement.classList.add('group'); // Estilo CSS para grupos

                    // Encabezado del grupo (número de grupo)
                    const groupHeader = document.createElement('h2');
                    groupHeader.textContent = `Grupo ${group.id}`;
                    groupElement.appendChild(groupHeader);

                    // Lista de partidos del grupo
                    const matchesList = document.createElement('ul');
                    group.matches.forEach(match => {
                        const date = match.date;
                        const team1 = match.team1.name;
                        const team2 = match.team2.name;

                        const matchItem = document.createElement('li');
                        matchItem.innerHTML = `
                        <h3>${date}</h3>
                        <p>${team1} VS ${team2}</p>
                    `;
                        matchesList.appendChild(matchItem);
                    });
                    groupElement.appendChild(matchesList);

                    // Agregar el grupo a la lista principal en HTML
                    calendarListHTML.appendChild(groupElement);
                });
            }
        })
}*/

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadCalendar);

function modifyDate(matchId, tournamentId) {
    window.location.replace(`modifyDate.html?match-id=${matchId}&tournament-id=${tournamentId}`);
}
