document.addEventListener("DOMContentLoaded", function () {
    const tournamentId = getTournamentIdFromURL();
    if (!tournamentId) {
        console.error("Tournament ID not found");
        return;
    }

    // Llamar a la función para obtener equipos y puntajes del torneo
    fetchTeamsAndPointsOfTournament(tournamentId)
        .catch(error => {
            console.error('Error:', error);
            // Manejar el error adecuadamente, por ejemplo, mostrar un mensaje al usuario
        });

    async function fetchTeamsAndPointsOfTournament(tournamentId) {
        try {
            // Obtener equipos del torneo
            const teamsResponse = await fetch(`/api/tournaments/${tournamentId}/teams`);
            if (!teamsResponse.ok) {
                throw new Error(`Failed to fetch teams of this tournament: ${teamsResponse.status} ${teamsResponse.statusText}`);
            }
            const teams = await teamsResponse.json();
            renderTeams(teams);
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw the error to be caught by the caller
        }
    }

    function renderTeams(teams) {
        const TeamsScoreTableBody = document.querySelector("#equipoPuntajeTable tbody");
        TeamsScoreTableBody.innerHTML = ''; // Limpiar datos previos

        teams.forEach(team => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${team.name}</td>
            `;
            TeamsScoreTableBody.appendChild(row);
        });

        // Agregar eventos a los botones de visualización si es necesario
        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', handleViewPlayer);
        });
    }

    function handleViewPlayer(event) {
        const teamId = event.target.getAttribute('data-team-id');
        // Implementar funcionalidad para visualizar jugadores u otra información del equipo
        console.log(`View team with ID: ${teamId}`);
    }

    function getTournamentIdFromURL() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('id');
    }
});
