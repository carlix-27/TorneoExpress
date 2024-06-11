package com.TorneosExpress.dto;

import com.TorneosExpress.model.Match.Match;

import java.util.List;

public class FixtureDto {
  private List<Match> matches;

  public List<Match> getMatches() {
    return matches;
  }

  public void setMatches(List<Match> matches) {
    this.matches = matches;
  }
}
