// Función para cargar los torneos del usuario
function loadTeam() {
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get('id');

    fetch(`/api/teams/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(team => {
            const teamList = document.getElementById("team-result");
            teamList.innerHTML = "";
            teamList.innerHTML = `
                    <div id="result">
                        <h2>${team.name}</h2>
                        <p>Ubicación: ${team.location}</p>
                        <p>Privacidad: ${team.private ? "Privado" : "Público"}</p>
                        <p>Puntos de prestigio: ${team.prestigePoints}</p>
                        <p>Cantidad de jugadores: ${team.players.length}</p>
                        <button type="submit">${team.private ? "Enviar solicitud" : "Unirse"}</button>
                    </div>
                `;
            //teamList.appendChild(li);// Limpiar la lista antes de cargar equipos

            /*
            teams.forEach(team => {
            });
             */
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadTeam);
