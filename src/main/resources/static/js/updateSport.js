function updateSport(){
    const id = document.getElementById('id').value;
    const new_name = document.getElementById('new-sport-name').value;
    const new_num_players = document.getElementById('new_num_players').value;
    const updateSportRequest = {
        id: id,
        new_name: new_name,
        new_num_players: new_num_players,
    };

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `/api/sports/update/${id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('Deporte actualizado exitosamente');
            document.getElementById('update-sport-form').reset();
        } else {
            alert('Ocurrió un error al actualizar el deporte. Por favor, inténtalo de nuevo.');
        }
    };

    xhr.send(JSON.stringify(updateSportRequest));
}