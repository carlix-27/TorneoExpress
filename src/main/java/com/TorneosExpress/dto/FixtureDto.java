package com.TorneosExpress.dto;

import com.TorneosExpress.model.Match.Match;

import java.util.List;

public class FixtureDto {
  private List<MatchDto> matches;

  public List<MatchDto> getMatches() {
    return matches;
  }

  public void setMatches(List<MatchDto> matches) {
    this.matches = matches;
  }
}
