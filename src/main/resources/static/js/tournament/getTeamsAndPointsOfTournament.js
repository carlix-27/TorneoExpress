document.addEventListener("DOMContentLoaded", function () {
    const tournamentId = getTournamentIdFromURL();
    if (!tournamentId) {
        console.error("Tournament ID not found");
        return;
    }

    // Llamar a la función para obtener equipos y puntajes del torneo
    fetchTeamsAndPointsOfTournament(tournamentId)
        .then(teamsWithScores => {
            // Renderizar equipos y puntajes en la tabla
            renderTeams(teamsWithScores);
        })
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

            // Obtener puntajes de los equipos
            const teamsScoreResponse = await fetch(`/api/tournaments/${tournamentId}/teamsScore`);
            if (!teamsScoreResponse.ok) {
                throw new Error(`Failed to fetch teams score of this tournament: ${teamsScoreResponse.status} ${teamsScoreResponse.statusText}`);
            }
            const teamsScore = await teamsScoreResponse.json();

            // Combinar la información de equipos y puntajes
            return combineTeamsAndScores(teams, teamsScore);
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw the error to be caught by the caller
        }
    }

    function combineTeamsAndScores(teams, teamsScore) {
        // Suponiendo que teams y teamsScore tienen la misma longitud y están ordenados de la misma manera
        return teams.map((team, index) => {
            return {
                id: team.id,
                name: team.name,
                score: teamsScore[index].score
            };
        });
    }

    function renderTeams(teams) {
        const TeamsScoreTableBody = document.querySelector("#equipoPuntajeTable tbody");
        TeamsScoreTableBody.innerHTML = ''; // Limpiar datos previos

        teams.forEach(team => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${team.name}</td>
                <td>${team.score}</td>
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
