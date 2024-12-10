package com.TorneosExpress.websockets;

import com.TorneosExpress.model.Notification;
import com.TorneosExpress.model.Team;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {
  private final SimpMessagingTemplate messagingTemplate;

  @Autowired
  public WebSocketService(SimpMessagingTemplate messagingTemplate) {
    this.messagingTemplate = messagingTemplate;
  }

  public void sendPointsUpdate(Team team) {
    messagingTemplate.convertAndSend("/topic/points", team);
  }

  public void sendNotification(Long to, Notification notification) {
//    messagingTemplate.convertAndSend("/topic/notifications/" + to, notification);
    messagingTemplate.convertAndSendToUser(
        to.toString(),
        "/notification",
        notification
    );
  }
}
