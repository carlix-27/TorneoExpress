function createTournament() {
    const name = document.getElementById('tournament-name').value;
    const description = document.getElementById('tournament-description').value;


    const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage

    const tournamentData = {
        name: name,
        description: description,
        creatorId: userId // Include the userId in the tournament data
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/tournaments', true);
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
