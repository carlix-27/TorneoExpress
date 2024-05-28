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
    //return new Fixture(calculateMatchCalendar(teams));
    return new Fixture(otherImplementation(teams));
  }

  private List<Match> otherImplementation(List<Team> teams) {
    List<Match> matches = new ArrayList<>();
    int numWeeks = teams.size() - 1; // Teams play against everyone except for themselves.

    for (int week = 0; week < numWeeks; week++) {
      List<Long> hasMatchForWeek = new ArrayList<>();
      processTeams(matches, teams, hasMatchForWeek, week);
    }
    return matches;
  }

  private void processTeams(List<Match> matches, List<Team> teams, List<Long> hasMatchForWeek, int week) {
    for (int i = 0; i < teams.size() - 1; i++) {
      if (isFreeOnWeek(teams.get(i).getId(), teams.get(i + 1).getId(), hasMatchForWeek)) {
        matches.add(new Match(
            teams.get(i).getId(),
            teams.get(i + 1).getId(),
            tournamentId,
            location,
            startDate.plusWeeks(week),
            "To be played"
        ));
        hasMatchForWeek.add(teams.get(i).getId());
        hasMatchForWeek.add(teams.get(i + 1).getId());
      }
    }
  }

  private List<Match> calculateMatchCalendar(List<Team> teams) {
    List<Match> matches = new ArrayList<>();
    Collections.shuffle(teams);
    /* Shuffle so that there are less misses. */
    for (int numTeams = 0; numTeams < teams.size() - 1; numTeams++) {
      List<Long> hasMatchOnWeek = new ArrayList<>();
      processWeek(teams, numTeams, hasMatchOnWeek, matches);
    }
    return matches;
  }

  private void processWeek(List<Team> teams, int numTeams, List<Long> hasMatchOnWeek, List<Match> matches) {
    for (int numWeeks = numTeams + 1; numWeeks < teams.size(); numWeeks++) {
      if (isFreeOnWeek(teams.get(numTeams).getId(), teams.get(numWeeks).getId(), hasMatchOnWeek)) {
        matches.add(new Match(
            teams.get(numTeams).getId(),
            teams.get(numWeeks).getId(),
            tournamentId,
            location,
            startDate.plusWeeks(numWeeks),
            "To be played"
        ));
        hasMatchOnWeek.add(teams.get(numTeams).getId());
        hasMatchOnWeek.add(teams.get(numWeeks).getId());
        if (hasMatchOnWeek.size() >= numTeams) {
          break; // Limit matches per week
        }
      }
    }
  }

  private boolean isFreeOnWeek(Long team1Id, Long team2Id, List<Long> teamsWithMatchForWeek) {
    return !teamsWithMatchForWeek.contains(team1Id)
        && !teamsWithMatchForWeek.contains(team2Id);
  }

}
