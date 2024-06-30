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

    function renderTeams(teams) { // TODO: Sección <td></td> Considero que esta parte no debe estar acá, directamente debe estar el botón de Ver Estadísticas, de forma genérica y no por cada equipo
        const TeamsScoreTableBody = document.querySelector("#equipoPuntajeTable tbody");
        TeamsScoreTableBody.innerHTML = ''; // Clear previous data

        teams.forEach(team => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${team.name}</td>
                <td>
                    <button class="action-button view-button" data-team-id="${team.id}">Ver</button>
       
                </td>
            `;
            TeamsScoreTableBody.appendChild(row);
        });

        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', handleViewPlayer);
        });

        document.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', handleRemovePlayer);
        });
    }

    function handleViewPlayer(event) { // TODO: Es posible que exista la posibilidad de acá ver un equipo.
        const teamId = event.target.getAttribute('data-team-id');
        // Implement view player functionality here
        console.log(`View team with ID: ${teamId}`);
    }


    function displaySuccessMessage(message) {
        const successMessage = document.getElementById("successMessage");
        successMessage.textContent = message;
        successMessage.style.display = "block";

        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    }

    function displayErrorMessage(message) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = message;
        errorMessage.style.display = "block";

        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }



    function getTournamentIdFromURL() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('id');
    }
});
