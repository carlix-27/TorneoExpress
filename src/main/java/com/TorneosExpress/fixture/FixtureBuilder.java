package com.TorneosExpress.fixture;

import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.model.Type;
import com.TorneosExpress.repository.MatchRepository;

import java.time.LocalDate;
import java.util.*;

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


  public Fixture build(List<Team> teams, Type type) {
    Fixture fixture = new Fixture();
    switch (type){
      case ROUNDROBIN:
        fixture.setMatches(calculateMatchRoundRobinCalendar(teams));
        break;
      case KNOCKOUT:
        fixture.setMatches(calculateKnockoutMatches(teams));
        break;
      case GROUPSTAGE:
        fixture.setMatches(calculateGroupMatches(teams, teams.size()));
    }

    return fixture;
  }


  private List<Match> calculateMatchRoundRobinCalendar(List<Team> teams) {
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


  private List<Match> calculateKnockoutMatches(List<Team> teams) {
    List<Match> matches = new ArrayList<>();
    Queue<Team> teamQueue = new LinkedList<>(teams);
    LocalDate matchDate = startDate;

    while (teamQueue.size() > 1) {
      int numMatches = teamQueue.size() / 2;

      for (int i = 0; i < numMatches; i++) {
        Team team1 = teamQueue.poll();
        Team team2 = teamQueue.poll();
        Match match = new Match(team1, team2, tournament, location, matchDate, null);
        matches.add(match);
        matchRepository.save(match);
      }
      matchDate = matchDate.plusWeeks(1);
    }

    return matches;
  }

  private List<Match> calculateGroupMatches(List<Team> teams, int groupSize) {
    List<Match> matches = new ArrayList<>();
    int numTeams = teams.size();
    int numGroups = (int) Math.ceil((double) numTeams / groupSize);

    for (int group = 0; group < numGroups; group++) {
      List<Team> groupTeams = teams.subList(group * groupSize, Math.min((group + 1) * groupSize, numTeams));
      for (int i = 0; i < groupTeams.size(); i++) {
        for (int j = i + 1; j < groupTeams.size(); j++) {
          LocalDate matchDate = startDate.plusDays((i + j) % groupTeams.size());
          Match match = new Match(groupTeams.get(i), groupTeams.get(j), tournament, location, matchDate, null);
          matches.add(match);
          matchRepository.save(match);
        }
      }
    }

    return matches;
  }





}
