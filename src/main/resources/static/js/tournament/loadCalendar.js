// Función para cargar los torneos del usuario
// Function to load the user's tournaments
function loadCalendar() {
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
            console.log("Tournament: ", tournament);
            const calendar = document.getElementById("calendar-result"); // TODO: Para ver como armamos bien el fixture hay que mirar aca.
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


function fetchRoundRobinFixture(id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type) {
    fetch(`/api/tournaments/${id}/${type}/calendar`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(matches => {

            let team1Score = match.firstTeamScore;

            if (team1Score === null) {
                team1Score = "-"
            }

            let team2Score = match.secondTeamScore;

            if (team2Score === null) {
                team2Score = "-"
            }


            calendarListHTML.innerHTML = `
                <div id="result">
                    <h2>${tournamentName} - Calendario</h2>
                </div>`;

            matches.forEach(match => {
                const listItem = document.createElement('li');
                listItem.className = 'tournament-bracket__item';
                listItem.innerHTML = `
                                 <div class="tournament-bracket__match" tabindex="0">
                                        <table class="tournament-bracket__table">
                                             <caption class="tournament-bracket__caption">
                                                    <p>${match.date}</p>
                                             </caption>
                                             <thead class="sr-only">
                                                <tr>
                                                    <th>Country</th>
                                                    <th>Score</th>
                                                </tr>
                                             </thead>
                                             <tbody class="tournament-bracket__content">
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                         <span class="tournament-bracket__number">${team1Score}</span> 
                                                    </td>
                                                </tr>
                                                
                                        
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                        <span class="tournament-bracket__number">${team2Score}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                 </div>                  
                `;
                calendarListHTML.appendChild(listItem);
            });
        })
        .catch(error =>{
            console.error('error fetching tournament data: ', error);
        });
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

                    console.log("Match: ", match)

                    let team1Score = match.firstTeamScore;

                    if (team1Score === null) {
                        team1Score = "-"
                    }

                    let team2Score = match.secondTeamScore;

                    if (team2Score === null) {
                        team2Score = "-"
                    }


                    const listItem = document.createElement('li');
                    listItem.className = 'tournament-bracket__item';
                    const title = ''; // TODO: Tiene que ir variando acorde la etapa del torneo.
                    listItem.innerHTML = `
                                 <h3 class="tournament-bracket__round-title"> Cuartos de final </h3>
                                 <div class="tournament-bracket__match" tabindex="0">
                                        <table class="tournament-bracket__table">
                                             <caption class="tournament-bracket__caption">
                                                    <p>${match.date}</p>
                                             </caption>
                                             <thead class="sr-only">
                                                <tr>
                                                    <th>Country</th>
                                                    <th>Score</th>
                                                </tr>
                                             </thead>
                                             <tbody class="tournament-bracket__content">
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                         <span class="tournament-bracket__number">${team1Score}</span> 
                                                    </td>
                                                </tr>
                                                
                                        
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                        <span class="tournament-bracket__number">${team2Score}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                 </div>               
                                 
                                    
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


// fetchGroupStage(tournamentId, tournament.matches, tournament.name, tournament.creatorId, calendar, tournament.type);
function fetchGroupStage(id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type) {
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

                const groupedMatches = {};
                let groupCounter = 1;

                // Crear un mapa para rastrear que equipos ya han sido emparejados
                const pairedTeams = new Set();


                // Iterar sobre los partidos y agrupar de a 2 por grupo
                matches.forEach(match => {
                    const { team1, team2 } = match;

                    // Si uno de los equipos ya ha sido emparejado, saltar este partido
                    if (pairedTeams.has(team1.name) || pairedTeams.has(team2.name)) return;

                    // Agregar los equipos al conjunto de emparejados
                    pairedTeams.add(team1.name);
                    pairedTeams.add(team2.name);

                    // Verificar si el grupo actual ya tiene 2 partidos
                    if (!groupedMatches[groupCounter]) {
                        groupedMatches[groupCounter] = { id: groupCounter, matches: [] };
                    } else if (groupedMatches[groupCounter].matches.length >= 2) {
                        groupCounter++;
                        groupedMatches[groupCounter] = { id: groupCounter, matches: [] };
                    }

                    // Agregar el partido al grupo actual
                    groupedMatches[groupCounter].matches.push(match);
                });


                let team1Score = match.firstTeamScore;

                if (team1Score === null) {
                    team1Score = "-"
                }

                let team2Score = match.secondTeamScore;

                if (team2Score === null) {
                    team2Score = "-"
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

                    group.matches.forEach(match => {
                        const listItem = document.createElement('li');
                        listItem.className = 'tournament-bracket__item';
                        listItem.innerHTML = `
                                 <div class="tournament-bracket__match" tabindex="0">
                                        <table class="tournament-bracket__table">
                                             <caption class="tournament-bracket__caption">
                                                    <p>${match.date}</p>
                                             </caption>
                                             <thead class="sr-only">
                                                <tr>
                                                    <th>Country</th>
                                                    <th>Score</th>
                                                </tr>
                                             </thead>
                                             <tbody class="tournament-bracket__content">
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                         <span class="tournament-bracket__number">${team1Score}</span> 
                                                    </td>
                                                </tr>
                                                
                                        
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                        <span class="tournament-bracket__number">${team2Score}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                 </div>                         
                        `;
                        groupElement.appendChild(listItem);
                    });

                    calendarListHTML.appendChild(groupElement);
                });
            }
        })
        .catch(error => console.error(error));
}


document.addEventListener("DOMContentLoaded", loadCalendar);

function modifyDate(matchId, tournamentId) {
    window.location.replace(`modifyDate.html?match-id=${matchId}&tournament-id=${tournamentId}`);
}

