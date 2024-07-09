package com.TorneosExpress.fixture;

import com.TorneosExpress.dto.ActiveMatch;
import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.repository.MatchRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ActiveMatchesFixtureBuilder {

    private final Long tournamentId;


    private final MatchRepository matchRepository;

    public ActiveMatchesFixtureBuilder(Long tournamentId, MatchRepository matchRepository){
        this.tournamentId = tournamentId;
        this.matchRepository = matchRepository;
    }

    public ActiveMatchFixture build(List<Team> teams) {
        List<ActiveMatch> activeMatches = calculateActiveMatches(teams);
        return new ActiveMatchFixture(activeMatches);
    }

    private List<ActiveMatch> calculateActiveMatches(List<Team> teams) {
        List<ActiveMatch> matches = new ArrayList<>();
        List<Match> existingMatches = matchRepository.findAllByTournamentId(tournamentId);
        int numTeams = teams.size();
        int matchIndex = 0;
        Set<String> processedMatches = new HashSet<>();

        // Generate matches only between participating teams
        for (int i = 0; i < numTeams; i++) {
            for (int j = i + 1; j < numTeams; j++) {
                if (matchIndex >= existingMatches.size()) {
                    break; // Ensure we do not go out of bounds
                }

                Match currentMatch =  existingMatches.get(matchIndex++); // FIXME! Este es el error, aca hace bochinche
                Long team1Id = teams.get(i).getId();
                Long team2Id = teams.get(j).getId();

                // Create a unique key for the match combination
                String matchKey = team1Id + "-" + team2Id;
                String reverseMatchKey = team2Id + "-" + team1Id;

                // Check if this match combination has already been processed
                if (!processedMatches.contains(matchKey) && !processedMatches.contains(reverseMatchKey)) {
                    String team1Name = teams.get(i).getName();
                    String team2Name = teams.get(j).getName();
                    matches.add(new ActiveMatch(currentMatch.getMatch_id(), team1Id, team2Id, tournamentId, team1Name, team2Name));

                    // Add the match combination to processed matches
                    processedMatches.add(matchKey);
                    processedMatches.add(reverseMatchKey);
                }
            }
        }

        return matches;
    }
}



