package com.TorneosExpress.fixture;

import com.TorneosExpress.dto.ActiveMatch;
import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.model.Team;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ActiveMatchesFixtureBuilder {

    private final Long tournamentId;

    private final Fixture fixture;

    public ActiveMatchesFixtureBuilder(Long tournamentId, Fixture fixture){
        this.tournamentId = tournamentId;
        this.fixture = fixture;
    }

    public ActiveMatchFixture build(List<Team> teams) {
        List<ActiveMatch> activeMatches = calculateActiveMatches(teams);
        return new ActiveMatchFixture(activeMatches);
    }

    private List<ActiveMatch> calculateActiveMatches(List<Team> teams) {
        List<ActiveMatch> matches = new ArrayList<>();
        List<Match> fixtureMatches = fixture.getMatches();
        int numTeams = teams.size();
        int matchIndex = 0;

        // Generate matches only between participating teams
        for (int i = 0; i < numTeams; i++) {
            for (int j = i + 1; j < numTeams; j++) {
                if (matchIndex >= fixtureMatches.size()) {
                    break; // Ensure we do not go out of bounds
                }

                Match currentMatch = fixtureMatches.get(matchIndex++);
                Long team1Id = teams.get(i).getId();
                String team1Name = teams.get(i).getName();
                Long team2Id = teams.get(j).getId();
                String team2Name = teams.get(j).getName();
                matches.add(new ActiveMatch(currentMatch.getMatch_id(), team1Id, team2Id, tournamentId, team1Name, team2Name));
            }
        }

        return matches;
    }

    // Mini Test
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

        ActiveMatchesFixtureBuilder amb = new ActiveMatchesFixtureBuilder(3L, fixture);
        ActiveMatchFixture activeMatchFixture = amb.build(teams);

        activeMatchFixture.getMatches().forEach(System.out::println);
    }
}



