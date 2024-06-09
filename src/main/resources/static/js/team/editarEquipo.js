function fetchTeamDetails(teamId) {
    fetch(`/api/teams/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(team => {
            // Populate form fields with tournament details
            document.getElementById('team-id').value = team.id;
            document.getElementById('team-name').value = team.name;
            document.getElementById('location').value = team.location;

            // Checkbox needs to be checked based on 'isPrivate' value
            const privacyCheckbox = document.getElementById('privacy');
            privacyCheckbox.checked = team.isPrivate;
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Function to handle form submission
function updateTeam(event) {
    event.preventDefault(); // Prevent default form submission

    const teamId = document.getElementById('team-id').value;
    const name = document.getElementById('team-name').value;
    const location = document.getElementById('location').value;
    const isPrivate = document.getElementById('privacy').checked;

    const updatedTeam = {
        id: teamId, // Include the ID in the updated data
        name: name,
        location: location,
        isPrivate: isPrivate
    };

    fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTeam)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to update team: ${response.status} ${response.statusText}`);
            }
            // Redirect back to tournaments list after successful update
            window.location.href = 'misEquipos.html';
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Function to get tournament ID from URL query parameter
function getTeamIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

// Entry point when the page loads
document.addEventListener("DOMContentLoaded", function() {
    const teamId = getTeamIdFromUrl();
    if (teamId) {
        // Fetch and populate tournament details
        fetchTeamDetails(teamId);

        // Add event listener to form submission
        const editForm = document.getElementById('edit-team-form');
        editForm.addEventListener('submit', updateTeam);
    } else {
        console.error('Team ID not found in URL');
    }
});
