package com.TorneosExpress.fixture;

import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.StageType;
import com.TorneosExpress.repository.MatchRepository;

import java.time.LocalDate;
import java.util.*;

public class FixtureBuilder {
  private final String location;
  private final LocalDate startDate;
  private final MatchRepository matchRepository;

  public FixtureBuilder(String location, LocalDate startDate, MatchRepository matchRepository) {
    this.location = location;
    this.startDate = startDate;
    this.matchRepository = matchRepository;
  }
  
  public List<Match> build(List<Team> teams, StageType type) {
    List<Match> fixtureMatches = new ArrayList<>();
    switch (type){
      case ROUNDROBIN:
        calculateMatchRoundRobinCalendar(teams, fixtureMatches);
        break;
      case KNOCKOUT:
        calculateKnockoutMatches(teams, fixtureMatches);
        break;
      case GROUPSTAGE:
        calculateGroupMatches(teams, teams.size(), fixtureMatches);
    }

    return fixtureMatches;
  }


  private void calculateMatchRoundRobinCalendar(List<Team> teams, List<Match> fixtureMatches) {
    int numTeams = teams.size();

    if (numTeams % 2 != 0) {
      teams.add(new Team("Dummy"));// 'Dummy' team.
      numTeams++;
    }
    int numWeeks = teams.size() - 1; // Teams play against everyone except for themselves.

    List<Team> teamsCopy = new ArrayList<>(teams);
    for (int week = 0; week < numWeeks; week++) {
      LocalDate matchDate = startDate.plusWeeks(week);
      buildMatches(numTeams, teamsCopy, fixtureMatches, matchDate);
      Collections.rotate(teamsCopy.subList(1, numTeams), 1);
    }

  }

  private void buildMatches(int numTeams, List<Team> teamsCopy, List<Match> matches, LocalDate matchDate) {
    for (int i = 0; i < numTeams / 2; i++) {
      Team team1 = teamsCopy.get(i);
      Team team2 = teamsCopy.get(numTeams - i - 1);
      if (!team1.getName().equals("Dummy") && !team2.getName().equals("Dummy")) {
        Match match = new Match(team1, team2, location, matchDate, null, StageType.ROUNDROBIN);
        matches.add(match);
        matchRepository.save(match);
      }
    }
  }
  

  private void calculateKnockoutMatches(List<Team> teams, List<Match> fixtureMatches) {
    Queue<Team> teamQueue = new LinkedList<>(teams);
    LocalDate matchDate = startDate;

    while (teamQueue.size() > 1) {
      int numMatches = teamQueue.size() / 2;

      for (int i = 0; i < numMatches; i++) {
        Team team1 = teamQueue.poll();
        Team team2 = teamQueue.poll();
        Match match = new Match(team1, team2, location, matchDate, null, StageType.KNOCKOUT);
        fixtureMatches.add(match);
        matchRepository.save(match);
      }
      matchDate = matchDate.plusWeeks(1);
    }

  }



//  private void calculateGroupMatches(List<Team> teams, int groupSize, List<Match> fixtureMatches) {
//    int numTeams = teams.size();
//    int numGroups = (int) Math.ceil((double) numTeams / groupSize);
//
//    for (int group = 0; group < numGroups; group++) {
//      List<Team> groupTeams = teams.subList(group * groupSize, Math.min((group + 1) * groupSize, numTeams));
//      for (int i = 0; i < groupTeams.size(); i++) {
//        for (int j = i + 1; j < groupTeams.size(); j++) {
//          LocalDate matchDate = startDate.plusDays((i + j) % groupTeams.size());
//          Match match = new Match(groupTeams.get(i), groupTeams.get(j), location, matchDate, null, StageType.GROUPSTAGE);
//          fixtureMatches.add(match);
//          matchRepository.save(match);
//        }
//      }
//    }
//  }

    private void calculateGroupMatches(List<Team> teams, int groupSize, List<Match> fixtureMatches) {
        int numTeams = teams.size();
        int numGroups = (int) Math.ceil((double) numTeams / groupSize);

        int matchDay = 0; // Para controlar las fechas de los partidos
        for (int group = 0; group < numGroups; group++) {
            // Asegúrate de que el subgrupo sea una nueva lista
            List<Team> groupTeams = new ArrayList<>(
                    teams.subList(group * groupSize, Math.min((group + 1) * groupSize, numTeams))
            );

            // Genera los partidos del grupo
            for (int i = 0; i < groupTeams.size(); i++) {
                for (int j = i + 1; j < groupTeams.size(); j++) {
                    LocalDate matchDate = startDate.plusDays(matchDay); // Incrementa la fecha
                    Match match = new Match(groupTeams.get(i), groupTeams.get(j), location, matchDate, null, StageType.GROUPSTAGE);
                    fixtureMatches.add(match);
                    matchRepository.save(match); // Guarda el partido
                    matchDay++;
                }
            }
        }
    }



}
