package com.TorneosExpress.fixture;

import com.TorneosExpress.model.Match.Match;
import java.util.List;

public class Fixture {
  private List<Match> matches;

  public Fixture(List<Match> matches) {
    this.matches = matches;
  }

  public List<Match> getMatches() {
    return matches;
  }
}
