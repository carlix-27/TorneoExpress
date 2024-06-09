// Función para cargar los torneos del usuario
// Function to load the user's tournaments
function loadCalendar() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    fetch(`/api/tournaments/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
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
                calendar.innerHTML = `
                <div id="result">
                    <h2>${tournament.name}</h2>
                    <p>Ubicación: ${tournament.location}</p>
                    <p>Dificultad: ${tournament.difficulty}</p>
                    <p>Privacidad: ${tournament.private ? "Privado" : "Público"}</p>
                    <p>Inicio: ${tournament.startDate}</p>
                    <!-- <p>Equipos: ${tournament.participatingTeams}</p> -->
                    <p>Cantidad de equipos permitidos: ${tournament.maxTeams}</p>
                    <a href="calendario.html?id=${tournament.id}"><h3>Ver calendario</h3></a>
                    <button id="join-button" type="submit">${tournament.private ? "Enviar solicitud" : "Unirse"}</button>
                </div>
            `;
            }

        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadCalendar);
