package com.TorneosExpress.service;

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


    public Match getStats(Long matchId){
        return matchRepository.findById(matchId).orElse(null);
    }


}
