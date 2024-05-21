package com.TorneosExpress.fixture;

import com.TorneosExpress.model.Match.Match;
import com.TorneosExpress.model.Team;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class FixtureBuilder {
  private final Long tournamentId;
  private final String location;
  private final LocalDate startDate;

  public FixtureBuilder(Long tournamentId, String location, LocalDate startDate) {
    this.tournamentId = tournamentId;
    this.location = location;
    this.startDate = startDate;
  }

  public Fixture build(List<Team> teams) {
    List<Match> matches = new ArrayList<>();
    for (int i = 0; i < teams.size() - 1; i++) {
      for (int j = i + 1; j < teams.size(); j++) {
        matches.add(new Match(
            teams.get(i).getId(),
            teams.get(j).getId(),
            this.tournamentId,
            this.location,
            new Date(),
            "Not played"
        ));
      }
    }
    return new Fixture(matches);
  }

  private LocalDate calculateMatchDate() {

    return startDate;
  }
}
