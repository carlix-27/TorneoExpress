function loadTeamRequests(teamId) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    fetchTeamRequests(userId, teamId)
}

function fetchTeamRequests(userId, teamId) {
    return fetch(`/api/requests/team/${userId}/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch team requests: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(requests => {
            const requestsContainer = document.getElementById("team-requests");
            requestsContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar

            const list = document.createElement('ul');

            requests.forEach(request => {
                const listItem = document.createElement('li');

                const playerRequesting = request.name;

                listItem.innerHTML = `
                    <p>From: ${playerRequesting}</p>
                    <div class="button-container">
                        <button class="manage-button accept-button" data-request-id="${request.id}">Accept</button>
                        <button class="manage-button deny-button" data-request-id="${request.id}">Deny</button>
                    </div>
                `;
                list.appendChild(listItem);
            });

            requestsContainer.appendChild(list);

            // Agregar listeners a los botones de aceptar y denegar
            list.querySelectorAll('.accept-button').forEach(button => {
                button.addEventListener('click', handleAccept);
            });

            list.querySelectorAll('.deny-button').forEach(button => {
                button.addEventListener('click', handleDeny);
            });
        })
        .catch(error => {
            console.error('Error fetching team requests:', error);
            // Manejar el error si es necesario
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
    const acceptUrl = `/api/requests/team/${requestId}/accept`;
    const denyUrl = `/api/requests/team/${requestId}/deny`;

    const url = accepted ? acceptUrl : denyUrl;

    if (accepted){
        fetchRequestDetails(requestId)
            .then(request => {
                console.log(request)
                sendConfirmationNotification(request);
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
                if (response.status === 500){
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
            loadTeamRequests(getTeamIdFromUrl());
            displaySuccessMessage(accepted ? 'Solicitud aceptada' : 'Solicitud rechazada', 'success');
        })
        .catch(error => {
            console.log(error.message)
            displayErrorMessage(error.message);
        });
}

function sendConfirmationNotification(request) {
    const requestTeamId = request.teamId;

    fetchTeamDetails(requestTeamId)
        .then((team) => {
            const teamName = team.name;
            const message = `${teamName} ha aceptado tu solicitud al equipo.`;
            const notificationTo = request.requestFrom;
            const url = `http://localhost:8080/loadTeam.html?id=${team.id}`;

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
            console.error('Error sending confirmation notification:', error);
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


function fetchRequestDetails(requestId) {
    return fetch(`/api/requests/team/details/${requestId}`)
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


function getTeamIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

document.addEventListener("DOMContentLoaded", function() {
    const teamId = getTeamIdFromUrl();
    if (teamId) {
        loadTeamRequests(teamId);
    } else {
        console.error('Team ID not found in URL');
    }
});
