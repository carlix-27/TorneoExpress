document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("find-player-form");
    const playerList = document.getElementById("lista-jugadores");

    function getAllPlayers() {
        fetch(`/api/user/players`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch active tournaments: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(players => renderPlayers(players))
            .catch(error => {
                console.error('Error:', error);
                // Handle the error, display a message to the user
            });
    }

    function renderPlayers(players) {
        playerList.innerHTML = ""; // Clear previous results

        players.forEach(function (player) {
            const listItem = document.createElement("li");
            listItem.textContent = player.name + " - " + player.location;
            playerList.appendChild(listItem);
        });
    }

    function filterPlayers(event){
        event.preventDefault();

        console.log("Filtering players...");

        const playerName = form.querySelector("#playerName").value.trim().toLowerCase();
        const playerLocation = form.querySelector("#playerLocation").value.trim().toLowerCase();

        console.log("Name:", playerName);
        console.log("Location:", playerLocation);

        fetch(`/api/user/players`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch active players: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(players => {
                console.log("Fetched players: " + players);

                const filteredPlayers = players.filter(function (player) {
                    const lowercasePlayerName = player.name.toLowerCase();
                    console.log("LowercasePlayerName: ", lowercasePlayerName);
                    const lowercaseLocation = player.location.toLowerCase(); // Corrected this line
                    console.log("LowercasePlayerLocation: ", lowercaseLocation);

                    const nameMatches = lowercasePlayerName.includes(playerName.toLowerCase()) || playerName === "";
                    console.log("Name Matches? : ", nameMatches);

                    const locationMatches = lowercaseLocation.includes(playerLocation.toLowerCase()) || playerLocation === ""; // Corrected this line
                    console.log("Location Matches? : ", locationMatches);

                    return nameMatches && locationMatches;
                });

                console.log("Filtered Players: ", filteredPlayers);
                renderPlayers(filteredPlayers);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    form.addEventListener("submit", filterPlayers);

    // Fetch active tournaments when the page loads
    getAllPlayers();
});