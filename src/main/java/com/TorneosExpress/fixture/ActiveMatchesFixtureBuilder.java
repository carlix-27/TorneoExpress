package com.TorneosExpress.fixture;

import com.TorneosExpress.dto.ActiveMatch;
import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Team;

import java.util.ArrayList;
import java.util.List;

public class ActiveMatchesFixtureBuilder {

    private final Long tournamentId;

    private Fixture fixture;

    public ActiveMatchesFixtureBuilder(Long tournamentId){
        this.tournamentId = tournamentId;
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
}
