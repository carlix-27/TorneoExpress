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

                const li = document.createElement("li");
                li.innerHTML = `
                    <div>
                        <a href="loadTeam.html?id=${team.id}"><h3>${team.name}</h3></a>
                        <p>Ubicación: ${team.location}</p>
                        <p>Deporte: ${team.sport.sportName}</p>
                        <p>Privacidad: ${team.isPrivate ? "Privado" : "Público"}</p>
                        <p>Jugadores inscritos: ${team.players.length} / ${team.sport.num_players * 2}</p>
                        <button class="signup-button" data-team-id="${team.id}">Signup</button>
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

export function showSignupModal(teamId) {
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
            // Handle error, show message to user
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
    teamDetails.innerHTML = `
    <h3>${team.name}</h3>
    <p>Ubicación: ${team.location}</p>
    <p>Deporte: ${team.sport.sportName}</p>
    <p>Privacidad: ${team.private ? "Privado" : "Público"}</p>
    <p>Jugadores inscritos: ${team.players.length} / ${team.sport.num_players * 2}</p>
  `;

    if (team.private) {
        signupButton.textContent = "Send Request";
        signupButton.setAttribute("data-privacy", "private");
    } else {
        signupButton.textContent = "Sign Up";
        signupButton.setAttribute("data-privacy", "public");
    }
}

function addSignupButtonListener(team, userId, signupButton) {
    signupButton.addEventListener("click", function() {
        if (team.players.length < team.sport.num_players * 2) {
            if (!team.players.includes(userId)) {
                sendInvite(team, userId);
            } else {
                console.log("Player is already part of the team.");
            }
        } else {
            console.log("Maximum number of players reached.");
        }
    });
}

function sendInvite(team, userId) {
    fetch(`/api/invites/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            teamId: team.id,
            userId: userId
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to send invite: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(invite => {
            console.log("Invite created successfully.", invite);
            displaySuccessMessage("Invite sent successfully! An invite has been sent to the team captain.");

            // Optionally create a notification for the team captain
            createNotification(team, userId);
        })
        .catch(error => {
            console.error("Error sending invite:", error);
            // Handle error sending invite
        });
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

function createNotification(team, userId) {
    fetch(`/api/notifications/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fromId: userId,
            toId: team.captain_id,
            message: `You have received an invite to join the team ${team.name}.`
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to create notification: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(notification => {
            console.log("Notification created successfully.");
            displaySuccessMessage("Signup successful! An invite has been sent to the team captain.");
        })
        .catch(error => {
            console.error("Error creating notification:", error);
            // Handle error creating notification
        });
}


function displaySuccessMessage(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";
}

document.addEventListener("DOMContentLoaded", loadTeams);
