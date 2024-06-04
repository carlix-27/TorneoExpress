loadTeams()

function showSignupModal(teamId) {
    const modal = document.getElementById("signupModal");
    const closeButton = modal.querySelector(".close");
    const signupButton = modal.querySelector("#sendInviteButton");
    const userId = localStorage.getItem("userId");

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
                                inviterId: userId, // Assuming userId is the ID of the inviter
                                inviteeId: team.captain_id, // Assuming captainId is the ID of the captain
                                teamId: teamId // Assuming teamId is the ID of the team
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

document.addEventListener("DOMContentLoaded", loadTeams);
