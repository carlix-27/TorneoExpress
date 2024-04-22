function createTeam() {
    const name = document.getElementById('team-name').value;
    const location = document.getElementById('team-location').value;
    const isPrivate = document.getElementById('team-privacy').checked;
    const captainId = localStorage.getItem("userId");
    console.log(captainId)

    const createTeamRequest = {
        name: name,
        location: location,
        isPrivate: isPrivate,
        captainId: captainId
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/teams/create', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 201) { // Use 201 status for resource created
            const createdTeam = JSON.parse(xhr.responseText);
            console.log("Team created.", createdTeam);
            console.log("Captain id:", captainId);
            window.location.replace("home.html?success=true");
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = "Error creating team";
            errorMessage.style.display = "block";
            console.error(xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(createTeamRequest));
}
// Check for success message parameter in URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('success')) {
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block'; // Display the success message
}