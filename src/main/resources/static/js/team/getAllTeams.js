document.addEventListener("DOMContentLoaded", () => {
    fetchAndLoadGoogleMapsAPI()
        .then(() => {
        })
        .catch(error => {
            console.error("Error loading Google Maps API:", error);
            showErrorToast("Error loading location services.", "error");
        });
    loadTeams()
});

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
                    isPrivate: isPrivate,
                    players,
                } = team;

                const sport = teamSport.sportName;
                const playersInTeam = players.length;
                const isInTeam = isUserInTeam(players, userId);
                const maxPlayers = teamSport.num_players * 2;

        const li = document.createElement("li");
        li.innerHTML = `
                    <div>
                        <a href="loadTeam.html?id=${team.id}"><h3>${name}</h3></a>
                        <p>Ubicación: <span id="location-${team.id}">Cargando...</span></p>
                        <p>Deporte: ${sport}</p>
                        <p>Privacidad: ${isPrivate ? "Privado" : "Público"}</p>
                        <p>Jugadores anotados: ${playersInTeam} / ${maxPlayers}</p>
                        ${!isInTeam ? `<button class="signup-button" data-team-id="${team.id}">Inscribirse</button>` : ''}
                    </div>
                `;
                listaEquipos.appendChild(li);

                const [lat, lng] = teamLocation.split(',');


                reverseGeocode(lat, lng).then(address => {
                    const locationElement = document.getElementById(`location-${team.id}`);
                    locationElement.textContent = address;
                }).catch(error => {
                    console.error('Error fetching location address:', error);
                    const locationElement = document.getElementById(`location-${team.id}`);
                    locationElement.textContent = 'Dirección no disponible';
                });
            });

            document.querySelectorAll('.signup-button').forEach(button => {
                button.addEventListener('click', function () {
                    showSignupModal(this.getAttribute('data-team-id'));
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
      });
    })
    .catch(error => {
      console.error('Error:', error);
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

    const teamSport = team.sport;
    const teamPlayers = team.players;
    const sportName = teamSport.sportName;
    const teamLocation = team.location;
    const playersInTeam = teamPlayers.length;
    const maxPlayers = teamSport.num_players * 2;
    const isTeamPrivate = team.isPrivate;

    teamDetails.innerHTML = `
        <h3>${team.name}</h3>
        <p>Ubicación: ${teamLocation}</p>
        <p>Deporte: ${sportName}</p>
        <p>Privacidad: ${isTeamPrivate ? "Privado" : "Público"}</p>
        <p>Jugadores inscritos: ${playersInTeam} / ${maxPlayers}</p>
    `;

    if (isTeamPrivate) {
        signupButton.textContent = "Mandar solicitud";
        signupButton.setAttribute("data-privacy", "private");
    } else {
        signupButton.textContent = "Anotarse";
        signupButton.setAttribute("data-privacy", "public");
    }
}

function addSignupButtonListener(team, userId, signupButton) {
    signupButton.addEventListener("click", function() {

        const isTeamPrivate = team.isPrivate;
        const playersInTeam = team.players.length;
        const teamSport = team.sport;
        const teamPlayers = team.players;

        const maxPlayers = teamSport.num_players * 2;

        const isPlayerInTeam = teamPlayers.some(player => {
            console.log("Comparing player ID:", player.id, "with user ID:", userId);
            return player.id == userId;
        });

        if (isPlayerInTeam) {
            displayErrorMessage("Ya eres parte de este equipo.");
            return;
        }

        if (playersInTeam < maxPlayers) {
            if (isTeamPrivate) {
                sendTeamRequest(team, userId);
            } else {
                joinPublicTeam(team, userId);
            }
        } else {
            displayErrorMessage("Numero máximo de jugadores permitidos");
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
                const statusError = response.statusText;
                throw new Error(`Error al unirse a equipo: ${statusError}`);
            }
            fetchPlayerDetails(userId).then(playerDetails => {

                const teamRequest = {
                    requestFrom: userId,
                    requestTo: team.captainId,
                    teamId: team.id,
                    accepted: false,
                    denied: false,
                    sent: true,
                    name: playerDetails.name
                };

                setTimeout(() => location.reload());
                displaySuccessMessage("Te has unido al equipo exitosamente!");
                createTeamNotification(teamRequest);
            });
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
                    displaySuccessMessage("Solicitud mandada con éxito");
                    createTeamNotification(teamRequest);
                })
                .catch(error => {
                    displayErrorMessage("Ya tiene una solicitud pendiente.");
                    console.error('Error:', error);
                });
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
            let url = "";

            const isTeamPrivate = team.isPrivate;

            let message;

            if (isTeamPrivate) {
                message = `${playerName} ha solicitado unirse al siguiente equipo: ${teamName}.`;
                url = `http://localhost:8080/manejarSolicitudesEquipo.html?id=${team.id}`;
            } else {
                message = `${playerName} se ha unido a tu equipo: ${teamName}`;
                url = `http://localhost:8080/visualizarJugadoresEquipo?id=${team.id}`;
            }

            const notificationTo = teamRequest.requestTo;

            return fetch(`/api/notifications/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    notificationTo: notificationTo,
                    message: message,
                    url: url
                })
            });
        })
        .catch(error => console.log(error));
}

function fetchPlayerDetails(playerId) {
    return fetch(`/api/players/${playerId}`)
        .then(response => response.json());
}

function displayModal(modal, closeButton) {
    modal.style.display = "block";
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

function isUserInTeam(players, userId) {
  return players.some(player => player.id == userId);
}

document.addEventListener("DOMContentLoaded", loadTeams);

