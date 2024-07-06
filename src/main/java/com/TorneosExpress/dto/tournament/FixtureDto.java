package com.TorneosExpress.dto.tournament;

import java.util.List;
import java.util.Objects;

public class FixtureDto {
  private List<MatchDto> matches;

  public List<MatchDto> getMatches() {
    return matches;
  }

  public void setMatches(List<MatchDto> matches) {
    this.matches = matches;
  }

  public MatchDto find(Long matchId) {
    for (MatchDto matchDto : matches) {
      if (Objects.equals(matchDto.getMatchId(), matchId)) {
        return matchDto;
      }
    }
    return null;
  }
}
