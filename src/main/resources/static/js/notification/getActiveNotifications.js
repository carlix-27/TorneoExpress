document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");
    getActiveNotifications(userId);
});

function getActiveNotifications(userId) {
    fetch(`/api/notifications/active/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(notifications => {
            const notificationsContainer = document.getElementById('notifications');
            notificationsContainer.innerHTML = ''; // Clear any existing notifications
            notifications.forEach(notification => {
                const notificationElement = document.createElement('div');
                notificationElement.className = 'notification';
                notificationElement.innerHTML = `
                    <p>${notification.message}</p>
                `;
                notificationsContainer.appendChild(notificationElement);
            });

            // Attach event listeners to the accept and deny buttons
            document.querySelectorAll('.accept-button').forEach(button => {
                button.addEventListener('click', function() {
                    handleAcceptInvite(this.getAttribute('data-invite-id'));
                });
            });
            document.querySelectorAll('.deny-button').forEach(button => {
                button.addEventListener('click', function() {
                    handleDenyInvite(this.getAttribute('data-invite-id'));
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

function handleAcceptInvite(inviteId) {
    fetch(`/api/invites/accept/${inviteId}`, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to accept invite: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Invite accepted successfully:', data);
            // Refresh the notifications list
            const userId = localStorage.getItem("userId");
            getActiveNotifications(userId);
        })
        .catch(error => console.error('Error:', error));
}

function handleDenyInvite(inviteId) {
    fetch(`/api/invites/deny/${inviteId}`, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to deny invite: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Invite denied successfully:', data);
            // Refresh the notifications list
            const userId = localStorage.getItem("userId");
            getActiveNotifications(userId);
        })
        .catch(error => console.error('Error:', error));
}
