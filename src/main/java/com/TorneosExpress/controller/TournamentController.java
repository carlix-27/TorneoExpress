package com.TorneosExpress.controller;

import com.TorneosExpress.model.Tournament;
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

    // Create a new tournament
    @PostMapping("")
    public ResponseEntity<Tournament> createTournament(@RequestBody Tournament tournament) {
        // Set the creator_id for the tournament
        // Here, you would typically get the userId from the session or token
        // For demonstration, I'm assuming you have a method to get the userId
        Long creatorId = getUserId(); // This method should get the userId of the logged-in user
        tournament.setCreatorId(creatorId);

        Tournament createdTournament = tournamentService.createTournament(tournament);
        return new ResponseEntity<>(createdTournament, HttpStatus.CREATED);
    }

    // Get all tournaments
    @GetMapping("")
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        List<Tournament> tournaments = tournamentService.getAllTournaments();
        return new ResponseEntity<>(tournaments, HttpStatus.OK);
    }

    // Get tournament by ID
    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Long id) {
        Tournament tournament = tournamentService.getTournamentById(id);
        if (tournament == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(tournament, HttpStatus.OK);
    }

    // Update a tournament
    @PutMapping("/{id}")
    public ResponseEntity<Tournament> updateTournament(@PathVariable Long id, @RequestBody Tournament tournament) {
        Tournament existingTournament = tournamentService.getTournamentById(id);
        if (existingTournament == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Only allow update if the logged-in user is the creator
        Long creatorId = getUserId(); // Get the userId of the logged-in user
        if (!existingTournament.getCreatorId().equals(creatorId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

//        existingTournament.setName(tournament.getName());
//        existingTournament.setDescription(tournament.getDescription());
        // Update other fields as needed

        Tournament updatedTournament = tournamentService.updateTournament(existingTournament);
        return new ResponseEntity<>(updatedTournament, HttpStatus.OK);
    }

    // Delete a tournament
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTournament(@PathVariable Long id) {
        Tournament tournament = tournamentService.getTournamentById(id);
        if (tournament == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Only allow deletion if the logged-in user is the creator
        Long creatorId = getUserId(); // Get the userId of the logged-in user
        if (!tournament.getCreatorId().equals(creatorId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        tournamentService.deleteTournament(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Method to get userId (should be replaced with your actual method)
    private Long getUserId() {
        // For demonstration, returning a hardcoded userId
        // In a real application, this should retrieve the userId from the session or token
        return 1L; // Replace with actual logic to get userId
    }
}
