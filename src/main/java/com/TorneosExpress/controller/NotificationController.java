package com.TorneosExpress.controller;

import com.TorneosExpress.dto.NotificationDto;
import com.TorneosExpress.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/create")
    public ResponseEntity<?> createNotification(@RequestBody NotificationDto notificationDTO) {
        notificationService.createNotification(notificationDTO);
        return ResponseEntity.ok().build();
    }

}

