// Function to load the teams
function loadTeams() {
    fetch(`/api/teams/all`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(teams => {
            const listaEquipos = document.getElementById("lista-todos-equipos");
            listaEquipos.innerHTML = ""; // Clear the list before loading teams

            teams.forEach(team => {
                const playerCount = team.players.length;
                console.log(playerCount)
                const maxPlayers = team.sport.num_players * 2;
                console.log(maxPlayers)

                const li = document.createElement("li");
                li.innerHTML = `
                    <div>
                        <h3>${team.name}</h3>
                        <p>Ubicación: ${team.location}</p>
                        <p>Privacidad: ${team.private ? "Privado" : "Público"}</p>
                        <p>Jugadores inscritos: ${playerCount} / ${maxPlayers}</p>
                    </div>
                `;
                listaEquipos.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Load the teams when the page loads
document.addEventListener("DOMContentLoaded", loadTeams);
