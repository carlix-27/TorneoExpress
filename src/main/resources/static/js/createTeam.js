function createTeam() {
    const name = document.getElementById('team-name').value;
    const location = document.getElementById('team-location').value;
    const isPrivate = document.getElementById('team-privacy').checked;
    const captainId = localStorage.getItem("userId");
    console.log(captainId)

    if (!name.trim()) {
        document.getElementById('error-message').innerText = "Tournament name cannot be blank.";
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
        return;
    }

    if (!location.trim()) {
        document.getElementById('error-message').innerText = "Tournament location cannot be blank.";
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
        return;
    }

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
            document.getElementById('success-message').innerText = "Team created successfully!";
            document.getElementById('success-message').style.color = 'green';
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('error-message').style.display = 'none';
            //window.location.replace("home.html?success=true");
        } else if (xhr.status === 409) {
            // Conflict - Team name must be unique. Handled without SpringBoot decorator.
            document.getElementById('error-message').innerText = "Team name must be unique. Please choose a different name.";
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
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