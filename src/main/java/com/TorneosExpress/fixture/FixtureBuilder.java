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
        calculateGroupMatches(teams, fixtureMatches);
        break;
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
        Match match = new Match(team1, team2, location, matchDate, null);
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
        Match match = new Match(team1, team2, location, matchDate, null);
        fixtureMatches.add(match);
        matchRepository.save(match);
      }
      matchDate = matchDate.plusWeeks(1);
    }

  }


    private void calculateGroupMatches(List<Team> teams, List<Match> fixtureMatches) {
        // Comprobar si el número total de equipos no es múltiplo de 4 y rellenar con "Dummy"
        while (teams.size() % 4 != 0) {
            teams.add(new Team("Dummy"));
        }

        int numGroups = teams.size() / 4; // Número total de grupos
        List<Team> teamsCopy = new ArrayList<>(teams); // Copia de los equipos para manipular

        // Iterar sobre cada grupo
        for (int group = 0; group < numGroups; group++) {
            // Extraer los equipos del grupo actual
            List<Team> groupTeams = teamsCopy.subList(group * 4, (group + 1) * 4);

            // Generar partidos del grupo
            LocalDate groupStartDate = startDate.plusWeeks(group); // Escalar fechas por grupo
            buildGroupMatches(groupTeams, fixtureMatches, groupStartDate);
        }
    }

    private void buildGroupMatches(List<Team> groupTeams, List<Match> fixtureMatches, LocalDate matchDate) {
        for (int i = 0; i < groupTeams.size(); i++) {
            for (int j = i + 1; j < groupTeams.size(); j++) {
                Team team1 = groupTeams.get(i);
                Team team2 = groupTeams.get(j);

                Match match = new Match(team1, team2, location, matchDate, null);
                fixtureMatches.add(match);
                matchRepository.save(match);
            }

            matchDate = matchDate.plusDays(1);
        }
    }


}
