document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("find-player-form");
    const playerList = document.getElementById("lista-jugadores");
    const playerId = localStorage.getItem("userId");

    function getAllPlayers() {
        fetch(`/api/user/players`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch players: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(players => renderPlayers(players))
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function renderPlayers(players) {
        playerList.innerHTML = "";

        players.forEach(player => {
            const listItem = document.createElement("li");
            listItem.textContent = player.name;

            const inviteButton = document.createElement("button");
            inviteButton.className="invite-button";
            inviteButton.textContent = "Invite";
            inviteButton.addEventListener("click", () => showInviteModal(player));

            listItem.appendChild(inviteButton);
            playerList.appendChild(listItem);
        });
    }

    function filterPlayers(event) {
        event.preventDefault();

        const playerName = form.querySelector("#playerName").value.trim().toLowerCase();

        fetch(`/api/user/players`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch active players: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(players => {
                const filteredPlayers = players.filter(player => {
                    const lowercasePlayerName = player.name.toLowerCase();
                    const lowercaseLocation = player.location.toLowerCase();
                    const nameMatches = lowercasePlayerName.includes(playerName) || playerName === "";
                    const locationMatches = lowercaseLocation.includes(playerLocation) || playerLocation === "";
                    return nameMatches && locationMatches;
                });
                renderPlayers(filteredPlayers);
            })
            .catch(error => {
                console.error('Error:', error);
            });
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

    function createInviteNotification(invite) {
        const requestTeamId = invite.team;
        const userId = localStorage.getItem("userId");

        fetchTeamDetails(requestTeamId)
            .then(team => {
                const teamName = team.name;
                const message = `El equipo: ${teamName} te ha invitado a unirse a su equipo.`;
                const notificationTo = invite.inviteTo;
                const url = `http://localhost:8080/manejarInvitacionesJugador?id=${userId}`;

                return fetch(`/api/notifications/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        toId: notificationTo,
                        message: message,
                        redirectUrl: url,
                    }),
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to create notification: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function showInviteModal(player) {
        const modal = document.getElementById("inviteModal");
        const closeButton = document.getElementsByClassName("close")[0];
        const sendInviteButton = document.getElementById("sendInviteButton");
        const teamSelect = document.getElementById("teamInput");

        modal.style.display = "block";
        document.querySelector(".modal-content h2").textContent = `Invite ${player.name} to:`;

        closeButton.onclick = () => modal.style.display = "none";
        window.onclick = event => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };

        fetch(`/api/user/${playerId}/teams`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(teams => {
                teamSelect.innerHTML = "<option value=''>Select Team</option>";
                teams.forEach(team => {
                    const option = document.createElement("option");
                    option.value = team.id;
                    option.textContent = team.name;
                    teamSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching teams:', error));

        sendInviteButton.onclick = () => {
            const teamId = teamSelect.value;
            if (teamId) {
                fetchTeamDetails(teamId).then(team => {
                    const teamCaptain = team.captainId;
                    const isPrivate = team.isPrivate;
                    const isCaptain = playerId == teamCaptain;

                    console.log("team captain:", isCaptain);
                    console.log("is teamPrivate:", isPrivate);

                    if (isPrivate && !isCaptain) {
                        displayErrorMessage("No eres el capitan del equipo.");
                    } else {
                        displaySuccessMessage("Invitation enviada!")
                        sendInvite(player.id, teamId);
                    }
                });
            } else {
                displayErrorMessage("Por favor elegir un equipo.");
            }
        };
    }

    function sendInvite(playerId, teamId) {
        fetchTeamDetails(teamId)
            .then(team => {
                const teamCaptain = team.captainId;

                fetch("/api/requests/invite/send", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        inviteFrom: teamCaptain,
                        inviteTo: playerId,
                        teamId: team.id,
                        accepted: false,
                        denied: false,
                        sent: true,
                        name: team.name
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to send invite request: ${response.status} ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(invite => {
                        displaySuccessMessage("Invitación mandada.")
                        createInviteNotification(invite);
                    })
                    .catch(error => console.error('Error:', error));
            })
            .catch(error => console.error('Error fetching team details:', error));
    }

    form.addEventListener("submit", filterPlayers);
    getAllPlayers();
});
