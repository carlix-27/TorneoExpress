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
                /* Segundo fetch para agarrar el fixture. */
                fetchFixture(tournamentId, tournament, calendar);
            }

        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

function fetchFixture(id, tournament, calendarListHTML) {
    fetch(`/api/tournaments/${id}/calendar`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(fixture => {
            calendarListHTML.innerHTML = `
                <div id="result">
                    <h2>${tournament.name}</h2>
                    
                </div>
            `;

            /* Usar DTO para traer bien los datos. */
            fixture.matches.forEach(match => {
                const location = match.location;
                const date = match.date;
                const team1 = match.teamName1; // fetch team
                const team2 = match.teamName2; // fetch team

                const listItem = document.createElement('li');

                listItem.innerHTML = `
                    <h3>${date}</h3>
                    <p>${team1} VS ${team2}</p>
                    <p>${location}</p>
                `;
                calendarListHTML.appendChild(listItem);
            })

        })
}

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadCalendar);
