package com.TorneosExpress.controller;

import com.TorneosExpress.dto.tournament.UpdateMatchDto;
import com.TorneosExpress.dto.tournament.CreateTournamentDto;
import com.TorneosExpress.dto.tournament.UpdateTournamentDto;
import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.model.Type;
import com.TorneosExpress.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    private final TournamentService tournamentService;

    @Autowired
    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @PostMapping("/create")
    public Tournament createTournament(@RequestBody CreateTournamentDto request) {
        return tournamentService.createTournament(request);
    }

    @PutMapping("{tournamentId}/{teamId}/end")
    public Tournament endTournament(@PathVariable Long tournamentId, @PathVariable Long teamId) {
        return tournamentService.endTournament(tournamentId, teamId);
    }

    @GetMapping("/history")
    public List<Tournament> getTournamentHistory() {
        return tournamentService.getInactiveTournaments();
    }

    @PostMapping("/add/{tournamentId}/{teamId}")
    public ResponseEntity<Tournament> addTeamToTournament(@PathVariable Long tournamentId, @PathVariable Long teamId) {
        try {
            Tournament team = tournamentService.addTeamToTournament(teamId, tournamentId);
            return new ResponseEntity<>(team, HttpStatus.CREATED);
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(500).body(null);
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

    @GetMapping("/{tournamentId}/{type}/calendar")
    public List<Match> getTournamentCalendar(@PathVariable Long tournamentId, @PathVariable Type type) {
        return tournamentService.getTournamentFixture(tournamentId, type);
    }



    //cambie el getMatchCalendar a esto a un simple getMatch, ya que es exactamente lo mismo y se puede usar en todos lados
    @GetMapping("/matches/{matchId}")
    public Match getMatch(@PathVariable Long matchId) {
        return tournamentService.getMatchById(matchId);
    }

    @PutMapping("/matches/{matchId}")
    public Match updateMatch(@PathVariable Long matchId, @RequestBody UpdateMatchDto updateMatchDto) {
        return tournamentService.updateMatch(matchId, updateMatchDto);
    }
    

    @PutMapping("/{tournamentId}")
    public Tournament updateTournament(@PathVariable Long tournamentId, @RequestBody UpdateTournamentDto updatedTournamentDto) {
        return tournamentService.updateTournament(tournamentId, updatedTournamentDto);
    }


    @GetMapping("/active")
    public List<Tournament> getActiveTournaments() {
        return tournamentService.getActiveTournaments();
    }

    @GetMapping("/teams/{teamId}")
    public List<Tournament> getTournamentsForTeam(@PathVariable Long teamId) {
        return tournamentService.getTournamentsByTeam(teamId);
    }

    @GetMapping("/{tournamentId}/teams")
    public List<Team> getTeamsOfTournament(@PathVariable Long tournamentId) {
        return tournamentService.getTeamsOfTournament(tournamentId);
    }

    @GetMapping("/{tournamentId}/matches")
    public List<Match> getAllMatches(@PathVariable Long tournamentId) {
        return tournamentService.getAllMatches(tournamentId);
    }

}
