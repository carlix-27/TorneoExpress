package com.TorneosExpress.controller;

import com.TorneosExpress.dto.request.NotificationDto;
import com.TorneosExpress.model.Notification;
import com.TorneosExpress.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/unread/{userId}")
    public List<Notification> getUnreadNotifications(@PathVariable Long userId) {
        return notificationService.getUnreadNotifications(userId);
    }

    @PostMapping("/mark-as-read/{notificationId}")
    public Notification markAsRead(@PathVariable Long notificationId) {
        return notificationService.markAsRead(notificationId);
    }

    @DeleteMapping("/delete/{notificationId}")
    public void deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
    }

    @PostMapping("/create")
    public Notification createNotification(@RequestBody NotificationDto notificationDto) {
        Long toId = notificationDto.getToId();
        String message = notificationDto.getMessage();
        return notificationService.createNotification(toId, message);
    }

    @GetMapping("/active/{userId}")
    public List<Notification> getActiveNotificationsForUser(@PathVariable Long userId) {
        return notificationService.getActiveNotificationsForUser(userId);
    }


}
