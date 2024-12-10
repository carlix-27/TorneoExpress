function fetchSports() {
    fetch('/api/sports')
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
                option.value = sport.sportId;
                option.text = sport.sportName;
                sportDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function createTournament() {
    const name = document.getElementById('tournament-name').value;
    const sportId = document.getElementById('sport').value;

    const latitude = document.getElementById('location').dataset.latitude;
    const longitude = document.getElementById('location').dataset.longitude;

    if (!latitude || !longitude) {
        displayErrorMessage("Debe seleccionar una ubicación válida.");
        return;
    }

    const location = `${latitude},${longitude}`;

    const date = document.getElementById('start-date').value;
    const isPrivate = document.getElementById('privacy').checked;
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;
    const maxTeams = document.getElementById('maxTeams').value;
    const userId = localStorage.getItem("userId");

    if (!name.trim()) {
        displayErrorMessage("Tournament name cannot be blank.")
        return
    }

    // Solo toqueteo esto para poder poner la fecha que quiera y testear tranquilo para la creacion de torneos.
    // const today = new Date();
    // const selectedDate = new Date(date);
    //
    // today.setHours(0, 0, 0, 0);
    // selectedDate.setHours(0, 0, 0, 0);
    //
    // if (selectedDate < today) {
    //     displayErrorMessage("La fecha del torneo no puede ser anterior a la fecha actual.");
    //     return;
    // }

    if (maxTeams < 0) {
        displayErrorMessage("No se puede ingresar números negativos")
        return;
    }

    const tournamentData = {
        name: name,
        sport: { sportId: sportId },
        location: location,
        date: date,
        isPrivate: isPrivate,
        difficulty: difficulty,
        creatorId: userId,
        maxTeams: maxTeams,
        isActive: true,
        type: type
    };

    console.log(tournamentData)

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/tournaments/create', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const createdTournament = JSON.parse(xhr.responseText);
            displaySuccessMessage("Torneo creado con exito!")
        } else if (xhr.status === 500) {
            displayErrorMessage("El nombre del torneo debe ser único, por favor elegir un nuevo nombre.")
        } else {
            console.error("Error:", xhr.status, xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(tournamentData));

}
