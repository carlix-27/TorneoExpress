function loadTeams() {
    fetch(`/api/teams/all`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(teams => {
            const listaEquipos = document.getElementById("lista-todos-equipos");

            listaEquipos.innerHTML = '';

            teams.forEach(team => {

                const {
                    location: teamLocation,
                    sport: teamSport,
                    name,
                    private: isPrivate,
                    players,
                }
                = team

                const sport = teamSport.sportName
                const playersInTeam = players.length
                const maxPlayers = teamSport.num_players * 2

                const li = document.createElement("li");
                li.innerHTML = `
                    <div>
                        <a href="loadTeam.html?id=${team.id}"><h3>${name}</h3></a>
                        <p>Ubicación: ${teamLocation}</p>
                        <p>Deporte: ${sport}</p>
                        <p>Privacidad: ${isPrivate ? "Privado" : "Público"}</p>
                        <p>Jugadores anotados: ${playersInTeam} / ${maxPlayers}</p>
                        <button class="signup-button" data-team-id="${team.id}">Inscribirse</button>
                    </div>
                `;
                listaEquipos.appendChild(li);
            });

            // Attach event listeners to the signup buttons
            document.querySelectorAll('.signup-button').forEach(button => {
                button.addEventListener('click', function () {
                    showSignupModal(this.getAttribute('data-team-id'));
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

function showSignupModal(teamId) {
    const modal = document.getElementById("signupModal");
    const closeButton = modal.querySelector(".close");
    const signupButton = modal.querySelector("#sendInviteButton");
    const userId = localStorage.getItem("userId");

    fetchTeamDetails(teamId)
        .then(team => {
            displayTeamDetails(team, signupButton);
            addSignupButtonListener(team, userId, signupButton);
        })
        .catch(error => {
            console.error("Error:", error);
        });

    displayModal(modal, closeButton);
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

function displayTeamDetails(team, signupButton) {
    const teamDetails = document.getElementById("teamDetails");

    const {
        location: teamLocation,
        sport: teamSport,
        name,
        private: isPrivate,
        players,
    }
        = team

    const sportName = teamSport.name
    const playersInTeam = players.length
    const maxPlayers = teamSport.num_players * 2


    teamDetails.innerHTML = `
        <h3>${name}</h3>
        <p>Ubicación: ${teamLocation}</p>
        <p>Deporte: ${sportName}</p>
        <p>Privacidad: ${isPrivate ? "Privado" : "Público"}</p>
        <p>Jugadores inscritos: ${playersInTeam} / ${maxPlayers}</p>
    `;

    if (isPrivate) {
        signupButton.textContent = "Mandar solicitud";
        signupButton.setAttribute("data-privacy", "private");
    } else {
        signupButton.textContent = "Anotarse";
        signupButton.setAttribute("data-privacy", "public");
    }
}

function addSignupButtonListener(team, userId, signupButton) {
    signupButton.addEventListener("click", function() {

        const {
            sport: teamSport,
            private: isPrivate,
            players,
        }
        = team

        const playersInTeam = players.length
        const maxPlayers = teamSport.num_players * 2

        if (playersInTeam < maxPlayers) {
            if (isPrivate) {
                sendTeamRequest(team, userId);
            }
            else {
                joinPublicTeam(team, userId);
            }
        } else {
            displaySuccessMessage("Maximum number of players reached.");
        }
    });
}


function joinPublicTeam(team, userId) {
    fetch(`/api/teams/add/${team.id}/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId
        })
    })
        .then(response => {
            if (!response.ok) {
                const statusError = response.statusText
                throw new Error(`Error al unirse a equipo: ${statusError}`);
            }
            fetchPlayerDetails(userId).then(playerDetails => {
                const teamRequest ={
                    requestFrom: userId,
                    requestTo: team.captainId,
                    teamId: team.id,
                    accepted: false,
                    denied: false,
                    sent: true,
                    name: playerDetails.name
                }

                displaySuccessMessage("Te has unido al equipo exitosamente!");
                createTeamNotification(teamRequest)
            })
            return response.json();
        })
        .catch(error => {
            displayErrorMessage(error.message);
        });
}


function sendTeamRequest(team, userId) {
    fetchPlayerDetails(userId)
        .then(playerDetails => {
            const playerName = playerDetails.name;
            const teamCaptain = team.captainId;
            const teamId = team.id;

            fetch(`/api/requests/team/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requestFrom: userId,
                    requestTo: teamCaptain,
                    teamId: teamId,
                    accepted: false,
                    denied: false,
                    sent: true,
                    name: playerName
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to send team request: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(teamRequest => {
                    displaySuccessMessage("Solicitud mandada con éxito")
                    createTeamNotification(teamRequest);
                })
                .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error fetching player details:', error));
}


function createTeamNotification(teamRequest) {
    const requestTeamId = teamRequest.teamId;
    const requestFromId = teamRequest.requestFrom;

    Promise.all([fetchTeamDetails(requestTeamId), fetchPlayerDetails(requestFromId)])
        .then(([team, player]) => {
            const playerName = player.name;
            const teamName = team.name;

            const isTeamPrivate = team.isPrivate

            let message

            if (isTeamPrivate){
                message = `${playerName} ha solicitado unirse al siguiente equipo: ${teamName}.`;
            }
            else {
                message = `${playerName} se ha unido a tu equipo: ${teamName}`;
            }

            const notificationTo = teamRequest.requestTo;

            return fetch(`/api/notifications/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    toId: notificationTo,
                    message: message,
                })

            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to create notification: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => console.error('Error:', error));
}

function displayModal(modal, closeButton) {
    modal.style.display = "block";

    closeButton.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

function fetchPlayerDetails(playerId) {
    return fetch(`/api/user/players/${playerId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch player details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        });
}

const displaySuccessMessage = message => {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";

    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000);
};

function displayErrorMessage(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";

    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
}

document.addEventListener("DOMContentLoaded", loadTeams);
