function createTournament() {
    const name = document.getElementById('tournament-name').value;
    const sport = document.getElementById('sport').value;
    const location = document.getElementById('location').value;
    const isPrivate = document.getElementById('privacy').checked;
    const difficulty = document.getElementById('difficulty').value;
    const userId = localStorage.getItem("userId");

    // Check if user is premium
    checkPremiumStatus(userId, function(isPremium) {
        if (isPremium) {
            const tournamentData = {
                name: name,
                sport: sport,
                location: location,
                isPrivate: isPrivate,
                difficulty: difficulty,
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
        } else {
            window.location.href = "buy_premium.html"; // Redirect to buy premium page
        }
    });
}

function checkPremiumStatus(userId, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/user/' + userId + '/premium', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const isPremium = response.isPremium;
            callback(isPremium);
        } else {
            console.error(xhr.responseText);
            callback(false); // Default to not premium if there's an error
        }
    };
    xhr.send();
}
