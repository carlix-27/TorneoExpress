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
                        <button id="join-button" type="submit">${team.private ? "Enviar solicitud" : "Unirse"}</button>
                    </div>
                `;

            const joinButton = document.getElementById("join-button");
            joinButton.addEventListener("click", () => {
                joinTeam(teamId);
            });

        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Function to handle the join/request join action
function joinTeam(teamId) {
    fetch(`/api/teams/${teamId}/join`, {
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
            alert('Request to join the team was successful!');
            // Optionally update the UI or handle the response data
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to join the team. Please try again.');
        });
}

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadTeam);
