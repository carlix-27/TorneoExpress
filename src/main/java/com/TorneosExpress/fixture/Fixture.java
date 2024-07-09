package com.TorneosExpress.fixture;

import com.TorneosExpress.model.Match;
import jakarta.persistence.Embeddable;
import jakarta.persistence.OneToMany;

import java.util.List;

@Embeddable
public class Fixture {
  @OneToMany
  private List<Match> matches;

  public List<Match> getMatches() {
    return matches;
  }

  public void setMatches(List<Match> matches) {
    this.matches = matches;
  }
}
