package com.TorneosExpress.websockets;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserPointsMessage {
  private String message;

  public UserPointsMessage() {
  }

  public UserPointsMessage(String message) {
    this.message = message;
  }
}


