package com.TorneosExpress.results;

import com.TorneosExpress.model.TournamentRequest;
import lombok.Getter;

@Getter
public class TournamentRequestResult {
  private final TournamentRequest tournamentRequest;
  private final Boolean successful;

  public TournamentRequestResult(TournamentRequest tournamentRequest, Boolean successful) {
    this.tournamentRequest = tournamentRequest;
    this.successful = successful;
  }
}
