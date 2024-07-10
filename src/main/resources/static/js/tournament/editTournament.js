function fetchAndPopulateSports(selectedSport) {
    fetch('/api/sports')
        .then(response => {
            if (!response.ok) {
                console.log(`Failed to fetch sports: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const sportSelect = document.getElementById('sport');
            sportSelect.innerHTML = ''; // Clear existing options

            const defaultOption = document.createElement('option');
            defaultOption.value = selectedSport.sportId;
            defaultOption.textContent = selectedSport.sportName;
            sportSelect.appendChild(defaultOption);

            data.forEach(sport => {
                if (sport.sportId !== selectedSport.sportId) {
                    const option = document.createElement('option');
                    option.value = sport.sportId;
                    option.textContent = sport.sportName;
                    sportSelect.appendChild(option);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching sports:', error);
        });
}

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
            document.getElementById('location').value = tournament.location;
            document.getElementById('difficulty').value = tournament.difficulty;

            const privacyCheckbox = document.getElementById('privacy');
            privacyCheckbox.checked = tournament.isPrivate;

            // Fetch sports and set the selected sport
            fetchAndPopulateSports(tournament.sport);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateTournament(event) {
    event.preventDefault();

    const tournamentId = document.getElementById('tournament-id').value;
    const name = document.getElementById('tournament-name').value;
    const location = document.getElementById('location').value;
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
