function createTournament() {
    const name = document.getElementById('tournament-name').value;
    const sport = document.getElementById('sport').value;
    const location = document.getElementById('location').value;
    const isPrivate = document.getElementById('privacy').checked;
    const difficulty = document.getElementById('difficulty').value; // Get the selected difficulty value
    const userId = localStorage.getItem("userId");

    const tournamentData = {
        name: name,
        sport: sport,
        location: location,
        isPrivate: isPrivate,
        difficulty: difficulty, // Send the selected difficulty value
        creatorId: userId
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/tournaments/create', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 201) {
            const createdTournament = JSON.parse(xhr.responseText);
            console.log('Tournament created:', createdTournament);
        } else {
            console.error(xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(tournamentData));
}
