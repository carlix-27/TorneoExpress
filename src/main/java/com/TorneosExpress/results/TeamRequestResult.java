package com.TorneosExpress.results;

import com.TorneosExpress.model.TeamRequest;
import lombok.Getter;

@Getter
public class TeamRequestResult {
  private final TeamRequest teamRequest;
  private final Boolean successful;

  public TeamRequestResult(TeamRequest teamRequest, Boolean successful) {
    this.teamRequest = teamRequest;
    this.successful = successful;
  }
}
