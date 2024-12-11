package com.TorneosExpress.results;

import com.TorneosExpress.model.Team;
import lombok.Getter;

@Getter
public class PurchaseResult {
  private final Team team;
  private final boolean successful;

  public PurchaseResult(Team team, boolean successful) {
    this.team = team;
    this.successful = successful;
  }
}
