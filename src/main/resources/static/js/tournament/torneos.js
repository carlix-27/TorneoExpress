// Fetch active tournaments and display them with a join button
function fetchActiveTournaments() {
    fetch('/api/tournaments/active')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch active tournaments: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournaments => {
            const tournamentList = document.getElementById('tournament-list');

            // Clear existing list
            tournamentList.innerHTML = '';

            tournaments.forEach(tournament => {
                const tournamentName = tournament.name;
                const tournamentSport = tournament.sport;
                const tournamentSportName = tournamentSport.sportName;
                const tournamentLocation = tournament.location;
                const tournamentPrivacy = tournament.private;
                const maxTeams = tournament.maxTeams;
                const participatingTeams = tournament.participatingTeams;
                const numOfParticipatingTeams = participatingTeams.length;

                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h3>${tournamentName}</h3>
                    <p>Deporte: ${tournamentSportName}</p>
                    <p>Ubicación: ${tournamentLocation}</p>
                    <p>Privacidad: ${tournamentPrivacy ? "Privado" : "Público"}</p>
                    <p>Dificultad: ${tournament.difficulty}</p>
                    <p>Equipos Participantes: ${numOfParticipatingTeams} / ${maxTeams}</p>
                   <button class="signup-button" data-tournament-id="${tournament.id}">Inscribirse</button>
                `;
                tournamentList.appendChild(listItem);
            });


            document.querySelectorAll('.signup-button').forEach(button => {
                button.addEventListener('click', function () {
                    showSignupModal(this.getAttribute('data-tournament-id'));
                });
            });

        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = 'Error al obtener los torneos activos.';
            document.getElementById('error-message').style.display = 'block';
        });
}


function showSignupModal(tournamentId) {
    const modal = document.getElementById("signupModal");
    const closeButton = modal.querySelector(".close");
    const signupButton = modal.querySelector("#sendInviteButton");
    const userId = localStorage.getItem("userId");

    fetchTournamentDetails(tournamentId)
        .then(tournament => {
            displayTournamentDetails(tournament, signupButton);
            addSignupButtonListener(tournament, userId, signupButton);
        })
        .catch(error => {
            console.error("Error:", error);
        });

    displayModal(modal, closeButton);
}

function fetchTournamentDetails(tournamentId) {
    return fetch(`/api/tournaments/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch team details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        });
}

function displayTournamentDetails(tournament, signupButton) {
    const tournamentDetails = document.getElementById("tournamentDetails");

    const tournamentName = tournament.name;
    const tournamentSport = tournament.sport;
    const tournamentSportName = tournamentSport.sportName;
    const tournamentLocation = tournament.location;
    const tournamentPrivacy = tournament.private;
    const maxTeams = tournament.maxTeams;
    const participatingTeams = tournament.participatingTeams;
    const numOfParticipatingTeams = participatingTeams.length;


    tournamentDetails.innerHTML = `
        <h3>${tournamentName}</h3>
        <p>Deporte: ${tournamentSportName}</p>
        <p>Ubicación: ${tournamentLocation}</p>
        <p>Privacidad: ${tournamentPrivacy ? "Privado" : "Público"}</p>
        <p>Dificultad: ${tournament.difficulty}</p>
        <p>Equipos Participantes: ${numOfParticipatingTeams} / ${maxTeams}</p>
    `;

    if (tournament.private) {
        signupButton.textContent = "Send Request";
        signupButton.setAttribute("data-privacy", "private");
    } else {
        signupButton.textContent = "Sign Up";
        signupButton.setAttribute("data-privacy", "public");
    }
}


function addSignupButtonListener(tournament, teamId, userId, signupButton) {
    signupButton.addEventListener("click", function() {
        const participatingTeams = tournament.participatingTeams;
        const maxTeams = tournament.maxTeams;
        const numOfParticipatingTeams = participatingTeams.length;

        if (numOfParticipatingTeams < maxTeams) {
            const tournamentIsPrivate = tournament.private;

            if (tournamentIsPrivate) {
                sendTournamentRequest(tournament, teamId, userId);
            } else {
                joinPublicTournament(tournament, teamId, userId);
            }
        } else {
            displayErrorMessage("The maximum number of participating teams has been reached.");
        }
    });
}



function sendTournamentRequest(tournament, teamId, userId) {
    fetchTeamDetails(teamId)
        .then(teamDetails => {
            const teamCaptain = teamDetails.captainId;

            fetch(`/api/requests/tournament/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requestFrom: userId,
                    requestTo: teamCaptain,
                    tournamentId: tournament.id,
                    accepted: false,
                    denied: false,
                    sent: true
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to send tournament request: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(tournamentRequest => {
                    createRequestNotification(tournamentRequest);
                })
                .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error fetching team details:', error));
}



function createRequestNotification(tournamentRequest) {
    const requestTournamentId = tournamentRequest.tournamentId;
    const requestTeamId = tournamentRequest.teamId;

    Promise.all([fetchTournamentDetails(requestTournamentId), fetchTeamDetails(requestTeamId)])
        .then(([team, player]) => {
            const playerName = player.name;
            const teamName = team.name;
            const message = `${playerName} ha solicitado unirse al siguiente equipo: ${teamName}.`;

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
        .then(notification => {
            displaySuccessMessage('Request sent successfully.');
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



function fetchTeamDetails(teamId) {
    return fetch(`/api/teams/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch player details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        });
}


function displaySuccessMessage(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";

    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000);
}

function displayErrorMessage(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";

    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
}


document.addEventListener("DOMContentLoaded", fetchActiveTournaments);