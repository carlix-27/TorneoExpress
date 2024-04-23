function addSport() {
    const sportName = document.getElementById('sport-name').value;
    const num_players = document.getElementById('num_players').value;
    const userId = localStorage.getItem("userId");

    // Check if sport name or number of players is empty
    if (!sportName.trim()) {
        document.getElementById('error-message').innerText = "Sport name cannot be blank.";
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    if (!num_players.trim()) {
        document.getElementById('error-message').innerText = "Please specify number of players";
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    // Check if user is premium
    checkPremiumStatus(userId, function (isPremium){
        if (isPremium) {
            const createSportRequest = {
                name: sportName,
                num_players: num_players,
            };

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/sports/create', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = function () {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    console.log('Deporte creado: ', response);
                    alert('Deporte agregado exitosamente');
                    document.getElementById('add-sport-form').reset();
                } else if (xhr.status === 500) {
                    document.getElementById('error-message').innerText = "Sport name must be unique. Please choose a different name.";
                    document.getElementById('error-message').style.display = 'block';
                } else {
                    alert('Ocurrió un error al agregar el deporte. Por favor, inténtalo de nuevo.');
                    console.error(xhr.responseText);
                }
            };

            xhr.send(JSON.stringify(createSportRequest));
        } else {
            window.location.href = "buy_premium.html"; // Redirect to buy premium page
        }
    });
}

function checkPremiumStatus(userId, callback){
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
