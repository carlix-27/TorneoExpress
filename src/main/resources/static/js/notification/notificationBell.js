let notificationCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    const unreadCount = document.getElementById('unread-count');
    const notificationText = document.getElementById('notification-text');
    const userId = localStorage.getItem("userId");

    getNotifications(userId);
    connectWebSocket();

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
                notificationCount = unreadCountValue;

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

function connectWebSocket() {
  let socket = new SockJS('/ws');
  let stompClient = Stomp.over(socket);
  const userId = localStorage.getItem("userId");
  stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe(`/user/${userId}/notification`, function (message) {
      updateNotifications(JSON.parse(message.body));
    });
  });
}

function updateNotifications(notification) {
  notificationCount += 1;
  const updatedUnreadCount = document.getElementById('unread-count');
  const notificationText = document.getElementById('notification-text');
  updatedUnreadCount.textContent = notificationCount;
  updatedUnreadCount.style.display = 'inline-block';
  notificationText.textContent = 'Notifications (' + notificationCount + ')';
  notificationText.classList.add('has-notifications');
  notificationText.classList.remove('no-notifications');
}
