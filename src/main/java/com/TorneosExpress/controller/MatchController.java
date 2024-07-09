package com.TorneosExpress.controller;


import com.TorneosExpress.model.Statistics;
import com.TorneosExpress.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.TorneosExpress.dto.StatisticsDto;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final StatisticsService statisticsService;

    @Autowired
    public MatchController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @PostMapping("/{tournamentId}/{match_id}/statistics")
    public Statistics saveStatistics(@PathVariable Long match_id, @PathVariable Long tournamentId, @RequestBody StatisticsDto statisticsDto) {
        return statisticsService.saveStatistics(match_id, tournamentId, statisticsDto);
    }

    @GetMapping("/{matchId}/getStatistics")
    public ResponseEntity<?> getStatistics(@PathVariable Long matchId){
        StatisticsDto statisticsDto = statisticsService.getStatistics(matchId);
        if (statisticsDto != null) {
            return ResponseEntity.ok(statisticsDto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Statistics not found.");
        }
    }

}
