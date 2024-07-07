document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");
    getNotifications(userId);
});

function getNotifications(userId) {
    fetch(`/api/notifications/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(notifications => {
            const unreadContainer = document.getElementById('unread-notifications');
            const readContainer = document.getElementById('read-notifications');

            unreadContainer.innerHTML = ''; // Clear any existing notifications
            readContainer.innerHTML = '';

            notifications.forEach(notification => {
                const notificationElement = document.createElement('div');
                notificationElement.className = 'notification';
                notificationElement.innerHTML = `
                    <p>${notification.message}</p>
                `;

                if (!notification.read) {
                    unreadContainer.appendChild(notificationElement);
                } else {
                    readContainer.appendChild(notificationElement);
                }
            });

            markNotificationsAsRead(userId);
        })
        .catch(error => console.error('Error:', error));
}

function markNotificationsAsRead(userId) {
    fetch(`/api/notifications/markRead/${userId}`, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to mark notifications as read: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('All notifications marked as read successfully:', data);
        })
        .catch(error => console.error('Error:', error));
}