let signupButtonListenerAdded = false;

document.addEventListener("DOMContentLoaded", () => {
    fetchAndLoadGoogleMapsAPI()
        .then(() => {
            initializeAutocomplete('location');
        })
        .catch(error => {
            console.error("Error loading Google Maps API:", error);
            showErrorToast("Error loading location services.", "error");
        });
});

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
            tournamentList.innerHTML = '';

            tournaments.forEach(tournament => {
                const {
                    name: tournamentName,
                    sport: tournamentSport,
                    location: tournamentLocation, // coordinates string
                    private: tournamentPrivacy,
                    maxTeams,
                    participatingTeams
                } = tournament;

                const tournamentSportName = tournamentSport.sportName;
                const numOfParticipatingTeams = participatingTeams.length;

                // Split the coordinates string into latitude and longitude
                const [lat, lng] = tournamentLocation.split(',');

                // Use reverseGeocode to get the human-readable address
                reverseGeocode(lat, lng)
                    .then(locationAddress => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <a href="loadTournament.html?id=${tournament.id}"><h3>${tournamentName}</h3></a>
                            <p>Deporte: ${tournamentSportName}</p>
                            <p>Ubicación: ${locationAddress}</p>
                            <p>Privacidad: ${tournamentPrivacy ? "Privado" : "Público"}</p>
                            <p>Dificultad: ${tournament.difficulty}</p>
                            <p>Equipos Participantes: ${numOfParticipatingTeams} / ${maxTeams}</p>
                            <button class="signup-button" data-tournament-id="${tournament.id}">Inscribirse</button>
                        `;
                        tournamentList.appendChild(listItem);
                    })
                    .catch(error => {
                        console.error('Error geocoding location:', error);
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <a href="loadTournament.html?id=${tournament.id}"><h3>${tournamentName}</h3></a>
                            <p>Deporte: ${tournamentSportName}</p>
                            <p>Ubicación: No se pudo obtener la ubicación</p>
                            <p>Privacidad: ${tournamentPrivacy ? "Privado" : "Público"}</p>
                            <p>Dificultad: ${tournament.difficulty}</p>
                            <p>Equipos Participantes: ${numOfParticipatingTeams} / ${maxTeams}</p>
                            <button class="signup-button" data-tournament-id="${tournament.id}">Inscribirse</button>
                        `;
                        tournamentList.appendChild(listItem);
                    });

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

    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';

    fetchTournamentDetails(tournamentId)
        .then(tournament => {
            const tournamentSport = tournament.sport;
            displayTournamentDetails(tournament, signupButton);

            fetchUserTeams(tournamentSport, userId)
                .then(teams => {

                    populateTeamSelect(teams);
                    const userIsInTournament = tournament.participatingTeams.some(team =>
                        team.captainId == userId || team.players.some(player => player.id == userId)
                    );

                    if (userIsInTournament) {
                        permaDisplayErrorMessage("Ya estás inscrito en este torneo con otro equipo.");
                        return;
                    }

                    addSignupButtonListener(tournament, userId, signupButton);
                })
                .catch(error => {
                    console.error('Error fetching user teams:', error);
                });
        })
        .catch(error => {
            console.error("Error fetching tournament details:", error);
        });

    displayModal(modal, closeButton);
}

function populateTeamSelect(teams) {
    const teamSelect = document.getElementById('teamSelect');

    teamSelect.innerHTML = '';

    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });
}

function addSignupButtonListener(tournament, userId, signupButton) {
    if (signupButtonListenerAdded) {
        signupButton.removeEventListener("click", signupButtonClickHandler);
    }

    signupButtonClickHandler = function () {
        const maxTeams = tournament.maxTeams;
        const tournamentParticipatingTeams = tournament.participatingTeams;
        const numOfParticipatingTeams = tournamentParticipatingTeams.length;
        const teamId = document.getElementById("teamSelect").value;

        const isTeamInTournament = tournamentParticipatingTeams.some(team => teamId == team.id);

        if (isTeamInTournament) {
            displayErrorMessage("Este equipo ya está en el torneo.");
            return;
        }

        if (numOfParticipatingTeams < maxTeams) {
            const { private: tournamentIsPrivate, creatorId} = tournament;

            if (tournamentIsPrivate && creatorId != userId) {
                sendTournamentRequest(tournament, teamId, userId);
            } else {
                joinPublicTournament(tournament, teamId);
            }
        } else {
            displayErrorMessage("Error al inscribirse: Número máximo de equipos alcanzado.");
        }
    };

    signupButton.addEventListener("click", signupButtonClickHandler);
    signupButtonListenerAdded = true;
}

function joinPublicTournament(tournament, teamId) {
    const tournamentId = tournament.id;
    fetch(`/api/tournaments/add/${tournamentId}/${teamId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to join tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            setTimeout(() => location.reload());
            console.log("Successfully joined tournament:", data);
            displaySuccessMessage("Éxito al anotarse a torneo!");
        })
        .catch(error => {
            console.error('Error joining tournament:', error);
            displayErrorMessage("Error al unirse a torneo");
        });
}

function fetchUserTeams(tournamentSport, userId) {
    return fetch(`/api/teams/captain/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al conseguir equipos del jugador: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(teams => {

            console.log('Tournament Sport:', tournamentSport.sportId);
            console.log('Fetched Teams:', teams);

            const filteredTeams = teams.filter(team => {
                const teamSport = team.sport
                console.log('Team Sport:', teamSport);
                return team.sport.sportId === tournamentSport.sportId;
            });

            console.log('Filtered Teams:', filteredTeams);
            return filteredTeams;
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage("Error al conseguir equipos del jugador");
            return [];
        });
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
    const {location: tournamentLocation, private: privateTournament, maxTeams, participatingTeams} = tournament;
    const numOfParticipatingTeams = participatingTeams.length;

    tournamentDetails.innerHTML = `
        <h3>${tournamentName}</h3>
        <p>Deporte: ${tournamentSportName}</p>
        <p>Ubicación: ${tournamentLocation}</p>
        <p>Privacidad: ${privateTournament ? "Privado" : "Público"}</p>
        <p>Dificultad: ${tournament.difficulty}</p>
        <p>Equipos Participantes: ${numOfParticipatingTeams} / ${maxTeams}</p>
    `;

    if (privateTournament) {
        signupButton.textContent = "Mandar Solicitud";
        signupButton.setAttribute("data-privacy", "private");
    } else {
        signupButton.textContent = "Anotarse";
        signupButton.setAttribute("data-privacy", "public");
    }
}

function sendTournamentRequest(tournament, teamId, userId) {
    fetchTeamDetails(teamId)
        .then(teamDetails => {

            const teamName = teamDetails.name;
            const tournamentId = tournament.id;
            const tournamentCreator = tournament.creatorId;
            const userFrom = userId;

            fetchPlayerDetails(userFrom)
                .then(playerDetails => {

                    const senderName = playerDetails.name;

                    return fetch(`/api/requests/tournament/send`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            requestFrom: userFrom,
                            requestTo: tournamentCreator,
                            teamId: teamId,
                            tournamentId: tournamentId,
                            teamName: teamName,
                            accepted: false,
                            denied: false,
                            sent: true,
                            name: senderName
                        })
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error sending request")
                    }
                    return response.json();
                })
                .then(tournamentRequest => {
                    displaySuccessMessage("Solicitud mandada");
                    createRequestNotification(tournamentRequest);
                })
                .catch(error => {
                  displayErrorMessage("Ya tiene una solicitud pendiente.");
                });
        })
        .catch(error => console.error('Error fetching team details:', error));
}

function createRequestNotification(tournamentRequest) {
    const requestTournamentId = tournamentRequest.tournamentId;
    const requestTeamId = tournamentRequest.teamId;

    Promise.all([fetchTournamentDetails(requestTournamentId), fetchTeamDetails(requestTeamId)])
        .then(([tournament, team]) => {
            const tournamentName = tournament.name;
            const teamName = team.name;
            const message = `${teamName} ha solicitado unirse al siguiente torneo: ${tournamentName}.`;
            const url = `http://localhost:8080/manejarSolicitudesTorneo.html?id=${tournament.id}`;

            const notificationTo = tournamentRequest.requestTo;

            return fetch(`/api/notifications/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    toId: notificationTo,
                    message: message,
                    redirectUrl: url,
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

const displayModal = (modal, closeButton) => {
    modal.style.display = "block";

    closeButton.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
};

function fetchPlayerDetails(playerId) {
    return fetch(`/api/user/players/${playerId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch player details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        });
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


function permaDisplayErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}


document.addEventListener("DOMContentLoaded", function() {
    fetchActiveTournaments();
});
