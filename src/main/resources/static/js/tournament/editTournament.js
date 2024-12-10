function fetchTournamentDetails(tournamentId) {
    fetch(`/api/tournaments/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournament => {

            document.getElementById('tournament-id').value = tournament.id;
            document.getElementById('tournament-name').value = tournament.name;
            document.getElementById('difficulty').value = tournament.difficulty;

            document.getElementById('privacy').checked = tournament.private;

        })
        .catch(error =>{
            console.error('Error:', error);
        });
}

function updateTournament(event) {
    event.preventDefault();

    const tournamentId = document.getElementById('tournament-id').value;
    const name = document.getElementById('tournament-name').value;
    const isTournamentPrivate = document.getElementById('privacy').checked;

    console.log(isTournamentPrivate)

    const difficulty = document.getElementById('difficulty').value;

    const updatedTournament = {
        name: name,
        location: location,
        isPrivate: isTournamentPrivate,
        difficulty: difficulty
    };

    console.log(updatedTournament)

    fetch(`/api/tournaments/${tournamentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTournament)
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


function getTournamentIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

document.addEventListener("DOMContentLoaded", function () {
    const tournamentId = getTournamentIdFromUrl();

    if (tournamentId) {
        fetchTournamentDetails(tournamentId);

        const editForm = document.getElementById('edit-tournament-form');
        editForm.addEventListener('submit', updateTournament);
    } else {
        console.error('Tournament ID not found in URL');
    }
});
