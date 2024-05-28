package com.TorneosExpress.fixture;

import com.TorneosExpress.model.Match.Match;
import com.TorneosExpress.model.Team;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
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
    return new Fixture(calculateMatchCalendar(teams));
  }

  private List<Match> calculateMatchCalendar(List<Team> teams) {
    List<Match> matches = new ArrayList<>();
    Collections.shuffle(teams);
    /* Shuffle so that there are less misses. */
    for (int i = 0; i < teams.size() - 1; i++) {
      List<Long> hasMatchOnWeek = new ArrayList<>();
      processWeek(teams, i, hasMatchOnWeek, matches);
    }
    return matches;
  }

  private void processWeek(List<Team> teams, int i, List<Long> hasMatchOnWeek, List<Match> matches) {
    for (int j = i + 1; j < teams.size(); j++) {
      if (isFreeOnWeek(teams.get(i).getId(), teams.get(j).getId(), hasMatchOnWeek)) {
        matches.add(new Match(
            teams.get(i).getId(),
            teams.get(j).getId(),
            tournamentId,
            location,
            startDate.plusWeeks(j),
            "To be played"
        ));
        hasMatchOnWeek.add(teams.get(i).getId());
        hasMatchOnWeek.add(teams.get(j).getId());
      }
    }
  }

  private boolean isFreeOnWeek(Long team1Id, Long team2Id, List<Long> teamsWithMatchForWeek) {
    return !teamsWithMatchForWeek.contains(team1Id)
        && !teamsWithMatchForWeek.contains(team2Id);
  }

}
