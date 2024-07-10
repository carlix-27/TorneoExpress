package com.TorneosExpress.controller;

import com.TorneosExpress.model.Match;
import com.TorneosExpress.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.TorneosExpress.dto.tournament.SaveMatchStatsDto;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    @Autowired
    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PostMapping("/{match_id}")
    public Match saveStatistics(@PathVariable Long match_id, @RequestBody SaveMatchStatsDto statisticsDto) {
        return matchService.saveStats(match_id, statisticsDto);
    }


    @GetMapping("/{matchId}")
    public Match getMatchStats(@PathVariable Long matchId){
        return matchService.getStats(matchId);
    }

}
