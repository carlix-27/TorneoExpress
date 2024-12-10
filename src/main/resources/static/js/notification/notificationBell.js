let notificationCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    const notificationIcon = document.getElementById('notification-icon'); // Select the icon
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

                updateNotificationUI(unreadCountValue);
            })
            .catch(error => console.error('Error:', error));
    }

    function transcurridoMasDe24Horas(createdAt) {
        const milisegundosPorDia = 24 * 60 * 60 * 1000;
        const ahora = new Date();
        return (ahora - createdAt) > milisegundosPorDia;
    }

    function updateNotificationUI(unreadCountValue) {
        if (unreadCountValue > 0) {
            notificationIcon.src = 'img/NewNotification.png';
        } else {
            notificationIcon.src = 'img/Notifications%20Icon.png';
        }
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
    const notificationIcon = document.getElementById('notification-icon');
    notificationIcon.src = 'img/NewNotification.png';
}
