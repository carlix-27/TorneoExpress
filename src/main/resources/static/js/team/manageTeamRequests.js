document.addEventListener("DOMContentLoaded", loadTeamRequests);

function loadTeamRequests() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    fetch(`/api/requests/team/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch team requests: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(requests => {
            const requestsContainer = document.getElementById("team-requests");
            requestsContainer.innerHTML = ''; // Clear any existing requests

            requests.forEach(request => {
                const requestElement = document.createElement('div');
                requestElement.className = 'request';
                requestElement.innerHTML = `
                    <p>Team: ${request.teamName}</p>
                    <p>From: ${request.requestFromName}</p>
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
        .catch(error => console.error('Error:', error));
}

function handleAccept(event) {
    const requestId = event.target.getAttribute('data-request-id');
    updateRequestStatus(requestId, true, false);
}

function handleDeny(event) {
    const requestId = event.target.getAttribute('data-request-id');
    updateRequestStatus(requestId, false, true);
}

function updateRequestStatus(requestId, accepted, denied) {
    fetch(`/api/requests/team/${requestId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accepted, denied })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to update request: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            loadTeamRequests(); // Reload the requests after update
        })
        .catch(error => console.error('Error:', error));
}
