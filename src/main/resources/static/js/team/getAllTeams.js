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

            listaEquipos.innerHTML = ''; // Clear the list before loading teams

            teams.forEach(team => {
                const listItem = document.createElement("li");

                listItem.innerHTML = `
                        <h3>${team.name}</h3>
                        <p>Ubicación: ${team.location}</p>
                        <p>Deporte: ${team.sport.sportName}</p>
                        <p>Privacidad: ${team.private ? "Privado" : "Público"}</p>
                        <p>Jugadores inscritos: ${team.players.length} / ${team.sport.num_players * 2}</p>
                        <button class="signup-button" data-team-id="${team.id}">Signup</button>
                `;

                listaEquipos.appendChild(listItem);
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

    // Fetch team details and populate the modal
    fetch(`/api/teams/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch team details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(team => {
            const teamDetails = document.getElementById("teamDetails");
            teamDetails.innerHTML = `
                <h3>${team.name}</h3>
                <p>Ubicación: ${team.location}</p>
                <p>Deporte: ${team.sport.sportName}</p>
                <p>Privacidad: ${team.private ? "Privado" : "Público"}</p>
                <p>Jugadores inscritos: ${team.players.length} / ${team.sport.num_players * 2}</p>
            `;

            // Update the button text based on privacy
            if (team.private) {
                signupButton.textContent = "Send Request";
                signupButton.setAttribute("data-privacy", "private");
            } else {
                signupButton.textContent = "Sign Up";
                signupButton.setAttribute("data-privacy", "public");
            }

            // Add click event listener to the signup button
            signupButton.addEventListener("click", function() {
                // Check if the number of players is below the max amount
                if (team.players.length < team.sport.num_players * 2) {
                    // Check if the player is not already part of the team
                    if (!team.players.includes(userId)) { // You need to replace `playerId` with the actual ID of the player
                        // Send invite to the team captain
                        fetch(`/api/invites/send`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                inviter: {
                                    id: userId // You need to replace `userId` with the actual ID of the inviter
                                },
                                invitee: {
                                    id: team.captain_id // You need to replace `captainId` with the actual ID of the captain
                                },
                                team: {
                                    id: teamId // You need to replace `teamId` with the actual ID of the team
                                },
                                createdAt: {

                                }
                            })
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Failed to send invite: ${response.status} ${response.statusText}`);
                                }
                                return response.json();
                            })
                            .then(invite => {
                                console.log("Invite sent successfully.");
                                // Create notification for the captain
                                fetch(`/api/notifications/create`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        recipientId: team.captain_id,
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
                                        // Display success message
                                        const successMessage = document.getElementById("successMessage");
                                        successMessage.textContent = "Signup successful! An invite has been sent to the team captain.";
                                        successMessage.style.display = "block";
                                    })
                                    .catch(error => {
                                        console.error("Error creating notification:", error);
                                        // Handle error creating notification
                                    });
                            })
                            .catch(error => {
                                console.error("Error sending invite:", error);
                                // Handle error sending invite
                            });
                    } else {
                        console.log("Player is already part of the team.");
                        // Handle case where player is already part of the team
                    }
                } else {
                    console.log("Maximum number of players reached.");
                    // Handle case where maximum number of players is reached
                }
            });
        })
        .catch(error => {
            console.error("Error:", error);
            // Handle error, show message to user
        });

    // Display the modal
    modal.style.display = "block";

    // Close modal when the close button is clicked
    closeButton.onclick = function () {
        modal.style.display = "none";
    };

    // Close modal when user clicks outside the modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

// Load the teams when the page loads
document.addEventListener("DOMContentLoaded", loadTeams);
