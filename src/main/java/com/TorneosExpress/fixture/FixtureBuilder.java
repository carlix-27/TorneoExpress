package com.TorneosExpress.fixture;

import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.repository.MatchRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class FixtureBuilder {
  private final Tournament tournament;
  private final String location;
  private final LocalDate startDate;
  private final MatchRepository matchRepository;

  public FixtureBuilder(Tournament tournament, String location, LocalDate startDate, MatchRepository matchRepository) {
    this.tournament = tournament;
    this.location = location;
    this.startDate = startDate;
    this.matchRepository = matchRepository;
  }


  public Fixture build(List<Team> teams) {
    Fixture fixture = new Fixture();
    fixture.setMatches(calculateMatchCalendar(teams));
    return fixture;
  }


  private List<Match> calculateMatchCalendar(List<Team> teams) {
    List<Match> matches = new ArrayList<>();
    int numTeams = teams.size();

    if (numTeams % 2 != 0) {
      teams.add(new Team("Dummy"));// 'Dummy' team.
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
        Match match = new Match(team1, team2, tournament, location, matchDate, null);
        matches.add(match);
        matchRepository.save(match);
      }
    }
  }

}
