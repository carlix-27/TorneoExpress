package com.TorneosExpress.controller;

import com.TorneosExpress.dto.tournament.MatchDto;
import com.TorneosExpress.dto.tournament.CreateTournamentDto;
import com.TorneosExpress.dto.tournament.UpdateTournamentDto;
import com.TorneosExpress.fixture.Fixture;
import com.TorneosExpress.model.Difficulty;
import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;


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

    @PutMapping("{tournamentId}/end")
    public Tournament endTournament(@PathVariable Long tournamentId) {
        return tournamentService.endTournament(tournamentId);
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
    public List<Tournament> getTournamentsByUser(@PathVariable Long userId) {
        return tournamentService.getTournamentsByUser(userId);
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

    @GetMapping("/{tournamentId}/calendar")
    public Fixture getTournamentCalendar(@PathVariable Long tournamentId) {
        return tournamentService.getTournamentFixture(tournamentId);
    }

    @GetMapping("/{tournamentId}/calendar/{matchId}")
    public Match getCalendarMatch(@PathVariable Long tournamentId, @PathVariable Long matchId) {
        Fixture fixture = tournamentService.getTournamentFixture(tournamentId);
        if (fixture == null) {
            return ResponseEntity.notFound().build();
        }
        for (MatchDto match : fixture.getMatches()) {
            if (Objects.equals(match.getMatchId(), matchId)) {
                return ResponseEntity.ok(match);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{tournamentId}/calendar/{matchId}")
    public ResponseEntity<Match> updateMatch(
        @PathVariable Long tournamentId, @PathVariable Long matchId, @RequestBody MatchDto matchDto) {
        FixtureDto fixture = tournamentService.getTournamentCalendar(tournamentId);
        if (fixture == null) {
            return ResponseEntity.notFound().build();
        }
        Match match = tournamentService.getMatchById(matchId);
        LocalDate updatedDate = matchDto.getDate();
        match.setDate(updatedDate);
        Match updatedMatchEntity = tournamentService.updateMatch(match);
        return ResponseEntity.ok(updatedMatchEntity);
    }
    

    @PutMapping("/{tournamentId}")
    public Tournament updateTournament(@PathVariable Long tournamentId,
                                                       @RequestBody UpdateTournamentDto updatedTournamentDto) {

        return tournamentService.updateTournament(tournamentId, updatedTournamentDto);

        Tournament existingTournament = tournamentService.getTournamentById(tournamentId);
        if (existingTournament == null) {
            return null;
        }

        String updatedTournamentName = updatedTournament.getName();
        Sport updatedTournamentSport = updatedTournament.getSport();
        String updatedTournamentLocation = updatedTournament.getLocation();
        boolean updatedTournamentPrivate = updatedTournament.isPrivate();
        Difficulty updatedTournamentDifficulty = updatedTournament.getDifficulty();

        existingTournament.setName(updatedTournamentName);
        existingTournament.setSport(updatedTournamentSport);
        existingTournament.setLocation(updatedTournamentLocation);
        existingTournament.setPrivate(updatedTournamentPrivate);
        existingTournament.setDifficulty(updatedTournamentDifficulty);

        Tournament updatedTournamentEntity = tournamentService.updateTournament(existingTournament);
        return ResponseEntity.ok(updatedTournamentEntity);
    }


    @GetMapping("/active")
    public List<Tournament> getActiveTournaments() {
        return tournamentService.getActiveTournaments();
    }


    @GetMapping("/{tournamentId}/teams")
    public List<Team> getTeamsOfTournament(@PathVariable Long tournamentId) {
        return tournamentService.getTeamsOfTournament(tournamentId);
    }


    @GetMapping("/{tournamentId}/activeMatches")
    public List<Match> getActiveMatches(@PathVariable Long tournamentId) {
        return tournamentService.getActiveMatches(tournamentId);
    }

}
