document.addEventListener("DOMContentLoaded", function () {
    loadTeamInvites();

    function loadTeamInvites() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.error("User ID not found in localStorage");
            return;
        }
        fetchTeamInvites(userId);
    }

    function fetchTeamInvites(userId) {
        return fetch(`/api/requests/invite/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch team invites: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(invites => {
                const requestsContainer = document.getElementById("team-invites");
                requestsContainer.innerHTML = '';

                const list = document.createElement('ul');

                const teamDetailsPromises = invites.map(request => {
                    const teamId = request.team;
                    return fetchTeamDetails(teamId).then(team => ({ request, team }));
                });

                return Promise.all(teamDetailsPromises).then(results => {
                    results.forEach(({ request, team }) => {
                        const requestElement = document.createElement('li');
                        const teamName = team.name;

                        requestElement.innerHTML = `
                        <p>From: ${teamName}</p>
                        <div class="button-container">
                            <button class="manage-button accept-button" data-request-id="${request.id}">Accept</button>
                            <button class="manage-button deny-button" data-request-id="${request.id}">Deny</button>
                        </div>
                    `;
                        list.appendChild(requestElement);
                    });

                    requestsContainer.appendChild(list);

                    document.querySelectorAll('.accept-button').forEach(button => {
                        button.addEventListener('click', handleAccept);
                    });

                    document.querySelectorAll('.deny-button').forEach(button => {
                        button.addEventListener('click', handleDeny);
                    });
                }).catch(error => console.error('Error fetching team details:', error));
            })
            .catch(error => console.error('Error:', error));
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

    function handleAccept(event) {
        const requestId = event.target.getAttribute('data-request-id');
        updateRequestStatus(requestId, true);
    }

    function handleDeny(event) {
        const requestId = event.target.getAttribute('data-request-id');
        updateRequestStatus(requestId, false);
    }

    function updateRequestStatus(requestId, accepted) {
        const acceptUrl = `/api/requests/invite/accept/${requestId}`;
        const denyUrl = `/api/requests/invite/deny/${requestId}`;
        const url = accepted ? acceptUrl : denyUrl;

        if (accepted){
            console.log(accepted)
            fetchRequestDetails(requestId)
                .then(invite => {
                    console.log(invite)
                    sendConfirmationNotification(invite);
                })
                .catch(error => {
                    console.error('Error fetching request details:', error);
                });
        }

        fetch(url, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 500) {
                        return response.text().then(errorMessage => {
                            throw new Error(errorMessage);
                        });
                    } else {
                        return response.json().then(error => {
                            throw new Error(error.message || 'Failed to update request');
                        });
                    }
                }
                return response.json();
            })
            .then(() => {
                loadTeamInvites();
                displaySuccessMessage(accepted ? 'Invitación a equipo aceptada' : 'Invitación a equipo rechazada', 'success');
            })
            .catch(error => {
                console.log(error.message);
                displayErrorMessage(error.message);
            });
    }

    function fetchRequestDetails(requestId) {
        return fetch(`/api/requests/invite/details/${requestId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch request details: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error fetching request details:', error);
                throw error; // Re-throw the error to handle it further if needed
            });
    }

    function sendConfirmationNotification(invite) {
        console.log(invite)
        const requestTeamId = invite.team;
        const user = invite.inviteTo

        Promise.all([fetchTeamDetails(requestTeamId), fetchPlayerDetails(user)])
            .then(([team, player]) => {

                const teamName = team.name;
                const playerName = player.name

                const message = `${playerName} ha aceptado tu invitacion al equipo ${teamName}.`;
                const notificationFrom = invite.inviteFrom;

                return fetch(`/api/notifications/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        toId: notificationFrom,
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
            .catch(error => {
                console.error('Error sending confirmation notification:', error);
            });
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

    function displaySuccessMessage(message) {
        const successMessage = document.getElementById("successMessage");
        successMessage.textContent = message;
        successMessage.style.display = "block";
    }

    function displayErrorMessage(message) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = message;
        errorMessage.style.display = "block";

        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }
});
