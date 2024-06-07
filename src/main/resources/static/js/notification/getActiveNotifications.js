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
        })
        .catch(error => console.error('Error:', error));
}
