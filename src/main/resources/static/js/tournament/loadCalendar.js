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
                    case 'ROUNDROBIN':
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
                                                         <span class="tournament-bracket__number">${match.firstTeamScore}</span> 
                                                    </td>
                                                </tr>
                                                
                                        
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                        <span class="tournament-bracket__number">${match.secondTeamScore}</span>
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
        .then(response =>{
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })

        .then(matches => {
            const results = document.createElement('div');
            results.id = 'result';
            results.innerHTML = `
                <h2>${tournamentName} - Calendario</h2>
            `;

            calendarListHTML.appendChild(results);

            let winners = [];

            let roundCompleted = true;

            matches.forEach(match => {
                const team1Score = match.firstTeamScore !== null ? match.firstTeamScore : 0;
                const team2Score = match.secondTeamScore !== null ? match.secondTeamScore : 0;

                if(team1Score !== 0  || team2Score !== 0) { // Si son 0 quiere decir que aun no se agregaron estadisticas a ninguno de los equipos. Estan 0 a 0

                    const winner = checkWinner(team1Score, team2Score);

                    if (winner !== null) {
                            const winningTeam = winner === 1 ? match.team1 : match.team2;
                            winners.push(winningTeam);
                        }
                    } else{
                        roundCompleted = false; // Aun no terminamos de hacer el agregado de estadisticas.
                    }


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
        });
}



// FIXME: Que pasa si es empate? Que informe, que pasan a penales y de ahi forma random quien gana. Es la mejor forma de resolverlo.


// todo: considera tener en cuenta el isPlayed de cada partido, de esa forma resolvemos mediante el uso de resolveTie y listo.
// esta resolucion aplicaria a cada caso.


function checkWinner(team1Score, team2Score) {
    if(team1Score === team2Score){
        return 0;
    } else if(team1Score > team2Score){
        return 1;
    } else{
        return 2;
    }
}


function fetchGroupStage(id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type) {
    console.log("Matches", matches);
    console.log("Type", type);

    fetch(`/api/tournaments/${id}/${type}/calendar`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(calendarMatches => {
            // Limpiar el contenido anterior
            calendarListHTML.innerHTML = `
                <div id="result">
                    <h2>${tournamentName} - Calendario</h2>
                </div>
            `;

            console.log("MatchesCalendar", matches);

            if (tournamentCreatorId !== localStorage.getItem("userId")) {

                const groupedMatches = [];
                let currentGroup = [];
                let groupCount = 0;
                let winners = [];
                let roundCompleted = true;

                matches.forEach((match, index) => {
                    currentGroup.push(match);
                    if (currentGroup.length === 6 && groupCount < 4) {
                        groupedMatches.push(currentGroup);
                        currentGroup = []; // Limpiar el grupo para el siguiente
                        groupCount++;
                        if (groupCount === 4){
                            return;
                        }
                    }

                    // // Manejar el grupo 5
                    // if (groupCount === 4 && index === matches.length - 1) {
                    //     groupedMatches.push(currentGroup); // Añadir los elementos restantes al grupo 5
                    // }

                    const team1Score = match.firstTeamScore !== null ? match.firstTeamScore : 0;
                    const team2Score = match.secondTeamScore !== null ? match.secondTeamScore : 0;

                    if(team1Score !== 0  || team2Score !== 0) { // Si son 0 quiere decir que aun no se agregaron estadisticas a ninguno de los equipos. Estan 0 a 0

                        const winner = checkWinner(team1Score, team2Score);

                        if (winner !== null) {
                            const winningTeam = winner === 1 ? match.team1 : match.team2;
                            winners.push(winningTeam);
                        }
                    } else{
                        roundCompleted = false; // Aun no terminamos de hacer el agregado de estadisticas.
                    }
                });

                if (groupCount === 4 && currentGroup.length > 0) {
                    groupedMatches.push(currentGroup);
                }


                console.log(groupCount);
                console.log("Grouped Teams:", groupedMatches);

                // Iteramos sobre los grupos

                groupedMatches.forEach((group, groupIndex) => {
                        // Crear un elemento para el grupo
                        const groupElement = document.createElement('div');
                        groupElement.classList.add('group');
                        const groupHeader = document.createElement('h2');
                        if (groupIndex < 4){
                            groupHeader.textContent = `Grupo ${groupIndex + 1}`;
                        } else {
                            groupHeader.textContent = 'Fase Knockout';
                        }

                        groupElement.appendChild(groupHeader);

                        // Iterar sobre los partidos del grupo
                        group.forEach((match) => {
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
                                            <th>Equipo</th>
                                            <th>Score</th>
                                        </tr>
                                    </thead>
                                    <tbody class="tournament-bracket__content">
                                        <tr class="tournament-bracket__team">
                                            <td class="tournament-bracket__country">
                                                <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                            </td>
                                            <td class="tournament-bracket__score">
                                                <span class="tournament-bracket__number">${match.firstTeamScore}</span>
                                            </td>
                                        </tr>
                                        <tr class="tournament-bracket__team">
                                            <td class="tournament-bracket__country">
                                                <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                            </td>
                                            <td class="tournament-bracket__score">
                                                <span class="tournament-bracket__number">${match.secondTeamScore}</span>
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

                // 4 grupos, logica de knockout
                if(groupedMatches.length === 4 && roundCompleted && matches.length > 24){
                    const groupMatches = groupedMatches.map(group => group.map(match => match.winner));
                    // Aca, tiene que tomar los ultimos 4 partidos que hay
                    const knockoutMatches = buildKnockoutFixture(groupMatches.flat());

                    fetchKnockoutFixtureForGroups(id, knockoutMatches, "Fase Knockout", tournamentCreatorId, calendarListHTML, "KNOCKOUT");
                }

            }
        })
        .catch(error => console.error(error));
}

function buildKnockoutFixture(groupMatches) {
    const knockoutMatches = [];
    for (let i = 0; i < groupMatches.length; i += 2) {
        const match = {
            team1: groupMatches[i],
            team2: groupMatches[i + 1],
        };
        knockoutMatches.push(match);
    }
    return knockoutMatches;
}



function fetchKnockoutFixtureForGroups(id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type){

    fetch(`/api/tournaments/${id}/${type}/calendar`)
        .then(response =>{
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })

        .then(matches => {

            console.log("Matches que tengo en el metodo", matches);

            const results = document.createElement('div');
            results.id = 'result';
            results.innerHTML = `
                <h2>${tournamentName} - Calendario</h2>
            `;

            calendarListHTML.appendChild(results);

            let winners = [];

            let roundCompleted = true;

            const lastFourMatches = matches.slice(-4);

            lastFourMatches.forEach(match => {
                console.log("Match: ", match);
                const team1Score = match.firstTeamScore !== null ? match.firstTeamScore : 0;
                const team2Score = match.secondTeamScore !== null ? match.secondTeamScore : 0;

                if(team1Score !== 0  || team2Score !== 0) { // Si son 0 quiere decir que aun no se agregaron estadisticas a ninguno de los equipos. Estan 0 a 0

                    const winner = checkWinner(team1Score, team2Score);

                    if (winner !== null) {
                        const winningTeam = winner === 1 ? match.team1 : match.team2;
                        winners.push(winningTeam);
                    }
                } else{
                    roundCompleted = false; // Aun no terminamos de hacer el agregado de estadisticas.
                }


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
        });
}






document.addEventListener("DOMContentLoaded", loadCalendar);

function modifyDate(matchId, tournamentId) {
    window.location.replace(`modifyDate.html?match-id=${matchId}&tournament-id=${tournamentId}`);
}

