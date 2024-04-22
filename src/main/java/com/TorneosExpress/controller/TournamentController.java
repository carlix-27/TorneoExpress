package com.TorneosExpress.controller;

import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.service.PlayerService;
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
    private PlayerService playerService;

    // Create a new tournament
    @PostMapping("/create")
    public ResponseEntity<?> createTournament(@RequestBody Tournament tournament) {
        // Check if tournament name is unique
        if (tournamentService.isTournamentNameUnique(tournament.getName())) {
            tournament.setActive(true); // Set isActive to true
            Tournament createdTournament = tournamentService.createTournament(tournament);
            return new ResponseEntity<>(createdTournament, HttpStatus.CREATED);
        } else {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Tournament name must be unique.");
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

        // Update the existing tournament with the new data
        existingTournament.setName(updatedTournament.getName());
        existingTournament.setSport(updatedTournament.getSport());
        existingTournament.setLocation(updatedTournament.getLocation());
        existingTournament.setPrivate(updatedTournament.isPrivate());
        existingTournament.setDifficulty(updatedTournament.getDifficulty());

        Tournament updatedTournamentEntity = tournamentService.updateTournament(existingTournament);
        return ResponseEntity.ok(updatedTournamentEntity);
    }





}
