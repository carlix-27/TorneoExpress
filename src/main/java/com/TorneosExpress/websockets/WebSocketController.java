package com.TorneosExpress.websockets;

import com.TorneosExpress.model.Team;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

  @MessageMapping("/updatePoints")
  @SendTo("/topic/points")
  public Team updatePoints(Team team) {
    return team;
  }
}
