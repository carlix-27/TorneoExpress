package com.TorneosExpress.controller;

import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.service.PlayerService;
import com.TorneosExpress.service.TournamentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    public ResponseEntity<Tournament> createTournament(@RequestBody Tournament tournament,
                                                       HttpServletRequest request) {
        Tournament createdTournament = tournamentService.createTournament(tournament);
        return new ResponseEntity<>(createdTournament, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Tournament>> getTournamentsByUser(@PathVariable Long userId) {
        List<Tournament> tournaments = tournamentService.getTournamentsByUser(userId);
        return ResponseEntity.ok().body(tournaments);
    }


}
