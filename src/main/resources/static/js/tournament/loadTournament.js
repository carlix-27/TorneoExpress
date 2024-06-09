// Función para cargar los torneos del usuario
// Function to load the user's tournaments
function loadTournament() {
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
            const tournamentList = document.getElementById("tournament-result");
            tournamentList.innerHTML = `
                <div id="result">
                    <h2>${tournament.name}</h2>
                    <p>Ubicación: ${tournament.location}</p>
                    <p>Dificultad: ${tournament.difficulty}</p>
                    <p>Privacidad: ${tournament.private ? "Privado" : "Público"}</p>
                    <p>Inicio: ${tournament.startDate}</p>
                    <!-- <p>Equipos: ${tournament.participatingTeams}</p> -->
                    <p>Cantidad de equipos permitidos: ${tournament.maxTeams}</p>
                    <button id="join-button" type="submit">${tournament.private ? "Enviar solicitud" : "Unirse"}</button>
                </div>
            `;

            const joinButton = document.getElementById("join-button");
            joinButton.addEventListener("click", () => {
                joinTournament(tournamentId);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}


// Function to handle the join/request join action
function joinTournament(tournamentId) {
    fetch(`/api/tournaments/${tournamentId}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerId : localStorage.getItem("userId")} )
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to join team: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Request to join the tournament was successful!');
            // Optionally update the UI or handle the response data
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to join the tournament. Please try again.');
        });
}

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadTournament);
