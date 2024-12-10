package com.TorneosExpress.controller;

import com.TorneosExpress.model.Match;
import com.TorneosExpress.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    @Autowired
    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/{matchId}")
    public Match getMatchStats(@PathVariable Long matchId){
        return matchService.getStats(matchId);
    }

}
