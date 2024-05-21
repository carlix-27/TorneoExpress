function createTeam(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('team-name').value;
    const location = document.getElementById('team-location').value;
    const isPrivate = document.getElementById('privacy').checked;
    const captainId = localStorage.getItem("userId");

    if (!name.trim()) {
        document.getElementById('error-message').innerText = "Nombre del equipo no puede estar vacío.";
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
        return;
    }

    if (!location.trim()) {
        document.getElementById('error-message').innerText = "Ubicación del equipo no puede estar vacía.";
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
        if (xhr.status === 201) {
            const createdTeam = JSON.parse(xhr.responseText);
            console.log("Team created.", createdTeam);
            console.log(captainId);
            document.getElementById('success-message').innerText = "Equipo creado exitosamente!";
            document.getElementById('success-message').style.color = 'green';
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('error-message').style.display = 'none';

            // Actualizo el estado del capitán en el frontend
            localStorage.setItem("isCaptain", true);

        } else if (xhr.status === 500) {
            document.getElementById('error-message').innerText = "El nombre del equipo debe ser único. Por favor, elija un nombre diferente.";
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = "Error al crear el equipo";
            errorMessage.style.display = "block";
            console.error(xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(createTeamRequest));
}

// Attach createTeam function to form submit event
const form = document.getElementById('add-team-form');
form.addEventListener('submit', createTeam);
