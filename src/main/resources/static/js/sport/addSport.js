function addSport() {
    const sportName = document.getElementById('sport-name').value;
    const num_players = document.getElementById('num_players').value;

    if (!sportName.trim()) {
        displayErrorMessage("Nombre del deporte no puede estar vació.")
        return;
    }

    if (!num_players.trim()) {
        displayErrorMessage("Por favor especificar numero de jugadores")
        return;
    }


    const createSportRequest = {
        name: sportName,
        num_players: num_players,
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/sports/create', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            window.location.href = '/deportes.html?success=true';
        } else if (xhr.status === 500) {
            displayErrorMessage("Nombre del deporte debe ser único")
        } else {
            console.error("Error:", xhr.status, xhr.responseText);
        }
    };

    xhr.send(JSON.stringify(createSportRequest));
}