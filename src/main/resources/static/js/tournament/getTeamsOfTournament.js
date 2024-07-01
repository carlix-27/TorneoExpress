// Acá debo hacer una lógica muy parecida a la que tiene visualizarJugadoresEquipo.js

document.addEventListener("DOMContentLoaded", function () {
    const tournamentId = getTournamentIdFromURL();
    if (!tournamentId) {
        console.error("Tournament ID not found");
        return;
    }
    fetchTeamsOfTournament(tournamentId);

    function fetchTeamsOfTournament(tournamentId) {
        fetch(`/api/tournaments/${tournamentId}/teams`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch teams of this tournament: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(teams => {
                renderTeams(teams);
            })
            .catch(error => console.error('Error:', error));
    }

    function renderTeams(teams) {
        const TeamsScoreTableBody = document.querySelector("#equipoPuntajeTable tbody");
        TeamsScoreTableBody.innerHTML = ''; // Clear previous data

        teams.forEach(team => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${team.name}</td>
                <td>
                   
                </td>
            `;
            TeamsScoreTableBody.appendChild(row);
        }); // TODO: En la sección ultima abajo de team.name deben cargarse los puntajes. A medida que cada partido gane un partido, debo ver como hacer eso!

        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', handleViewPlayer);
        });

    }

    function handleViewPlayer(event) {
        const teamId = event.target.getAttribute('data-team-id');
        // Implement view player functionality here
        console.log(`View team with ID: ${teamId}`);
    }

    function getTournamentIdFromURL() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('id');
    }
});
