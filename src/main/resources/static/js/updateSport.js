// Function to fetch sport details by ID
function fetchSportDetails(sportId) {
    fetch(`/api/sports/${sportId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch sport details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(sport => {
            // Populate form fields with sport details
            document.getElementById('sport-id').value = sport.sportId;
            document.getElementById('sport-name').value = sport.sportName;
            document.getElementById('num_players').value = sport.num_players;
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Function to handle form submission
function updateSport() {

    const sportId = document.getElementById('sport-id').value;
    const sportName = document.getElementById('sport-name').value;
    const num_players = document.getElementById('num_players').value;

    const updatedSport = {
        id: sportId, // Include the ID in the updated data
        sportName: sportName,
        num_players: num_players
    };

    fetch(`/api/sports/update/${sportId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSport)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to update sport: ${response.status} ${response.statusText}`);
            }
            // Redirect back to sports list after successful update
            window.location.href = 'deportes.html';
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Function to get sport ID from URL query parameter
function getSportIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

// Entry point when the page loads
document.addEventListener("DOMContentLoaded", function() {
    const sportId = getSportIdFromUrl();
    if (sportId) {
        // Fetch and populate sport details
        fetchSportDetails(sportId);
    } else {
        console.error('Sport ID not found in URL');
    }
});
