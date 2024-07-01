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

}
