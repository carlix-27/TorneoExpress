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

                const teamDetailsPromises = invites.map(request => {

                    const teamId = request.team;

                    return fetchTeamDetails(teamId).then(team => ({ request, team }));
                });

                Promise.all(teamDetailsPromises).then(results => {
                    results.forEach(({ request, team }) => {
                        const requestElement = document.createElement('div');
                        const teamName = team.name;

                        requestElement.className = 'request';
                        requestElement.innerHTML = `
                            <p>From: ${teamName}</p>
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

        fetch(url, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to update request: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(() => {
                loadTeamInvites();
            })
            .catch(error => console.error('Error:', error));
    }
});
