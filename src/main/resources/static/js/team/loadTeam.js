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

            const players = team.players;
            const playerList = players.map(player => `<li><a>${player.name}</a></li>`).join('');

            teamList.innerHTML = "";
            teamList.innerHTML = `
        <div id="result">
            <h2>${team.name}</h2>
            <p>Ubicación: ${team.location}</p>
            <p>Privacidad: ${team.private ? "Privado" : "Público"}</p>
            <p>Puntos de prestigio: ${team.prestigePoints}</p>
            <p>Número de jugadores: ${team.players.length}</p>
            <p>Jugadores del equipo:</p>
            <ul>${playerList}</ul>
        </div>
    `;
        })

        .catch(error => {
            console.error('Error:', error);
        });
}

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadTeam);
