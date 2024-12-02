document.addEventListener("DOMContentLoaded", () => {
    const unreadCount = document.getElementById('unread-count');
    const notificationText = document.getElementById('notification-text');
    const userId = localStorage.getItem("userId");

    getNotifications(userId);

    function getNotifications(userId) {
        fetch(`/api/notifications/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(notifications => {

                const unreadNotifications = notifications.filter(notification => !notification.read && !transcurridoMasDe24Horas(new Date(notification.createdAt)));
                const unreadCountValue = unreadNotifications.length;

                if (unreadCountValue > 0) {
                    unreadCount.textContent = unreadCountValue; // Show unread count
                    unreadCount.style.display = 'inline-block'; // Make count visible
                    notificationText.textContent = 'Notifications (' + unreadCountValue + ')'; // Update notification text with count
                    notificationText.classList.add('has-notifications'); // Change color for unread notifications
                    notificationText.classList.remove('no-notifications');
                } else {
                    unreadCount.style.display = 'none'; // Hide unread count if no unread notifications
                    notificationText.textContent = 'Notifications'; // Show plain text
                    notificationText.classList.add('no-notifications'); // Default color when no notifications
                    notificationText.classList.remove('has-notifications');
                }

            })
            .catch(error => console.error('Error:', error));
    }

    function transcurridoMasDe24Horas(createdAt) {
        const milisegundosPorDia = 24 * 60 * 60 * 1000;
        const ahora = new Date();
        return (ahora - createdAt) > milisegundosPorDia;
    }

});