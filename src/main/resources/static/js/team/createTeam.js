function fetchSports() {
    fetch('/api/sports') // Assuming this endpoint returns the list of sports
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch sports: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(sports => {
            const sportDropdown = document.getElementById('sport');
            sports.forEach(sport => {
                const option = document.createElement('option');
                option.value = sport.sportId; // Assuming sportId is the ID field in your Sport entity
                option.text = sport.sportName; // Assuming sportName is the name field in your Sport entity
                sportDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user or retry fetch
        });
}



function createTeam(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('team-name').value;
    const sportId = document.getElementById('sport').value; // Get the selected sportId
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
        sport: { sportId: sportId },
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
