package com.TorneosExpress.controller;

import com.TorneosExpress.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.TorneosExpress.dto.StatisticsDto;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private StatisticsService statisticsService;

    @PostMapping("/{tournamentId}/{match_id}/statistics")
        public ResponseEntity<?> saveStatistics(@PathVariable Long match_id, @PathVariable Long tournamentId, @RequestBody StatisticsDto statisticsDto) {
            boolean success = statisticsService.saveStatistics(match_id, tournamentId, statisticsDto);
            if (success) {
                return ResponseEntity.ok("Statistics saved successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving statistics.");
            }
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

    @GetMapping("/{tournamentId}/{matchId}/getMatchId")
    public Long getMatchId(@PathVariable Long matchId, @PathVariable Long tournamentId){
        return statisticsService.getIdOfMatchWithAssociatedStatistics(matchId, tournamentId);
    }

}
