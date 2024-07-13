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
                                                         <span class="tournament-bracket__number">3</span> 
                                                    </td>
                                                </tr>
                                                
                                        
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                        <span class="tournament-bracket__number">2</span>
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

function fetchKnockoutFixture(id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type) {
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
                renderKnockoutStages(matches, calendarListHTML);
            } else {
                renderEditableMatches(matches, calendarListHTML);
            }
        })
        .catch(error => console.error('Error:', error));
}

function renderKnockoutStages(matches, calendarListHTML) {
    const totalMatches = matches.length;
    const stages = ['Octavos de Final', 'Cuartos de Final', 'Semifinal', 'Final'];

    let matchIndex = 0;
    stages.forEach(stage => {
        const stageMatches = getStageMatches(matches, matchIndex, stage, totalMatches);
        if (stageMatches.length > 0) {
            const stageTitle = document.createElement('h3');
            stageTitle.className = 'tournament-bracket__round-title';
            stageTitle.textContent = stage;
            calendarListHTML.appendChild(stageTitle);

            stageMatches.forEach(match => {
                const listItem = document.createElement('li');
                listItem.className = 'tournament-bracket__item';
                listItem.innerHTML = generateMatchHTML(match);
                calendarListHTML.appendChild(listItem);
            });
            matchIndex += stageMatches.length;
        }
    });
}

function getStageMatches(matches, startIndex, stage, totalMatches) {
    const stageSizes = {
        'Octavos de Final': totalMatches >= 16 ? 8 : 0,
        'Cuartos de Final': totalMatches >= 8 ? 4 : 0,
        'Semifinal': totalMatches >= 4 ? 2 : 0,
        'Final': totalMatches >= 2 ? 1 : 0
    };

    const size = stageSizes[stage];
    return matches.slice(startIndex, startIndex + size);
}


function generateMatchHTML(match) {
    const team1Score = match.firstTeamScore !== null ? match.firstTeamScore : "-";
    const team2Score = match.secondTeamScore !== null ? match.secondTeamScore : "-";

    return `
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
        <script>checkWinner(${team1Score}, ${team2Score})</script>
    `;
}

function renderEditableMatches(matches, calendarListHTML) {
    matches.forEach(match => {
        const location = match.matchLocation;
        const date = match.date;
        const team1 = match.team1.name;
        const team2 = match.team2.name;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h3>${date}</h3>
            <p>${team1} VS ${team2}</p>
            <p>${location}</p>
            <button class="modify-date-button" onclick="modifyDate(${match.id}, ${id})">Modificar fecha</button>
        `;
        calendarListHTML.appendChild(listItem);
    });
}

function checkWinner(team1Score, team2Score) {
    if (team1Score !== "-" && team2Score !== "-") {
        return team1Score > team2Score ? 1 : 2;
    }
    return null;
}


/*
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
                    console.log(team1Score)

                    if (team1Score === null) {
                        team1Score = "-"
                    }

                    let team2Score = match.secondTeamScore;
                    console.log(team2Score)

                    if (team2Score === null) {
                        team2Score = "-"
                    }


                    const listItem = document.createElement('li');
                    listItem.className = 'tournament-bracket__item';
                    const title = ''; // TODO: Tiene que ir variando acorde la etapa del torneo. APLICA A 16 Equipos maximo esta logica.
                    listItem.innerHTML = `
                                 <h3 class="tournament-bracket__round-title"> Octavos de Final </h3>
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
                                 <script>checkWinner(team1Score, team2Score)</script>   
                                 
                                 <h3 class="tournament-bracket__round-title"> Cuartos de Final </h3>
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
                                                <tr class="tournament-bracket__team tournament-bracket__team--winner">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                         <span class="tournament-bracket__number">${team1Score}</span> 
                                                    </td>
                                                </tr>
                                                
                                        
                                                <tr class="tournament-bracket__team tournament-bracket__team--winner">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr> <!--Este equipo debe ser distinto al que inicialmente era, es decir, el ganador del otro partido. -->
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                        <span class="tournament-bracket__number">${team2Score}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                 </div>
                                 
                                 <script>checkWinner(team1Score, team2Score)</script>   
                                 
                                 <h3 class="tournament-bracket__round-title"> Semifinal </h3>
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
                                                <tr class="tournament-bracket__team tournament-bracket__team--winner tournament-bracket__team--winner">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                         <span class="tournament-bracket__number">${team1Score}</span> 
                                                    </td>
                                                </tr>
                                                
                                        
                                                <tr class="tournament-bracket__team tournament-bracket__team--winner tournament-bracket__team--winner">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr> <!--Este equipo debe ser distinto al que inicialmente era, es decir, el ganador del otro partido. -->
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                        <span class="tournament-bracket__number">${team2Score}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                 </div>
                                 
                                 <script>checkWinner(team1Score, team2Score)</script>   
                                 
                                 <h3 class="tournament-bracket__round-title"> Final </h3>
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
                                                <tr class="tournament-bracket__team tournament-bracket__team--winner tournament-bracket__team--winner tournament-bracket__team--winner">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                         <span class="tournament-bracket__number">${team1Score}</span> 
                                                    </td>
                                                </tr>
                                                
                                        
                                                <tr class="tournament-bracket__team tournament-bracket__team--winner tournament-bracket__team--winner tournament-bracket__team--winner">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr> <!--Este equipo debe ser distinto al que inicialmente era, es decir, el ganador del otro partido. -->
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                        <span class="tournament-bracket__number">${team2Score}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                 </div>
                                 
                                 <script>checkWinner(team1Score, team2Score)</script>   <!--El que gana aca gana el torneo entero.-->
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
}*/

function checkWinner(team1Score, team2Score){

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
                                                         <span class="tournament-bracket__number">3</span> 
                                                    </td>
                                                </tr>
                                                
                                        
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                        <span class="tournament-bracket__number">2</span>
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


// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadCalendar);

function modifyDate(matchId, tournamentId) {
    window.location.replace(`modifyDate.html?match-id=${matchId}&tournament-id=${tournamentId}`);
}


/*
   else {
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
            } */