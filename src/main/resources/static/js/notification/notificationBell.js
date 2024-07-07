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

                const unreadNotifications = notifications.filter(notification => !notification.read);
                const unreadCountValue = unreadNotifications.length;

                if (unreadCountValue > 0) {
                    notificationText.textContent = 'Notifications (' + unreadCountValue + ')';
                    unreadCount.style.display = 'inline-block';
                } else {
                    notificationText.textContent = 'Notifications';
                    unreadCount.style.display = 'none'; // Hide the unread count if no unread notifications
                }

            })
            .catch(error => console.error('Error:', error));
    }

});

function confirmLogout() {
    const logoutConfirmed = window.confirm('Do you want to logout?');
    if (logoutConfirmed) {
        localStorage.removeItem("userId"); // Remove userId from localStorage
        window.location.href = "login.html";
    }
}

document.getElementById("logout-link").addEventListener("click", confirmLogout);
