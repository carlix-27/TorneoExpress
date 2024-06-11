package com.TorneosExpress.controller;

import com.TorneosExpress.dto.AccessRequest;
import com.TorneosExpress.dto.ShortTeamDto;
import com.TorneosExpress.dto.StatisticsDto;
import com.TorneosExpress.dto.TournamentDto;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.service.StatisticsService;
import com.TorneosExpress.service.TeamService;
import com.TorneosExpress.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    @Autowired
    private TournamentService tournamentService;

    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private TeamService teamService;

    @PostMapping("/create")
    public ResponseEntity<?> createTournament(@RequestBody TournamentDto request) {
        // Check if tournament name is unique
        String requestName = request.getName();
        boolean tournamentNameUnique = tournamentService.isTournamentNameUnique(requestName);
        if (tournamentNameUnique) {
            Tournament tournament = new Tournament(request);
            Tournament createdTournament = tournamentService.createTournament(tournament);
            createdTournament.setActive(true);
            return ResponseEntity.ok(createdTournament);
        } else{
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Tournament name must be unique.");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Tournament>> getTournamentsByUser(@PathVariable Long userId) {
        List<Tournament> tournaments = tournamentService.getTournamentsByUser(userId);
        return ResponseEntity.ok().body(tournaments);
    }

    @DeleteMapping("/{tournamentId}")
    public ResponseEntity<String> deleteTournament(@PathVariable Long tournamentId) {
        tournamentService.deleteTournament(tournamentId);
        return ResponseEntity.ok("Tournament deleted successfully");
    }

    @GetMapping("/{tournamentId}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Long tournamentId) {
        Tournament tournament = tournamentService.getTournamentById(tournamentId);
        if (tournament == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tournament);
    }

    @PutMapping("/{tournamentId}")
    public ResponseEntity<Tournament> updateTournament(@PathVariable Long tournamentId,
                                                       @RequestBody Tournament updatedTournament) {
        Tournament existingTournament = tournamentService.getTournamentById(tournamentId);
        if (existingTournament == null) {
            return ResponseEntity.notFound().build();
        }

        existingTournament.setName(updatedTournament.getName());
        existingTournament.setSport(updatedTournament.getSport());
        existingTournament.setLocation(updatedTournament.getLocation());
        existingTournament.setPrivate(updatedTournament.isPrivate());
        existingTournament.setDifficulty(updatedTournament.getDifficulty());

        Tournament updatedTournamentEntity = tournamentService.updateTournament(existingTournament);
        return ResponseEntity.ok(updatedTournamentEntity);
    }


    @GetMapping("/active")
    public List<Tournament> getActiveTournaments() {
        return tournamentService.getActiveTournaments();
    }


    @PostMapping("/{tournamentId}/statistics")
    public ResponseEntity<?> saveStatistics(@PathVariable Long tournamentId, @RequestBody StatisticsDto statisticsDto) {
        boolean success = statisticsService.saveStatistics(tournamentId, statisticsDto);
        if (success) {
            return ResponseEntity.ok("Statistics saved successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving statistics.");
        }
    }

    @GetMapping("{tournamentId}/teams")
    public ResponseEntity<List<ShortTeamDto>> getTeamsByTournamentId(@PathVariable Long userId, @PathVariable Long tournamentId){
        List<ShortTeamDto> teams = teamService.findByCaptainId(userId).stream().map(Team::ShortTeamDto).toList();
        return ResponseEntity.ok().body(teams);

    }

}
