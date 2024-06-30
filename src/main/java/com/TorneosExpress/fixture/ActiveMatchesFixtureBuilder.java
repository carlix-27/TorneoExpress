package com.TorneosExpress.fixture;

import com.TorneosExpress.dto.ActiveMatch;
import com.TorneosExpress.model.Team;

import java.util.ArrayList;
import java.util.List;

public class ActiveMatchesFixtureBuilder {

    private final Long tournamentId;

    public ActiveMatchesFixtureBuilder(Long tournamentId){
        this.tournamentId = tournamentId;
    }

    public ActiveMatchFixture build(List<Team> teams) {
        List<ActiveMatch> activeMatches = calculateActiveMatches(teams);
        return new ActiveMatchFixture(activeMatches);
    }

    private List<ActiveMatch> calculateActiveMatches(List<Team> teams) {
        List<ActiveMatch> matches = new ArrayList<>();
        int numTeams = teams.size();

        // Generate matches only between participating teams
        for (int i = 0; i < numTeams; i++) {
            for (int j = i + 1; j < numTeams; j++) {
                Team team1 = teams.get(i);
                Team team2 = teams.get(j);
                matches.add(new ActiveMatch(team1, team2, tournamentId, "To be played."));
            }
        }

        return matches;
    }
}
