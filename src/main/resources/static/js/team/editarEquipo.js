function fetchTeamDetails(teamId) {
    fetch(`/api/teams/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch team details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(team => {
            document.getElementById('team-id').value = team.id;
            document.getElementById('team-name').value = team.name;
            document.getElementById('privacy').checked = team.private;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateTeam(event) {
    event.preventDefault();

    const teamId = document.getElementById('team-id').value;
    const name = document.getElementById('team-name').value;
    const isPrivate = document.getElementById('privacy').checked;

    const updatedTeam = {
        name: name,
        isPrivate: isPrivate
    };

    console.log(updatedTeam)

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
            displaySuccessMessage("Equipo editado exitosamente")
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getTeamIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

function displaySuccessMessage(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";
}


document.addEventListener("DOMContentLoaded", function() {
    const teamId = getTeamIdFromUrl();
    if (teamId) {
        // Fetch and populate team details
        fetchTeamDetails(teamId);

        // Add event listener to form submission
        const editForm = document.getElementById('edit-team-form');
        editForm.addEventListener('submit', updateTeam);
    } else {
        console.error('Team ID not found in URL');
    }
});