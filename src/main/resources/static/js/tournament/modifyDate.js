function fetchMatchDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('match-id');
    const tournamentId = urlParams.get('tournament-id');

    fetch(`/api/tournaments/${tournamentId}/calendar/${matchId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(match => {
            document.getElementById('match-id').value = match.id;
            document.getElementById('team1-name').value = match.name;
            document.getElementById('team2-name').value = match.difficulty;
            document.getElementById('match-location').value = match.location;

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateMatch(event) {
    event.preventDefault();

    const matchId = document.getElementById('match-id').value;
    const team1 = document.getElementById('team1-name').value;
    const team2 = document.getElementById('team2-name').value;
    const location = document.getElementById('match-location').value;

    const updatedMatch = {
        id: matchId,
        team1: team1,
        team2: team2,
        location: location
    };

    console.log(updatedMatch)

    const tournamentId = getTournamentIdFromUrl();

    fetch(`/api/tournaments/${tournamentId}/calendar/${matchId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMatch)
    })
        .then(response => {
            if (!response.ok) {
                displayErrorMessage("Error al actualizar el torneo");
            }
            displaySuccessMessage("Torneo actualizado con éxito");
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const displaySuccessMessage = message => {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";

    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000);
};

function getTournamentIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('tournament-id');
}

document.addEventListener("DOMContentLoaded", function () {
    const tournamentId = getTournamentIdFromUrl();

    if (tournamentId) {
        fetchMatchDetails();

        const editForm = document.getElementById('modify-date-form');
        editForm.addEventListener('submit', updateMatch);
    } else {
        console.error('Tournament ID not found in URL');
    }
});