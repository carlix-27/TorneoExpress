document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    if (tournamentId) {
        document.getElementById('tournamentId').value = tournamentId;
    }

    const formularioEstadisticas = document.getElementById('formularioEstadisticas');
    if (formularioEstadisticas) {
        formularioEstadisticas.addEventListener('submit', saveStats);
    }

    if (tournamentId) {
        fetchMatches(tournamentId);
        fetchTeams(tournamentId);
    }
});

async function fetchMatches(tournamentId) {
    try {
        const response = await fetch(`/api/tournaments/${tournamentId}/activeMatches`);
        const matches = await response.json();
        console.log(matches)
        const partidoSelector = document.getElementById('partidoSelector');

        matches.forEach(match => {
            const option = document.createElement('option');
            option.value = match.id;

            const firstTeam = match.team1
            const secondTeam = match.team2

            option.textContent = `${firstTeam.name} vs ${secondTeam.name}`;
            partidoSelector.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching matches:', error);
    }
}

async function fetchTeams(tournamentId) {
    try {
        const response = await fetch(`/api/tournaments/${tournamentId}/teams`);
        const teams = await response.json();
        const winnerSelector = document.getElementById('winnerSelector');

        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            winnerSelector.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
}

async function saveStats(event) {
    event.preventDefault();

    const tournamentId = document.getElementById('tournamentId').value;
    const matchId = document.querySelector('#partidoSelector').value;
    const team1Score = document.querySelector('input[name="team1Score"]').value;
    const team2Score = document.querySelector('input[name="team2Score"]').value;
    const winnerId = document.querySelector('#winnerSelector').value;

    if (!isValidScore(team1Score) || !isValidScore(team2Score)) {
        displayErrorMessage("Ingrese puntajes válidos para los equipos");
        return;
    }

    const data = {
        winner: { id: parseInt(winnerId) },
        team1Score: parseInt(team1Score),
        team2Score: parseInt(team2Score)
    };

    try {
        const response = await fetch(`/api/matches/${tournamentId}/${matchId}/statistics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            displaySuccessMessage("Estadísticas agregadas con éxito");
            document.getElementById('formularioEstadisticas').reset();
        } else {
            displayErrorMessage("Hubo un problema al agregar las estadísticas");
        }
    } catch (error) {
        displayErrorMessage("Error al guardar las estadísticas");
    }
}













function isValidScore(score) {
    return !isNaN(parseInt(score)) && isFinite(score) && parseInt(score) >= 0;
}

function displaySuccessMessage(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";
}

function displayErrorMessage(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";

    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
}
