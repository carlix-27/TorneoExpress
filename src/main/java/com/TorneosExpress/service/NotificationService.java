package com.TorneosExpress.service;

import com.TorneosExpress.model.Notification;
import com.TorneosExpress.repository.NotificationRepository;
import com.TorneosExpress.websockets.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final WebSocketService webSocketService;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, WebSocketService webSocketService) {
        this.notificationRepository = notificationRepository;
        this.webSocketService = webSocketService;
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByToIdAndReadFalse(userId);
    }

    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public Notification createNotification(Long toId, String message, String url) {
        Notification notification = new Notification(toId, message, url);
        Notification savedNotification = notificationRepository.save(notification);
        webSocketService.sendNotification(toId, notification);
        return savedNotification;
    }

    public List<Notification> getActiveNotificationsForUser(Long userId) {
        return notificationRepository.findByToIdAndReadFalse(userId);
    }

    public List<Notification> getNotificationsToUser(Long userId) {
        return notificationRepository.findByToId(userId);
    }

    public void markNotificationsAsRead(Long userId) {
        notificationRepository.markAllAsReadByToId(userId);
    }
}
