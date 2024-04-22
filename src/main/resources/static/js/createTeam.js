function createTeam() {
    const name = document.getElementById('team-name').value;
    const sport = document.getElementById('team-sport').value;
    const location = document.getElementById('team-location').value;
    const isPrivate = document.getElementById('team-privacy').value;
    const captainId = localStorage.getItem("userId");

    const createTeamRequest = {
        teamName: name,
        sport: sport,
        location: location,
        isPrivate: isPrivate,
        captain: captainId
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/createTeam/submit_creation', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            //localStorage.setItem("token", response.token);
            window.location.replace("home.html?success=true");
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = "Error creating team"; // Set your error message here
            errorMessage.style.display = "block"; // Display the error message div
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