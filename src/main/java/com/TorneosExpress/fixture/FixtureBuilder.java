package com.TorneosExpress.fixture;

import com.TorneosExpress.model.Match.Match;
import com.TorneosExpress.model.Team;
import java.time.LocalDate;
import java.util.ArrayList;
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
            teams.get(i),
            teams.get(i + 1),
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

  private boolean isFreeOnWeek(Long team1Id, Long team2Id, List<Long> teamsWithMatchForWeek) {
    return !teamsWithMatchForWeek.contains(team1Id)
        && !teamsWithMatchForWeek.contains(team2Id);
  }

  public static void main(String[] args) {
    List<Team> teams = List.of(
        new Team(1L, "test1", "pilar", false),
        new Team(2L, "test2", "pilar", false),
        new Team(3L, "test3", "pilar", true),
        new Team(4L, "test4", "pilar", false)
        );

    FixtureBuilder fb = new FixtureBuilder(3L, "pilar", LocalDate.now());
    Fixture fixture = fb.build(teams);
    fixture.getMatches().forEach(System.out::println);
    /* Fixture should contain N(N-1)/2 matches, N being the amount of teams. */
  }

}
