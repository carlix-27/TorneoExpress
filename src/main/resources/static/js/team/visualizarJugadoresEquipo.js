document.addEventListener("DOMContentLoaded", function () {
    const teamId = getTeamIdFromURL();
    const userId = localStorage.getItem("userId");

    if (!teamId || !userId) {
        console.error("Team ID or User ID not found");
        return;
    }

    fetchPlayersOfTeam(teamId, userId);

    function fetchPlayersOfTeam(teamId, userId) {
        fetch(`/api/teams/all/${teamId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch players of team: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(players => {
                renderPlayers(teamId, players, userId);
            })
            .catch(error => console.error('Error:', error));
    }

    function renderPlayers(teamId, players, userId) {
        fetchTeamDetails(teamId)
            .then(team => {
                const playersTableBody = document.querySelector("#playersTable tbody");
                playersTableBody.innerHTML = ''; // Clear previous data

                // Update the header dynamically with team name
                const playersHeader = document.querySelector("h2");
                playersHeader.textContent = `Jugadores del Equipo: ${team.name}`;

                players.forEach(player => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${player.name}</td>
                        <td>
                            ${userId == team.captainId && player.id != userId ? `<button class="action-button remove-button" data-player-id="${player.id}">Expulsar</button>` : ''}
                        </td>
                    `;
                    playersTableBody.appendChild(row);
                });

                document.querySelectorAll('.remove-button').forEach(button => {
                    button.addEventListener('click', handleRemovePlayer);
                });

            })
            .catch(error => {
                console.error('Error fetching team details:', error);
            });
    }

    function handleRemovePlayer(event) {
        const playerId = event.target.getAttribute('data-player-id');

        fetch(`/api/teams/${teamId}/${playerId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to remove player: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(() => {
                displayFeedbackMessage('Jugador expulsado correctamente', true);
                fetchPlayersOfTeam(teamId, userId);
            })
            .catch(error => {
                console.error('Error:', error);
                displayFeedbackMessage('Failed to remove player', false);
            });
    }

    function displayFeedbackMessage(message, success) {
        const feedbackMessage = document.getElementById("feedbackMessage");
        feedbackMessage.textContent = message;
        feedbackMessage.style.color = success ? 'green' : 'red';
        feedbackMessage.style.display = "block";

        setTimeout(() => {
            feedbackMessage.style.display = "none";
        }, 3000);
    }

    function fetchTeamDetails(teamId) {
        return fetch(`/api/teams/${teamId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch team details: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
    }

    function getTeamIdFromURL() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('id');
    }
});
