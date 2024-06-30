package com.TorneosExpress.fixture;

import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Team;

import java.util.ArrayList;
import java.util.List;

public class ActiveMatchesFixtureBuilder {

    private final Long tournamentId;

    public ActiveMatchesFixtureBuilder(Long tournamentId){
        this.tournamentId = tournamentId;
    }

    public ActiveMatchFixture build(List<Team> teams) {
        List<Match> activeMatches = calculateActiveMatches(teams);
        return new ActiveMatchFixture(activeMatches);
    }

    private List<Match> calculateActiveMatches(List<Team> teams) {
        List<Match> matches = new ArrayList<>();
        int numTeams = teams.size();

        // Generate matches only between participating teams
        for (int i = 0; i < numTeams; i++) {
            for (int j = i + 1; j < numTeams; j++) {
                Team team1 = teams.get(i);
                Team team2 = teams.get(j);
                matches.add(new Match(team1, team2, tournamentId, "To be played."));
            }
        }

        return matches;
    }
}
