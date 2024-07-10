package com.TorneosExpress.service;

import com.TorneosExpress.dto.tournament.SaveMatchStatsDto;
import com.TorneosExpress.model.Match;
import com.TorneosExpress.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MatchService {

    private final MatchRepository matchRepository;

    @Autowired
    public MatchService(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    public Match saveStats(Long matchId, SaveMatchStatsDto matchStats){
        Match match = matchRepository.findById(matchId).orElse(null);
        assert match != null;
        match.setFirstTeamScore(matchStats.getTeam1Score());
        match.setSecondTeamScore(matchStats.getTeam2Score());
        match.setWinner(matchStats.getWinner());

        return matchRepository.save(match);
    }

    public Match getStats(Long matchId){
        return matchRepository.findById(matchId).orElse(null);
    }


}
