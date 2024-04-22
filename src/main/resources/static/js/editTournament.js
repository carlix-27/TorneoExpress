// Function to fetch tournament details by ID
function fetchTournamentDetails(tournamentId) {
    fetch(`/api/tournaments/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournament => {
            // Populate form fields with tournament details
            document.getElementById('tournament-id').value = tournament.id;
            document.getElementById('tournament-name').value = tournament.name;
            document.getElementById('sport').value = tournament.sport;
            document.getElementById('location').value = tournament.location;
            document.getElementById('difficulty').value = tournament.difficulty;

            // Checkbox needs to be checked based on 'isPrivate' value
            const privacyCheckbox = document.getElementById('privacy');
            privacyCheckbox.checked = tournament.isPrivate;
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}


// Function to handle form submission
function updateTournament(event) {
    event.preventDefault(); // Prevent default form submission

    const tournamentId = document.getElementById('tournament-id').value;
    const name = document.getElementById('tournament-name').value;
    const sport = document.getElementById('sport').value;
    const location = document.getElementById('location').value;
    const isPrivate = document.getElementById('privacy').checked;
    const difficulty = document.getElementById('difficulty').value;

    const updatedTournament = {
        id: tournamentId, // Include the ID in the updated data
        name: name,
        sport: sport,
        location: location,
        isPrivate: isPrivate,
        difficulty: difficulty
    };

    fetch(`/api/tournaments/${tournamentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTournament)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to update tournament: ${response.status} ${response.statusText}`);
            }
            // Redirect back to tournaments list after successful update
            window.location.href = 'misTorneos.html';
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Function to get tournament ID from URL query parameter
function getTournamentIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

// Entry point when the page loads
document.addEventListener("DOMContentLoaded", function() {
    const tournamentId = getTournamentIdFromUrl();
    if (tournamentId) {
        // Fetch and populate tournament details
        fetchTournamentDetails(tournamentId);
        // Add event listener to form submission
        const editForm = document.getElementById('edit-tournament-form');
        editForm.addEventListener('submit', updateTournament);
    } else {
        console.error('Tournament ID not found in URL');
    }
});
