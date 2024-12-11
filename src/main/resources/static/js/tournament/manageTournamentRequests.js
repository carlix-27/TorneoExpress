function loadTournamentRequests(tournamentId) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    fetchTournamentRequests(userId, tournamentId);
}

function fetchTournamentRequests(userId, tournamentId) {
    return fetch(`/api/requests/tournament/${userId}/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament requests: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(requests => {
            const requestsContainer = document.getElementById("tournament-requests");

            requestsContainer.innerHTML = '';

            requests.forEach(request => {
                const requestElement = document.createElement('div');
                const teamRequesting = request.teamName;

                requestElement.className = 'request';
                requestElement.innerHTML = `
                    <p>From: ${teamRequesting}</p>
                    <div class="button-container">
                        <button class="manage-button accept-button" data-request-id="${request.id}">Accept</button>
                        <button class="manage-button deny-button" data-request-id="${request.id}">Deny</button>
                    </div>
                `;
                requestsContainer.appendChild(requestElement);
            });

            document.querySelectorAll('.accept-button').forEach(button => {
                button.addEventListener('click', handleAccept);
            });

            document.querySelectorAll('.deny-button').forEach(button => {
                button.addEventListener('click', handleDeny);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage('Error al obtener las solicitudes del torneo.');
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
    const acceptUrl = `/api/requests/tournament/${requestId}/accept`;
    const denyUrl = `/api/requests/tournament/${requestId}/deny`;

    const url = accepted ? acceptUrl : denyUrl;

    if (accepted){
        fetchRequestDetails(requestId)
            .then(request => {
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
            loadTournamentRequests(getTournamentFromUrl());
            displaySuccessMessage(accepted ? 'Solicitud aceptada' : 'Solicitud rechazada', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage(error.message || 'Failed to update request', 'error');
        });
}



function getTournamentFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

document.addEventListener("DOMContentLoaded", function() {
    const tournamentId = getTournamentFromUrl();
    if (tournamentId) {
        loadTournamentRequests(tournamentId);
    } else {
        console.error('Tournament ID not found in URL');
    }
});

function fetchRequestDetails(requestId) {
    return fetch(`/api/requests/tournament/details/${requestId}`)
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

function sendConfirmationNotification(request) {
    const requestTournamentId = request.tournamentId;
    const teamName = request.teamName

    fetchTournamentDetails(requestTournamentId)
        .then((tournament) => {
            const tournamentName = tournament.name;
            const message = `${tournamentName} ha aceptado tu solicitud al torneo para el equipo: ${teamName}.`;
            const notificationTo = request.requestFrom;
            const url = `localhost:8080/loadTournament.html?id=${tournament.id}`;

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
        .catch(error => {
            console.error('Error sending confirmation notification:', error);
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