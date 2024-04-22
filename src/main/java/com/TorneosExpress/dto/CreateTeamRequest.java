package com.TorneosExpress.dto;

import com.TorneosExpress.model.player.Player;

public class CreateTeamRequest {
  private String name;
  private String location;
  private boolean isPrivate;
  private Player captain;

  public Player getCaptain() {
    return captain;
  }

  public String getLocation() {
    return location;
  }

  public String getTeamName() {
    return name;
  }

  public boolean isPrivate() {
    return isPrivate;
  }
}
