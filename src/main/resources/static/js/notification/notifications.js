document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");
    getNotifications(userId);
    connectWebSocket();
});

function getNotifications(userId) {
    fetch(`/api/notifications/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener las notificaciones: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(notifications => {
            const unreadContainer = document.getElementById('unread-notifications');
            const readContainer = document.getElementById('read-notifications');

            // Ordenar notificaciones por fecha de creación (más reciente primero)
            notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            unreadContainer.innerHTML = ''; // Limpiar notificaciones existentes
            readContainer.innerHTML = '';

            notifications.forEach(notification => {
                const createdAt = new Date(notification.createdAt);
                const timeAgo = tiempoTranscurrido(new Date(), createdAt);

                // Filtrar notificaciones que tienen más de 24 horas
                if (transcurridoMasDe24Horas(createdAt)) {
                    return; // Salir del bucle forEach para esta notificación
                }

                const notificationElement = document.createElement('div');
                notificationElement.className = 'notification';

                notificationElement.innerHTML = `
                    <p>${notification.message} - <span style="font-size: 12px; color: #999;">${timeAgo}</span></p>
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
                throw new Error(`Error al marcar las notificaciones como leídas: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Todas las notificaciones marcadas como leídas correctamente:', data);
        })
        .catch(error => console.error('Error:', error));
}

function tiempoTranscurrido(actual, anterior) {
    const milisegundosPorMinuto = 60 * 1000;
    const milisegundosPorHora = milisegundosPorMinuto * 60;
    const milisegundosPorDia = milisegundosPorHora * 24;

    const transcurrido = actual - anterior;

    if (transcurrido < milisegundosPorMinuto) {
        return `hace ${Math.round(transcurrido / 1000)} segs`;
    } else if (transcurrido < milisegundosPorHora) {
        return `hace ${Math.round(transcurrido / milisegundosPorMinuto)} mins`;
    } else if (transcurrido < milisegundosPorDia) {
        return `hace ${Math.round(transcurrido / milisegundosPorHora)} horas`;
    } else {
        return ''; // Si ha pasado más de 24 horas, no mostrar tiempo transcurrido
    }
}

function transcurridoMasDe24Horas(createdAt) {
    const milisegundosPorDia = 24 * 60 * 60 * 1000;
    const ahora = new Date();

    return (ahora - createdAt) > milisegundosPorDia;
}

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
  console.log("notification: " + notification);
  const updatedUnreadNotifications = document.getElementById('unread-notifications');
  const notificationElement = document.createElement('div');
  const createdAt = new Date(notification.createdAt);
  const timeAgo = tiempoTranscurrido(new Date(), createdAt);
  notificationElement.className = 'notification';
  notificationElement.innerHTML = `
    <p>${notification.message} - <span style="font-size: 12px; color: #999;">${timeAgo}</span></p>
  `;
  updatedUnreadNotifications.appendChild(notificationElement);
  markNotificationsAsRead(localStorage.getItem("userId"));
}
