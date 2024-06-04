package com.TorneosExpress.service;

import com.TorneosExpress.dto.NotificationDto;
import com.TorneosExpress.model.Notification;
import com.TorneosExpress.model.Player;
import com.TorneosExpress.repository.NotificationRepository;
import com.TorneosExpress.repository.PlayerRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Transactional
    public void createNotification(NotificationDto notificationDTO) {

        Player recipient = playerRepository.findById(notificationDTO.getRecipientId())
                .orElseThrow(() -> new EntityNotFoundException("Player not found with ID: " + notificationDTO.getRecipientId()));


        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setMessage(notificationDTO.getMessage());


        notificationRepository.save(notification);
    }
}
