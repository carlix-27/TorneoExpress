package com.TorneosExpress.fixture;

import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Sport;
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
    int numTeams = teams.size();

    if (numTeams % 2 != 0) {
      teams.add(new Team("Dummy")); // 'Dummy' team.
      numTeams++;
    }
    int numWeeks = teams.size() - 1; // Teams play against everyone except for themselves.

    List<Team> teamsCopy = new ArrayList<>(teams);
    for (int week = 0; week < numWeeks; week++) {
      LocalDate matchDate = startDate.plusWeeks(week);
      buildMatches(numTeams, teamsCopy, matches, matchDate);
      Collections.rotate(teamsCopy.subList(1, numTeams), 1);
    }

    return matches;
  }

  private void buildMatches(int numTeams, List<Team> teamsCopy, List<Match> matches, LocalDate matchDate) {
    for (int i = 0; i < numTeams / 2; i++) {
      Team team1 = teamsCopy.get(i);
      Team team2 = teamsCopy.get(numTeams - i - 1);
      if (!team1.getName().equals("Dummy") && !team2.getName().equals("Dummy")) {
        matches.add(new Match(
            team1, team2, tournamentId, location, matchDate, "To be played."));
      }
    }
  }



  public static void main(String[] args) {
    Sport futbol = new Sport();
    List<Team> teams = new ArrayList<>();
    teams.add(new Team(1L, "test1", futbol, "pilar", false));
    teams.add(new Team(2L, "test2", futbol, "pilar", false));
    teams.add(new Team(3L, "test3", futbol, "pilar", true));
    teams.add(new Team(4L, "test4", futbol, "pilar", false));
    teams.add(new Team(5L, "test5", futbol, "pilar", false));

    FixtureBuilder fb = new FixtureBuilder(3L, "pilar", LocalDate.now());
    Fixture fixture = fb.build(teams);
    fixture.getMatches().forEach(System.out::println);
    /* Fixture should contain N(N-1)/2 matches, N being the amount of teams. */
  }

}
