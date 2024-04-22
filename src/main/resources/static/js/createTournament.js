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
            // Check if the tournament name is empty
            if (!name.trim()) {
                alert("Tournament name cannot be empty.");
                return;
            }

            const tournamentData = {
                name: name,
                sport: sport,
                location: location,
                isPrivate: isPrivate,
                difficulty: difficulty,
                creatorId: userId,
                isActive: true
            };

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/tournaments/create', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                if (xhr.status === 201) {
                    const createdTournament = JSON.parse(xhr.responseText);
                    console.log('Tournament created:', createdTournament);
                    // You can redirect or show a success message here
                } else if (xhr.status === 409) {
                    // Conflict - Tournament name must be unique
                    document.getElementById('error-message').innerText = "Tournament name must be unique. Please choose a different name.";
                    document.getElementById('error-message').style.display = 'block';
                } else {
                    console.error("Error:", xhr.status, xhr.responseText);
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
